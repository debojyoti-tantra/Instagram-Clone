import express from "express";
import { sendMessage, getMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);

export default router;