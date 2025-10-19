import express from "express";
import type { Request, Response } from "express";
import connection from "../db/connection";
import { validateUserBody } from "../middleware/auth";
import {
  createUserSchema,
  type CreateUserInput,
} from "../utilities/createUserSchema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userRoutes = express.Router();

userRoutes.post("/signup", validateUserBody(createUserSchema), async (req: Request, res: Response) => {
    const { email, password }: CreateUserInput = req.body;

    //Check the email exists
    const [rows] = await connection.execute(
      "SELECT EMAIL FROM user WHERE EMAIL=?",
      [email]
    );

    if (!rows) {
        return res.status(400).json({message: "Email already exists."});
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Save the user to the db
    const userId: string = crypto.randomUUID();
    await connection.execute("INSERT INTO user(id , email, password) VALUES(?, ?, ?)", [userId, email, hashedPassword]);

    // Sign the token
    const token = jwt.sign({userId: userId}, process.env.JWT_SECRET as string, {expiresIn: '1h'});

    //return token
    res.status(201).json({ token });
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
