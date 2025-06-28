import { useDispatch } from "react-redux";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const useGoogleOAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            // Đăng nhập với popup Google
            const result = await signInWithPopup(auth, provider);

            // Gửi dữ liệu người dùng tới backend
            const res = await fetch("api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await res.json();

            // Cập nhật redux state user
            dispatch(signInSuccess(data));

            // Chuyển hướng về trang chủ
            navigate("/");
        } catch (e) {
            console.log("could not sign in with google", e);
        }
    };

    return { handleGoogleClick };
};

export default useGoogleOAuth;
