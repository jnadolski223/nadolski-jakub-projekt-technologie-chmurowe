export default function PageHeader({ username = "" }) {
    return (
        <div className="header">
            <h1>EventApp</h1>
            {username ? (
                <div className="account-section">
                    <button>{username}</button>
                </div>
            ) : (
                <div className="account-section">
                    <button>Log in</button>
                    <button>Register</button>
                </div>
            )}
        </div>
    );
};