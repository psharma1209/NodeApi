const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Electronic Store",
    subTitle: "Powerful Electronics"
  });
});

module.exports = router;
