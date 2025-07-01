// Import mongoose để tạo schema và model
import mongoose from "mongoose";

// Định nghĩa schema cho bảng `users` trong MongoDB
const userSchema = new mongoose.Schema({
        _id: {
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        // Ảnh đại diện người dùng (có giá trị mặc định)
        avatar: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        },
        provider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
    },
    // Tự động thêm `createdAt` và `updatedAt` cho mỗi document
    {timestamps: true}
);

const User = mongoose.model('User', userSchema);
export default User;
