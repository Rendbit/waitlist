import request from "supertest";
import express from "express";
import { joinWaitlist } from "../controllers/user";
import User from "../models/User";

// Mock the User model to avoid hitting the database
jest.mock("../models/User");

const app = express();
app.use(express.json()); // For parsing JSON request bodies

// Set up route for the joinWaitlist controller
app.post("/waitlist-api/user/join", joinWaitlist);

const testEmail = "testEmail12@gmail.com";
const testStellarPublicKey = "12";

describe("joinWaitlist Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if any required field is missing", async () => {
    const response = await request(app).post("/waitlist-api/user/join").send({
      firstName: "John",
      lastName: "Doe",
      stellarPublicKey: testStellarPublicKey,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required.");
  });

  it("should return 409 if the user already exists", async () => {
    User.findOne = jest.fn().mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: testEmail,
      stellarPublicKey: testStellarPublicKey,
    });

    const response = await request(app).post("/waitlist-api/user/join").send({
      firstName: "John",
      lastName: "Doe",
      email: testEmail,
      stellarPublicKey: testStellarPublicKey,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User already joined the waitlist.");
  });

  it("should create a new user and return 201 if all fields are valid", async () => {
    // ✅ FIXED: Ensure user doesn't already exist
    User.findOne = jest.fn().mockResolvedValue(null);

    User.create = jest.fn().mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      email: testEmail,
      stellarPublicKey: testStellarPublicKey,
    });

    const response = await request(app).post("/waitlist-api/user/join").send({
      firstName: "John",
      lastName: "Doe",
      email: testEmail,
      stellarPublicKey: testStellarPublicKey,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Successfully joined the waitlist!");
  });

  it("should handle errors gracefully", async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    User.create = jest.fn().mockRejectedValue(new Error("Some database error"));

    const response = await request(app).post("/waitlist-api/user/join").send({
      firstName: "John",
      lastName: "Doe",
      email: testEmail,
      stellarPublicKey: testStellarPublicKey,
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server error. Please try again later.");
  });
});
