import express from "express";
import cors from "cors";
import ffmpeg from "fluent-ffmpeg";

import fs from "fs";
import path from "path";

import upload from "./middleware/upload.js";
import getDirname from "./utils/dirname.js";

const { __dirname } = await getDirname(import.meta.url);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/convert", upload.array("images"), (req, res) => {
	const pathToImages = path.resolve(__dirname, "temp", req.hostname);

	//Check if all images have same mimetype
	const mimetype = req.files[0].mimetype;
	if (!req.files.every(file => file.mimetype === mimetype)) {
		res.status(400).json({
			message: "All images should have same extension"
		});
	}

	const extentsion = mimetype.split("/")[1];

	//Convert images
	ffmpeg(pathToImages + "/*." + extentsion)
		.inputOption(["-pattern_type glob"])
		.inputFPS(2)
		.outputOption(["-pix_fmt yuv420p"])
		.outputFPS(24)
		.toFormat("webm")
		.on("error", error => {
			console.error(error);

			fs.rm(path.resolve(pathToImages), { recursive: true }, err => {
				console.error(err);
			});

			res.status(500).json({
				message: "Something went wrong while converting the images",
				error
			});
		})
		.on("end", () => {
			fs.rm(path.resolve(pathToImages), { recursive: true }, err => {
				console.error(err);
			});
		})
		.pipe(res, { end: true });
});

app.use(function (req, res, next) {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

app.use(function (error, req, res, next) {
	console.error(error);

	if (res.headersSent) {
		return next(err);
	}

	res.status(error.status || 500).json({
		status: error.status || 500,
		message: error.message
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
