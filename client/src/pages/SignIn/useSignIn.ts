import {type ChangeEvent, type FormEvent, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {signInStart, signInSuccess,signInFailure} from "../../redux/user/userSlice";
import type {AppDispatch, RootState} from "../../redux/store";

type FormData = {
    email: string;
    password: string;
};

export const useSignIn = () => {
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const { loading, error } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            dispatch(signInStart())
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false) {
                dispatch(signInFailure(data.message))
                return;
            }

            setFormData({ email: '', password: '' });
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (err:any) {
            dispatch(signInFailure(err.message));
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