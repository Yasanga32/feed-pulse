import rateLimit from "express-rate-limit";

export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per window
  message: {
    success: false,
    message: "Too many submissions. Please try again after 1 hour."
  },
  standardHeaders: true,
  legacyHeaders: false
});