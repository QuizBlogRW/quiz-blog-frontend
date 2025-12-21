import { Button } from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import "./NotAuthenticated.css";

export default function Unauthorized({
    message = "You are not authorized to access this page",
    actionLabel = "Go Back",
    onAction,
}) {
    const { isLoading } = useSelector((state) => state.users);
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <QBLoadingSM title="Checking authorization…" />
            </div>
        );
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div
                className="auth-wrapper p-4 p-md-5 rounded shadow-sm text-center bg-white"
                style={{ maxWidth: 350 }}
                role="alert"
                aria-live="assertive"
            >
                <h1 className="h5 fw-bold text-success mb-3">
                    {message}
                </h1>

                <Button
                    color="warning"
                    onClick={onAction ?? (() => navigate(-1))}
                    className="fw-bold px-4 py-2 text-success"
                >
                    {actionLabel}
                </Button>
            </div>
        </div>
    );
}
