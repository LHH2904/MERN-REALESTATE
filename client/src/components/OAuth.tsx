import {Button} from "flowbite-react";
import useGoogleOAuth from "./useGoogleOAuth";

const OAuth = () => {
    const { handleGoogleClick } = useGoogleOAuth();

    return (
        <Button
            type="button"
            color={"red"}
            onClick={handleGoogleClick}
        >
            CONTINUE WITH GOOGLE
        </Button>
    );
};

export default OAuth;