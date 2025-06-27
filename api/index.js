import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from "./routes/user.route.js";
dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("MongoDB Connected!");
    })
    .catch(err => {
        console.log(err);
    });

const app = express();

app.listen(3000, () => {
    console.log('Server started on port 3000!');
});

app.use("/api/users", userRoute);