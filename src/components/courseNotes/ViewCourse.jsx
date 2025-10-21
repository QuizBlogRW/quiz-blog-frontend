import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import CourseNotes from '@/components/dashboard/courses/notes/CourseNotes'
import AddChapter from '@/components/dashboard/courses/AddChapter'
import EditChapterModal from '@/components/dashboard/courses/EditChapterModal'
import { getChaptersByCourse, deleteChapter } from '@/redux/slices/chaptersSlice'
import { getOneCourse } from '@/redux/slices/coursesSlice'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Card, Button, CardTitle, CardText, Alert, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM'
import DeleteModal from '@/utils/DeleteModal'

const ViewCourse = () => {

    const dispatch = useDispatch()

    // Access route parameters
    const { courseId } = useParams()

    useEffect(() => {
        dispatch(getChaptersByCourse(courseId))
        dispatch(getOneCourse(courseId))
    }, [dispatch, courseId])

    const { chaptersByCourse, isLoading } = useSelector(state => state.chapters)
    const { oneCourse } = useSelector(state => state.courses)
    const { user } = useSelector(state => state.auth)
    const [activeIndex, setActiveIndex] = useState(null)

    const collapse = index => {
        if (activeIndex !== index) setActiveIndex(index)
    }

    return (<Container className="mt-2 py-2 py-lg-5 view-course-container">
    <Alert color="success" style={{ backgroundColor: "var(--brand)", border: "1px solid var(--brand)", color: "#fff" }}>
            <Breadcrumb tag="nav" listTag="div">
                <>
                    <BreadcrumbItem tag="a" href="/course-notes" style={{ color: "#fff", fontWeight: "bold" }}>
                        Courses Home
                    </BreadcrumbItem>

                    <BreadcrumbItem active tag="span" style={{ color: "#157A6E" }}>
                        Chapters
                    </BreadcrumbItem>
                </>
                {user?.role !== 'Visitor' ?
                    <Button outline color="warning" className="ms-auto">
                        <strong>
                            <AddChapter course={oneCourse} />
                        </strong>
                    </Button> : null}

            </Breadcrumb>

            <h4 className="alert-heading">
                {oneCourse?.title} course
            </h4>

            <hr />
            <p className="mb-0">
                {oneCourse?.description}
            </p>
        </Alert>


        {isLoading ?
            <QBLoadingSM /> :

            chaptersByCourse.length > 0 ?

                chaptersByCourse.map((chapter, index) => (

                    <Card key={index} className="mb-3 text-capitalize chapter-card" body style={{ minHeight: "fit-content", border: "2px solid var(--brand)" }}>

                        <CardTitle tag="h5" className="fw-bolder mb-0 d-flex">
                            Chapter - {index + 1}.&nbsp;{chapter?.title}
                            {user?.role !== 'Visitor' ?

                                <span className="ms-auto">
                                    <Button size="sm" color="link" className="mx-2">
                                        <EditChapterModal idToUpdate={chapter._id} editTitle={chapter?.title} editDesc={chapter?.description} />
                                    </Button>
                                    <DeleteModal deleteFnName="deleteChapter" deleteFn={deleteChapter} delID={chapter._id} delTitle={chapter?.title} />
                                </span> : null}
                        </CardTitle>

                        <CardText className="text-muted">{chapter?.description}</CardText>

                        <div id="accordion">
                            <div className="card border-0">
                                <div className="card-header" id={`heading${index}`}>
                                    <h5 className="mb-0">

                                        <Button block outline color="success" size="sm" index={index} onClick={() => { collapse(index) }} className={`d-flex justify-content-between ${(activeIndex === index || activeIndex === null) ? '' : 'collapsed'}`} data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded={(activeIndex === index || activeIndex === null)} aria-controls={`collapse${index}`}>

                                            <span className="me-auto">Course notes</span>

                                            <i className={`fa fa-angle-${(activeIndex === index || activeIndex === null) ? 'up' : 'down'} ms-auto`}></i>
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

                <Alert color="danger" className="d-flex justify-content-between" style={{ border: "1px solid var(--brand)" }}>
                    <strong>No chapters yet for this course!</strong>
                    {user?.role !== 'Visitor' ?
                        <Button outline color="success">
                            <strong><AddChapter course={oneCourse} /></strong>
                        </Button> : null}
                </Alert>
        }
    </Container>)
}

export default ViewCourse
