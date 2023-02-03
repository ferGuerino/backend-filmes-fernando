import { Client } from "pg";

const client: Client = new Client({
  user: "joe",
  password: "1234",
  host: "localhost",
  database: "kenzie_movies",
  port: 5432,
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected");
};

export { client, startDatabase };
