import { useState } from "react"

export default function LogInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login successful:", { email, password });
    };

    return (
        <>
            <div className="login-container">
                <p><strong>Welcome Back!</strong></p>
                <form className="login-form" onSubmit={handleLogin}>
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

                    <button type="submit">Log in</button>
                </form>
            </div>
        </>
    )
};