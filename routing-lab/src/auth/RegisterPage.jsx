import { Link } from "react-router";
import { useNavigate } from "react-router";
import { PropTypes } from "prop-types";
import { UsernamePasswordForm } from "./UsernamePasswordForm";
import { sendPostRequest } from "../utils/sendPostRequest";


export function RegisterPage({ setAuthToken }) {
    const navigate = useNavigate();
    
    async function handleRegister({ username, password }) {
        const response = await sendPostRequest("/auth/register", { username, password});
    
        if (response.type === "success" && response.data.token) {
            setAuthToken(response.data.token);
            navigate("/");
        }

        return response;
    }


    return (
        <div>
            <h1>Register a New Account</h1>
            <UsernamePasswordForm onSubmit={ handleRegister } />
            <p>
                Already have an account?   
                <Link to="/login">Login Here</Link>
            </p> 
        </div>
    );
}

RegisterPage.propTypes = {
    setAuthToken: PropTypes.func.isRequired,
};