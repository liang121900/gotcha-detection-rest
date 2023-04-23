import { useSelector } from "react-redux";
import useLogin from "../../hook/useLogin";

const ProtectedRoute = ({ children }) => {
    const { redirectToLogin } = useLogin()
    const isAuthenticated = useSelector((state) => state.user?.isAuthenticated)

    if (!isAuthenticated) {
        redirectToLogin();
    }
    return children

};

export default ProtectedRoute;