import { useState, useEffect, useRef } from "react";
import { Col, Row } from "reactstrap";

const CountDown = ({ timeInSecs, start, goToNextQuestion }) => {
    const [remaining, setRemaining] = useState(timeInSecs);
    const hasFired = useRef(false);

    useEffect(() => {
        setRemaining(timeInSecs);
        hasFired.current = false;
    }, [timeInSecs]);

    useEffect(() => {
        if (!start) return;

        if (remaining <= 0) {
            if (!hasFired.current) {
                hasFired.current = true;
                goToNextQuestion();
            }
            return;
        }

        const interval = setInterval(() => {
            setRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [remaining, start]);

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
