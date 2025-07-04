import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import listingRoute from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("MongoDB Connected!");
    })
    .catch(err => {
        console.log(err);
    });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);

app.use((err,req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
})

app.listen(3000, () => {
    console.log('Server started on port 3000!');
});