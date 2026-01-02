import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createChapter, getChaptersByCourse, deleteChapter, updateChapter } from '@/redux/slices/chaptersSlice';
import { getOneCourse } from '@/redux/slices/coursesSlice';
import validators from '@/utils/validators';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, CardTitle, CardText, Alert, Breadcrumb, BreadcrumbItem, Input } from 'reactstrap';
import { notify } from '@/utils/notifyToast';
import CourseNotes from '@/components/dashboard/courses/notes/CourseNotes';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import DeleteModal from '@/utils/DeleteModal';
import UpdateModal from '@/utils/UpdateModal';
import AddModal from '@/utils/AddModal';
import NotAuthenticated from '@/components/users/NotAuthenticated';

const ViewCourse = () => {

    const dispatch = useDispatch();

    // Access route parameters
    const { courseId } = useParams();

    useEffect(() => {
        dispatch(getChaptersByCourse(courseId));
        dispatch(getOneCourse(courseId));
    }, [dispatch, courseId]);

    const { chaptersByCourse, isLoading: chaptersLoading } = useSelector(state => state.chapters);
    const { oneCourse, isLoading: coursesLoading } = useSelector(state => state.courses);
    const { user, isAuthenticated } = useSelector(state => state.users);
    const [activeIndex, setActiveIndex] = useState(null);

    const initialState = { title: '', description: '', course: oneCourse?._id, courseCategory: oneCourse?.courseCategory, created_by: user?._id }

    const collapse = index => {
        if (activeIndex !== index) setActiveIndex(index);
    };

    if (!isAuthenticated) return <NotAuthenticated />;
    if (chaptersLoading || coursesLoading) return <QBLoadingSM />

    const createFn = data => {
        const { title, description } = data;
        const res = validators.validateTitleDesc(title, description, { minTitle: 4, minDesc: 4, maxTitle: 80, maxDesc: 200 });
        if (!res.ok) {
            notify('Insufficient info!', 'error');
            return Promise.reject(new Error('validation'));
        }
        return createChapter({ ...data, course: oneCourse?._id, courseCategory: oneCourse?.courseCategory });
    }

    const newForm = (state, setState, firstInputRef) => (
        <>
            <Input ref={firstInputRef} type="text" name="title" id="title" placeholder="Chapter title ..." className="mb-3" value={state.title || ''} onChange={e => setState({ ...state, title: e.target.value })} />
            <Input type="text" name="description" id="description" placeholder="Chapter description ..." className="mb-3" value={state.description || ''} onChange={e => setState({ ...state, description: e.target.value })} />
        </>
    )

    return (<div className="mt-2 py-2 py-lg-5 view-course-container">
        <Alert color="success" style={{ backgroundColor: 'var(--brand)', border: '1px solid var(--brand)', color: '#fff' }}>
            <Breadcrumb tag="nav" listTag="div">
                <>
                    <BreadcrumbItem tag="a" href="/course-notes" style={{ color: '#fff', fontWeight: 'bold' }}>
                        Courses Home
                    </BreadcrumbItem>

                    <BreadcrumbItem active tag="span" style={{ color: '#157A6E' }}>
                        Chapters
                    </BreadcrumbItem>
                </>
                {user?.role !== 'Visitor' ?
                    <AddModal
                        title="Add New Chapter"
                        triggerText="Chapter"
                        initialState={initialState}
                        submitFn={createFn}
                        renderForm={newForm}
                    /> : null}

            </Breadcrumb>

            <h4 className="alert-heading">
                {oneCourse?.title} course
            </h4>

            <hr />
            <p className="mb-0">
                {oneCourse?.description}
            </p>
        </Alert>


        {chaptersByCourse.length > 0 ?

            chaptersByCourse.map((chapter, index) => {

                const initialUpdateData = { idToUpdate: chapter._id, name: chapter.title, description: chapter.description }

                const updateFn = (data) => {
                    const { name, description } = data;
                    const res = validators.validateTitleDesc(name, description, { minTitle: 4, minDesc: 4, maxTitle: 80, maxDesc: 200 });
                    if (!res.ok) {
                        notify('Insufficient info!', 'error');
                        return Promise.reject(new Error('validation'));
                    }
                    return updateChapter({ ...data, course: oneCourse?._id, courseCategory: oneCourse?.courseCategory });
                }

                const updateForm = (state, setState, firstInputRef) => (
                    <>
                        <Input ref={firstInputRef} type="text" name="name" id="name" placeholder="Chapter title ..." className="mb-3" value={state.name || ''} onChange={e => setState({ ...state, name: e.target.value })} />
                        <Input type="text" name="description" id="description" placeholder="Chapter description ..." className="mb-3" value={state.description || ''} onChange={e => setState({ ...state, description: e.target.value })} />
                    </>
                )

                return (

                    <Card key={index} className="mb-3 text-capitalize chapter-card" body style={{ minHeight: 'fit-content', border: '2px solid var(--brand)' }}>

                        <CardTitle tag="h5" className="fw-bolder mb-0 d-flex">
                            Chapter - {index + 1}.&nbsp;{chapter?.title}
                            {user?.role !== 'Visitor' ?

                                <span className="ms-auto d-flex align-items-center">
                                    <UpdateModal
                                        title="Edit Chapter"
                                        initialUpdateData={initialUpdateData}
                                        submitFn={updateFn}
                                        renderForm={updateForm}
                                    />
                                    <DeleteModal deleteFnName="deleteChapter" deleteFn={deleteChapter} delID={chapter._id} delTitle={chapter?.title} />
                                </span> : null}
                        </CardTitle>

                        <CardText className="text-muted">{chapter?.description}</CardText>

                        <div id="accordion">
                            <div className="card border-0">
                                <div className="card-header" id={`heading${index}`}>
                                    <h5 className="mb-0">

                                        <Button block outline color="success" size="sm" index={index} onClick={() => { collapse(index); }} className={`d-flex justify-content-between ${(activeIndex === index || activeIndex === null) ? '' : 'collapsed'}`} data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded={(activeIndex === index || activeIndex === null)} aria-controls={`collapse${index}`}>

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

                    </Card>)
            }) :

            <Alert color="danger" className="d-flex justify-content-between" style={{ border: '1px solid var(--brand)' }}>
                <strong>No chapters yet for this course!</strong>
                {user?.role !== 'Visitor' ?
                    <AddModal
                        title="Add New Chapter"
                        triggerText="Chapter"
                        initialState={initialState}
                        submitFn={createFn}
                        renderForm={newForm}
                    /> : null}
            </Alert>
        }
    </div>);
};

export default ViewCourse;
