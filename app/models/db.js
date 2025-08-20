import { Client } from "pg";
import "dotenv/config";

const client = new Client(process.env.DB_CONNECTION);

try {
  await client.connect();
} catch (error) {
  console.error("❌ Erreur de connexion à la base :", error.message);
  process.exit(1);
}

export default client;