
import {Avatar, Button, FileInput, HelperText, Label, TextInput} from "flowbite-react";
import {useProfile} from "./useProfile";
import {Link} from "react-router-dom";

const Profile = () => {
    const {
        currentUser, fileRef, avatarPreview, formData,
        uploadMessage, updateSuccess, error, loading,
        handleChange, handleFileChange, handleSubmit,
        handleDelete, handleLogOut
    } = useProfile();


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
                <Button type="button" color="green">
                    <Link to={"/create-listing"}>
                        CREATE LISTING
                    </Link>
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