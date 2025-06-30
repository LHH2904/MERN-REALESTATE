import {useSelector} from "react-redux";
import {Outlet, Navigate} from "react-router-dom";
import type {RootState} from "../redux/store";

const PrivateRoute = () => {
    const currentUser = useSelector(
        (state: RootState) => state.user.currentUser
    );

    if (!currentUser) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;