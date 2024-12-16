import { db } from "./db_connection";

const fetchPollResults = async (pollId: string) => {
    try {
        const result = await db`
            SELECT id, option_text, votes_count FROM poll_options WHERE poll_id = ${pollId} ORDER BY votes_count DESC
        `;

        return result;
    } catch (error) {
        console.error("Error in fetchPollResults:", error);
        throw error;
    }
};

const fetchLeaderboard = async () => {
    try {
        const result = await db`
          SELECT p.id AS poll_id, po.option_text, po.votes_count
          FROM poll_options po
          JOIN polls p ON po.poll_id = p.id
          ORDER BY po.votes_count DESC
          LIMIT 10;
      `;
        return result;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
};

export { fetchPollResults, fetchLeaderboard };
