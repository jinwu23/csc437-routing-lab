import { Outlet } from "react-router";
import { Header } from "./Header.jsx";

export function MainLayout({setAuthToken}) {
    return (
        <div>
            <Header setAuthToken={setAuthToken}/>
            <div style={{padding: "0 2em"}}>
                <Outlet />
            </div>
        </div>
    );
}
