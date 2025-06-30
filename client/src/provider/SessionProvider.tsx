import {type ReactNode, useEffect} from "react";
import { supabase } from "../supabase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

const SessionProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const restoreSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data?.session) {
                console.log("Không tìm thấy session");
                return;
            }

            const user = data.session.user;
            const currentUser = {
                _id: user.id,
                email: user.email,
                username: user.user_metadata?.full_name || "User",
                avatar: user.user_metadata?.avatar_url || "",
                createdAt: user.created_at,
                updatedAt: new Date().toISOString(),
            };

            dispatch(signInSuccess(currentUser));
        };

        restoreSession();
    }, [dispatch]);

    return <>{children}</>;
};

export default SessionProvider;