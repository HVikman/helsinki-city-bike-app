const request = require("supertest");
const app = require("../app");
const db = require("../database");

describe("Journeys API", () => {
  afterAll((done) => {
    // Close the database connection
    db.end((err) => {
      if (err) {
        console.error("Error closing database connection:", err);
      } else {
        console.log("Database connection closed");
      }
      done();
    });
  });
  // Test the "GetJourneyById" endpoint
  describe("GET /journeys/journey/:id", () => {
    test("should return the correct journey with a valid journey ID", async () => {
      const response = await request(app).get("/journeys/journey/222222");

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(222222);
      expect(response.body.departure_name).toBe("Fleminginkatu");
    });

    test("should return a 400 Bad Request with an invalid journey ID", async () => {
      const response = await request(app).get("/journeys/journey/text");
      expect(response.status).toBe(400);
    });
    test("should return a 404 Not Found with a journey id not existing", async () => {
      const response = await request(app).get("/journeys/journey/999999999");
      expect(response.status).toBe(404);
    });
  });
  describe("POST /journeys", () => {
    test("should create a new journey", async () => {
      const journeyData = {
        departure_name: "Kaivopuisto",
        departure_id: 1,
        return_name: "Laivasillankatu",
        return_id: 2,
        duration: 90,
        distance: 2000,
      };

      const response = await request(app).post("/journeys").send(journeyData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("ID");
    });

    test("should return a 400 Bad Request with missing data", async () => {
      const invalidJourneyData = {
        departure_name: "Karhupuisto",
      };

      const response = await request(app)
        .post("/journeys")
        .send(invalidJourneyData);
      expect(response.status).toBe(400);
    });
  });
});
