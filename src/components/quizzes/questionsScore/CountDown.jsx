import { useState, useEffect, useRef } from "react";
import { Col, Row } from "reactstrap";

const CountDown = ({ timeInSecs, start, goToNextQuestion, curQnIndex }) => {
    const [remaining, setRemaining] = useState(timeInSecs);
    const intervalRef = useRef(null);

    // Reset timer when question changes (use curQnIndex as dependency)
    useEffect(() => {
        setRemaining(timeInSecs);
    }, [timeInSecs, curQnIndex]); // Added curQnIndex

    useEffect(() => {
        if (!start) {
            // Clear any existing interval if start is false
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Clear any existing interval before starting a new one
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    goToNextQuestion();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [start, curQnIndex, goToNextQuestion]);

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return (
        <Row>
            <Col>
                <div className="text-end text-danger me-3">
                    <h6>
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </h6>
                </div>
            </Col>
        </Row>
    );
};

export default CountDown;
