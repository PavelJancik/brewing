import { connectClient, stopClient } from "../server/db";

async function main() {
  const client = await connectClient();

  await client.collection("beerBatches").deleteMany({});

  const resp = await client.collection("beerBatches").insertMany([
    {
      id: "2025-06",
      name: "SMASH Cenntenial + Mango & Habanero",
    },
    {
      id: "2025-05",
      name: "SMASH Cenntenial + Ibišek",
    },
  ]);

  console.info("Inserted Contests:", resp.insertedCount);

  stopClient();
}

main();
