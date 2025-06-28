import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Định nghĩa hàm signup để xử lý đăng ký người dùng mới
export const signup = async (req, res) => {
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
        res.status(201).json("User successfully created!");
    } catch (error) {
        // Nếu xảy ra lỗi (ví dụ: trùng email, lỗi kết nối DB...), gửi mã lỗi 500
        res.status(500).json(error.message);
    }


};