import { Link } from "react-router";
import { UsernamePasswordForm } from "./UsernamePasswordForm";
import { sendPostRequest } from "../utils/sendPostRequest";

export function LoginPage() {
    async function handleLogin({ username, password }) {
        console.log("Login user:", username, password);
        const response = await sendPostRequest("/auth/login", { username, password });
    
        return response;
    }

    return (
        <div>
            <h1>Login</h1>
            <UsernamePasswordForm onSubmit={ handleLogin } />
            <p>
                Don't have an account?
                <Link to="/register">
                    Register Here
                </Link>
            </p>
        </div>
    );
}