import { Card, Button, CardTitle, CardText, Input } from 'reactstrap';
import AddModal from '@/utils/AddModal';
import { createChapter } from '@/redux/slices/chaptersSlice';
import validators from '@/utils/validators';
import UpdateModal from '@/utils/UpdateModal';
import { updateCourse } from '@/redux/slices/coursesSlice';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import DeleteModal from '@/utils/DeleteModal';
import { deleteCourse } from '@/redux/slices/coursesSlice';
import { useSelector } from 'react-redux';
import { notify } from '@/utils/notifyToast';
import NotAuthenticated from '@/components/auth/NotAuthenticated';

const CoursesHolder = ({ courses }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    courses.isByCatLoading ? (
      <QBLoadingSM title="courses" />
    ) : (
      courses && courses.coursesByCategory.map((course) => (
        <Card key={course._id} className="my-3" body outline color="warning">
          <CardTitle tag="h5">{course.title}</CardTitle>
          <CardText>{course.description}</CardText>

          <div className="d-flex justify-content-between">
            <Button className="view-course">
              <a href={`/view-course/${course._id}`} className="text-white">
                View Notes
              </a>
            </Button>

            {user.role !== 'Visitor' ? (
              <>
                <AddModal
                  title="Add New Chapter"
                  triggerText="Chapter"
                  initialState={{
                    title: '',
                    description: '',
                    course: course._id,
                    courseCategory: course.courseCategory,
                  }}
                  submitFn={(data) => {
                    const { title, description } = data;
                    const res = validators.validateTitleDesc(
                      title,
                      description,
                      { minTitle: 4, minDesc: 4, maxTitle: 80, maxDesc: 200 }
                    );
                    if (!res.ok) {
                      notify('Insufficient info!', 'error');
                      return Promise.reject(new Error('validation'));
                    }
                    return createChapter({ ...data });
                  }}
                  renderForm={(state, setState, firstInputRef) => (
                    <>
                      <Input
                        ref={firstInputRef}
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Chapter title ..."
                        className="mb-3"
                        value={state.title || ''}
                        onChange={(e) =>
                          setState({ ...state, title: e.target.value })
                        }
                      />
                      <Input
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Chapter description ..."
                        className="mb-3"
                        value={state.description || ''}
                        onChange={(e) =>
                          setState({ ...state, description: e.target.value })
                        }
                      />
                    </>
                  )}
                />
                <UpdateModal
                  title="Edit Course"
                  initialData={{
                    idToUpdate: course._id,
                    name: course.title,
                    description: course.description,
                  }}
                  submitFn={(data) => {
                    const { name, description } = data;
                    const res = validators.validateTitleDesc(
                      name,
                      description,
                      { minTitle: 4, minDesc: 4, maxTitle: 80, maxDesc: 200 }
                    );
                    if (!res.ok) return Promise.reject(new Error('validation'));
                    return updateCourse({
                      idToUpdate: data.idToUpdate,
                      title: data.name,
                      description: data.description,
                    });
                  }}
                  renderForm={(state, setState, firstInputRef) => (
                    <>
                      <Input
                        ref={firstInputRef}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Course title ..."
                        className="mb-3"
                        value={state.name || ''}
                        onChange={(e) =>
                          setState({ ...state, name: e.target.value })
                        }
                      />
                      <Input
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Course description ..."
                        className="mb-3"
                        value={state.description || ''}
                        onChange={(e) =>
                          setState({ ...state, description: e.target.value })
                        }
                      />
                    </>
                  )}
                />
                <DeleteModal
                  deleteFnName="deleteCourse"
                  deleteFn={deleteCourse}
                  delID={course._id}
                  delTitle={course.title}
                />
              </>
            ) : null}
          </div>
        </Card>
      ))
    )
  ) : (
    <NotAuthenticated />
  );
};

export default CoursesHolder;
