const express = require("express");
const router = express.Router();
const stations = require("../models/stations_model");

//id validator
function validateId(request, response, next) {
  const stationid = parseInt(request.params.id);
  if (isNaN(stationid)) {
    response.status(400).json({ error: "id has to be a number" });
    return;
  }
  request.stationid = stationid;
  next();
}

/**
 * @api {get} /stations/station/:id Single station information
 * @apiName GetStationById
 * @apiGroup Stations
 *
 * @apiParam {Number} id Station unique ID.
 *
 * @apiSuccess {Number} id Station ID
 * @apiSuccess {String} name Name of station.
 * @apiSuccess {String} address  Adress of station.
 * @apiSuccess {Number} departures_count Number of departures from station
 * @apiSuccess {Number} returns_count Number of returns to station
 * @apiSuccess {Number} x X coordinate of station
 * @apiSuccess {Number} y Y coordinate of station
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {"id":1,"name":"Kaivopuisto","address":"Meritori 1","x":24.950210571289062,"y":60.15536880493164,"departures_count":23802,"returns_count":24288}
 *
 * @apiError StationNotFound No station with this ID.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not found"
 *     }
 * @apiError BadRequest Request parameter invalid.
 *
 * @apiErrorExample 400 Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "id has to be number"
 *     }
 */
router.get("/station/:id?", validateId, function (request, response) {
  stations.getById(request.stationid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.length === 0 || dbResult[0][0].id === null) {
      response.status(404).json({ error: "not found" });
    } else {
      console.log(dbResult[0][0]);
      response.json(dbResult[0][0]);
    }
  });
});

//average distance of journeys endpoint
/**
 * @api {get} /stations/averages/:id Average distance of journeys from/to this station
 * @apiName GetAverages
 * @apiGroup Stations
 *
 * @apiParam {Number} id Station unique ID.
 *
 * @apiSuccess {Number} avgstart Average distance of journey starting from this station in meters.
 * @apiSuccess {Number} avgend Average distance of journey ending to this station in meters.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "avgstart":2337.6,
 *      "avgend":2399.09
 *    }
 *
 * @apiError StationNotFound No station with this ID.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not found"
 *     }
 * @apiError BadRequest Request parameter invalid.
 *
 * @apiErrorExample 400 Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "id has to be number"
 *     }
 */
router.get("/averages/:id?", validateId, function (request, response) {
  stations.getAverages(request.stationid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.length === 0 || dbResult[0][0].avgstart === null) {
      response.status(404).json({ error: "not found" });
    } else {
      response.json(dbResult[0][0]);
    }
  });
});

//request body validator
function validateBody(requestBody, requiredFields, requiredTypes) {
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    const type = requiredTypes[i];

    if (!requestBody.hasOwnProperty(field)) {
      return `${field} is missing`;
    }

    if (typeof requestBody[field] !== type) {
      return `${field} should be ${type}`;
    }
  }

  return null; // request ok
}

//top end station  endpoint
/**
 * @api {get} /stations/endstations/:id Top 5 journey end stations from this station
 * @apiName GetEndStations
 * @apiGroup Stations
 *
 * @apiParam {Number} id Station unique ID.
 *
 * @apiSuccess {Object[]} Array Array of stations
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 * [{"station_id":12,"station_name":"Kanavaranta","count":1224},
 * {"station_id":16,"station_name":"Liisanpuistikko","count":916},
 * {"station_id":19,"station_name":"Rautatientori / itä","count":848},
 * {"station_id":124,"station_name":"Isoisänsilta","count":828},
 * {"station_id":121,"station_name":"Vilhonvuorenkatu","count":796}]
 *    }
 *
 * @apiError StationNotFound No station with this ID.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not found"
 *     }
 * @apiError BadRequest Request parameter invalid.
 *
 * @apiErrorExample 400 Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "id has to be number"
 *     }
 */
router.get("/endstations/:id?", validateId, function (request, response) {
  stations.getEndStations(request.stationid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.length === 0 || dbResult[0].length === 0) {
      response.status(404).json({ error: "not found" });
    } else {
      response.json(dbResult[0]);
    }
  });
});

//top start stations endpoint
/**
 * @api {get} /stations/startstations/:id Top 5 start stations of journeys ending here
 * @apiName GetStartStations
 * @apiGroup Stations
 *
 * @apiParam {Number} id Station unique ID.
 *
 * @apiSuccess {Object[]} Array Array of stations
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
[{"station_id":12,"station_name":"Kanavaranta","count":1168},
{"station_id":126,"station_name":"Kalasatama (M)","count":1078},
{"station_id":16,"station_name":"Liisanpuistikko","count":960},
{"station_id":121,"station_name":"Vilhonvuorenkatu","count":930},
{"station_id":124,"station_name":"Isoisänsilta","count":920}]
 *    }
 *
 * @apiError StationNotFound No station with this ID.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not found"
 *     }
 * @apiError BadRequest Request parameter invalid.
 *
 * @apiErrorExample 400 Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "id has to be number"
 *     }
 */
router.get("/startstations/:id?", validateId, function (request, response) {
  stations.getStartStations(request.stationid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.length === 0 || dbResult[0].length === 0) {
      response.status(404).json({ error: "not found" });
    } else {
      response.json(dbResult[0]);
    }
  });
});

//list of stations

