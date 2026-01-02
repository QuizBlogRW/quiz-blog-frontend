import { useState, useEffect, useRef, useMemo } from "react";
import { Col, Row, Input, Label, FormGroup } from "reactstrap";
import CountDown from "./questionsScore/CountDown";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";

const QuestionsView = ({
    qnsLength,
    curQnIndex,
    currentQn,
    curQnOpts,
    checkedState,
    selected,
    handleOnChange,
    goToNextQuestion
}) => {
    const imgRef = useRef(null);
    const [imgLoaded, setImgLoaded] = useState(true);
    const [imgError, setImgError] = useState(false);

    // Reset image state when question changes
    useEffect(() => {
        if (!currentQn?.question_image) {
            setImgLoaded(true);
            setImgError(false);
            return;
        }

        // Reset states for new image
        setImgLoaded(false);
        setImgError(false);

        // Preload image
        const img = new Image();
        img.src = currentQn.question_image;

        img.onload = () => {
            setImgLoaded(true);
            setImgError(false);
        };

        img.onerror = () => {
            setImgLoaded(true);
            setImgError(true);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [currentQn?.question_image]);

    const handleImgLoad = () => {
        setImgLoaded(true);
        setImgError(false);
    };

    const handleImgError = () => {
        setImgLoaded(true);
        setImgError(true);
    };

    // Memoize question number
    const questionNumber = useMemo(
        () => curQnIndex + 1,
        [curQnIndex]
    );

    // Memoize whether countdown should start
    const shouldStartCountdown = useMemo(
        () => imgLoaded && !imgError,
        [imgLoaded, imgError]
    );

    // Guard: No current question
    if (!currentQn) {
        return null;
    }

    return (
        <div className="question-view p-2" style={{ backgroundColor: "#F5F5F5" }}>
            {/* Countdown — only start when image is loaded successfully */}
            <CountDown
                timeInSecs={currentQn.duration}
                start={shouldStartCountdown}
                goToNextQuestion={goToNextQuestion}
                curQnIndex={curQnIndex}
            />

            {/* Question Header */}
            <Row>
                <Col>
                    <div className="question-section my-2 mx-auto w-75 text-center">
                        <h4 className="question-count text-uppercase text-secondary fw-bolder">
                            Question{" "}
                            <b style={{ color: "#B4654A" }}>{questionNumber}</b>
                            /{qnsLength}
                        </h4>
                        <h5 className="q-txt mt-4 fw-bolder">
                            {currentQn.questionText}
                        </h5>
                    </div>
                </Col>
            </Row>

            {/* Image Section */}
            {currentQn.question_image && (
                <Row>
                    <Col className="d-flex justify-content-center align-items-center position-relative">
                        {/* Loading Indicator */}
                        {!imgLoaded && (
                            <div className="position-absolute">
                                <QBLoadingSM title="Loading image..." />
                            </div>
                        )}

                        {/* Error Message */}
                        {imgError && (
                            <div className="alert alert-warning my-3" role="alert">
                                <i className="fa fa-exclamation-triangle me-2"></i>
                                Failed to load image
                            </div>
                        )}

                        {/* Image */}
                        {!imgError && (
                            <img
                                ref={imgRef}
                                src={currentQn.question_image}
                                onLoad={handleImgLoad}
                                onError={handleImgError}
                                alt={`Question ${questionNumber} illustration`}
                                className="img-fluid my-3 px-sm-5"
                                style={{
                                    maxWidth: "70%",
                                    maxHeight: "250px",
                                    objectFit: "contain",
                                    borderRadius: "5px",
                                    opacity: imgLoaded ? 1 : 0,
                                    transition: "opacity 0.3s ease-in-out",
                                }}
                                loading="lazy"
                            />
                        )}
                    </Col>
                </Row>
            )}

            {/* Answer Options */}
            {curQnOpts?.length > 0 ? (
                <Row>
                    <Col>
                        <div className="answer d-flex flex-column mx-auto mt-2 w-lg-50">
                            {curQnOpts.map((answerOption, index) => {
                                const isSelected = selected[index];
                                const isDisabled = !imgLoaded || imgError;

                                return (
                                    <div key={`${answerOption.answerText}-${index}`} className="my-3 my-lg-4">
                                        <FormGroup check>
                                            <Label
                                                check
                                                className="p-1 text-center"
                                                style={{
                                                    width: "96%",
                                                    margin: "auto",
                                                    border: "2px solid #000",
                                                    borderRadius: "10px",
                                                    backgroundColor:
                                                        isSelected && answerOption.isCorrect
                                                            ? "#157a6e"
                                                            : isSelected && !answerOption.isCorrect
                                                                ? "#aa1313"
                                                                : isDisabled
                                                                    ? "#e0e0e0"
                                                                    : "#fff",
                                                    color: isSelected ? "#fff" : isDisabled ? "#999" : "#000",
                                                    cursor: isDisabled ? "not-allowed" : "pointer",
                                                    opacity: isDisabled ? 0.6 : 1,
                                                    transition: "all 0.2s ease-in-out",
                                                }}
                                                htmlFor={`answer-${curQnIndex}-${index}`}
                                            >
                                                <Input
                                                    id={`answer-${curQnIndex}-${index}`}
                                                    className="d-none"
                                                    type="checkbox"
                                                    name={`question-${curQnIndex}`}
                                                    value={answerOption.answerText}
                                                    checked={checkedState[index] ?? false}
                                                    onChange={(e) => handleOnChange(e, index)}
                                                    disabled={isDisabled}
                                                    aria-label={`Answer option ${index + 1}: ${answerOption.answerText}`}
                                                />
                                                <span className="d-block py-2">
                                                    {answerOption.answerText}
                                                </span>
                                            </Label>
                                        </FormGroup>
                                    </div>
                                );
                            })}
                        </div>
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col>
                        <div className="alert alert-info text-center my-4" role="alert">
                            No answer options available for this question.
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default QuestionsView;
