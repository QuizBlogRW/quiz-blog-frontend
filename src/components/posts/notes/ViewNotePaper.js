import React, { useEffect } from 'react'
import { Container, Col, Row, Card, Button, CardTitle, CardText, Spinner } from 'reactstrap'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { getOneNotePaper } from '../../../redux/notes/notes.actions'
import LoginModal from '../../auth/LoginModal'
import SpinningBubbles from '../../rLoading/SpinningBubbles'

const ViewNotePaper = ({ auth, nPaper, getOneNotePaper }) => {

    // Access route parameters
    const { noteSlug } = useParams()

    useEffect(() => {
        getOneNotePaper(noteSlug)
    }, [getOneNotePaper, noteSlug])

    const { title, description, courseCategory, course, chapter, notes_file, createdAt } = nPaper.oneNotePaper

    let date = new Date(createdAt)

    return (
        nPaper.isOneNotePaperLoading ?

            <>
                <div className="py-3 d-flex justify-content-center align-items-center">
                    <Spinner color="warning" style={{ width: '10rem', height: '10rem' }} />
                </div>
                <div className="py-3 d-flex justify-content-center align-items-center">
                    <h4 className="blink_load">Loading ...</h4>
                </div>
                <div className="py-3 d-flex justify-content-center align-items-center">
                    <Spinner type="grow" color="success" style={{ width: '10rem', height: '10rem' }} />
                </div>
            </> :

            notes_file && notes_file ?

                <Container className="main d-flex flex-column justify-content-center rounded border border-primary my-5 py-4 w-80">

                    <div className="question-view">
                        <Row>
                            <Col>
                                <Card body className='question-section text-center my-2 mx-auto w-75'>
                                    <CardTitle tag="h5" className='question-count text-uppercase text-center text-secondary font-weight-bold'>
                                        ({title})
                                    </CardTitle>

                                    <CardText>{description}</CardText>

                                    <small className='text-center text-info font-weight-bolder'>{date.toDateString()}</small>

                                    {!auth.isAuthenticated ?

                                        // If not authenticated or loading
                                        <div className="d-flex justify-content-center align-items-center text-danger">
                                            {
                                                auth.isLoading ?
                                                    <SpinningBubbles /> :
                                                    <LoginModal
                                                        textContent={'Login first to download this file'}
                                                        textColor={'text-danger font-weight-bolder my-5 border rounded'}
                                                        isAuthenticated={auth.isAuthenticated} />
                                            }
                                        </div> :

                                        <div className='answer d-flex justify-content-center mx-auto mt-2 w-lg-50'>

                                            {notes_file.split('.').pop().toLowerCase() === 'pdf' ?
                                                <a href={`/view-pdf-notes/${noteSlug}`} className="text-white">
                                                    <Button className="btn btn-outline-primary mt-3">
                                                        View
                                                    </Button>
                                                </a> :
                                                <a href={notes_file}>
                                                    <Button className="btn btn-outline-primary mt-3">
                                                        Download
                                                    </Button>
                                                </a>}

                                            <Link to={'/'}>
                                                <Button className="btn btn-outline-primary mt-3">
                                                    Back
                                                </Button>
                                            </Link>
                                        </div>
                                    }
                                    <small className="mt-3 text-info">
                                        ~{courseCategory.title} | {course.title} | {chapter.title}~
                                    </small>

                                </Card>

                            </Col>
                        </Row>
                    </div>

                </Container> :

                <div className="pt-5 d-flex justify-content-center align-items-center">
                    <h4>This file is unavailable!</h4>
                    <Link to={'/'}>
                        <Button className="btn btn-outline-primary mt-3">
                            Go back
                        </Button>
                    </Link>
                </div>)
}

const mapStateToProps = state => ({
    nPaper: state.notesReducer
})

export default connect(mapStateToProps, { getOneNotePaper })(ViewNotePaper)