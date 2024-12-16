import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const PollCreate = () => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([""]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim() || options.some((opt) => !opt.trim())) {
            alert("Please fill out all fields.");
            return;
        }

        const payload = {
            question,
            options: options,
        };
        console.log(payload);

        try {
            setLoading(true);
            const response = await fetch("http://localhost:3000/polls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Poll created successfully!");
                setQuestion("");
                setOptions([""]);
            } else {
                alert("Failed to create poll.");
            }
        } catch (error) {
            console.error("Error creating poll:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create a New Poll</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="question">Poll Question:</label>
                    <input
                        id="question"
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter poll question"
                        required
                    />
                </div>
                <div>
                    <h2>Options</h2>
                    {options.map((option, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeOption(index)}
                                disabled={options.length <= 1}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addOption}>
                        Add Option
                    </button>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Poll"}
                </button>
            </form>
            <div style={{ marginTop: "30px" }}>
                <button onClick={() => { navigate('/vote') }} style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px' }}>go to VOTE page -{">"}</button>
            </div>

            <div style={{ marginTop: "30px" }}>
                <button onClick={() => { navigate('/leaderboard') }} style={{ fontSize: '20px', fontWeight: 'bold', padding: '10px' }}>go to LEADERBOARD page -{">"}</button>
            </div>
        </div>
    );
};

export default PollCreate;
