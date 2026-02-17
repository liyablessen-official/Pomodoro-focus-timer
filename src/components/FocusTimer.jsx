import "../styles/FocusTimer.css";
import { useEffect, useState } from "react";
import ProductivityDashboard from "./ProductivityDashboard";
// supabase code
import { supabase } from "../supabaseClient";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function FocusTimer({user}) {
    const [displayTime,setDisplayTime] = useState(25*60); // 25 minutes in seconds
    const [status,setStatus] = useState("focus"); // focus,break
    const [isRunning,setIsRunning] = useState(false);
    const [sessionCount,setSessionCount] = useState(0);
    const [graphData,setGraphData] = useState([]);

    const getdisplaytime = (timeInSeconds) =>{
        const minutes = Math.floor(timeInSeconds/60);
        const seconds = timeInSeconds % 60;
        return `${minutes} : ${seconds <10 ? "0" : "" }${seconds}`;
    }

    const handlebtnClick = () =>{
        setIsRunning(!isRunning);
    }

    const handleReset = () =>{
        if(status==="focus"){
            setStatus("focus");
            setDisplayTime(25*60);
        }
        else{
            setStatus("break");
            setDisplayTime(5*60);
        }
        
        if(isRunning){
            setIsRunning(false);
        }
    }

    useEffect(()=>{
        const timer = setInterval(() => {
            if(!isRunning) return;
            if(displayTime > 0){
                setDisplayTime(prevTime => prevTime -1);
            }
            else{
                if(status==="focus"){
                    if(displayTime===0){
                        setSessionCount(prev=>prev+1);
                        setStatus("break");
                        setDisplayTime(5*60); // 5 minutes break
                    }
                }
                else{
                    setStatus("focus");
                    setDisplayTime(25*60); // 25 minutes focus
                }
            }
            
        }, 1000);

        return () => clearInterval(timer);
    },[isRunning,displayTime,status]);

    // useEffect(()=>{
        
    //     const savedAnalytics = JSON.parse(localStorage.getItem("focusAnalytics")) || [];
    //     setGraphData(savedAnalytics);
    //     // const today = new Date().toISOString().split("T")[0];
    //     const today = new Date().toLocaleString('en-US', { month: 'short' , day: '2-digit' });
    //     // console.log(today);
    //     const todayData = savedAnalytics.find(item => item.date === today);
    //     if(todayData){
    //         setSessionCount(todayData.sessions);
    //     }
    //     // test this scenario(session count not refreshed on new day on page load)*************
    //     else{
    //         setSessionCount(0);
    //     }
    //     //********************************
    // },[]);

    useEffect(() => {
        if (sessionCount > 0) {
            saveAnalytics();
        }
    }, [sessionCount]);
      

    // useEffect(()=>{
    //     if(sessionCount>0)
    //     {
    //         // const today = new Date().toISOString().split("T")[0];
    //         const today = new Date().toLocaleString('en-US', { month: 'short' , day: '2-digit' });
            
    //         setGraphData(prev=>{
    //             const updated = [...prev];
    //             const index = updated.findIndex(item => item.date === today);
    //             if(index !== -1){
    //                 updated[index].sessions = sessionCount;
    //                 updated[index].totalFocusTime= sessionCount*25;
    //             }
    //             else{
    //                 updated.push({
    //                     date: today,
    //                     sessions: sessionCount,
    //                     totalFocusTime: sessionCount*25
    //                 });
    //             }
    //             localStorage.setItem("focusAnalytics",JSON.stringify(updated));
    //         return updated;
    //         });

            
    //     }
    // },[sessionCount]);

    // progress calculator
    const totalTime = (status==="focus" ? 25*60 : 5*60);
    const progress = displayTime / totalTime;

    // save analytics to supabase
    // const today = new Date().toLocaleString('en-US', { month: 'short' , day: '2-digit' });
    const today = new Date().toISOString().split("T")[0];

    const saveAnalytics = async () =>{
        const {data} = await supabase
        .from("focus_analytics")
        .select("*")
        .eq("date",today)
        .eq("user_id",user.id)
        .single();

        if(data){
            await supabase
            .from("focus_analytics")
            .update({
                sessions: sessionCount,
                total_focus_time: sessionCount * 25
            })
            .eq("id",data.id);
        }else{
            await supabase
            .from("focus_analytics")
            .insert({
                user_id: user.id,
                date: today,
                sessions: sessionCount,
                total_focus_time: sessionCount * 25
            });
        }
    };

    // const fetchAnalytics = async () =>{
    //     const {data} = supabase
    //     .from("focus_analytics")
    //     .select("*")
    //     .eq("user_id", user.id)
    //     .order("date", {ascending:true});

    //     setGraphData(data || []);
    // }

    const fetchAnalytics = async () => {
        const { data, error } = await supabase
          .from("focus_analytics")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: true });
      
        // if (error) {
        //   console.error("Fetch analytics error:", error);
        // } else {
        //   console.log("Fetched analytics:", data);
        //   setGraphData(data || []);
        // }

        if(!error && data){
            const formated = data.map(item => {
                const formatedDate = new Date(item.date).toLocaleString('en-US', { month: 'short' , day: '2-digit' });
                return {
                    date: formatedDate,              // "Jan 30"
                    sessions: item.sessions,
                    total_focus_time: item.total_focus_time
                };
            });
            
            setGraphData(formated);
        }
      };

    useEffect(() => {
        fetchAnalytics();
        console.log(graphData);
    }, []);
    //  //////////////////////////

  return (
    <div>
        
        <div className="focus-timer-container">
            <h2>Focus Timer Component</h2>
            <p className="focus-timer-heading">
                <img src="https://www.nicepng.com/png/detail/237-2379295_focus-timer-tasks-on-the-mac-app-store.png" alt="focus timer icon" />
                {status=== "focus" ? "Focus Timer" : "Break Timer"}
            </p>
            {/* circular progress bar */}
            <div className="progress-wrapper">
                <svg className="progress-ring" width="220" height="220">
                    <circle className="progress-ring-bg"
                        cx="110"
                        cy="110"
                        r="80"
                    />
                    <circle className="progress-ring-fill"
                        cx="110"
                        cy="110"
                        r="80"
                        style={{
                            strokeDashoffset: 2 * Math.PI * 80 * (1-progress),
                            stroke: progress < 0.30 ? "#cb391f" : "#4caf50"
                        }}
                    />
                </svg>
        

                <h3 className="focus-timer-h3">{getdisplaytime(displayTime)}</h3>
            </div>

            {/* end of progress bar */}
            <div className="focus-timer-btn-container">
                <button className="focus-timer-button" onClick={handlebtnClick}>
                    {isRunning? "Stop" : "Start" }
                </button>
                <button className="focus-timer-button"  onClick={handleReset}>Reset</button>
            </div>
            <p className="focus-timer-heading">
                <img src="https://www.nicepng.com/png/detail/28-280057_flat-icon-bar-graphics-statistics-chart-graph-graph.png" alt="focus timer icon" />
                Todays Analytics
            </p>
            <p>Completed focus session: {sessionCount}</p>

            {graphData.length > 0 && (
                <ProductivityDashboard analytics={graphData} />
            )}
        </div>
    </div>
  );
}