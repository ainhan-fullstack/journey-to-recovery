import express from "express";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", authRoutes);

app.listen(port, () => console.log(`Server is running on the port ${port}`));
