const express = require("express");
const router = express.Router();
const stations = require("../models/stations_model");

router.get("/station/:id?", function (request, response) {
  stations.getById(request.params.id, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult[0]);
    }
  });
});

router.get("/", function (req, res) {
  const page = parseInt(req.query.page) || 1; // Current page number
  const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page

  stations.getAll(page, pageSize, function (err, dbResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(dbResult);
    }
  });
});

router.get("/totalpages", function (req, res) {
  const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page

  stations.getTotalPages(pageSize, function (err, totalPages) {
    if (err) {
      res.json(err);
    } else {
      res.json({ totalPages });
    }
  });
});

router.post("/", function (request, response) {
  stations.add(request.body, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(request.body);
    }
  });
});

router.delete("/:id", function (request, response) {
  stations.delete(request.params.id, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult);
    }
  });
});

router.put("/:id", function (request, response) {
  stations.update(request.params.id, request.body, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult);
    }
  });
});
module.exports = router;
