const fs = require("fs/promises");
const bodyParser = require("body-parser");
const express = require("express");

const beApp = express();

beApp.use(bodyParser.json());

// CORS
beApp.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Get files from a bucket
beApp.get("/bucketList", async (req, res) => {
  try {
    const fileContent = await fs.readFile(
      "./backend/data/bucketList.json",
      "utf8"
    );
    const bucketListData = JSON.parse(fileContent);

    const { bucketName } = req.query;
    if (bucketName) {
      const bucket = bucketListData.find((b) => b.name === bucketName);
      if (!bucket) {
        return res
          .status(404)
          .json({ message: `Bucket with name ${bucketName} not found` });
      }
      return res.status(200).json({ bucket });
    }

    res.status(200).json({ bucketList: bucketListData });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error reading bucket list data",
        error: error.message,
      });
  }
});

// Add or update a file in a bucket
beApp.post("/bucketList/file", async (req, res) => {
  const { bucketName, file } = req.body;
  try {
    const fileContent = await fs.readFile(
      "./backend/data/bucketList.json",
      "utf8"
    );
    let bucketListData = JSON.parse(fileContent);

    const bucket = bucketListData.find((b) => b.name === bucketName);
    if (!bucket) {
      return res
        .status(404)
        .json({ message: `Bucket with name ${bucketName} not found` });
    }

    const existingFileIndex = bucket.files.findIndex(
      (f) => f.name === file.name
    );
    if (existingFileIndex !== -1) {
      bucket.files[existingFileIndex] = {
        ...bucket.files[existingFileIndex],
        dateAdded: file.dateAdded,
        size: file.size,
      };
    } else {
      bucket.files.push({
        name: file.name,
        dateAdded: file.dateAdded,
        size: file.size,
      });
    }

    await fs.writeFile(
      "./backend/data/bucketList.json",
      JSON.stringify(bucketListData)
    );

    res.status(200).json({ message: "File added or updated in bucket!" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error adding or updating file in bucket",
        error: error.message,
      });
  }
});

// Remove a file from a bucket
beApp.delete("/bucketList/file", async (req, res) => {
  const { bucketName, fileName } = req.body;
  try {
    const fileContent = await fs.readFile(
      "./backend/data/bucketList.json",
      "utf8"
    );
    let bucketListData = JSON.parse(fileContent);

    const bucket = bucketListData.find((b) => b.name === bucketName);
    if (!bucket) {
      return res
        .status(404)
        .json({ message: `Bucket with name ${bucketName} not found` });
    }

    const fileIndex = bucket.files.findIndex((file) => file.name === fileName);
    if (fileIndex === -1) {
      return res
        .status(404)
        .json({ message: `File with name ${fileName} not found in bucket` });
    }

    bucket.files.splice(fileIndex, 1);

    await fs.writeFile(
      "./backend/data/bucketList.json",
      JSON.stringify(bucketListData)
    );

    res.status(200).json({ message: "File removed from bucket!" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error removing file from bucket",
        error: error.message,
      });
  }
});

// Add a new bucket
beApp.post("/bucketList/bucket", async (req, res) => {
  const { bucketName, bucketLocation } = req.body;
  try {
    const fileContent = await fs.readFile(
      "./backend/data/bucketList.json",
      "utf8"
    );
    let bucketListData = JSON.parse(fileContent);

    const bucketExists = bucketListData.some(
      (bucket) => bucket.name === bucketName
    );
    if (bucketExists) {
      return res
        .status(400)
        .json({ message: `Bucket with name ${bucketName} already exists` });
    }

    bucketListData.push({
      name: bucketName,
      location: bucketLocation,
      files: [],
    });

    await fs.writeFile(
      "./backend/data/bucketList.json",
      JSON.stringify(bucketListData)
    );

    res.status(201).json({ message: "Bucket added successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding bucket", error: error.message });
  }
});

// Remove a bucket
beApp.delete("/bucketList/bucket", async (req, res) => {
  const { bucketName } = req.body;
  try {
    const fileContent = await fs.readFile(
      "./backend/data/bucketList.json",
      "utf8"
    );
    let bucketListData = JSON.parse(fileContent);

    const bucketIndex = bucketListData.findIndex(
      (bucket) => bucket.name === bucketName
    );
    if (bucketIndex === -1) {
      return res
        .status(404)
        .json({ message: `Bucket with name ${bucketName} not found` });
    }

    bucketListData.splice(bucketIndex, 1);

    await fs.writeFile(
      "./backend/data/bucketList.json",
      JSON.stringify(bucketListData)
    );

    res.status(200).json({ message: "Bucket removed successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing bucket", error: error.message });
  }
});

// Fetch all bucket names and locations
beApp.get("/bucketList/buckets", async (req, res) => {
  try {
    const fileContent = await fs.readFile(
      "./backend/data/bucketList.json",
      "utf8"
    );
    const bucketListData = JSON.parse(fileContent);

    const buckets = bucketListData.map((bucket) => ({
      name: bucket.name,
      location: bucket.location,
    }));

    res.status(200).json({ buckets });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching bucket names and locations",
        error: error.message,
      });
  }
});

// Fetch Details
beApp.get("/bucketDetails", async (req, res) => {
  try {
    const fileContent = await fs.readFile(
      "./backend/data/bucketList.json",
      "utf8"
    );
    const bucketListData = JSON.parse(fileContent);

    const { bucketName } = req.query;
    if (bucketName) {
      const bucket = bucketListData.find((b) => b.name === bucketName);
      if (!bucket) {
        return res
          .status(404)
          .json({ message: `Bucket with name ${bucketName} not found` });
      }
      const bucketDetails = {
        name: bucket.name,
        location: bucket.location || "Unknown",
        size: bucket.files.reduce((acc, file) => acc + file.size, 0),
      };
      return res.status(200).json(bucketDetails);
    }

    res.status(400).json({ message: "Bucket name is required" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reading Details", error: error.message });
  }
});

// 404
beApp.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

beApp.listen(3001, () => {
  console.log("Server is running on port 3001");
});
