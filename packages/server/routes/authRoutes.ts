import express from "express";
import type { Request, Response } from "express";
import connection from "../db/connection";

const authRoutes = express.Router();

authRoutes.get('/test-db', async (req: Request, res: Response) => {
    const [rows] = await connection.execute("SELECT 1 + 1 as solution");
    res.json({message: "Database connection successful!", solution: (rows as any)[0].solution})
})

export default authRoutes;