import {useSelector} from "react-redux";
import type {RootState} from "../redux/store";
import {Avatar, Button, FileInput, HelperText, Label, TextInput} from "flowbite-react";
import {type ChangeEvent, type FormEvent, useEffect, useRef, useState} from "react";
import {supabase} from "../supabase";

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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

    // Upload file lên supabase và lấy public url
    const handleFileUpload = async (file: File) => {
        if (!currentUser) return;

        const filePath = `${currentUser._id}/${Date.now()}_${file.name}`;

        const { error } = await supabase.storage
            .from("image")
            .upload(filePath, file);

        if (error) {
            console.error("Upload error:", error.message);
            setError("Tải ảnh lên thất bại.");
            return;
        }

        const { data: publicUrlData } = supabase.storage
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

        try {
            console.log("Form submitted:", formData);
        } catch (err) {
            setError("Có lỗi xảy ra khi cập nhật thông tin.");
        } finally {
            setLoading(false);
        }
    };

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
                    <HelperText className="mt-1">A profile picture is useful to confirm your are logged into your account</HelperText>
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
                        required
                        shadow
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'UPDATE'}
                </Button>
                <div className='flex justify-between'>
                    <HelperText className="text-red-600 font-medium">
                        Delete Account
                    </HelperText>
                    <HelperText className="text-red-600 font-medium">
                        Sign Out
                    </HelperText>
                </div>
            </form>
        </div>
    );
};

export default Profile;