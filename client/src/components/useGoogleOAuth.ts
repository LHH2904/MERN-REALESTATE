import { supabase } from "../supabase";

const useGoogleOAuth = () => {

    const handleGoogleClick = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                skipBrowserRedirect: false,
            },
        });
        if (error) {
            console.error("Google sign-in error:", error.message);
            return;
        }
    };

    return { handleGoogleClick };
};

export default useGoogleOAuth;
