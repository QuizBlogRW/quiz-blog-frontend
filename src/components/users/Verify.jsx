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
const RESEND_COOLDOWN = 30;

export default function Verify() {
    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, user } = useSelector((state) => state.users);

    const [emailForOTP] = useState(() => localStorage.getItem("emailForOTP") || "");
    const [resendAttempts, setResendAttempts] = useState(() => {
        const savedAttempts = Number(localStorage.getItem(RESEND_ATTEMPTS_KEY));
        return Number.isNaN(savedAttempts) ? 0 : savedAttempts;
    });

    const isSessionValid = Boolean(emailForOTP) && EMAIL_REGEX.test(emailForOTP);

    const clearVerificationSession = useCallback(() => {
        localStorage.removeItem("emailForOTP");
        localStorage.removeItem(RESEND_ATTEMPTS_KEY);
    }, []);

    // Redirect if already verified or session expired
    useEffect(() => {
        if (user?.verified) {
            clearVerificationSession();
            notify("Your account is already verified.", "info");
            navigate("/", { replace: true });
            return;
        }

        if (!isSessionValid) {
            clearVerificationSession();
            notify("Verification session expired. Please start again.", "error");
            navigate("/", { replace: true });
        }
    }, [clearVerificationSession, isSessionValid, navigate, user]);

    useEffect(() => {
        if (resendTimer <= 0) {
            setCanResend(resendAttempts < MAX_RESEND_ATTEMPTS);
            return;
        }
        const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [resendTimer, resendAttempts]);

    const handleChange = useCallback((e) => {
        const value = e.target.value.replace(/\D/g, "");
        setOtp(value);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailForOTP) return notify("Verification session expired. Please start again.", "error");
        if (otp.length !== 6) return notify("Please enter the 6-digit code.", "error");

        try {
            await dispatch(verify({ email: emailForOTP, otp })).unwrap();
            clearVerificationSession();
            notify("Verified successfully!", "success");
            setOtp("");
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            notify(err?.message || "Could not verify your code. Please try again.", "error");
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
            await dispatch(resendOTP({ email: emailForOTP })).unwrap();
            const nextAttempts = resendAttempts + 1;
            localStorage.setItem(RESEND_ATTEMPTS_KEY, String(nextAttempts));
            setResendAttempts(nextAttempts);
            setResendTimer(RESEND_COOLDOWN);
            setCanResend(false);
            notify(`A new code has been sent. Resends used: ${nextAttempts}/${MAX_RESEND_ATTEMPTS}.`, "success");
        } catch (err) {
            notify(err?.message || "Failed to resend code. Try again.", "error");
        } finally {
            setIsResending(false);
        }
    };

    const renderAds = () => isAdEnabled() && (
        <>
            <Row className="w-100 mb-4"><Col sm="12"><SquareAd /></Col></Row>
            <Row className="w-100 mt-4"><Col sm="12"><ResponsiveAd /></Col></Row>
        </>
    );

    if (isLoading || user?.verified || !isSessionValid) {
        return null;
    }

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
                                ? `Resend Code`
                                : `Resend in ${resendTimer}s`}
                    </Button>
                </div>
            </Row>
        </div>
    );
}
