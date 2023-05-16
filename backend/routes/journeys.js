const express = require("express");
const router = express.Router();
const journeys = require("../models/journeys_model");

router.get("/journey/:id?", function (request, response) {
  const journeyid = parseInt(request.params.id) || 1;
  journeys.getById(journeyid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult[0]);
    }
  });
});

router.get("/", function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  journeys.getAll(page, pageSize, function (err, dbResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(dbResult);
    }
  });
});

router.get("/totalpages", function (req, res) {
  const pageSize = parseInt(req.query.pageSize) || 10;

  journeys.getTotalPages(pageSize, function (err, totalPages) {
    if (err) {
      res.json(err);
    } else {
      res.json({ totalPages });
    }
  });
});

router.post("/", function (request, response) {
  journeys.add(request.body, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(request.body);
    }
  });
});

router.delete("/:id", function (request, response) {
  journeys.delete(request.params.id, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult);
    }
  });
});

router.put("/:id", function (request, response) {
  journeys.update(request.params.id, request.body, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult);
    }
  });
});
module.exports = router;
