import {type ReactNode, useEffect} from "react";
import { supabase } from "../supabase";
import { useDispatch } from "react-redux";
import {signInFailure, signInSuccess} from "../redux/user/userSlice";
import type {AppDispatch} from "../redux/store";

const SessionProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const restoreSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data?.session) {
                console.log("Không tìm thấy session");
                return;
            }

            const user = data.session.user;

            try {
                const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.user_metadata?.full_name,
                        photo: user.user_metadata?.avatar_url,
                        supabaseId: user.id,
                    }),
                    credentials: "include",
                });

                const serverUser = await res.json();

                if (!serverUser.success) {
                    dispatch(signInFailure(serverUser.message || "Auth failed"));
                    return;
                }

                // dispatch user MongoDB về Redux
                dispatch(signInSuccess(serverUser.user));

            } catch (err) {
                console.error("Session sync error:", err);
            }
        };

        restoreSession().then();
    }, [dispatch]);

    return <>{children}</>;
};

export default SessionProvider;