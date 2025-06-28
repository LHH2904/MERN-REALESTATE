import {Button, HelperText, Label, TextInput} from "flowbite-react";
import {Link} from "react-router-dom";
import {useSignUp} from "./useSignUp";

const SignUp = () => {
    const {
        formData,
        error,
        loading,
        handleChange,
        handleSubmit,
    } = useSignUp();

    return (
        <div>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
            <form onSubmit={handleSubmit} className='max-w-md mx-auto flex flex-col gap-4'>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="username">Username</Label>
                    </div>
                    <TextInput
                        id="username"
                        type="text"
                        value={formData.username}
                        placeholder="..."
                        required
                        shadow
                        onChange = {handleChange}
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
                        onChange = {handleChange}
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
                        onChange = {handleChange}
                    />
                </div>
                {error && (
                    <HelperText className="text-red-600 font-medium">
                        {error}
                    </HelperText>
                )}
                <Button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'SIGN UP'}
                </Button>
                <Button type="button" color={"red"}>CONTINUE WITH GOOGLE</Button>
                <HelperText>
                    Have an account?
                    <Link
                        to={"/sign-in"}
                        className="ml-1 font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                        Sign In
                    </Link>
                    .
                </HelperText>
            </form>
        </div>
    );
};

export default SignUp;