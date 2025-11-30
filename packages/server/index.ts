import express from "express";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

const corsOptions = {
  origin: ["https://willowy-tartufo-ba9677.netlify.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api", userRoutes);

app.listen(port, () => console.log(`Server is running on the port ${port}`));
