import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Register successful:", { username, email, password });
    };

    return (
        <>
            <div className="register-container">
                <p><strong>Welcome to EventApp!</strong></p>
                <form className="register-form" onSubmit={handleRegister}>
                    <p>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </p>
                    <p>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </p>

                    <p>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </p>

                    <button type="submit">Create account</button>
                </form>
                <p>Already registered? <Link to="/login">Log in</Link></p>
            </div>
        </>
    );
};