import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Row, Button } from "reactstrap";
import { unsubscribe } from "@/redux/slices/subscribersSlice";
import { notify } from "@/utils/notifyToast";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import Jumbotron from "@/utils/Jumbotron";

export default function Unsubscribe() {
    const dispatch = useDispatch();

    const [unsubscribed, setUnsubscribed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [invalidLink, setInvalidLink] = useState(false);

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    useEffect(() => {
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
                <Jumbotron
                    h1="Unsubscribe"
                    p="Manage your email subscription preferences."
                />

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
