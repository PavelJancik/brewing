import express from "express";
import cors from "cors";
import multer from "multer";
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
      ABV: 1,
      IBU: 1,
      rating: 1,
      img: 1,
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

router.post("/addBatch", async (req, res) => {
  const client = await connectClient();
  const { newBatch } = req.body;
  await client.collection("beerBatches").insertOne(newBatch);
  const addedBatch = await client
    .collection("beerBatches")
    .findOne({ slug: newBatch.slug });

  res.send({ addedBatch });
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

router.delete("/deleteBatch/:batchSlug", async (req, res) => {
  const client = await connectClient();
  const { batchSlug } = req.params;
  console.log(`deleting ${batchSlug}`);

  const result = await client
    .collection("beerBatches")
    .deleteOne({ slug: batchSlug });

  res.send({ success: true, message: "Batch deleted." });
});

const upload = multer({ storage: multer.memoryStorage() }); // store file in memory
router.post("/updateImage/:slug", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send({ error: "No file uploaded" });

  try {
    const base64Data = req.file.buffer.toString("base64"); // convert buffer to Base64
    const client = await connectClient();

    const result = await client
      .collection("beerBatches")
      .findOneAndUpdate(
        { slug: req.params.slug },
        { $set: { img: base64Data, imageName: req.file.originalname } },
        { returnDocument: "after" },
      );

    if (!result) return res.status(404).send({ error: "Batch not found" });

    res.send({
      message: "Image uploaded and saved as Base64",
      batch: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to store Base64 image" });
  }
});

export default router;
