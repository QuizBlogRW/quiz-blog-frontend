import React, { useContext } from 'react';
import { Card, Button, CardTitle, CardText } from 'reactstrap'
import { deleteCourse } from '../../redux/courses/courses.actions';
import LoginModal from '../auth/LoginModal'
import DeleteIcon from '../../images/remove.svg';
import AddChapter from './AddChapter'
import EditCourseModal from './EditCourseModal'
import { connect } from 'react-redux';
import SpinningBubbles from '../rLoading/SpinningBubbles';
import { authContext } from '../../appContexts';

const CoursesHolder = ({ courses, deleteCourse }) => {

    // context
    const auth = useContext(authContext);

    return (

        auth.isAuthenticated ?

            courses.isByCatLoading ?

                <SpinningBubbles title='courses' />:

                courses && courses.coursesByCategory.map(course => (
                    <Card key={course._id} className="mb-3" body outline color="warning">
                        <CardTitle tag="h5">{course.title}</CardTitle>
                        <CardText>{course.description}</CardText>

                        <div className="d-flex justify-content-between">
                            <Button className="view-course">
                                <a href={`/view-course/${course._id}`} className="text-white">View Notes</a>
                            </Button>

                            {auth.user.role !== 'Visitor' ?
                                <span>
                                    <Button outline color="warning">
                                        <strong><AddChapter course={course} /></strong>
                                    </Button>

                                    <Button size="sm" color="link" className="mx-2">
                                        <EditCourseModal idToUpdate={course._id} editTitle={course.title} editDesc={course.description} />
                                    </Button>

                                    <Button size="sm" color="link" className="mr-2" onClick={() => deleteCourse(course._id)}>
                                        <img src={DeleteIcon} alt="" width="16" height="16" />
                                    </Button>
                                </span>
                                : null}
                        </div>

                    </Card>)) :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                }
            </div>
    );
};


export default connect(null, { deleteCourse })(CoursesHolder);