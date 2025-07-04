import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {errorHandler} from "../utils/error.js";

export const test = (req, res) => {
    res.json({
        message: "Api route is working!"
    });
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return next(errorHandler(401, 'You can only update your own account!'));
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                }
            },
            {new: true}
        )

        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);

    } catch (e) {
        next(e);
    }
};

export const deleteUser = async (req, res, next) => {
    console.log("req.user.id =", req.user?.id);
    console.log("req.params.id =", req.params.id);

    if (req.user.id !== req.params.id)
        return next(errorHandler(401, 'You can only delete your own account!'));

    try {
        const user = await User.findById(req.params.id);
        if (!user) return next(errorHandler(404, 'User not found!'));

        await User.findByIdAndDelete(req.params.id)
        res.clearCookie("access_token",{
            httpOnly: true,
            sameSite: "strict",
            path: "/"
        });
        res.status(200).json({ success: true, message: "User deleted" });

    } catch (e) {
        next(e);
    }
}