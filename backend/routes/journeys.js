const express = require("express");
const router = express.Router();
const journeys = require("../models/journeys_model");

//id validator
function validateId(request, response, next) {
  const journeyid = parseInt(request.params.id);
  if (isNaN(journeyid)) {
    response.status(400).json({ error: "id has to be a number" });
    return;
  }
  request.journeyid = journeyid;
  next();
}

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

//get single journey
/**
 * @api {get} /journeys/journey/:id Request Journey Information
 * @apiName GetJourneyById
 * @apiGroup Journeys
 *
 * @apiParam {Number} id Journey unique ID.
 *
 * @apiSuccess {Number} id Journey ID
 * @apiSuccess {Number} departure_id ID of departure station.
 * @apiSuccess {String} departure_name  Name of departure station.
 * @apiSuccess {Number} return_id ID of return station.
 * @apiSuccess {String} return_name  Name of return station.
 * @apiSuccess {Number} distance Distance of journey in meters.
 * @apiSuccess {Number} duration Duration of journey in seconds.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {"id":123456,"departure_id":9,"departure_name":"Erottajan aukio","return_id":48,"return_name":"Mastokatu","distance":1705,"duration":385}
 *
 * @apiError JourneyNotFound No Journey with this ID.
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
router.get("/journey/:id?", validateId, function (request, response) {
  journeys.getById(request.journeyid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.length === 0) {
      response.status(404).json({ error: "not found" });
    } else {
      response.json(dbResult[0]);
    }
  });
});
//list of journeys
/**
 * @api {get} /journeys/?page=:page&pageSize=:pageSize Request list of journeys
 * @apiName GetJourneys
 * @apiGroup Journeys
 *
 * @apiParam {Number} page Page of stations. (default is 1 if not specified)
 * @apiParam {Number} pageSize Number of items per page(default is 10 if not specified).

 * @apiSuccess {Object[]} journeys Array containing specified amount of journeys
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {"journeys":[{"id":114403,"departure_id":94,"departure_name":"Laajalahden aukio","return_id":100,"return_name":"Teljäntie","distance":2043,"duration":500},{"id":114404,"departure_id":82,"departure_name":"Töölöntulli","return_id":113,"return_name":"Pasilan asema","distance":1870,"duration":611},{"id":114405,"departure_id":123,"departure_name":"Näkinsilta","return_id":121,"return_name":"Vilhonvuorenkatu","distance":1025,"duration":399},{"id":114406,"departure_id":4,"departure_name":"Viiskulma","return_id":65,"return_name":"Hernesaarenranta","distance":4318,"duration":2009},{"id":114407,"departure_id":4,"departure_name":"Viiskulma","return_id":65,"return_name":"Hernesaarenranta","distance":1400,"duration":350},{"id":114408,"departure_id":292,"departure_name":"Koskelan varikko","return_id":133,"return_name":"Paavalinpuisto","distance":1713,"duration":366},{"id":114409,"departure_id":34,"departure_name":"Kansallismuseo","return_id":81,"return_name":"Stenbäckinkatu","distance":2550,"duration":1377},{"id":114410,"departure_id":240,"departure_name":"Viikin normaalikoulu","return_id":281,"return_name":"Puotila (M)","distance":5366,"duration":1304},{"id":114411,"departure_id":116,"departure_name":"Linnanmäki","return_id":117,"return_name":"Brahen puistikko","distance":3344,"duration":1393},{"id":114412,"departure_id":116,"departure_name":"Linnanmäki","return_id":145,"return_name":"Pohjolankatu","distance":3248,"duration":935}]}
 *
 * @apiError NotFound No more journeys to find.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not found"
 *     }
 */
router.get("/", function (req, res) {
  const page = parseInt(req.query.page) || 1; //if page is not specified, default to 1
  const pageSize = parseInt(req.query.pageSize) || 10; //if pagesize is not specified, default to 10

  journeys.getAll(page, pageSize, function (err, dbResult) {
    if (err) {
      res.json(err);
    } else if (dbResult.journeys.length === 0) {
      res.status(404).json({ error: "not found" });
    } else {
      res.json(dbResult);
    }
  });
});

