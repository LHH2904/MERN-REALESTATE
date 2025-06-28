import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type FormData = {
    username: string;
    email: string;
    password: string;
};

export const useSignUp = () => {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false) {
                setError(data.message || "Sign up failed");
                setLoading(false);
                return;
            }

            setFormData({ username: "", email: "", password: "" });
            setError(null);
            navigate("/sign-in");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        error,
        loading,
        handleChange,
        handleSubmit,
    };
};
