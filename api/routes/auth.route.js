// Import express để tạo router
import express from "express";
// Import các hàm xử lý (controller) từ file auth.controller.js
import {google, signin, signup} from "../controllers/auth.controller.js";

// Tạo một router mới từ express
const router = express.Router();

// Định nghĩa route POST /signup để gọi hàm signup xử lý đăng ký người dùng mới
router.post("/signup", signup)

// Định nghĩa route POST /signin để gọi hàm signin xử lý đăng nhập người dùng
router.post("/signin", signin)

// Định nghĩa route POST /google để xử lý đăng nhập hoặc đăng ký bằng Google OAuth
router.post("/google", google)

export default router;