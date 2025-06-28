import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FormData = {
    email: string;
    password: string;
};

export const useSignIn = () => {
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Để nhận cookie
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false) {
                setError(data.message || 'Login failed');
                setLoading(false);
                return;
            }

            setFormData({ email: '', password: '' });
            setLoading(false);
            navigate('/');
        } catch (err) {
            setLoading(false);
            setError('Something went wrong.');
        }
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        loading,
        error,
    };
};