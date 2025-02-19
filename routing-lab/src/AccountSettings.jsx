import { MainLayout } from "./MainLayout.jsx";

export function AccountSettings({accountName, setAccountName}) {
    return (
        <>
            <h2>Account settings</h2>
            <label>
                Username
                <input
                    value={accountName}
                    onChange={(e) => { setAccountName(e.target.value)}}
                />
            </label>
            <p><i>Changes are auto-saved.</i></p>
        </>
    );
}
