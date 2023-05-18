const express = require("express");
const router = express.Router();
const stations = require("../models/stations_model");

//info of single station
router.get("/station/:id?", function (request, response) {
  const stationid = parseInt(request.params.id);
  console.log(stationid);

  if (isNaN(stationid)) {
    console.log("invalid");
    response.status(400).json({ error: "id has to be integer" });
    return;
  }

  stations.getById(stationid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.length === 0) {
      response.status(404).json({ error: "not found" });
    } else {
      response.json(dbResult[0]);
    }
  });
});

//average duration of journeys endpoint
router.get("/averages/:id?", function (request, response) {
  const stationid = parseInt(request.params.id);
  console.log(stationid);

  if (isNaN(stationid)) {
    console.log("invalid");
    response.status(400).json({ error: "id has to be integer" });
    return;
  }

  stations.getAverages(stationid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.length === 0) {
      response.status(404).json({ error: "not found" });
    } else {
      response.json(dbResult[0]);
    }
  });
});

//list of stations
router.get("/", function (req, res) {
  const page = parseInt(req.query.page) || 1; //if page is not specified, default to 1
  const pageSize = parseInt(req.query.pageSize) || 10; //if pagesize is not specified, default to 10

  stations.getAll(page, pageSize, function (err, dbResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(dbResult);
    }
  });
});

//amount of pages for pagination
router.get("/totalpages", function (req, res) {
  const pageSize = parseInt(req.query.pageSize) || 10; //if pagesize is not specified, default to 10

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
  const stationid = parseInt(request.params.id);
  if (isNaN(stationidid)) {
    response.status(400).json({ error: "id has to be integer" });
    return;
  }

  stations.delete(stationid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult);
    }
  });
});

router.put("/:id", function (request, response) {
  const stationid = parseInt(request.params.id);
  if (isNaN(stationidid)) {
    response.status(400).json({ error: "id has to be integer" });
    return;
  }

  stations.update(stationid, request.body, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json(dbResult);
    }
  });
});
module.exports = router;
