import {
    ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
  } from "recharts";

  import "../styles/focusTimer.css";
import { useState } from "react";

  const groupByWeek = (data) => {
    const weeks = {};
  
    data.forEach(item => {
      const date =  new Date(item.date);
      
      const week = `W${Math.ceil(
        (((date - new Date(date.getFullYear(), 0, 1)) / 86400000) +
          new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7
      )}`;
  
      if (!weeks[week]) {
        weeks[week] = { week, sessions: 0, total_focus_time: 0 };
      }
  
      weeks[week].sessions += item.sessions;
      weeks[week].total_focus_time += item.total_focus_time;
    });
  
    return Object.values(weeks).slice(-7);
  };

  const getLastN = (data, n, key) => {
    return [...data]
      .sort((a, b) => new Date(a[key]) - new Date(b[key]))
      .slice(-n);
  };
  
  const exportToCSV = (data, filename = "focus-analytics.csv") => {
    if (!data || !data.length) return;
  
    // CSV headers
    const headers = Object.keys(data[0]).join(",");
  
    // CSV rows
    const rows = data.map(item =>
      Object.values(item).join(",")
    );
  
    const csvContent = [headers, ...rows].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  
    URL.revokeObjectURL(url);
  };
  

export default function ProductivityDashboard({analytics}){
    // const weeklyData = groupByWeek(analytics);
    const xaxistext = `Focus Sessions ${new Date().getFullYear()}`;
    const last7Days = getLastN(analytics, 7, "date");

    // console.log(new Date(date).toLocaleString('en-US', { month: 'short' , day: '2-digit' }));

    const [viewMode, setViewMode] = useState("daily");
    const chartData = viewMode==="weekly" ? groupByWeek(analytics) : last7Days ;

 return(
    <div className="dashboard" style={{ width: "100%", margin: "0 auto" }}>
      <div className="dashboard-header">
        <h3>Focus Analytics</h3>
        <div className="focustimer-graph-btn-conatiner">
            <button
            className="focus-timer-export-btn"
            onClick={() => exportToCSV(analytics)}
            >
            Export CSV
            </button>
            <div className="focustimer-toggle-container">
                <button id="daily-btn"
                    className={viewMode === "daily" ? "active" : "focus-timer-viewmode-button"}
                    onClick={() => setViewMode("daily")}
                >
                    Daily
                </button>

                <button id="weekly-btn"
                    className={viewMode === "weekly" ? "active" : "focus-timer-viewmode-button"}
                    onClick={() => setViewMode("weekly")}
                >
                    Weekly
                </button>
            </div>
        </div>
      </div>


      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData} >
        <defs>
            <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4caf50" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#81c784" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
            dataKey={viewMode==="weekly"? "week" : "date"} 
            interval={0}
            angle={-90} 
            tickMargin={25}
            height={60}
            />

            {/* Left Axis → Sessions */}
            <YAxis yAxisId="left" />

            {/* Right Axis → Minutes */}
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
                contentStyle={{backgroundColor:"#f9dbbd", color:"#cb391f", borderRadius:"5px"}}
                itemStyle={{color:"#000"}}
            />
            <Legend 
                verticalAlign="top" 
                align="center" 
                layout="horizontal"
                wrapperStyle={{marginTop: "-10px"}}
            />

            {/* bar graph for count of sessions covered */}
            <Bar
                yAxisId="left"
                dataKey="sessions"
                name={xaxistext}
                // XAxis={sessions}
                barSize={20}
                fill="url(#sessionsGradient)"
                radius={[6, 6, 0, 0]}
                
            />

            {/* line graph for total focus time covered */}
            <Line
            yAxisId="right"
            type="monotone"
            dataKey="total_focus_time"
            name="Total Focus Time"
            stroke="#DA7422"
            strokeWidth={3}
            dot={{ r: 3 }}
            // style={{marginTop:"20px"}}
          />

        </ComposedChart>

      </ResponsiveContainer>
    </div>
 );
}