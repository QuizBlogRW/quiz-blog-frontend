import React from 'react'
import { Col, Row, Card, CardTitle, Button } from 'reactstrap'
import DeleteIcon from '../../images/remove.svg'
import { deleteVideo } from '../../redux/quizes/quizes.actions'
import { deleteFaqVideo } from '../../redux/faqs/faqs.actions'
import { connect } from 'react-redux'

const EmbeddedVideos = ({ quiz, faq, isFromFaqs, currentUser, deleteVideo }) => {

    const videos = isFromFaqs ? faq && faq.video_links: quiz && quiz.oneQuiz && quiz.oneQuiz.video_links
    const iD = isFromFaqs ? faq && faq._id : quiz && quiz.oneQuiz && quiz.oneQuiz._id

    const delHandler = (vId) => {
        // Create new object
        const vidData = {
            vId,
            iD
        }
        
        // Attempt to create
        isFromFaqs ? deleteFaqVideo(vidData, vId) : deleteVideo(vidData, vId)
    }

    return (
        videos.length > 0 &&
            <Row>
                <Col sm={12} style={{backgroundColor: "khaki"}}>
                    <h4 className="my-2 my-lg-4 text-center font-weight-bold d-block">
                        VIDEOS
                    </h4>
                </Col>

                {videos && videos.map((vid, index) => (
                    <Col sm={6} key={index} className="my-5">

                        <Card body className='question-section text-center my-2 mx-auto w-75 p-0 py-3 p-sm-2'>
                            <CardTitle tag="small" className='question-count text-uppercase text-center text-success font-weight-bold'>
                                {vid && vid.vtitle}
                                <Button size="sm" color="white" className={`mr-2 ${currentUser && currentUser.role === 'Admin' ? '' : 'd-none'}`} onClick={() => delHandler(vid._id)}>
                                    &nbsp&nbsp&nbsp<img src={DeleteIcon} alt="" width="10" height="10" />
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

export default connect(null, { deleteVideo })(EmbeddedVideos)