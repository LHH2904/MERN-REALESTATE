import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../redux/store";
import {Avatar, Button, FileInput, HelperText, Label, TextInput} from "flowbite-react";
import {type ChangeEvent, type FormEvent, useEffect, useRef, useState} from "react";
import {supabase} from "../supabase";
import {
    deleteUserFailure,
    deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess
} from "../redux/user/userSlice";
import {useNavigate} from "react-router-dom";

export interface CurrentUser {
    _id: string;
    username: string;
    email: string;
    avatar: string;
}

const Profile = () => {
    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser
    ) as CurrentUser | null;

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        avatar: "",
    });

    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [avatarPreview, setAvatarPreview] = useState<string>(currentUser?.avatar || "");
    const [uploadMessage, setUploadMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const navigate = useNavigate();

    // Load current user data vào form
    useEffect(() => {
        if (currentUser) {
            setFormData({
                username: currentUser.username,
                email: currentUser.email,
                password: "",
                avatar: currentUser.avatar,
            });
        }
    }, [currentUser]);

    // Xử lý thay đổi input text
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    // Xử lý chọn file ảnh, kiểm tra file hợp lệ và kích thước
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Kiểm tra kích thước file < 2MB
        const maxSize = 2 * 1024 * 1024; // 3MB tính bằng bytes
        if (selectedFile.size > maxSize) {
            setError("Kích thước file phải nhỏ hơn 2MB.");
            setFile(undefined);
            setUploadMessage("");
            return;
        }

        setError("");
        setFile(selectedFile);
    };

    // Khi file thay đổi thì upload lên supabase
    useEffect(() => {
        if (!file) return;
        handleFileUpload(file).then();
    }, [file]);

    // Tự động ẩn thông báo sau vài giây
    useEffect(() => {
        if (uploadMessage) {
            const timer = setTimeout(() => {
                setUploadMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [uploadMessage]);

    // Tự động ẩn thông báo sau vài giây
    useEffect(() => {
        if (updateSuccess) {
            const timer = setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateSuccess]);

    // Upload file lên supabase và lấy public url
    const handleFileUpload = async (file: File) => {
        if (!currentUser) return;

        const filePath = `${currentUser._id}/${Date.now()}_${file.name}`;

        const {error} = await supabase.storage
            .from("image")
            .upload(filePath, file);

        if (error) {
            console.error("Upload error:", error.message);
            setError("Tải ảnh lên thất bại.");
            return;
        }

        const {data: publicUrlData} = supabase.storage
            .from("image")
            .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;
        setAvatarPreview(publicUrl);

        setFormData(prev => ({
            ...prev,
            avatar: publicUrl
        }));

        setUploadMessage("Upload Image Successfully");
    };

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
        if (!currentUser) {
            setLoading(false);
            return;
        }

        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
                credentials: "include",
            })
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            await supabase.auth.signOut();
            dispatch(deleteUserSuccess(data));
            navigate("/sign-in");

        } catch (e) {
            if (e instanceof Error) {
                dispatch(deleteUserFailure(e.message));
            } else {
                dispatch(deleteUserFailure("Unknown error occurred"));
            }
        }
    }

    const handleLogOut = async() => {
        try {
            dispatch(signOutUserStart())
            const res = await fetch(`/api/auth/signout`,{
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

    if (!currentUser) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div>
            <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>

            <form onSubmit={handleSubmit} className='max-w-md mx-auto flex flex-col gap-4 mt-5'>
                <div id="fileUpload" className="max-w-md hidden">
                    <Label className="mb-2 block" htmlFor="file">
                        Upload file
                    </Label>
                    <FileInput id="file" ref={fileRef} accept='image/*' onChange={handleFileChange}/>
                    <HelperText className="mt-1">A profile picture is useful to confirm your are logged into your
                        account</HelperText>
                </div>
                <Avatar
                    img={formData.avatar || avatarPreview}
                    alt="User avatar"
                    size="xl"
                    rounded
                    onClick={() => fileRef.current?.click()}
                />
                {error && (
                    <HelperText className="text-red-600 font-medium text-center">
                        {error}
                    </HelperText>
                )}
                {uploadMessage && (
                    <p className="text-green-600 text-center mt-2">{uploadMessage}</p>
                )}
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="username">Username</Label>
                    </div>
                    <TextInput
                        id="username"
                        type="text"
                        value={formData.username}
                        required
                        shadow
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email">Email</Label>
                    </div>
                    <TextInput
                        id="email"
                        type="email"
                        value={formData.email}
                        required
                        shadow
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        value={formData.password}
                        shadow
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'UPDATE'}
                </Button>
                <div className='flex justify-between'>
                    <HelperText
                        className="text-red-600 font-medium cursor-pointer"
                        onClick={handleDelete}
                    >
                        Delete Account
                    </HelperText>
                    <HelperText
                        className="text-red-600 font-medium cursor-pointer"
                        onClick={handleLogOut}
                    >
                        Sign Out
                    </HelperText>
                </div>
                <p className='text-green-600 mt-5'>{updateSuccess ? 'User is updated successfully' : ''}</p>
            </form>
        </div>
    );
};

export default Profile;