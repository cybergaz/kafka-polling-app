import React from "react";
import { Route, Routes } from "react-router-dom";
import PollCreate from "./modules/PollCreate";
import Vote from "./modules/Vote";
import Leaderboard from "./modules/Leaderboard";

const Approutes = () => {
    return (
        <Routes>
            <Route path="/leaderboard" element={<Leaderboard />}></Route>
            <Route path="/" element={<PollCreate />}></Route>
            <Route path="/polls" element={<PollCreate />}></Route>
            <Route path="/vote" element={<Vote />}></Route>
        </Routes>
    );
};

export default Approutes;
