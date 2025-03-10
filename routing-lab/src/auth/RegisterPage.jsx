import { Link } from "react-router";
import { UsernamePasswordForm } from "./UsernamePasswordForm";
import { sendPostRequest } from "../utils/sendPostRequest";


export function RegisterPage() {
    async function handleRegister({ username, password }) {
        const response = await sendPostRequest("/auth/register", { username, password});
    
        if (response.type === "success") {
            console.log("User registered successfully!");
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