/**
 * @api {get} /stations/?page=:page&pageSize=:pageSize List of all stations
 * @apiName GetStations
 * @apiGroup Stations
 *
 * @apiParam {Number} page Page of stations. 1=defaultValue
 * @apiParam {Number} pageSize Number of items per page(default=10).

 * @apiSuccess {Object[]} stations Array containing specified amount of stations
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *     {"stations":[{"id":1,"name":"Kaivopuisto","address":"Meritori 1","x":24.9502,"y":60.1554},{"id":2,"name":"Laivasillankatu","address":"Laivasillankatu 14","x":24.9565,"y":60.161},{"id":3,"name":"Kapteeninpuistikko","address":"Tehtaankatu 13","x":24.945,"y":60.1582},{"id":4,"name":"Viiskulma","address":"Fredrikinkatu 19","x":24.9418,"y":60.161},{"id":5,"name":"Sepänkatu","address":"Tehtaankatu 25","x":24.9363,"y":60.1579},{"id":6,"name":"Hietalahdentori","address":"Hietalahdenkatu 2","x":24.9296,"y":60.1622},{"id":7,"name":"Designmuseo","address":"Korkeavuorenkatu 23","x":24.946,"y":60.1631},{"id":8,"name":"Vanha kirkkopuisto","address":"Annankatu 16","x":24.9391,"y":60.1654},{"id":9,"name":"Erottajan aukio","address":"Eteläesplanadi 22","x":24.9442,"y":60.1669},{"id":10,"name":"Kasarmitori","address":"Fabianinkatu 13","x":24.9495,"y":60.165}]}
 *    }
 *
 * @apiError NotFound No more stations to find.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not found"
 *     }
 */
router.get("/", function (request, response) {
  const page = parseInt(request.query.page) || 1; //if page is not specified, default to 1
  const pageSize = parseInt(request.query.pageSize) || 10; //if pagesize is not specified, default to 10

  stations.getAll(page, pageSize, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.stations.length === 0) {
      response.status(404).json({ error: "not found" });
    } else {
      response.json(dbResult);
    }
  });
});

//amount of pages for pagination
/**
 * @api {get} /stations/totalpages/?pageSize=:pageSize Stations pages count
 * @apiName GetTotalPages
 * @apiGroup Stations
 *
 * @apiParam {Number} pageSize Number of items per page(default=10).

 * @apiSuccess {Object} totalPages Object containing amount of pages with specified pageSize
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *     {"totalPages":46}
 *    }
 */
router.get("/totalpages/", function (request, response) {
  const pageSize = parseInt(request.query.pageSize) || 10; //if pagesize is not specified, default to 10

  stations.getTotalPages(pageSize, function (err, totalPages) {
    if (err) {
      response.json(err);
    } else {
      response.json({ totalPages });
    }
  });
});

/**
 * @api {post} /stations/ Create a new station
 * @apiName CreateStation
 * @apiGroup Stations
 *
 * @apiBody {Number} id Station unique ID.
 * @apiBody {String} name Name of the station.
 * @apiBody {String} address Address of the station.
 * @apiBody {Number} x X coordinate of the station.
 * @apiBody {Number} y Y coordinate of the station.
 *
 * @apiSuccess {Number} Inserted with id The ID of the newly created station.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ID": 123
 *     }
 *
 * @apiError BadRequest Request body invalid or missing required fields.
 *
 * @apiErrorExample 400 Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Field is missing or invalid"
 *     }
 */
router.post("/", function (request, response) {
  const requiredFields = ["id", "name", "address", "x", "y"];
  const requiredTypes = ["number", "string", "string", "number", "number"];

  const validationError = validateBody(
    request.body,
    requiredFields,
    requiredTypes
  );
  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }

  stations.add(request.body, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json({ ID: dbResult.insertId });
    }
  });
});

/**
 * @api {delete} /stations/:id Delete a station
 * @apiName DeleteStation
 * @apiGroup Stations
 *
 * @apiParam {Number} id Station unique ID.
 *
 * @apiSuccess {Object} Result of the deletion operation.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Station deleted successfully"
 *     }
 *
 * @apiError NotFound No station found with the specified ID.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No station found with ID"
 *     }
 */
router.delete("/:id", validateId, function (request, response) {
  stations.delete(request.stationid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.affectedRows === 0) {
      response.status(404).json({ error: "No station found with id" });
    } else {
      response.json(dbResult.affectedRows);
    }
  });
});

/**
 * @api {put} /stations/:id Update a station
 * @apiName UpdateStation
 * @apiGroup Stations
 *
 * @apiParam {Number} id Station unique ID.
 * @apiBody {String} [name] Name of the station.
 * @apiBody {String} [address] Address of the station.
 * @apiBody {Number} [x] X coordinate of the station.
 * @apiBody {Number} [y] Y coordinate of the station.
 *
 * @apiSuccess {Object} Result of the update operation.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Station updated successfully"
 *     }
 *
 * @apiError NotFound No station found with the specified ID.
 * @apiError BadRequest Request body invalid or missing required fields.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No station found with ID"
 *     }
 * @apiErrorExample 400 Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Field is missing or invalid"
 *     }
 */

router.put("/:id", validateId, function (request, response) {
  const requiredFields = ["id", "name", "address", "x", "y"];
  const requiredTypes = ["number", "string", "string", "number", "number"];

  const validationError = validateBody(
    request.body,
    requiredFields,
    requiredTypes
  );
  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }

  stations.update(request.stationid, request.body, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.affectedRows === 0) {
      response.status(404).json({ error: "No journey found with id" });
    } else {
      response.json(dbResult.affectedRows);
    }
  });
});
module.exports = router;
