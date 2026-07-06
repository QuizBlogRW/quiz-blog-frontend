import { useState, useEffect, useCallback } from "react";
import { Row, Col, Button, Form, Input } from "reactstrap";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ResponsiveAd from "@/components/adsenses/ResponsiveAd";
import isAdEnabled from "@/utils/isAdEnabled";
import Jumbotron from "@/utils/Jumbotron";
import { sendNewPassword } from "@/redux/slices/usersSlice";
import { notify } from "@/utils/notifyToast";

export default function ResetPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isAuthenticated } = useSelector((state) => state.users);

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

        if (isProcessing || isLoading) return;

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
            )
                .unwrap()
                .then(() => {
                    navigate("/", { replace: true });
                });
        } catch (err) {
            console.error(err);
            notify("Error resetting password. Try again.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard", { replace: true });
    }, [isAuthenticated, navigate]);

    return (
        <div className="forgot-password mt-4">
            <Row
                className="mt-5 d-flex flex-column justify-content-center align-items-center"
                style={{ minHeight: "70vh" }}
            >
                <Jumbotron
                    h1="Update your password"
                    p="Please enter matching passwords to reset your account."
                    small="Please a strong password."
                />

                <Form className="my-4" onSubmit={handleSubmit}>
                    <div className="input-group mx-auto my-4 w-75">
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

                    <div className="input-group mx-auto my-4 w-75">
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
                        disabled={isProcessing || isLoading}
                        style={{ width: "160px" }}
                    >
                        {isProcessing || isLoading ? "Processing..." : "Update"}
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
