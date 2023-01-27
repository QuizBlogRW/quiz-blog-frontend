import React, { useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import LoginModal from '../../auth/LoginModal'
import { Link } from 'react-router-dom'
import { getNotes, deleteNotes, removeQzNt } from '../../../redux/notes/notes.actions'
import { saveDownload } from '../../../redux/downloads/downloads.actions'
import img from '../../../images/resourceImg.svg'
import DeleteIcon from '../../../images/remove.svg'
import AddNotesModal from './AddNotesModal'
import EditNotesModal from './EditNotesModal'
import AddRelatedQuiz from './AddRelatedQuiz'
import { Row, Col, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import { authContext, currentUserContext } from '../../../appContexts'

const CourseNotes = ({ chapter, getNotes, deleteNotes, removeQzNt, saveDownload, notes }) => {

    // context
    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)

    useEffect(() => { getNotes() }, [getNotes])

    const onDownload = (note) => {
        const newDownload = {
            notes: note._id,
            chapter: note.chapter,
            course: note.course,
            courseCategory: note.courseCategory,
            downloaded_by: currentUser ? currentUser._id : null
        }
        saveDownload(newDownload)
    }

    return (

        auth.isAuthenticated ?

            notes.isLoading ?
                <SpinningBubbles title='notes' /> :

                <>
                    {currentUser.role !== 'Visitor' ?
                        <Row>
                            {chapter ?
                                <Button size="sm" outline color="success" className="ml-auto mr-1 mx-sm-auto my-2 add-notes-btn">
                                    <strong><AddNotesModal chapter={chapter} /></strong>
                                </Button> : null
                            }
                        </Row> : null}

                    <Row>
                        {notes && notes.allNotes.map(note =>

                            note.chapter === chapter._id ?

                                <Col key={note._id} sm="12" className="mb-3 resouces-card c-notes w-100">

                                    <Card className="d-flex flex-row p-1">
                                        <CardImg top width="12%" src={img} alt="Card image cap" className="pl-1" />
                                        <CardBody style={{ width: "77%" }}>

                                            <CardTitle tag="h6" className="text-info font-weight-bold mb-1"
                                                style={{ fontSize: ".7rem" }}>
                                                {note.title}
                                            </CardTitle>

                                            <CardSubtitle tag="small" className="mb-2 text-muted font-weight-bolder" style={{ fontSize: ".6rem" }}>
                                                {note.courseCategory.title}
                                            </CardSubtitle>

                                            <CardText className="mb-1">
                                                <small>{note.description}</small>
                                                <br />
                                                <i className="font-weight-bolder text-info" style={{ fontSize: ".5rem" }}>
                                                    {note.notes_file && note.notes_file.split('/').pop().replace(/%20|%5B|%5D/g, ' ')}
                                                </i>
                                            </CardText>

                                            {note.quizzes && note.quizzes.length > 0 ?
                                                <>
                                                    <h6 style={{ fontSize: ".7rem", fontWeight: "bolder", marginTop: "1rem", color: "magenta" }}>
                                                        <u>RELATED QUIZZES</u>
                                                    </h6>

                                                    <ol style={{ fontSize: ".65rem" }}>
                                                        {
                                                            note.quizzes && note.quizzes.map(qz =>
                                                                <li key={qz && qz._id}>
                                                                    <Link to={`/view-quiz/${qz && qz.slug}`}>
                                                                        {qz.title}
                                                                    </Link>

                                                                    {currentUser.role !== 'Visitor' ?
                                                                        <Button size="sm" color="link" className="ml-2" onClick={() => removeQzNt(note._id, qz && qz._id)}>
                                                                            <img src={DeleteIcon} alt="" width="10" height="10" />
                                                                        </Button> : null}
                                                                </li>
                                                            )
                                                        }
                                                    </ol></> : null}

                                            <div className="action-btns">

                                                <Button size="sm" color="success">
                                                    <a href={note.notes_file} className="text-white" onClick={() => onDownload(note)} target="_blank" rel="noreferrer">Download</a>
                                                </Button>

                                                {currentUser.role !== 'Visitor' ?
                                                    <><Button size="sm" color="link" className="mx-2">
                                                        <EditNotesModal idToUpdate={note._id} editTitle={note.title} editDesc={note.description} />
                                                    </Button>

                                                        <Button size="sm" color="link" className="mr-2" onClick={() => deleteNotes(note._id)}>
                                                            <img src={DeleteIcon} alt="" width="16" height="16" />
                                                        </Button>
                                                        <AddRelatedQuiz courseCategoryID={note.courseCategory} noteID={note._id} /></> : null}
                                            </div>

                                        </CardBody>
                                    </Card>
                                </Col> : null)}
                    </Row>
                </> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                }
            </div>)
}

const mapStateToProps = state => ({ notes: state.notesReducer })

export default connect(mapStateToProps, { getNotes, deleteNotes, removeQzNt, saveDownload })(CourseNotes)