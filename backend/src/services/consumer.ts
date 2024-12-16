import { kafka } from "../actions/kafka_setup";
import { db } from "../actions/db_connection";
import { fetchPollResults, fetchLeaderboard } from "../actions/fetch_info";
import { broadcastLeaderboard, broadcastUpdate } from "./websocket";

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || "0" });

const consumeVotes = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "votes", fromBeginning: true });

    console.log("Kafka Consumer connected and listening for votes...");
    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                if (message.value) {
                    const { vote } = JSON.parse(message.value.toString());
                    // console.log("Received vote:", vote);

                    try {
                        // console.log("vote data", vote.poll_id, vote.option_id);
                        const validationResult = await db`
                            SELECT * FROM poll_options WHERE option_id = ${vote.option_id} AND poll_id = ${vote.poll_id}
                        `;

                        if (validationResult.length === 0) {
                            console.log("[ERROR] : Poll option does not belong to the specified poll.");
                        }

                        const result = await db`
                            UPDATE poll_options SET votes_count = votes_count + 1 WHERE option_id = ${vote.option_id} AND poll_id = ${vote.poll_id} RETURNING *
                        `;

                        console.log("Updated Option : ", result)
                    } catch (error) {
                        console.error("[ERROR] : DB vote processing :", error)
                    }

                    // console.log("Vote processed successfully:", updatedOption);

                    const pollResults = await fetchPollResults(vote.poll_id);
                    const leaderboard = await fetchLeaderboard();


                    // console.table(pollResults);
                    console.table(leaderboard);

                    broadcastUpdate(vote.poll_id, pollResults);
                    broadcastLeaderboard(leaderboard);


                } else {
                    console.warn("Received a message with a null value");
                }


                // Validate and cast the vote with both pollOptionId and pollId
                // const updatedOption = await castVote(vote.pollOptionId, vote.pollId);
                //
                // // Fetch the latest poll results
                // const pollResults = await fetchPollResults(vote.pollId);
                // console.log(`[${topic}] part: ${partition}`, message.value.toString());
                //
                // // Broadcast updated poll results to WebSocket clients
                //
                // console.log("Vote processed successfully:", updatedOption);
                // const leaderboard = await fetchLeaderboard();
                // console.log(pollResults);
                // broadcastUpdate(vote.pollId, pollResults);
                // broadcastLeaderboard(leaderboard);

            } catch (error) {
                console.error("Error processing vote:", error);
            }
        },
    });

};

export { consumeVotes }
