import multer from "multer";
import fs from "fs";
import path from "path";

import getDirname from "../utils/dirname.js";

const { __dirname } = await getDirname(import.meta.url);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync(path.resolve(__dirname, "../temp", req.hostname))) {
			fs.mkdir(
				path.resolve(__dirname, "../temp", `${req.hostname}`),
				err => {
					console.error(err);
					cb(null, path.resolve(__dirname, "../temp", req.hostname));
				}
			);
		} else {
			cb(null, path.resolve(__dirname, "../temp", req.hostname));
		}
	},
	filename: (req, file, cb) => {
		const mimetype = file.mimetype.split("/")[1];
		cb(null, `${Date.now()}-${req.hostname}.${mimetype}`);
	}
});

const limits = 1024 * 1024 * 100;

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/webp"
	) {
		cb(null, true);
	} else {
		const error = new Error("File type is not supported");
		error.status = 415;
		cb(error, false);
	}
};

export default multer({ storage, limits, fileFilter });
