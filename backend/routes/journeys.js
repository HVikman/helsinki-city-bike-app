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
//validate sort parameters
function validateSortParams(sortBy, sortDirection) {
  const validSortColumns = [
    "id",
    "departure_name",
    "return_name",
    "distance",
    "duration",
  ];
  const validSortDirections = ["asc", "desc"];

  if (sortBy && !validSortColumns.includes(sortBy)) {
    return false;
  }

  if (sortDirection && !validSortDirections.includes(sortDirection)) {
    return false;
  }

  return true;
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
 * @apiSuccess {Number} departure_id ID of departure journey.
 * @apiSuccess {String} departure_name  Name of departure journey.
 * @apiSuccess {Number} return_id ID of return journey.
 * @apiSuccess {String} return_name  Name of return journey.
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
 * @api {get} /journeys/?page=:page&pageSize=:pageSize&sortBy=:sortBy&sortDirection=:sortDirection List of all journeys
 * @apiName GetJourneys
 * @apiGroup Journeys
 *
 * @apiParam {Number} page Page of journeys. Defaults to 1 if not specified.
 * @apiParam {Number} pageSize Number of items per page. Defaults to 10 if not specified. Maximum value is 1000.
 * @apiParam {String} sortBy Sort the journeys by a specific column. Defaults to "id" if not specified. Valid columns are "id", "departure_name", "return_name", "distance", and "duration".
 * @apiParam {String} sortDirection Sort direction for the sorting column. Defaults to "asc" if not specified. Valid values are "asc" for ascending and "desc" for descending.
 *
 * @apiSuccess {Object[]} journeys Array containing specified amount of journeys.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *      "journeys":[
 *      {"id":1,"departure_id":94,"departure_name":"Laajalahden aukio","return_id":100,"return_name":"Teljäntie","distance":2043,"duration":500},
 *      {"id":2,"departure_id":82,"departure_name":"Töölöntulli","return_id":113,"return_name":"Pasilan asema","distance":1870,"duration":611}]
 *     }
 *
 * @apiError NotFound No more journeys to find.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not found"
 *     }
 *
 * @apiError InvalidSortParameters Invalid sort parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Invalid sort parameters"
 *     }
 */
router.get("/", function (request, response) {
  const page = parseInt(request.query.page) || 1; //if page is not specified, default to 1
  const pageSize = parseInt(request.query.pageSize) || 10; //if pagesize is not specified, default to 10
  const sortBy = request.query.sortBy || "id";
  const sortDirection = request.query.sortDirection || "asc";

  if (!validateSortParams(sortBy, sortDirection)) {
    response.status(400).json({ error: "Invalid sort parameters" });
    return;
  }

  if (pageSize > 1000) {
    pageSize = 10;
  }
  journeys.getAll(
    page,
    pageSize,
    sortBy,
    sortDirection,
    function (err, dbResult) {
      if (err) {
        console.log(err);
        response.json(err);
      } else if (dbResult.journeys.length === 0) {
        response.status(404).json({ error: "not found" });
      } else {
        response.json(dbResult);
      }
    }
  );
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
router.get("/totalpages/", function (request, response) {
  const pageSize = parseInt(request.query.pageSize) || 10; //if pagesize is not specified, default to 10

  journeys.getTotalPages(pageSize, function (err, totalPages) {
    if (err) {
      response.json(err);
    } else {
      response.json({ totalPages });
    }
  });
});

//create a journey
/**
 * @api {post} /journeys/ Create a Journey
 * @apiName CreateJourney
 * @apiGroup Journeys
 *
 * @apiBody {Number} departure_id ID of the departure journey.
 * @apiBody {String} departure_name Name of the departure journey.
 * @apiBody {Number} return_id ID of the return journey.
 * @apiBody {String} return_name Name of the return journey.
 * @apiBody {Number} duration Duration of the journey in seconds.
 * @apiBody {Number} distance Distance of the journey in meters.
 *
 * @apiSuccess {Object} result Object containing ID of the created journey.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ID": 123456
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
      response.json({ ID: dbResult.insertId });
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
      response.json(dbResult.affectedRows);
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
 * @apiBody {Number} departure_id Updated ID of the departure journey.
 * @apiBody {String} departure_name Updated name of the departure journey.
 * @apiBody {Number} return_id Updated ID of the return journey.
 * @apiBody {String} return_name Updated name of the return journey.
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
      response.json(dbResult.affectedRows);
    }
  });
});
module.exports = router;
