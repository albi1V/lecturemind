import { useState } from "react";

import "./RegistrationPage.css";

import {
    sendRegistrationOTP,
    registerUser
} from "../../services/api";


function RegistrationPage({
    onBack,
    onLogin
}) {

    const [identifier, setIdentifier] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [otpSent, setOtpSent] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    // --------------------------------
    // PASSWORD VALIDATION
    // --------------------------------

    const passwordRequirements = {
        minLength: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };


    const passwordValid =
        passwordRequirements.minLength &&
        passwordRequirements.uppercase &&
        passwordRequirements.lowercase &&
        passwordRequirements.number;


    const passwordsMatch =
        password.length > 0 &&
        password === confirmPassword;


    // --------------------------------
    // SEND OTP
    // --------------------------------

    const handleSendOTP = async () => {

        setError("");
        setMessage("");

        if (!identifier.trim()) {

            setError(
                "Please enter your email or phone number."
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await sendRegistrationOTP(
                    identifier.trim()
                );

            setOtpSent(true);

            setMessage(
                response.message
            );

        } catch (error) {

            console.error(
                "OTP error:",
                error
            );

            const detail =
                error.response?.data?.detail;

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
                    "Failed to send OTP."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // --------------------------------
    // REGISTER
    // --------------------------------

    const handleRegister = async () => {

        setError("");
        setMessage("");


        if (!identifier.trim()) {

            setError(
                "Please enter your email or phone number."
            );

            return;
        }


        if (!otp.trim()) {

            setError(
                "Please enter the OTP."
            );

            return;
        }


        if (!password) {

            setError(
                "Please enter a password."
            );

            return;
        }


        if (!passwordValid) {

            setError(
                "Please satisfy all password requirements."
            );

            return;
        }


        if (!passwordsMatch) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await registerUser(
                    identifier.trim(),
                    otp.trim(),
                    password
                );


            setMessage(
                response.message
            );


            setIdentifier("");
            setOtp("");
            setPassword("");
            setConfirmPassword("");

            setOtpSent(false);

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            const detail =
                error.response?.data?.detail;


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
                    "Registration failed."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // --------------------------------
    // PAGE
    // --------------------------------

    return (

        <div className="registration-page">

            <div className="registration-card">


                {/* BACK BUTTON */}

                <button
                    className="registration-back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>


                {/* TITLE */}

                <h1>
                    Create Account
                </h1>


                <p className="registration-description">
                    Create your LectureMind account.
                </p>


                {/* FORM */}

                <div className="registration-form">


                    {/* EMAIL / PHONE */}

                    <label>
                        Email or Phone
                    </label>


                    <input
                        type="text"
                        placeholder="Enter email or phone"
                        value={identifier}
                        onChange={(event) =>
                            setIdentifier(
                                event.target.value
                            )
                        }
                    />


                    {/* SEND OTP */}

                    <button
                        className="otp-button"
                        onClick={handleSendOTP}
                        disabled={
                            loading ||
                            !identifier.trim()
                        }
                    >
                        {loading
                            ? "Please wait..."
                            : "Send OTP"}
                    </button>


                    {/* OTP + PASSWORD */}

                    {otpSent && (

                        <>


                            {/* OTP */}

                            <label>
                                OTP
                            </label>


                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                maxLength={6}
                                onChange={(event) =>
                                    setOtp(
                                        event.target.value
                                    )
                                }
                            />


                            {/* PASSWORD */}

                            <label>
                                Password
                            </label>


                            <input
                                type="password"
                                placeholder="Create password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                            />


                            {/* PASSWORD REQUIREMENTS */}

                            <div className="password-requirements">

                                <p
                                    className={
                                        passwordRequirements.minLength
                                            ? "valid"
                                            : ""
                                    }
                                >
                                    {passwordRequirements.minLength
                                        ? "✓"
                                        : "○"}

                                    {" "}
                                    At least 8 characters
                                </p>


                                <p
                                    className={
                                        passwordRequirements.uppercase
                                            ? "valid"
                                            : ""
                                    }
                                >
                                    {passwordRequirements.uppercase
                                        ? "✓"
                                        : "○"}

                                    {" "}
                                    At least one uppercase letter
                                </p>


                                <p
                                    className={
                                        passwordRequirements.lowercase
                                            ? "valid"
                                            : ""
                                    }
                                >
                                    {passwordRequirements.lowercase
                                        ? "✓"
                                        : "○"}

                                    {" "}
                                    At least one lowercase letter
                                </p>


                                <p
                                    className={
                                        passwordRequirements.number
                                            ? "valid"
                                            : ""
                                    }
                                >
                                    {passwordRequirements.number
                                        ? "✓"
                                        : "○"}

                                    {" "}
                                    At least one number
                                </p>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <label>
                                Confirm Password
                            </label>


                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                            />


                            {/* PASSWORD MATCH MESSAGE */}

                            {confirmPassword.length > 0 && (

                                <p
                                    className={
                                        passwordsMatch
                                            ? "password-match valid"
                                            : "password-match"
                                    }
                                >
                                    {passwordsMatch
                                        ? "✓ Passwords match"
                                        : "✗ Passwords do not match"}
                                </p>

                            )}


                            {/* CREATE ACCOUNT */}

                            <button
                                className="create-account-button"
                                onClick={handleRegister}
                                disabled={
                                    loading ||
                                    !passwordValid ||
                                    !passwordsMatch ||
                                    !otp.trim()
                                }
                            >

                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}

                            </button>


                        </>

                    )}

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


                {/* LOGIN */}

                <p className="login-link-text">
                    Already have an account?
                </p>


                <button
                    className="login-link-button"
                    onClick={onLogin}
                >
                    Login
                </button>


            </div>

        </div>
    );
}


export default RegistrationPage;