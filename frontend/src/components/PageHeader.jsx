export default function PageHeader({ username = "" }) {
    return (
        <div className="header">
            <h1>EventApp</h1>
            {username ? (
                <div className="account-section">
                    <span>{username}</span>
                </div>
            ) : (
                <div className="account-section">
                    <span>Log in</span>
                    <span>/</span>
                    <span>Register</span>
                </div>
            )}
        </div>
    );
};