import { Outlet } from "react-router";
import { Header } from "./Header.jsx";

export function MainLayout(props) {
    return (
        <div>
            <Header />
            <div style={{padding: "0 2em"}}>
                <Outlet />
            </div>
        </div>
    );
}
