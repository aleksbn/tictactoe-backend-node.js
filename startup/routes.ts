import cors from "cors";
import express from "express";
import { Express } from "express";
import users from "../routes/users";
import auth from "../routes/auth";
import games from "../routes/games";
import history from "../routes/history";
import generate from "../routes/generate";

function setRoutes(app: Express) {
	app.use(express.json());
	app.use(cors());
	app.use("/api/users", users);
	app.use("/api/auth", auth);
	app.use("/api/games", games);
	app.use("/api/history", history);
	app.use("/api/generate", generate);
}

export { setRoutes };
