import { Link } from "react-router-dom";

export default function PageHeader({ username = "", accountEndpoint = "/", loginEndpoint = "/", registerEndpoint = "/" }) {
    return (
        <div className="header">
            <h1>EventApp</h1>
            {username ? (
                <div className="account-section">
                    <Link to={accountEndpoint}>
                        <button>{username}</button>
                    </Link>
                </div>
            ) : (
                <div className="account-section">
                    <Link to={loginEndpoint}>
                        <button>Log in</button>
                    </Link>
                    <Link to={registerEndpoint}>
                        <button>Register</button>
                    </Link>
                </div>
            )}
        </div>
    );
};