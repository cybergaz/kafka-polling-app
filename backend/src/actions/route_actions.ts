import express from 'express';
import { db } from './db_connection';
import { Kafka } from 'kafkajs';
import { sendvote } from '../services/producer';
import { fetchLeaderboard, fetchPollResults } from './fetch_info';

const createPoll = async (req: express.Request, res: express.Response) => {
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options)) {
        res.status(400).send("Invalid request data");
        return;
    }
    try {
        const poll = { question }
        const pollResult = await db`INSERT INTO polls ${db(poll)} RETURNING *`;

        console.log('Question Title inserted :', question);
        console.log('Question options inserted :', options);

        let option_id = 1; // Start with an initial value for option_id
        const optionPromises = options.map(async (option) => {
            const poll_options = {
                poll_id: pollResult[0].id,
                option_text: option,
                option_id: option_id++ // Increment option_id for each iteration
            };
            await db`INSERT INTO poll_options ${db(poll_options)}`;
        });
        await Promise.all(optionPromises);
        res.status(201).json({ message: "Poll created successfully", poll: pollResult[0] });

    } catch (error) {
        console.error(error);
    }
}

const pushVote = async (req: express.Request, res: express.Response) => {
    const { poll_id } = req.params;
    const { option_id } = req.body;

    if (!poll_id || !option_id) {
        res.status(400).send("Poll ID (as a param /polls/:id/vote) and Poll Option ID (in the request body with key 'option_id') are required.");
        return;
    }

    try {
        const pollOption = await db` SELECT * FROM poll_options WHERE option_id = ${option_id} AND poll_id = ${poll_id} `;
        // console.table(pollOption)

        if (pollOption.length === 0) {
            res.status(404).send("Poll Option not found");
            return;
        }

        // await db` INSERT INTO votes (poll_option_id) VALUES (${option_id}) `;
        //
        // console.table(await db`SELECT * FROM votes`)

        const vote = { poll_id, option_id }
        await sendvote(vote);
        // console.log("vote sent for further processing")

    } catch (error) {
        console.error("ERROR occured while pushing a vote :", error)
        res.status(500).send("Internal Server Error");
    }

    res.status(200).send({ message: 'Vote Submitted' });
}

const getResults = async (req: express.Request, res: express.Response) => {
    const poll_id = req.params.id;
    // console.log("requested poll id", poll_id)
    // console.table(fetchPollResults(poll_id))
    try {
        const data = await db`SELECT * FROM poll_options where poll_id = ${poll_id}`
        console.table(data)
        res.status(200).json({ poll_results: data });
    }
    catch (error) {
        console.error("Error in fetching poll results", error)
        res.status(500).send('Internal Server Error');
    }
}

const getLeaderboard = async (req: express.Request, res: express.Response) => {

    try {
        const data = await fetchLeaderboard();
        console.table(data)
        res.status(200).json({ leaderboard: data });
    }
    catch (error) {
        console.error("Error in fetching poll results", error)
        res.status(500).send('Internal Server Error');
    }
}



const getPolls = async (req: express.Request, res: express.Response) => {
    const polls = await db`SELECT * FROM polls`;
    // console.log(polls)

    res.status(200).json({ data: polls });
    // res.status(200).send('All Polls');
}


const getOptions = async (req: express.Request, res: express.Response) => {
    const pollId = req.params.id;

    const options = await db`
        SELECT
            *
        FROM
            poll_options
        WHERE
            poll_id = ${pollId}
    `;
    res.status(200).json({ data: options });

    // res.status(200).send('Poll results');
}

export { createPoll, pushVote, getResults, getLeaderboard, getPolls, getOptions };
