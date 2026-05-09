import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Input, Button } from 'reactstrap';
import { notify } from '@/utils/notifyToast';
import { verify, resendOTP } from '@/redux/slices/usersSlice';
import SquareAd from '@/components/adsenses/SquareAd';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import isAdEnabled from '@/utils/isAdEnabled';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RESEND_ATTEMPTS = 3;
const RESEND_ATTEMPTS_KEY = 'otpResendAttempts';

export default function Verify() {
    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isAuthenticated } = useSelector((state) => state.users);

    const emailForOTP = localStorage.getItem("emailForOTP") || "";
    const [resendAttempts, setResendAttempts] = useState(() => {
        const savedAttempts = Number(localStorage.getItem(RESEND_ATTEMPTS_KEY));
        return Number.isNaN(savedAttempts) ? 0 : savedAttempts;
    });

    const clearVerificationSession = useCallback(() => {
        localStorage.removeItem("emailForOTP");
        localStorage.removeItem(RESEND_ATTEMPTS_KEY);
    }, []);

    // Redirect if session expired
    useEffect(() => {
        if (!emailForOTP || !EMAIL_REGEX.test(emailForOTP)) {
            clearVerificationSession();
            notify("Verification session expired. Please start again.", "error");
            navigate("/login", { replace: true });
        }
    }, [clearVerificationSession, emailForOTP, navigate]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard", { replace: true });
    }, [isAuthenticated, navigate]);

    // Page title
    useEffect(() => {
        document.title = "Verify OTP";
    }, []);

    useEffect(() => {
        if (resendTimer === 0) {
            setCanResend(resendAttempts < MAX_RESEND_ATTEMPTS);
            return;
        }

        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [resendAttempts, resendTimer]);

    const handleChange = useCallback((e) => {
        const value = e.target.value.replace(/\D/g, "");
        setOtp(value);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailForOTP) return notify("Verification session expired. Please start again.", "error");
        if (otp.length !== 6) return notify("Please enter the 6-digit code.", "error");

        try {
            const result = await dispatch(verify({ email: emailForOTP, otp }));
            if (result.payload?.user) {
                clearVerificationSession();
                notify("Verified successfully!", "success");
                setOtp("");
                setTimeout(() => navigate("/dashboard"), 1000);
            }
        } catch (err) {
            console.error(err);
            notify("Could not verify your code. Please try again.", "error");
        }
    };

    const handleResend = async () => {
        if (isResending) return;

        if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
            clearVerificationSession();
            notify("It is impossible to verify this account now. Please start all over.", "error");
            navigate("/", { replace: true });
            return;
        }

        if (!canResend) return;

        setIsResending(true);
        try {
            await dispatch(resendOTP({ email: emailForOTP }));
            const nextAttempts = resendAttempts + 1;
            localStorage.setItem(RESEND_ATTEMPTS_KEY, String(nextAttempts));
            setResendAttempts(nextAttempts);
            setResendTimer(30);
            setCanResend(false);
            console.log(`A new code has been sent. Resends used: ${nextAttempts}/${MAX_RESEND_ATTEMPTS}.`, "success");
        } catch (err) {
            console.error(err);
            notify("Failed to resend code. Try again.", "error");
        } finally {
            setIsResending(false);
        }
    };

    if (!emailForOTP || !EMAIL_REGEX.test(emailForOTP)) {
        return (
            <Row className="mt-5 d-flex justify-content-center align-items-center text-danger" style={{ minHeight: "70vh" }}>
                <h1>Verification session expired. Please start again.</h1>
            </Row>
        );
    }

    const renderAds = () => isAdEnabled() && (
        <>
            <Row className="w-100 mb-4"><Col sm="12"><SquareAd /></Col></Row>
            <Row className="w-100 mt-4"><Col sm="12"><ResponsiveAd /></Col></Row>
        </>
    );

    return (
        <div className="forgot-password mt-4">
            <Row className="mt-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
                {renderAds()}
                <Row className="jbtron rounded px-4 py-4 py-sm-5 text-center border border-info my-4 w-100">
                    <h1 className="fw-bolder text-white display-6">Verify Your Account</h1>
                    <p className="text-white mt-2 mb-1">We’ve sent a 6-digit verification code to:</p>
                    <p className="fw-bold text-white mb-4">{emailForOTP}</p>
                    <p className="text-white small mb-0">Enter the code below to complete your verification.</p>

                    <small className="text-warning">If you did not receive the code, please check your spam or junk folder.</small>
                    <hr className="my-3" style={{ height: "2px", borderWidth: 0, backgroundColor: "var(--brand)" }} />
                </Row>

                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-center">
                        <Input
                            bsSize="lg"
                            placeholder="6-digit code"
                            className="text-center"
                            style={{ width: 220 }}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            autoComplete="one-time-code"
                            autoFocus
                            value={otp}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <Button className="bg-success text-white px-5" type="submit" disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Verify"}
                        </Button>
                    </div>
                </form>

                <div className="mt-3 mt-lg-5 text-center">
                    <Button
                        color="info"
                        size="sm"
                        disabled={isResending || (resendAttempts < MAX_RESEND_ATTEMPTS && !canResend)}
                        onClick={handleResend}
                    >
                        {resendAttempts >= MAX_RESEND_ATTEMPTS
                            ? "Start Over"
                            : canResend
                                ? `Resend Code (${MAX_RESEND_ATTEMPTS - resendAttempts} left)`
                                : `Resend available in ${resendTimer}s`}
                    </Button>
                </div>
            </Row>
        </div>
    );
}
