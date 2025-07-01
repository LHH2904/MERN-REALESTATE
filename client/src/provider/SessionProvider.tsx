import {type ReactNode, useEffect, useState} from "react";
import { supabase } from "../supabase";
import { useDispatch } from "react-redux";
import {signInFailure, signInSuccess} from "../redux/user/userSlice";
import type {AppDispatch} from "../redux/store";

const SessionProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data?.session) {
                dispatch(signInFailure("No session found"));
                setLoading(false);
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
                    setLoading(false);
                    return;
                }

                // dispatch user MongoDB về Redux
                dispatch(signInSuccess(serverUser.user));
                setLoading(false);

            } catch (err) {
                console.error("Session sync error:", err);
                setLoading(false);
            }
        };

        restoreSession().then();
    }, [dispatch]);

    if (loading) {
        // Bạn có thể render spinner hoặc null để tránh UI nhấp nháy khi chưa biết user
        return null;
    }

    return <>{children}</>;
};

export default SessionProvider;