import { Link } from "react-router";
import "./Header.css";

export function Header( {setAuthToken} ) {
    return (
        <header>
            <h1>My cool site</h1>
            <div>
                <label>
                    Some switch (dark mode?) <input type="checkbox" />
                </label>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/images">Image Gallery</Link>
                    <Link to="/account">Account</Link>
                    <button onClick={() => {setAuthToken(null)}}>Logout</button>
                </nav>
            </div>
        </header>
    );
}
