import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const adminLogin = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        // Hardcoded admin credentials from .env
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim();

        console.log("Login attempt:", { email, password });
        console.log("Expected credentials:", { ADMIN_EMAIL, ADMIN_PASSWORD });

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "Bad Request",
                message: "Email and password required"
            });
        }

        // Using trim() on provided email to avoid whitespace issues
        if (email.trim() !== ADMIN_EMAIL || password.trim() !== ADMIN_PASSWORD) {
            console.log("Login failed: Mismatching credentials");
            return res.status(401).json({
                success: false,
                data: null,
                error: "Unauthorized",
                message: "Invalid credentials"
            });
        }

        console.log("Login success for admin");
        const token = jwt.sign(
            { email: email.trim(), role: "admin", appId: process.env.APP_ID || 'standalone' },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            data: { token },
            error: null,
            message: "Login successful"
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            data: null,
            error: error.name || "Internal Server Error",
            message: error.message
        });
    }
};