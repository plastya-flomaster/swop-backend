const express = require("express");
const router = express.Router();

const likedItems = require("../../controllers/likedItems.controller");

router.post("/create/:id", likedItems.create);

router.put("/addpairs", likedItems.addPairs);

router.get("/search/:id", likedItems.search);

module.exports = router;
