import { Request, Response, RequestHandler } from "express";
import User from "../models/User";

/**
 * @desc    Controller to handle waitlist registration
 * @route   POST /api/users/join-waitlist
 * @access  Public
 */
export const joinWaitlist: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { firstName, lastName, email, stellarPublicKey } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !stellarPublicKey) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { stellarPublicKey }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already joined the waitlist." });
    }

    // Create new waitlist entry
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      stellarPublicKey,
    });

    return res.status(201).json({
      message: "Successfully joined the waitlist!",
      data: newUser,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid data provided." });
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate entry detected." });
    }

    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
