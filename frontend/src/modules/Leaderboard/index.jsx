import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await fetch("http://localhost:3000/Leaderboard");
                const data = await response.json();
                // console.log(data?.leaderboard)
                setLeaderboard(data?.leaderboard);
            } catch (error) {
                console.error("Failed to fetch polls:", error);
            }
        };
        fetchPolls();


        const socketFetch = async () => {
            const socket = new WebSocket("ws://localhost:8080");
            socket.onopen = () => {
                console.log("WebSocket connection established.");
                socket.send(JSON.stringify({ action: "leaderboard" }));
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // console.log(data);
                try {
                    if (data.type == "leaderboard") {
                        console.log("successully updated leaderboard")
                        setLeaderboard(data?.leaderboard)
                    }
                }
                catch (error) {
                    console.error("Failed to fetch leaderboard:", error);
                }
            };

            socket.onclose = () => {
                console.log("WebSocket connection closed.");
            };
        }

        socketFetch();
    }, []);

    return (
        <>
            <h1>Poll Leaderboard</h1>
            <ul type="1">
                {
                    leaderboard.length > 0 ?
                        leaderboard.map((item, index) => {
                            return (
                                <li key={index} id="list" style={{ display: "flex", "gap": "5px" }}>
                                    <div id="listitem"
                                        style={{ color: '#27D174', fontSize: '18px', fontWeight: "bold", padding: '10px', border: '2px solid #354559', borderRadius: '10px', marginBottom: '10px' }} >
                                        POLL_ID -{">"} <span style={{ color: 'white' }}>{item.poll_id}</span>
                                    </div>
                                    <div id="listitem"
                                        style={{ color: '#579ED1', fontSize: '18px', fontWeight: "bold", padding: '10px', border: '2px solid #354559', borderRadius: '10px', marginBottom: '10px' }} >
                                        OPTION_TEXT -{">"} <span style={{ color: 'white' }}>{item.option_text}</span></div>
                                    <div id="listitem"
                                        style={{ color: '#E0BA95', fontSize: '18px', fontWeight: "bold", padding: '10px', border: '2px solid #354559', borderRadius: '10px', marginBottom: '10px' }} >
                                        VOTE_COUNTS -{">"} <span style={{ color: 'white' }}>{item.votes_count}</span></div>
                                </li>
                            );
                        })
                        : <li>No data available</li>
                }
            </ul >

            <div style={{ marginTop: "30px" }}>
                <button onClick={() => { navigate('/vote') }} style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px' }}>go to VOTE page {"<"}-</button>
            </div>

            <div style={{ marginTop: "30px" }}>
                <button onClick={() => { navigate('/polls') }} style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px' }}>go to POLL CREATE page {"<"}-</button>
            </div>
        </>
    );
};

export default Leaderboard;
