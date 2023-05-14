const express = require("express");
const router = express.Router();
const journeys = require("../models/journeys_model");

router.get("/:id?", function (request, response) {
  journeys.getById(request.params.id, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult[0]);
    }
  });
});

router.get("/list/:page?", function (request, response) {
  const page = parseInt(request.params.page) || 1;
  const limit = 1000; // Set your desired limit here

  journeys.getAll(page, limit, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult);
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
