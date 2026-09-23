import { useState } from "react";

import "./LoginPage.css";

import { loginUser } from "../../services/api";


function LoginPage({
    onBack,
    onRegister,
    onLoginSuccess
}) {

    const [identifier, setIdentifier] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    // --------------------------------
    // LOGIN
    // --------------------------------

    const handleLogin = async () => {

        setError("");
        setMessage("");


        // Check identifier
        if (!identifier.trim()) {

            setError(
                "Please enter your email or phone number."
            );

            return;
        }


        // Check password
        if (!password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await loginUser(
                    identifier.trim(),
                    password
                );


            console.log(
                "Login successful:",
                response
            );


            setMessage(
                response.message
            );


            /*
             * Login was successful.
             *
             * Tell App.jsx to move
             * to the Landing Page.
             */

            onLoginSuccess();


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            const detail =
                error.response?.data?.detail;


            // FastAPI validation errors
            if (Array.isArray(detail)) {

                const messages =
                    detail.map(
                        (item) => item.msg
                    );

                setError(
                    messages.join(", ")
                );

            } else {

                setError(
                    detail ||
                    "Login failed. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <div className="login-card">


                {/* BACK BUTTON */}

                <button
                    className="login-back-button"
                    onClick={onBack}
                    disabled={loading}
                >
                    ← Back
                </button>


                {/* TITLE */}

                <h1>
                    Welcome Back
                </h1>


                <p className="login-description">
                    Login to continue to LectureMind.
                </p>


                <div className="login-form">


                    {/* EMAIL / PHONE */}

                    <label>
                        Email or Phone
                    </label>


                    <input
                        type="text"
                        placeholder="Enter email or phone"
                        value={identifier}
                        onChange={(event) => {
                            setIdentifier(
                                event.target.value
                            );

                            setError("");
                        }}
                        disabled={loading}
                    />


                    {/* PASSWORD */}

                    <label>
                        Password
                    </label>


                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(event) => {
                            setPassword(
                                event.target.value
                            );

                            setError("");
                        }}
                        onKeyDown={(event) => {
                            if (
                                event.key === "Enter"
                            ) {
                                handleLogin();
                            }
                        }}
                        disabled={loading}
                    />


                    {/* LOGIN BUTTON */}

                    <button
                        className="login-submit-button"
                        onClick={handleLogin}
                        disabled={
                            loading ||
                            !identifier.trim() ||
                            !password
                        }
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>


                </div>


                {/* SUCCESS MESSAGE */}

                {message && (

                    <p className="success-message">
                        {message}
                    </p>

                )}


                {/* ERROR MESSAGE */}

                {error && (

                    <p className="error-message">
                        {error}
                    </p>

                )}


                {/* REGISTER */}

                <p className="register-link-text">
                    Don't have an account?
                </p>


                <button
                    className="register-link-button"
                    onClick={onRegister}
                    disabled={loading}
                >
                    Create an account
                </button>


            </div>

        </div>
    );
}


export default LoginPage;