import { Link } from "react-router";
import { useNavigate } from "react-router";
import { PropTypes } from "prop-types";
import { UsernamePasswordForm } from "./UsernamePasswordForm";
import { sendPostRequest } from "../utils/sendPostRequest";

export function LoginPage({setAuthToken}) {
    const navigate = useNavigate();

    async function handleLogin({ username, password }) {
        console.log("Login user:", username, password);
        const response = await sendPostRequest("/auth/login", { username, password });
    
        if (response.type === "success" && response.data.token) {
            setAuthToken(response.data.token); 
            navigate("/");
        }

        return response;
    }

    return (
        <div>
            <h1>Login</h1>
            <UsernamePasswordForm onSubmit={ handleLogin } />
            <p>
                Don&apos;t have an account?
                <Link to="/register">
                    Register Here
                </Link>
            </p>
        </div>
    );
}

LoginPage.propTypes = {
    setAuthToken: PropTypes.func.isRequired,
};