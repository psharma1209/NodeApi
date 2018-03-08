const express = require("express");
const router = express.Router();
var fs = require("fs");

var readStream = fs.createReadStream("./db.json");

var mainCategory = {};
var productsJson = [];
readStream.on("data", data => {
  productsJson = JSON.parse(data);
});

router.get("/", function (req, res, next) {
  res.json({ productsJson });
});

router.get("/add", function (req, res, next) {
  res.json({ productsJson });
});

router.post("/add", function (req, res, next) {
  var product = req.body;
  var id = productsJson.products.length;
  product.id = ++id;
  productsJson.products.push(product);
  var writeStream = fs.createWriteStream("./db.json");
  writeStream.write(JSON.stringify(productsJson), err => {
    if (err) throw err;
    else {
      var successmessage = "Successfully Added the new Product";
      res.status(200).json({ successmessage });
    }
  });
});

router.get("/edit/:id", function (req, res) {
  var id = req.params.id;
  var index = productsJson.products.findIndex(p => p.id == id);
  res.json({ productDetails: productsJson.products[index] });
});

router.post("/edit/:id", function (req, res) {
  var product = req.body;
  var id = req.params.id;
  var idx = productsJson.products.findIndex(p => p.id == id);
  product.id = id;
  productsJson.products[idx] = product;
  var writeStream = fs.createWriteStream("./db.json");
  writeStream.write(JSON.stringify(productsJson), err => {
    if (err) throw err;
    else {
      var editmsg = "Product is edited successfully";
      res.json({ editmsg });
    }
  });
});

router.get("/del/:id", function (req, res) {
  var id = req.params.id;
  var deletemsg;
  var delindex = productsJson.products.findIndex(p => p.id == id);
  productsJson.products.splice(delindex, 1);
  var writeStream = fs.createWriteStream("./db.json");
  writeStream.write(JSON.stringify(productsJson), err => {
    if (err) throw err;
    else {
      deletemsg = "Successfully deleted" + " " + id;
      res.json({ deletemsg });
    }
  });
});

router.post("/view", function (req, res) {
  if (req.body.id) {
    var idx = productsJson.products.findIndex(p => p.id == req.body.id);
    res.json({ productDetails: productsJson.products[idx] });
  } else if (req.body.productName) {
    var result = productsJson.products.filter(
      p => p.productName == req.body.productName
    );
    res.json({ productDetails: result });
  }
});

router.get("/viewCategory", function (req, res) {
  var categoryArray = [];
  var categoryArray1 = [];
  for (i = 0; i < productsJson.products.length; i++) {
    categoryArray.push(productsJson.products[i].category);
  }
  for (i = 0; i < categoryArray.length - 1; i++) {
    for (j = 1; j < categoryArray.length; j++) {
      if (categoryArray[i] == categoryArray[j]) {
        categoryArray.splice(j, 1);
      }
    }
  }
  for (i = 0; i < categoryArray.length; i++) {
    let CatObjvalue = [];
    let count = 0;
    for (j = 0; j < productsJson.products.length; j++) {
      if (categoryArray[i] == productsJson.products[j].category) {
        CatObjvalue[count] = productsJson.products[j];
        count++;
      }
    }

    mainCategory[categoryArray[i]] = CatObjvalue;
  }
  res.json({ Category: mainCategory });
});

router.get("/search/:val", function (req, res, next) {
  var val = req.params.val.toLowerCase();
  var searchresult = [];
  var arr = productsJson.products;
  searchresult = arr.filter(function (obj) {
    return obj.productName
      .toString()
      .toLowerCase()
      .includes(val);
  });
  res.json({ searchresult: searchresult });
});

router.get("/globalSearch/:val", (req, res, next) => {
  var globalSearchResult = [];
  var val = req.params.val.toLowerCase();
  var arr = productsJson.products;

  globalSearchResult = arr.filter(function (obj) {
    return Object.keys(obj).some(function (key) {
      return obj[key]
        .toString()
        .toLowerCase()
        .includes(val);
    });
  });
  res.json({ globalSearchResult: globalSearchResult });
});

module.exports = router;
