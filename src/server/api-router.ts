import express from "express";
import cors from "cors";
import { connectClient } from "./db";

const router = express.Router();
router.use(cors());
router.use(express.json());

router.get("/beerBatches", async (req, res) => {
  const client = await connectClient();
  const beerBatches = await client
    .collection("beerBatches")
    .find()
    .project({
      _id: 0,
      slug: 1,
      name: 1,
    })
    .toArray();
  res.send({ beerBatches });
});

router.get("/batch/:batchSlug", async (req, res) => {
  const client = await connectClient();
  const batch = await client
    .collection("beerBatches")
    .findOne({ slug: req.params.batchSlug });
  res.send({ batch });
});

router.post("/updateBatch/:originalBatchSlug", async (req, res) => {
  const client = await connectClient();
  const { updatedBatchData } = req.body;
  const batch = await client
    .collection("beerBatches")
    .findOneAndUpdate(
      { slug: req.params.originalBatchSlug },
      { $set: updatedBatchData },
      { returnDocument: "after" },
    );
  res.send({ updatedBatch: batch });
});

router.post("/addBatch", async (req, res) => {
  const client = await connectClient();
  const { newBatch } = req.body;
  // const batch = await client
  await client.collection("beerBatches").inserOne(newBatch);

  const batch = await client
    .collection("beerBatches")
    .findOne({ slug: newBatch.batchSlug });

  res.send({ batch });
});

export default router;
