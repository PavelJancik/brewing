import express from "express";
import cors from "cors";
import { connectClient } from "./db";

const router = express.Router();
router.use(cors());

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

router.get("/batch/:batchId", async (req, res) => {
  const client = await connectClient();
  const batch = await client
    .collection("beerBatches")
    .findOne({ slug: req.params.batchId });
  res.send({ batch });
});

export default router;
