import React from 'react'
import { Button } from 'reactstrap'
import trash from '../../../images/trash.svg';

const ChallengeQuestions = ({ oneChQuiz, deleteChQuestion }) => {

    return (
        oneChQuiz.questions && oneChQuiz.questions.length > 0 ?
            <div className="p-3 p-lg-5">
                <p className="font-weight-bolder"><u>QUESTIONS</u></p>

                {oneChQuiz && oneChQuiz.questions.map((chQn, index) =>
                    <ul key={chQn._id} className="pl-1 text-info">
                        <li style={{ listStyle: "none" }}>
                            {index + 1}.&nbsp;

                            <b>
                                {chQn.questionText}
                            </b>
                            <strong className="text-danger">&nbsp;
                                ({chQn.answerOptions.length} answers)
                            </strong>
                            <Button size="sm" color="link" className="ml-2 mt-0 p-0" onClick={() => deleteChQuestion(chQn._id)}>
                                <img src={trash} alt="" width="16" height="16" />
                            </Button>
                        </li>
                    </ul>
                )}</div> :
            <p className="font-weight-bold text-danger text-center my-5">NO QUESTIONS FOR THIS CHALLENGE</p>
    )
}

export default ChallengeQuestions