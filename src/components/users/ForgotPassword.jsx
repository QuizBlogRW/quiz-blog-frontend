import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Row, Col, Button, Form, Input } from "reactstrap";

import SquareAd from "@/components/adsenses/SquareAd";
import ResponsiveAd from "@/components/adsenses/ResponsiveAd";
import isAdEnabled from "@/utils/isAdEnabled";
import { sendResetLink } from "@/redux/slices/usersSlice";
import { notify } from "@/utils/notifyToast";

export default function ForgotPassword() {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = useCallback((e) => {
        setEmail(e.target.value);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isProcessing) return;

        const emailTrimmed = email.trim();
        const emailRegex =
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!emailTrimmed) {
            notify("Please enter your email address.", "error");
            return;
        }

        if (!emailRegex.test(emailTrimmed)) {
            notify("That email doesn’t look correct. Please try again.", "error");
            return;
        }

        setIsProcessing(true);

        try {
            await dispatch(sendResetLink({ email: emailTrimmed }));
        } catch (err) {
            console.error(err);
            notify("Could not send reset link. Please try again.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="forgot-password mt-4">
            <Row
                className="mt-5 d-flex flex-column justify-content-center align-items-center"
                style={{ minHeight: "70vh" }}
            >
                {/* --- Top Ad --- */}
                {isAdEnabled() && (
                    <Row className="w-100 mb-4">
                        <Col sm="12">
                            <SquareAd />
                        </Col>
                    </Row>
                )}

                {/* --- Jumbotron --- */}
                <div className="jbtron rounded px-4 py-4 py-sm-5 text-center border border-info my-4 w-100">
                    <h1 className="fw-bolder text-white display-6">
                        Forgot Your Password?
                    </h1>

                    <p className="text-white mt-2 mb-1">
                        Enter the email linked to your account and we’ll send you a reset link.
                    </p>

                    <p className="text-white small mb-0">
                        It only takes a moment.
                    </p>

                    <hr
                        className="my-3"
                        style={{
                            height: "2px",
                            borderWidth: 0,
                            backgroundColor: "var(--brand)",
                        }}
                    />
                </div>

                {/* --- Form --- */}
                <Form className="my-2 w-100" onSubmit={handleSubmit}>
                    <div className="input-group mx-auto text-center" style={{ maxWidth: "380px" }}>
                        <Input
                            type="email"
                            name="email"
                            className="form-control text-center"
                            placeholder="Enter your email"
                            autoComplete="email"
                            value={email}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        color="success"
                        size="md"
                        className="mt-4 d-block mx-auto text-white"
                        style={{ width: "160px" }}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Sending..." : "Send Link"}
                    </Button>
                </Form>

                {/* --- Bottom Ad --- */}
                {isAdEnabled() && (
                    <Row className="w-100 mt-4">
                        <Col sm="12">
                            <ResponsiveAd />
                        </Col>
                    </Row>
                )}
            </Row>
        </div>
    );
}
