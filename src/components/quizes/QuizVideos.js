import React from 'react'
import { Col, Row, Card, CardTitle, Button } from 'reactstrap';
import DeleteIcon from '../../images/remove.svg'
import { deleteVideo } from '../../redux/quizes/quizes.actions'
import { connect } from 'react-redux'

const QuizVideos = ({ quiz, currentUser, deleteVideo }) => {

    const videos = quiz && quiz.oneQuiz && quiz.oneQuiz.video_links
    const qID = quiz && quiz.oneQuiz && quiz.oneQuiz._id

    const delHandler = (vId) => {

        // Create new object
        const vidData = {
            vId,
            qID
        }

        // Attempt to create
        deleteVideo(vidData, vId)
    }


    return (
        videos.length > 0 &&
            <Row>
                <Col sm={12}>
                    <h4 className="my-2 my-lg-4 text-center font-weight-bold d-block">
                        RELATED VIDEOS
                    </h4>
                </Col>
                {videos && videos.map((vid, index) => (
                    <Col sm={6} key={index}>

                        <Card body className='question-section text-center my-2 mx-auto w-75 p-0 py-3 p-sm-5'>
                            <CardTitle tag="small" className='question-count text-uppercase text-center text-success font-weight-bold'>
                                {vid && vid.vtitle}
                                <Button size="sm" color="white" className={`mr-2 ${currentUser && currentUser.role === 'Admin' ? '' : 'd-none'}`} onClick={() => delHandler(vid._id)}>
                                    &nbsp;&nbsp;&nbsp;<img src={DeleteIcon} alt="" width="10" height="10" />
                                </Button>
                            </CardTitle>

                            <div>
                                <iframe className="mx-auto border rounded" width="320" height="190" src={vid && vid.vlink} title="YouTube video player" frameBorder="0" allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture" allowFullScreen></iframe>
                            </div>

                        </Card>
                    </Col>
                ))}
            </Row>
    )
}

export default connect(null, { deleteVideo })(QuizVideos)