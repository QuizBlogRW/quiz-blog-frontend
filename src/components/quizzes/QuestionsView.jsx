import { useState, useEffect, useRef } from "react";
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
    const [prevImageUrl, setPrevImageUrl] = useState("");

    useEffect(() => {
        if (!currentQn?.question_image) {
            setImgLoaded(true);
            setPrevImageUrl("");
            return;
        }

        if (currentQn.question_image !== prevImageUrl) {
            setImgLoaded(false);
            setPrevImageUrl(currentQn.question_image);

            // Check if the image is already cached
            const imgEl = imgRef.current;
            if (imgEl?.complete) {
                setImgLoaded(true);
            }
        }
    }, [currentQn?.question_image, prevImageUrl]);

    const handleImgLoad = () => setImgLoaded(true);
    const handleImgError = () => setImgLoaded(true);

    if (!currentQn) return null;

    const questionNumber = curQnIndex + 1;

    return (
        <div className="question-view p-2" style={{ backgroundColor: "#F5F5F5" }}>
            {/* Countdown — only start when image is loaded */}
            <CountDown
                goToNextQuestion={goToNextQuestion}
                curQnIndex={curQnIndex}
                qnsLength={qnsLength}
                timeInSecs={currentQn.duration}
                start={imgLoaded}
            />

            {/* Question Header */}
            <Row>
                <Col>
                    <div className="question-section my-2 mx-auto w-75 text-center">
                        <h4 className="question-count text-uppercase text-secondary fw-bolder">
                            Question <b style={{ color: "#B4654A" }}>{questionNumber}</b>/{qnsLength}
                        </h4>
                        <h5 className="q-txt mt-4 fw-bolder">{currentQn.questionText}</h5>
                    </div>
                </Col>
            </Row>

            {/* Image OR Loader */}
            {currentQn.question_image && (
                <Row>
                    <Col className="d-flex justify-content-center">
                        {!imgLoaded && <QBLoadingSM title="Loading image..." />}
                        <img
                            ref={imgRef}
                            src={currentQn.question_image}
                            onLoad={handleImgLoad}
                            onError={handleImgError}
                            alt="Question"
                            className="img-fluid my-3 px-sm-5"
                            style={{
                                maxWidth: "70%",
                                maxHeight: "250px",
                                objectFit: "contain",
                                borderRadius: "5px",
                                display: imgLoaded ? "block" : "none",
                            }}
                        />
                    </Col>
                </Row>
            )}

            {/* Answers */}
            {curQnOpts?.length > 0 && (
                <Row>
                    <Col>
                        <div className="answer d-flex flex-column mx-auto mt-2 w-lg-50">
                            {curQnOpts.map((answerOption, index) => {
                                const isSelected = selected[index];
                                return (
                                    <div key={index} className="my-3 my-lg-4">
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
                                                                : "",
                                                    color: isSelected ? "#fff" : "",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <Input
                                                    className="d-none"
                                                    type="checkbox"
                                                    value={answerOption.answerText}
                                                    checked={checkedState[index] ?? false}
                                                    onChange={(e) => handleOnChange(e, index)}
                                                    disabled={!imgLoaded} // disable interaction when image is not loaded
                                                />
                                                <span>{answerOption.answerText}</span>
                                            </Label>
                                        </FormGroup>
                                    </div>
                                );
                            })}
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default QuestionsView;
