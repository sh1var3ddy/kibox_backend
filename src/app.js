import express from "express";
import v1Router from "./routes/index.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
}));
app.options(/.*/, cors());

app.get("/", (req, res) => {
    res.status(200).json({ "message": "Welcome to Kibox API" });
})

app.use("/api/v1", v1Router);
app.get("/health/ping", (req, res) => {
    res.status(200).json({ "message": "pong" });
})


export default app;