//total pages for pagination
/**
 * @api {get} /journeys/totalpages/?pageSize=:pageSize Request amount of pages
 * @apiName GetTotalPages
 * @apiGroup Journeys
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
router.get("/totalpages/", function (req, res) {
  const pageSize = parseInt(req.query.pageSize) || 10; //if pagesize is not specified, default to 10

  journeys.getTotalPages(pageSize, function (err, totalPages) {
    if (err) {
      res.json(err);
    } else {
      res.json({ totalPages });
    }
  });
});

//create a journey
/**
 * @api {post} /journeys/ Create a Journey
 * @apiName CreateJourney
 * @apiGroup Journeys
 *
 * @apiBody {Number} departure_id ID of the departure station.
 * @apiBody {String} departure_name Name of the departure station.
 * @apiBody {Number} return_id ID of the return station.
 * @apiBody {String} return_name Name of the return station.
 * @apiBody {Number} duration Duration of the journey in seconds.
 * @apiBody {Number} distance Distance of the journey in meters.
 *
 * @apiSuccess {Object} result Object containing ID of the created journey.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "Inserted with id": 123456
 *     }
 *
 * @apiError BadRequest Request body invalid.
 *
 * @apiErrorExample 400 Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Field is missing or has an invalid type"
 *     }
 */
router.post("/", function (request, response) {
  const requiredFields = [
    "departure_id",
    "departure_name",
    "return_id",
    "return_name",
    "duration",
    "distance",
  ];
  const requiredTypes = [
    "number",
    "string",
    "number",
    "string",
    "number",
    "number",
  ];

  const validationError = validateBody(
    request.body,
    requiredFields,
    requiredTypes
  );
  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }
  journeys.add(request.body, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else {
      response.json({ "Inserted with id": dbResult.insertId });
    }
  });
});

//delete a journey
/**
 * @api {delete} /journeys/:id Delete a Journey
 * @apiName DeleteJourney
 * @apiGroup Journeys
 *
 * @apiParam {Number} id ID of the journey to delete.
 *
 * @apiSuccess {Object} result Object containing the delete operation details.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "affectedRows": 1
 *     }
 *
 * @apiError NotFound No journey found with the provided ID.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No journey found with id"
 *     }
 */
router.delete("/:id", validateId, function (request, response) {
  journeys.delete(request.journeyid, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.affectedRows === 0) {
      response.status(404).json({ error: "No journey found with id" });
    } else {
      response.json(dbResult);
    }
  });
});

//update journey
/**
 * @api {put} /journeys/:id Update a Journey
 * @apiName UpdateJourney
 * @apiGroup Journeys
 *
 * @apiParam {Number} id ID of the journey to update.
 * @apiBody {Number} departure_id Updated ID of the departure station.
 * @apiBody {String} departure_name Updated name of the departure station.
 * @apiBody {Number} return_id Updated ID of the return station.
 * @apiBody {String} return_name Updated name of the return station.
 * @apiBody {Number} duration Updated duration of the journey in seconds.
 * @apiBody {Number} distance Updated distance of the journey in meters.
 *
 * @apiSuccess {Object} result Object containing the update operation details.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "affectedRows": 1
 *     }
 *
 * @apiError NotFound Journey with the provided ID doesn't exist.
 *
 * @apiErrorExample 404 Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Journey with this id doesn't exist"
 *     }
 *
 * @apiError BadRequest Request body invalid.
 *
 * @apiErrorExample 400 Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Field is missing or has an invalid type"
 *     }
 */
router.put("/:id", validateId, function (request, response) {
  const requiredFields = [
    "departure_id",
    "departure_name",
    "return_id",
    "return_name",
    "duration",
    "distance",
  ];
  const requiredTypes = [
    "number",
    "string",
    "number",
    "string",
    "number",
    "number",
  ];

  const validationError = validateBody(
    request.body,
    requiredFields,
    requiredTypes
  );
  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }
  journeys.update(request.journeyid, request.body, function (err, dbResult) {
    if (err) {
      response.json(err);
    } else if (dbResult.affectedRows === 0) {
      response.status(404).json({ error: "journey with this id doesnt exist" });
    } else {
      response.json(dbResult);
    }
  });
});
module.exports = router;
