import { useState, useCallback } from "react";
import { Row, Col, Button, Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import ResponsiveAd from "@/components/adsenses/ResponsiveAd";
import SquareAd from "@/components/adsenses/SquareAd";
import isAdEnabled from "@/utils/isAdEnabled";
import { sendNewPassword } from "@/redux/slices/usersSlice";
import { notify } from "@/utils/notifyToast";

export default function ResetPassword() {
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        password: "",
        password1: "",
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    // Extract token & userId from URL once
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("id");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isProcessing) return;

        const { password, password1 } = form;

        if (!password || !password1) {
            notify("Passwords cannot be empty!", "error");
            return;
        }

        if (password !== password1) {
            notify("Passwords must match!", "error");
            return;
        }

        if (!token || !userId) {
            notify("Invalid reset link. Request a new one.", "error");
            return;
        }

        setIsProcessing(true);

        try {
            await dispatch(
                sendNewPassword({
                    userId,
                    token,
                    password,
                })
            );
        } catch (err) {
            console.error(err);
            notify("Error resetting password. Try again.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="forgot-password mt-4">
            <Row
                className="mt-5 d-block text-center"
                style={{ minHeight: "68vh" }}
            >
                <h2 className="fw-bolder my-3" style={{ color: "var(--brand)" }}>
                    Update your password
                </h2>

                <p>Please enter matching passwords to reset your account.</p>

                {/* Square Ad */}
                {isAdEnabled() && (
                    <Row className="w-100 mb-3">
                        <Col sm="12">
                            <SquareAd />
                        </Col>
                    </Row>
                )}

                <Form className="my-4" onSubmit={handleSubmit}>
                    <div className="input-group mx-auto my-4 w-50">
                        <Input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Create password..."
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="input-group mx-auto my-4 w-50">
                        <Input
                            type="password"
                            name="password1"
                            className="form-control"
                            placeholder="Verify password..."
                            value={form.password1}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <Button
                        color="success"
                        size="md"
                        className="mt-4 d-block mx-auto text-white"
                        disabled={isProcessing}
                        style={{ width: "16%" }}
                    >
                        {isProcessing ? "Processing..." : "Reset"}
                    </Button>
                </Form>

                {/* Responsive Ad */}
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
