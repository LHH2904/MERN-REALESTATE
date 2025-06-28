import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";

// Định nghĩa hàm signup để xử lý đăng ký người dùng mới
export const signup = async (req, res, next) => {
    // Lấy dữ liệu từ body của request gửi từ client (gồm username, email và password)
    const { username, email, password } = req.body;

    // Mã hóa mật khẩu bằng bcrypt với saltRounds = 10
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Tạo một đối tượng user mới với thông tin nhận được và mật khẩu đã mã hóa
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        // Lưu user mới vào MongoDB
        await newUser.save();

        // Gửi phản hồi về client với mã 201 (Created) nếu thành công
        res.status(201).json({
            success: true,
            message: "User successfully created!",
        });
    } catch (error) {
        // Nếu xảy ra lỗi (ví dụ: trùng email, lỗi kết nối DB...), gửi mã lỗi 500
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        // Tìm user theo email
        const validUser = await User.findOne({ email });

        // Nếu không tìm thấy user
        if (!validUser) return next(errorHandler(404, "User not found"));

        // So sánh mật khẩu client nhập và mật khẩu đã hash trong DB
        const validPassword = bcrypt.compareSync(password, validUser.password)

        if (!validPassword) return next(errorHandler(401, "Wrong credential!"));

        // Tạo token JWT chứa ID user
        const token = jwt.sign(
            {id: validUser._id},
            process.env.JWT_SECRET // Key bí mật từ biến môi trường
        );

        // Loại bỏ password khỏi object trả về cho client
        const { password: pass, ...rest } = validUser._doc;

        // Trả token qua cookie, trả dữ liệu user (trừ password)
        res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(rest);
    } catch (e) {
        next(e);  // Gửi lỗi cho middleware xử lý lỗi chung
    }
}