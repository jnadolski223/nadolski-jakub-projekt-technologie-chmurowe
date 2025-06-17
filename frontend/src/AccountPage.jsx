import { useState } from "react";
import PageHeader from "./components/PageHeader";

export default function AccountPage() {
    const [activeSection, setActiveSection] = useState("settings");

    return (
        <>
            <PageHeader/>
            <h1>Account Page</h1>
            <p>Page under construction</p>
            <div className="account-navbar">
                <ul>
                    <li onClick={() => setActiveSection("settings")}>Account setting</li>
                    <li onClick={() => setActiveSection("my-events")}>My events</li>
                    <li onClick={() => setActiveSection("signed-events")}>Signed events</li>
                </ul>
            </div>
            <div className="account-content">
                {activeSection === "settings" && <p>Account settings section</p>}
                {activeSection === "my-events" && <p>My events section</p>}
                {activeSection === "signed-events" && <p>My signed events section</p>}
            </div>
        </>
    );
};