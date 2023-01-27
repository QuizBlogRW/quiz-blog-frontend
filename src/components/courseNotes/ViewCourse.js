import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import ReactLoading from "react-loading";
import LoginModal from '../auth/LoginModal'
import { connect } from 'react-redux'
import CourseNotes from './notes/CourseNotes'
import AddChapter from './AddChapter'
import EditChapterModal from './EditChapterModal'
import { getChaptersByCourse, deleteChapter } from '../../redux/chapters/chapters.actions'
import { getOneCourse } from '../../redux/courses/courses.actions'
import DeleteIcon from '../../images/remove.svg';
import { Container, Card, Button, CardTitle, CardText, Alert, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import SpinningBubbles from '../rLoading/SpinningBubbles';
import { authContext, currentUserContext } from '../../appContexts'

const ViewCourse = ({ getChaptersByCourse, chaptersBy, getOneCourse, deleteChapter, oneCourse }) => {

    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)

    const [activeIndex, setActiveIndex] = useState(null);

    const collapse = index => {
        if (activeIndex !== index) setActiveIndex(index);
    }

    // Access route parameters
    const { courseId } = useParams()

    useEffect(() => {
        getChaptersByCourse(courseId);
        getOneCourse(courseId);
    }, [getChaptersByCourse, getOneCourse, courseId]);


    return (

        !auth.isAuthenticated ?
            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                }
            </div> :

            <Container className="mt-2 py-2 py-lg-5 view-course-container">

                {!oneCourse.isOneCourseLoading ?

                    Object.keys(oneCourse.oneCourse).length < 1 ?
                        <>
                            {/* When no course reload */}
                            {window.location.reload()}
                        </> :

                        <Alert color="success" className='border border-warning'>
                            <Breadcrumb tag="nav" listTag="div">
                                <>
                                    <BreadcrumbItem tag="a" href="/course-notes">Courses Home</BreadcrumbItem>
                                    <BreadcrumbItem active tag="span">Chapters</BreadcrumbItem>
                                </>
                                {currentUser.role !== 'Visitor' ?
                                    <Button outline color="warning" className="ml-auto">
                                        <strong><AddChapter course={oneCourse.oneCourse} /></strong>
                                    </Button> : null}

                            </Breadcrumb>

                            <h4 className="alert-heading">
                                {oneCourse && oneCourse.oneCourse.title} course
                            </h4>

                            <hr />
                            <p className="mb-0">
                                {oneCourse && oneCourse.oneCourse.description}
                            </p>
                        </Alert> : null}


                {!chaptersBy.isByCourseLoading ?

                    chaptersBy.chaptersByCourse.length > 0 ?

                        chaptersBy.chaptersByCourse.map((chapter, index) => (

                            <Card key={chapter._id} className="mb-3 text-capitalize chapter-card" body outline color="warning" style={{ minHeight: "fit-content" }}>

                                <CardTitle tag="h5" className="font-weight-bolder mb-0 d-flex">
                                    Chapter - {index + 1}.&nbsp;{chapter.title}
                                    {currentUser.role !== 'Visitor' ?

                                        <span className="ml-auto">
                                            <Button size="sm" color="link" className="mx-2">
                                                <EditChapterModal idToUpdate={chapter._id} editTitle={chapter.title} editDesc={chapter.description} />
                                            </Button>

                                            <Button size="sm" color="link" className="mr-2" onClick={() => deleteChapter(chapter._id)}>
                                                <img src={DeleteIcon} alt="" width="16" height="16" />
                                            </Button></span> : null}
                                </CardTitle>

                                <CardText className="text-muted">{chapter.description}</CardText>

                                <div id="accordion">
                                    <div className="card border-0">
                                        <div className="card-header" id={`heading${index}`}>
                                            <h5 className="mb-0">

                                                <Button block outline color="info" size="sm" index={index} onClick={() => { collapse(index) }} className={`d-flex justify-content-between ${(activeIndex === index || activeIndex === null) ? '' : 'collapsed'}`} data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded={(activeIndex === index || activeIndex === null)} aria-controls={`collapse${index}`}>

                                                    <span className="mr-auto">Course notes</span>

                                                    <i className={`fa fa-angle-${(activeIndex === index || activeIndex === null) ? 'up' : 'down'} ml-auto`}></i>
                                                </Button>
                                            </h5>
                                        </div>

                                        <div id={`collapse${index}`} className={`collapse ${(activeIndex === index || activeIndex === null) ? 'show' : ''}`} aria-labelledby={`heading${index}`} data-parent="#accordion">
                                            <div className="card-body">
                                                <CourseNotes chapter={chapter} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </Card>)) :

                        <Alert color="danger" className="d-flex justify-content-between border border-warning">
                            <strong>No chapters yet for this course!</strong>
                            {currentUser.role !== 'Visitor' ?
                                <Button outline color="success">
                                    <strong><AddChapter course={oneCourse.oneCourse} /></strong>
                                </Button> : null}
                        </Alert> :
                    <ReactLoading type="spinningBubbles" color="#33FFFC" />
                }

            </Container>)
}

const mapStateToProps = state => ({
    chaptersBy: state.chaptersReducer,
    oneCourse: state.coursesReducer
})

export default connect(mapStateToProps, { getChaptersByCourse, getOneCourse, deleteChapter })(ViewCourse)