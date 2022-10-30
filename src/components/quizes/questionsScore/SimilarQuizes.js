import React from 'react'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap'
import { Link } from "react-router-dom"
import Unavailable from './Unavailable'
// import Bubbles from '../../rLoading/Bubbles'

const SimilarQuizes = ({ thisQId, categories, categoryId }) => {

    const thisCat = categories.find(c => c._id === categoryId)
    const thisCatQzs = thisCat && thisCat.quizes

    return (
        thisCatQzs && thisCatQzs.filter(q => q._id !== thisQId).length > 0 ?
            <>
                {
                    <Row className="similar-quizes mx-3">
                        <h4 className="text-center col-12 mb-4 font-weight-bolder text-uppercase text-underline">
                            Related quizes you may also like to take</h4>
                        {
                            thisCatQzs && thisCatQzs
                                .filter(q => q._id !== thisQId)
                                .sort(() => 0.5 - Math.random())
                                .map(quiz => (
                                    <Col sm="4" key={quiz._id} className="my-1 my-sm-4">
                                        <Card body>
                                            <CardTitle tag="h5" className="text-uppercase">
                                                {quiz.title} ({quiz.questions.length})
                                            </CardTitle>
                                            <CardText>{quiz.description}</CardText>
                                            <Button color="info">
                                                <Link to={`/view-quiz/${quiz.slug}`} className="text-white">
                                                    Attempt
                                                </Link>
                                            </Button>
                                        </Card>
                                    </Col>
                                )).slice(0, 3)}
                    </Row>
                }
            </> :
            <Unavailable title='No related quizes available yet' link='/allposts' more='quizes' />
    )
}

export default SimilarQuizes