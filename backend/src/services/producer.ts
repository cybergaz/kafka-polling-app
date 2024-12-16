import { kafka } from "../actions/kafka_setup";


const producer = kafka.producer();

// send vote to kafka topic
const sendvote = async (vote: { poll_id: string, option_id: any }) => {

    await producer.connect();
    console.log("Producer connected");

    // sending vote to random partition for handle concurrancy
    await producer.send({
        topic: "votes",
        messages: [{ partition: Math.floor(Math.random() * 3), value: JSON.stringify({ vote }) }],
    });
    console.log("Vote sent for poll_id : ", vote.poll_id, "and option_id : ", vote.option_id);
};

export { producer, sendvote };
