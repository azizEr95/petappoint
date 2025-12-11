import express from "express";
import { passwordResetService } from "../service/passwordResetService";
import { sendPasswordResetEmail } from "../service/emailService";
import { personService } from "../service/personService";
import { z } from "zod";
import { optionalAuthentication } from "./authentication";

export const passwordResetRouter = express.Router();

// Request password reset
passwordResetRouter.post("/request",
  optionalAuthentication,
  async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email()
      });

      const { email } = schema.parse(req.body);

      // Generate token (returns null if user doesn't exist)
      const token = await passwordResetService.createResetToken(email);

      if (token) {
        // Get user details for email
        const person = await personService.getByEmail(email);

        // Send reset email
        await sendPasswordResetEmail(email, person.firstName, token);
      }

      // Always return success (prevent email enumeration)
      res.status(200).json({
        message: "If the email exists, a reset link has been sent"
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Verify token (optional, for frontend UX)
passwordResetRouter.post("/verify",
  optionalAuthentication,
  async (req, res) => {
    try {
      const schema = z.object({
        token: z.string().min(1)
      });

      const { token } = schema.parse(req.body);

      const userId = await passwordResetService.verifyToken(token);

      if (userId) {
        res.status(200).json({ valid: true });
      } else {
        res.status(400).json({
          valid: false,
          error: "Token is invalid, expired, or already used"
        });
      }
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(400).json({
        valid: false,
        error: "Invalid request"
      });
    }
  }
);

// Confirm password reset
passwordResetRouter.post("/confirm",
  optionalAuthentication,
  async (req, res) => {
    try {
      const schema = z.object({
        token: z.string().min(1),
        newPassword: z.string()
          .min(8)
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[0-9]/, "Password must contain at least one number")
          .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must contain at least one special character")
      });

      const { token, newPassword } = schema.parse(req.body);

      const success = await passwordResetService.resetPassword(token, newPassword);

      if (success) {
        res.status(200).json({ message: "Password successfully reset" });
      } else {
        res.status(400).json({
          error: "Token is invalid, expired, or already used"
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Password validation failed",
          details: error.issues
        });
      } else {
        console.error("Password reset confirm error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
);
