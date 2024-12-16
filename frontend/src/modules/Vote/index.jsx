import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Vote = () => {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await fetch("http://localhost:3000/fetch/polls");
                const data = await response.json();
                setPolls(data?.data);
            } catch (error) {
                console.error("Failed to fetch polls:", error);
            }
        };
        fetchPolls();
        // setPolls([
        //   { id: 1, question: "What the fuck you doing?" },
        //   { id: 2, question: "What the fuck me doing?" },
        //   { id: 3, question: "What the fuck they doing?" },
        // ]);
    }, []);

    useEffect(() => {
        if (selectedPoll) {
            //   const allOptions = [
            //     { poll_id: 1, id: 1, votes_count: 5, option_text: "1" },
            //     { poll_id: 1, id: 2, votes_count: 10, option_text: "2" },
            //     { poll_id: 2, id: 3, votes_count: 3, option_text: "3" },
            //     { poll_id: 2, id: 4, votes_count: 8, option_text: "4" },
            //     { poll_id: 3, id: 5, votes_count: 2, option_text: "5" },
            //     { poll_id: 3, id: 6, votes_count: 6, option_text: "6" },
            //   ];

            //   const filteredOptions = allOptions
            //     .filter((option) => option.poll_id === parseInt(selectedPoll))
            //     .sort((a, b) => b.votes_count - a.votes_count);

            //   setOptions(filteredOptions);
            const fetchOptions = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(
                        `http://localhost:3000/polls/${selectedPoll}/options`
                    );
                    const data = await response.json();
                    setOptions(data?.data);
                } catch (error) {
                    console.error("Failed to fetch options:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchOptions();
        }
    }, [selectedPoll]);

    const handleVote = async (optionId) => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:3000/polls/${selectedPoll}/vote`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ option_id: optionId }),
                }
            );
            if (response.ok) {
                alert("Vote submitted successfully!");
                setOptions([]);
                setSelectedPoll(null);
            } else {
                alert("Failed to submit vote.");
            }
        } catch (error) {
            console.error("Failed to submit vote:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Vote for a Poll</h1>

            {/* Poll Dropdown */}
            <div>
                <label htmlFor="pollDropdown">Select a Poll:</label>
                <select
                    id="pollDropdown"
                    onChange={(e) => setSelectedPoll(e.target.value)}
                    value={selectedPoll || ""}
                >
                    <option value="" disabled>
                        Select...
                    </option>
                    {polls.map((poll) => (
                        <option key={poll.id} value={poll.id}>
                            {poll.question}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading Spinner */}
            {loading && <p>Loading...</p>}

            {/* Options */}
            {options.length > 0 && (
                <div>
                    <h2>Options</h2>
                    <ul>
                        {options.map((option) => (
                            <li key={option.id}>
                                {option.option_text} - Votes: {option.votes_count}
                                <button
                                    style={{ marginLeft: "10px" }}
                                    onClick={() => handleVote(option.id)}
                                >
                                    Vote
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{ marginTop: "30px" }}>
                <button onClick={() => { navigate('/leaderboard') }} style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px' }}>go to LEADERBOARD page -{">"}</button>
            </div>

            <div style={{ marginTop: "30px" }}>
                <button onClick={() => { navigate('/polls') }} style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px' }}>go to POLL CREATE page {"<"}-</button>
            </div>
        </div>
    );
};

export default Vote;
