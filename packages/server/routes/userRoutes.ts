import express from "express";
import type { Request, Response } from "express";
import connection from "../db/connection";
import { authenticateToken, validateBody } from "../middleware/auth";
import {
  registerSchema,
  type RegisterInput,
  loginSchema,
  type LoginInput,
  profileFormSchema,
  checkInSchema,
  goalSchema,
  wellnessSchema,
  chatSchema,
} from "../utilities/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { User } from "../utilities/types";
import type { RowDataPacket } from "mysql2/promise";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const userRoutes = express.Router();

userRoutes.post(
  "/signup",
  validateBody(registerSchema),
  async (req: Request, res: Response) => {
    const { email, password }: RegisterInput = req.body;

    //Check the email exists
    try {
      const [rows] = await connection.execute(
        "SELECT email FROM user WHERE email=?",
        [email]
      );
      if ((rows as any).length > 0) {
        return res.status(400).json({ message: "Email already exists." });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user to the db
    const userId: string = crypto.randomUUID();
    await connection.execute(
      "INSERT INTO user(id, email, password) VALUES(?, ?, ?)",
      [userId, email, hashedPassword]
    );

    // Sign the access token
    const accessToken = jwt.sign(
      { id: userId, email: email },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "1d" }
    );

    // Create and store the refresh token
    const refreshToken = jwt.sign(
      { id: userId, email: email },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await connection.execute(
      "INSERT INTO refresh_token (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, refreshToken, expiresAt]
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production"
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //return tokens
    res.status(201).json({ accessToken });
  }
);

userRoutes.post(
  "/login",
  validateBody(loginSchema),
  async (req: Request, res: Response) => {
    const { email, password }: LoginInput = req.body;

    //Check the email exists
    const [rows] = await connection.execute(
      "SELECT id, email, password FROM user WHERE email = ?",
      [email]
    );

    if ((rows as any).length === 0) {
      return res.status(400).json({ message: "Email does not exist." });
    }

    //Check the password match
    const user: User = (rows as any)[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }
    // Sign the access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "1d" }
    );

    // Create and store the refresh token
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await connection.execute(
      "INSERT INTO refresh_token (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiresAt]
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production"
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  }
);

userRoutes.post("/refresh-token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided." });
  }

  try {
    const userInfo = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string; email: string };

    const [deleteResult] = await connection.execute(
      "DELETE FROM refresh_token WHERE token = ?",
      [refreshToken]
    );

    if ((deleteResult as any).affectedRows === 0) {
      return res
        .status(401)
        .json({ message: "Invalid or already used refresh token." });
    }

    const newRefreshToken = jwt.sign(
      { id: userInfo.id, email: userInfo.email },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    const newAccessToken = jwt.sign(
      { id: userInfo.id, email: userInfo.email },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "1d" }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await connection.execute(
      "INSERT INTO refresh_token (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userInfo.id, newRefreshToken, expiresAt]
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production"
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ newAccessToken });
  } catch (error) {
    console.log("Refresh token error:", error);
    res.status(500).json({ message: "Server error during token refresh." });
  }
});

userRoutes.post(
  "/profile",
  authenticateToken,
  validateBody(profileFormSchema),
  async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: "UnAuthorized." });
    }

    const { displayName, dateOfBirth, gender, meditationExperience } = req.body;

    try {
      await connection.execute(
        "UPDATE user SET name = ?, dob = ?, gender = ?, meditation_level = ? WHERE id = ?",
        [displayName, dateOfBirth, gender, meditationExperience, user.id]
      );
    } catch (err) {
      res.status(500).json({ message: "Server error to update user info." });
    }

    res.status(200).json({ message: "Updated successfully." });
  }
);

userRoutes.get(
  "/profile",
  authenticateToken,
  async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: "UnAuthorized." });
    }

    try {
      const [rows] = await connection.execute(
        "Select id, email, name, dob, gender, meditation_level From user where id = ?",
        [user.id]
      );

      if ((rows as any).length === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      const userInfo = (rows as any)[0];
      res.status(200).json({ userInfo });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      res.status(500).json({ message: "Server error to fetch user info." });
    }
  }
);

userRoutes.post("/logout", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const refreshToken = req.cookies?.refreshToken;

  if (token) {
    try {
      const decoded = jwt.decode(token) as { exp: number };
      if (decoded && decoded.exp) {
        const expiresAt = new Date(decoded.exp * 1000);
        await connection.execute(
          "INSERT INTO blacklisted_token (token, expires_at) VALUES (?, ?)",
          [token, expiresAt]
        );
      }
    } catch (error) {
      console.log("Error blacklisting access token:", error);
    }
  }

  if (refreshToken) {
    try {
      await connection.execute("DELETE FROM refresh_token WHERE token = ?", [
        refreshToken,
      ]);
    } catch (error) {
      console.log("Error invalidating refresh token:", error);
    }
  }

  res.status(200).json({ message: "Logged out successfully." });
});

function toYYYYMMDD(date: Date): string {
  return date.toISOString().split("T")[0] || "";
}

function getLocalYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

