import { config } from "dotenv";
import Client from "./familywall-client.js";
config();

const { email, password } = process.env;

const client = new Client();
client.login(email, password).then(async () => {
  const allAccounts = await client.getAllFamily();
  console.log(JSON.stringify(allAccounts, null, 2));
});
