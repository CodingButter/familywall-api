import { config } from "dotenv";
import fs from "fs";
import Client from "./familywall-client.js";
config();

const { email, password } = process.env;
const run = async () => {
  const client = new Client();
  await client.login(email, password);
  const family = await client.getFamily();
  const members = family.getMembers();
  const familySettings = family.getFamilySettings();
  fs.writeFileSync("members.json", JSON.stringify(members, null, 2));
  fs.writeFileSync(
    "familySettings.json",
    JSON.stringify(familySettings, null, 2)
  );
};

run();
