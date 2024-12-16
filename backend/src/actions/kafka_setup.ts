import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "poll-client",
    brokers: [process.env.KAFKA_BROKERS || "kafka:9092"], // Update this if your broker is on a different host/port
});

const setupKafka = async () => {
    const admin = kafka.admin();

    try {
        console.log("Connecting....");
        await admin.connect();
        console.log("Connection Success !");

        const topics_exits = await admin.listTopics().then((data) => data.includes('votes'))
        // console.log(topics_exits)

        if (topics_exits) {
            console.log("Topic already exists!")
        }
        else {
            await admin.createTopics({
                topics: [
                    {
                        topic: "votes",
                        numPartitions: 3,
                    },
                ],
            });
            console.log("Topic created successfully!");
        }

    } catch (error) {
        console.error("Error Setting-Up Kafka : ", error);
    } finally {
        await admin.disconnect();
        console.log("Shitting Down Kafka...");
    }
};

export { kafka, setupKafka };
