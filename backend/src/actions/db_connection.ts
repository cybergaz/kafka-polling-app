import postgres from "postgres";

const db = postgres({
    host: process.env.POSTGRES_HOST || "postgresdb",
    database: process.env.POSTGRES_DB || "cybergaz",
    username: process.env.POSTGRES_USER || "gaz",
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
    password: process.env.POSTGRES_PASSWORD || "cybergaz",
    debug: function(_, query) {
        console.log("[EXECUTED QUERY]:", query);
    },
});

// schema
const createTables = async () => {
    try {
        await db`
        CREATE TABLE IF NOT EXISTS polls (
            id SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

        await db`
        CREATE TABLE IF NOT EXISTS poll_options (
            id SERIAL PRIMARY KEY,
            option_id INT NOT NULL,
            poll_id INT REFERENCES polls(id) ON DELETE CASCADE,
            option_text TEXT NOT NULL,
            votes_count INT DEFAULT 0
        );
        `;

        // await db`
        // CREATE TABLE IF NOT EXISTS votes (
        //     id SERIAL PRIMARY KEY,
        //     poll_option_id INT REFERENCES poll_options(id) ON DELETE CASCADE,
        //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        // );
        // `;

        console.log("Both Tables created successfully!");
    } catch (error) {
        console.error(error);
    }
}

export { db, createTables };
