import { connect_client, stop_client } from "../server/db";

async function main() {
  const client = await connect_client();

  await client.collection("brewing").deleteMany({});

  const resp = await client.collection("brewing").insertMany([
    {
      id: "2025-06",
      name: " SMASH Cenntenial + Mango & Habanero",
    },
    {
      id: "2025-05",
      name: "SMASH Cenntenial + Ibišek",
    },
  ]);

  console.info("Inserted Contests:", resp.insertedCount);

  stop_client();
}

main();
