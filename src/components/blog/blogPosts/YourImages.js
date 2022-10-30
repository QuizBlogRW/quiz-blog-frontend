import React, { useState, useEffect } from 'react'
import { Col, Row, Card, Alert, Button } from 'reactstrap'
import { connect } from 'react-redux'
import { getImageUploadsByOwner, deleteBlogPost } from '../../../redux/blog/blogPosts/uploadImages/uploadImages.actions'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import './yourimages.css'

const YourImages = ({ currentUser, yourImages, getImageUploadsByOwner, deleteBlogPost }) => {

    const uID = currentUser && currentUser._id

    useEffect(() => {
        getImageUploadsByOwner(uID)
    }, [getImageUploadsByOwner, uID])

    const [show, setShow] = useState(false)
    const [imgTitle, setImgTitle] = useState('')

    const copying = (img) => {
        var cp = navigator.clipboard.writeText(img && img.uploadImage)
        setShow(true)
        setImgTitle(img && img.imageTitle)

        if (cp) {
            window.setTimeout(() => setShow(false), 3000)
        }

        else return null
    }

    return (
        yourImages.isLoading ?
            <SpinningBubbles title='...' /> :
            <>

                <h5 className='text-center d-block'>AVAILABLE IMAGES</h5>
                <small className="d-block text-warning text-center font-weight-bolder">
                    {show ? `${imgTitle} copied` : ''}
                </small>
                <Row>

                    {
                        yourImages.imageUploadsByOwner && yourImages.imageUploadsByOwner.length === 0 ?

                            <Alert color="danger">You have not uploaded any image!</Alert> :

                            yourImages.imageUploadsByOwner && yourImages.imageUploadsByOwner.map(img => (
                                <Col sm='6' className='yourOneImg' key={img && img._id}>
                                    <Card inverse>

                                        <Button size="sm" className='btn-danger' onClick={() => deleteBlogPost(img && img._id)}>Delete</Button>
                                        <img src={img && img.uploadImage} alt='' />
                                        <Button className='btn-info mt-1 py-0' onClick={(event) => copying(img, event)}
                                        >
                                            <small className='d-block'>{img && img.imageTitle}</small>
                                            <small className='d-block'>Click to copy</small>
                                        </Button>
                                    </Card>
                                </Col>))}
                </Row>
            </>
    )
}

const mapStateToProps = state => ({
    yourImages: state.imageUploadsReducer
})

export default connect(mapStateToProps, { getImageUploadsByOwner, deleteBlogPost })(YourImages)