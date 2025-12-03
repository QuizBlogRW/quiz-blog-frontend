import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Row, Button } from "reactstrap";
import { unsubscribe } from "@/redux/slices/subscribersSlice";
import { notify } from "@/utils/notifyToast";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";

export default function Unsubscribe() {
    const dispatch = useDispatch();

    const [unsubscribed, setUnsubscribed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [invalidLink, setInvalidLink] = useState(false);

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    useEffect(() => {
        document.title = "Unsubscribe";
        if (!id || !email) {
            setInvalidLink(true);
        }
    }, [id, email]);

    const handleUnsubscribe = useCallback(async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            const result = await dispatch(unsubscribe({ id, email }));

            if (result?.payload?.success) {
                setUnsubscribed(true);
                notify("Unsubscribed successfully!", "success");
            }
        } catch (err) {
            console.error(err);
            notify("Something went wrong.", "error");
        } finally {
            setIsProcessing(false);
        }
    }, [dispatch, id, email, isProcessing]);

    return (
        <div className="forgot-password mt-4">

            <Row
                className="mt-5 d-flex flex-column justify-content-center align-items-center"
                style={{ minHeight: "70vh" }}
            >

                {/* JBTRON */}
                <Row className="jbtron rounded px-4 py-4 py-sm-5 text-center border border-danger my-4 w-100">
                    <h1 className="fw-bolder text-white display-6">Unsubscribe</h1>

                    <p className="text-white mt-2 mb-1">
                        Manage your email subscription preferences.
                    </p>

                    {email && (
                        <p className="fw-bold text-white mb-1">
                            Email: {email}
                        </p>
                    )}

                    <hr
                        className="my-3"
                        style={{
                            height: "2px",
                            borderWidth: 0,
                            backgroundColor: "var(--brand)",
                        }}
                    />
                </Row>

                {/* Body Content */}
                {invalidLink ? (
                    <h5 className="text-danger text-center mt-4">
                        Invalid unsubscribe link.
                        <br /> Please check your email again.
                    </h5>
                ) : unsubscribed ? (
                    <h6 className="fw-bold my-5 py-5 text-success text-center">
                        You have been unsubscribed from Quiz-Blog.
                        <br />
                        You will no longer receive updates.
                    </h6>
                ) : (
                    <div className="text-center">
                        <h6 className="fw-bold my-2 text-dark">
                            Are you sure you want to unsubscribe?
                        </h6>

                        {!isProcessing ? (
                            <Button
                                onClick={handleUnsubscribe}
                                className="mt-3 text-danger border-danger"
                            >
                                Yes, Unsubscribe Me
                            </Button>
                        ) : (
                            <div className="mt-3">
                                <QBLoadingSM />
                            </div>
                        )}
                    </div>
                )}
            </Row>
        </div>
    );
}