userRoutes.get(
  "/check-ins",
  authenticateToken,
  async (req: Request, res: Response) => {
    const user = (req as any).user;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek);

    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      weekDates.push(getLocalYYYYMMDD(day));
    }

    try {
      const placeholders = weekDates.map(() => "?").join(",");

      const sqlQuery = `
        SELECT checkin_date 
        FROM daily_checkin 
        WHERE user_id = ? AND checkin_date IN (${placeholders})
      `;

      const sqlValues = [user.id, ...weekDates];

      const [rows] = await connection.execute<RowDataPacket[]>(
        sqlQuery,
        sqlValues
      );

      const checkedInDates = new Set(rows.map((row) => row.checkin_date));

      const weekStatus = weekDates.map((date) => checkedInDates.has(date));

      res.status(200).json({ weekStatus });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error fetching check-ins." });
    }
  }
);

userRoutes.post(
  "/check-in",
  authenticateToken,
  validateBody(checkInSchema),
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { status } = req.body;

    const todayDate = getLocalYYYYMMDD(new Date());
    const checkinId = crypto.randomUUID();

    try {
      await connection.execute(
        "INSERT INTO daily_checkin (id, user_id, checkin_date, status) VALUES (?, ?, ?, ?)",
        [checkinId, user.id, todayDate, status]
      );
      res.status(201).json({ message: "Check-in successful." });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Server error during check-in." });
    }
  }
);

userRoutes.post(
  "/goal",
  authenticateToken,
  validateBody(goalSchema),
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const {
      overallGoal,
      smartGoal,
      importance,
      motivation,
      confidence,
      confidenceReason,
      reminderType,
    } = req.body;

    const goalId = crypto.randomUUID();

    try {
      await connection.execute(
        "INSERT INTO goal (id, user_id, overall_goal, smart_goal, importance, motivation, confidence, confidence_reason, reminder_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          goalId,
          user.id,
          overallGoal || null,
          smartGoal,
          importance || null,
          motivation || null,
          confidence || null,
          confidenceReason || null,
          reminderType || "none",
        ]
      );
      res.status(201).json({ message: "Goal saved successfully." });
    } catch (err: any) {
      console.error("Failed to save goal:", err);
      return res.status(500).json({ message: "Server error saving goal." });
    }
  }
);

userRoutes.post(
  "/wellness-summary",
  authenticateToken,
  validateBody(wellnessSchema),
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { wellnessRatings, wellnessExplanations, focusArea, strengths } =
      req.body;

    const wellnessId = crypto.randomUUID();

    const dbData = {
      id: wellnessId,
      user_id: user.id,
      social_rating: wellnessRatings.social || null,
      social_explanation: wellnessExplanations.social || null,
      physical_rating: wellnessRatings.physical || null,
      physical_explanation: wellnessExplanations.physical || null,
      environment_rating: wellnessRatings.environment || null,
      environment_explanation: wellnessExplanations.environment || null,
      financial_rating: wellnessRatings.financial || null,
      financial_explanation: wellnessExplanations.financial || null,
      work_rating: wellnessRatings.work || null,
      work_explanation: wellnessExplanations.work || null,
      spiritual_rating: wellnessRatings.spiritual || null,
      spiritual_explanation: wellnessExplanations.spiritual || null,
      recreation_rating: wellnessRatings.recreation || null,
      recreation_explanation: wellnessExplanations.recreation || null,
      mental_rating: wellnessRatings.mental || null,
      mental_explanation: wellnessExplanations.mental || null,
      focus_area: focusArea,
      strengths_values: strengths.values || null,
      strengths_good_at: strengths.goodAt || null,
      strengths_overcome: strengths.overcome || null,
      strengths_valued_for: strengths.valuedFor || null,
    };

    try {
      const sqlQuery = `
        INSERT INTO wellness_wheel (
          id, user_id, 
          social_rating, social_explanation,
          physical_rating, physical_explanation,
          environment_rating, environment_explanation,
          financial_rating, financial_explanation,
          work_rating, work_explanation,
          spiritual_rating, spiritual_explanation,
          recreation_rating, recreation_explanation,
          mental_rating, mental_explanation,
          focus_area, strengths_values, strengths_good_at, strengths_overcome, strengths_valued_for
        ) VALUES (
          :id, :user_id,
          :social_rating, :social_explanation,
          :physical_rating, :physical_explanation,
          :environment_rating, :environment_explanation,
          :financial_rating, :financial_explanation,
          :work_rating, :work_explanation,
          :spiritual_rating, :spiritual_explanation,
          :recreation_rating, :recreation_explanation,
          :mental_rating, :mental_explanation,
          :focus_area,
          :strengths_values, :strengths_good_at, :strengths_overcome, :strengths_valued_for
        )
      `;

      await connection.execute(sqlQuery, dbData);
      res.status(201).json({ message: "Wellness summary saved successfully." });
    } catch (err: any) {
      console.error("Failed to save wellness summary:", err);
      return res.status(500).json({ message: "Server error saving summary." });
    }
  }
);

userRoutes.post(
  "/chat",
  authenticateToken,
  validateBody(chatSchema),
  async (req: Request, res: Response) => {
    const { prompt, conversationId } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required." });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          maxOutputTokens: 200,
        },
      });

      const text = response.text;

      res.status(200).json({ generatedText: text });
    } catch (err) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ message: "Error communicating with AI." });
    }
  }
);

userRoutes.get("/test-db", async (req: Request, res: Response) => {
  const [rows] = await connection.execute("SELECT 1 + 1 as solution");
  res.json({
    message: "Database connection successful!",
    solution: (rows as any)[0].solution,
  });
});

export default userRoutes;
