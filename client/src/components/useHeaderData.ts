import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface CurrentUser {
    avatar: string;
}

export const useHeaderData = () => {
    const location = useLocation();
    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser
    ) as CurrentUser | null;

    return {
        currentPath: location.pathname,
        currentUser,
    };
};