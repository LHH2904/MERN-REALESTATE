import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";

/**
 * [POST] /api/auth/signup
 * Đăng ký người dùng mới
 */
export const signup = async (req, res, next) => {
    // Lấy dữ liệu từ body của request gửi từ client (gồm username, email và password)
    const { username, email, password } = req.body;

    // Mã hóa mật khẩu bằng bcrypt (saltRounds = 10)
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Tạo đối tượng người dùng mới
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        // Lưu user mới vào MongoDB
        await newUser.save();

        // Trả về kết quả thành công
        res.status(201).json({
            success: true,
            message: "User successfully created!",
        });
    } catch (error) {
        // Nếu xảy ra lỗi thì đẩy đến middleware xử lý lỗi
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

/**
 * [POST] /api/auth/signin
 * Đăng nhập người dùng với email & password
 */
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        // Tìm người dùng trong DB theo email
        const validUser = await User.findOne({ email });

        // Nếu không có người dùng, trả về lỗi
        if (!validUser) return next(errorHandler(404, "User not found"));

        // So sánh mật khẩu với mật khẩu đã được hash
        const validPassword = bcrypt.compareSync(password, validUser.password)

        // Nếu mật khẩu không khớp
        if (!validPassword) return next(errorHandler(401, "Wrong credential!"));

        // Tạo JWT token với id của người dùng
        const token = jwt.sign(
            {id: validUser._id},
            process.env.JWT_SECRET // Key bí mật từ biến môi trường
        );

        // Loại bỏ mật khẩu ra khỏi dữ liệu trả về
        const { password: pass, ...rest } = validUser._doc;

        // Gửi cookie chứa token + thông tin người dùng
        res
            .cookie("access_token", token, { httpOnly: true }) // httpOnly giúp bảo mật (tránh JS truy cập)
            .status(200)
            .json(rest);
    } catch (e) {
        // Đẩy lỗi đến middleware xử lý lỗi
        next(e);
    }
}

/**
 * [POST] /api/auth/google
 * Đăng nhập hoặc đăng ký bằng Google OAuth
 */
export const google = async (req, res, next) => {
    try {
        // Tìm người dùng theo email (từ Google)
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            // Nếu user đã tồn tại, tạo JWT token và gửi về
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            const {password: pass, ...rest} = user._doc;
            res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(rest);
        } else {
            // Nếu chưa có, tạo mật khẩu ngẫu nhiên rồi mã hóa
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword,10);
            // Tạo người dùng mới
            const newUser = new User({
                // Tạo username từ tên hiển thị (Google) và thêm hậu tố thời gian để tránh trùng
                username: req.body.name.split(" ").join("").toLowerCase() + Date.now().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            })
            await newUser.save();

            // Tạo JWT và gửi về client
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)
            const { password: pass, ...rest } = newUser._doc;
            return res
                .cookie("access_token", token, { httpOnly: true })
                .status(200)
                .json(rest);
        }
    } catch (e) {
        next(e);  // Gửi lỗi cho middleware xử lý lỗi chung
    }
}