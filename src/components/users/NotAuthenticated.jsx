import { useContext } from "react";
import { Button } from "reactstrap";
import { useSelector } from "react-redux";

import { logRegContext } from "@/contexts/appContexts";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import "./NotAuthenticated.css";

export default function NotAuthenticated({ message = "You must be logged in" }) {
    const { toggleL } = useContext(logRegContext) ?? {};
    const { isLoading } = useSelector((state) => state.users);

    // Show loader when authentication state is being validated
    if (isLoading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                <QBLoadingSM />
            </div>
        );
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div
                className="auth-wrapper p-4 p-md-5 rounded shadow-sm text-center bg-white"
                style={{ maxWidth: 350 }}
            >
                <h5 className="fw-bold text-success mb-3">{message}</h5>

                <Button
                    color="warning"
                    onClick={toggleL}
                    className="fw-bold px-4 py-2 text-success"
                    disabled={!toggleL}
                >
                    Login
                </Button>

                {/* Defensive UX: if toggleL is missing */}
                {!toggleL && (
                    <p className="mt-3 text-muted small">
                        Login button disabled: login context not available.
                    </p>
                )}
            </div>
        </div>
    );
}
