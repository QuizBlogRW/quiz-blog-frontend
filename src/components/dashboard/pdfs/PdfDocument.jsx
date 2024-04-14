import React from 'react'
import { Row, Col } from 'reactstrap'
import '../../footer/footer.css'
import HeaderFooter from './HeaderFooter'

const styles = {
    page: {
        backgroundColor: "#f6f6f5",
        padding: 20
    },
    reviewHeader: {
        width: "100%",
        padding: 15,
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
    },

    reviewHeaderImage: {
        backgroundColor: "#fff",
        height: 100,
        width: 100,
        padding: 5,
        margin: "auto 0",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        borderRadius: "10px",
    },
    reviewHeaderContact: {
        color: "white",
        fontSize: 11
    },
    reviewTitle: {
        textAlign: "center",
        textTransform: "uppercase",
        color: "#6c757d",
        margin: 10
    },
    reviewContainer: {
        backgroundColor: "#ffffff",
        padding: "20px",
        marginBottom: 5
    },
    questionText: {
        fontSize: 13,
        marginBottom: 10,
        fontWeight: "900"
    },
    reviewImage: {
        width: 100,
        margin: "10px 30px",
    }
}

const PdfDocument = ({ review }) => {

    return (
        <Row>
            <Col style={styles.page}>

                <HeaderFooter styles={styles} />

                <div className='py-3 my-2 border rounded' style={{ backgroundColor: "khaki" }}>
                    <h5 style={styles.reviewTitle}>{review.title}</h5>
                </div>

                {review ?
                    review.questions.map((question, index) => {

                        return (
                            <div key={index} style={styles.reviewContainer}>

                                <h6 style={styles.questionText}>
                                    Q{index + 1}. {question.questionText}
                                </h6>

                                {/* Image */}
                                {question && question.question_image ?
                                    <div style={{ display: 'block' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
                                            <img src={question.question_image} style={styles.reviewImage} alt="question" />
                                        </div>
                                    </div> : null}

                                {question.answerOptions.map((answer, index) =>
                                    <div key={index} style={{
                                        fontSize: 12,
                                        marginBottom: 12,
                                        color: answer.isCorrect ? "green" : !answer.isCorrect && answer.choosen ? "red" : "#6c757d"
                                    }}>
                                        <div key={index}>
                                            <p>{index + 1}. {answer.answerText}</p>
                                            {answer.explanations ?
                                                <small style={{ fontSize: "9px", marginTop: 6 }}>{answer.explanations}</small> : null}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                    : ""}

                <HeaderFooter styles={styles} fromFooter={true} />

            </Col>
        </Row>
    )
}

export default PdfDocument