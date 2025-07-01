import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import {
    deleteUserFailure, deleteUserStart, deleteUserSuccess,
    signOutUserFailure, signOutUserStart, signOutUserSuccess,
    updateUserFailure, updateUserStart, updateUserSuccess
} from "../../redux/user/userSlice";
import type { AppDispatch, RootState } from "../../redux/store";

interface CurrentUser {
    _id: string;
    username: string;
    email: string;
    avatar: string;
}

interface FormData {
    username: string;
    email: string;
    password: string;
    avatar: string;
}

export const useProfile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const currentUser = useSelector((state: RootState) => state.user.currentUser) as CurrentUser | null;
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
        avatar: "",
    });

    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | undefined>();
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const [uploadMessage, setUploadMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username,
                email: currentUser.email,
                password: "",
                avatar: currentUser.avatar,
            });
            setAvatarPreview(currentUser.avatar);
        }
    }, [currentUser]);

    // Ẩn uploadMessage sau vài giây
    useEffect(() => {
        if (uploadMessage) {
            const timer = setTimeout(() => {
                setUploadMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [uploadMessage]);

// Ẩn updateSuccess sau vài giây
    useEffect(() => {
        if (updateSuccess) {
            const timer = setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateSuccess]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.size > 2 * 1024 * 1024) {
            setError("Kích thước file phải nhỏ hơn 2MB.");
            setFile(undefined);
            return;
        }

        setError("");
        setFile(selectedFile);
    };

    const handleFileUpload = async (file: File): Promise<void> => {
        if (!currentUser) return;

        const filePath = `${currentUser._id}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
            .from("image")
            .upload(filePath, file);

        if (error) {
            setError("Tải ảnh lên thất bại.");
            return;
        }

        const { data } = supabase.storage.from("image").getPublicUrl(filePath);
        setAvatarPreview(data.publicUrl);

        setFormData(prev => ({
            ...prev,
            avatar: data.publicUrl
        }));
        setUploadMessage("Upload Image Successfully");
    };

    useEffect(() => {
        if (file) handleFileUpload(file).then();
    }, [file]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!currentUser) {
            setLoading(false);
            return;
        }

        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                    body: JSON.stringify(formData)
            })

            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                setError(data.message);
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                dispatch(updateUserFailure(err.message));
                setError(err.message);
            } else {
                dispatch(updateUserFailure("Lỗi không xác định."));
                setError("Lỗi không xác định.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!currentUser) return;

        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await res.json();
            if (!data.success) {
                dispatch(deleteUserFailure(data.message));
                return;
            }


            dispatch(deleteUserSuccess(data));
            navigate("/sign-in");
        } catch (err: any) {
            dispatch(deleteUserFailure(err.message));
        }
    };


    const handleLogOut = async() => {
        try {
            dispatch(signOutUserStart())
            const res = await fetch('/api/auth/signout',{
                method: 'POST',
                credentials: 'include', // Đảm bảo cookie được gửi theo
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }
            dispatch(signOutUserSuccess(data));
        } catch (e) {
            if (e instanceof Error) {
                dispatch(signOutUserFailure(e.message));
            } else {
                dispatch(signOutUserFailure("Unknown error"));
            }
        }
    }

    return {
        currentUser,
        fileRef,
        avatarPreview,
        formData,
        uploadMessage,
        updateSuccess,
        error,
        loading,
        handleChange,
        handleFileChange,
        handleSubmit,
        handleDelete,
        handleLogOut
    };
};
