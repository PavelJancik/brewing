import { connectClient, stopClient } from "../server/db";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import slugify from "slugify";

// CSV header:
// R;m;name;V-target;IBU;EBC;ABV-target;malts;hops;yeast;others;ingredientsShop;recipe;V;OG;FG;E;EPM;ABV;notes;rating;

async function importBatchesFromCSV(csvPath: string) {
  const client = await connectClient();

  const collection = client.collection("beerBatches");

  await collection.deleteMany({});
  const batches: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        const slug_name = slugify(row.name, {
          lower: true,
          strict: true,
        });
        batches.push({
          slug: `${row.R}-${row.m}-${slug_name}`,
          name: row.name,
          year: row.R,
          month: row.m,
          hops: row.hops
            ? row.hops.split("\n").map((h: string) => h.trim())
            : [],
          malts: row.malts
            ? row.malts.split("\n").map((m: string) => m.trim())
            : [],
          yeast: row.yeast
            ? row.yeast.split("\n").map((y: string) => y.trim())
            : [],
          others: row.others
            ? row.others.split("\n").map((o: string) => o.trim())
            : [],
          recipe: row.recipe,
          ingredientsShop: row.ingredientsShop,
          IBU: row.IBU ? Number(row.IBU.replace(",", ".")) : undefined,
          EBC: row.EBC ? Number(row.EBC.replace(",", ".")) : undefined,
          V: row.V ? Number(row.V.replace(",", ".")) : undefined,
          OG: row.OG ? Number(row.OG.replace(",", ".")) : undefined,
          FG: row.FG ? Number(row.FG.replace(",", ".")) : undefined,
          E: row.E ? Number(row.E.replace(",", ".")) : undefined,
          EPM: row.EPM ? Number(row.EPM.replace(",", ".")) : undefined,
          ABV: row.ABV ? Number(row.ABV.replace(",", ".")) : undefined,
          rating: row.rating.match(/\*/g)?.length ?? 0,
          notes: row.notes
            ? row.notes
                .split("\n")
                .map((n: string) => n.replace("•", "").trim())
            : [],
        });
      })
      .on("end", async () => {
        if (batches.length > 0) {
          await collection.insertMany(batches);
          console.info(`Inserted ${batches.length} batches from CSV.`);
        } else {
          console.info("No data found in CSV.");
        }
        stopClient();
        resolve();
      })
      .on("error", (err) => {
        stopClient();
        reject(err);
      });
  });
}

const csvFilePath = path.join(__dirname, "./batch_archive.csv");
importBatchesFromCSV(csvFilePath)
  .then(() => console.log("Import finished."))
  .catch((err) => console.error("Import failed:", err));
