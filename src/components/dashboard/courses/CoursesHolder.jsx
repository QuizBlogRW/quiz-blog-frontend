import { Card, Button, CardTitle, CardText } from 'reactstrap'
import AddChapter from './AddChapter'
import EditCourseModal from './EditCourseModal'
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM'
import DeleteModal from '@/utils/DeleteModal'
import { deleteCourse } from '@/redux/slices/coursesSlice'
import { useSelector } from "react-redux"
import NotAuthenticated from "@/components/auth/NotAuthenticated";

const CoursesHolder = ({ courses }) => {

    const { user, isAuthenticated } = useSelector(state => state.auth)

    return (
        isAuthenticated ?
            courses.isByCatLoading ?

                <QBLoadingSM title='courses' /> :

                courses && courses.coursesByCategory.map(course => (
                    <Card key={course._id} className="mb-3" body outline color="warning">
                        <CardTitle tag="h5">{course.title}</CardTitle>
                        <CardText>{course.description}</CardText>

                        <div className="d-flex justify-content-between">
                            <Button className="view-course">
                                <a href={`/view-course/${course._id}`} className="text-white">View Notes</a>
                            </Button>

                            {user.role !== 'Visitor' ?
                                <span>
                                    <Button outline color="warning">
                                        <strong><AddChapter course={course} /></strong>
                                    </Button>

                                    <Button size="sm" color="link" className="mx-2">
                                        <EditCourseModal idToUpdate={course._id} editTitle={course.title} editDesc={course.description} />
                                    </Button>
                                    <DeleteModal deleteFnName="deleteCourse" deleteFn={deleteCourse} delID={course._id} delTitle={course.title} />
                                </span>
                                : null}
                        </div>

                    </Card>)) :
            <NotAuthenticated />
                    
    )
}

export default CoursesHolder