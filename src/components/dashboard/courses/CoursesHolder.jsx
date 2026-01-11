import { useMemo, useCallback } from 'react';
import { Card, Button, CardTitle, CardText, Input, FormGroup, Label } from 'reactstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AddModal from '@/utils/AddModal';
import UpdateModal from '@/utils/UpdateModal';
import DeleteModal from '@/utils/DeleteModal';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import NotAuthenticated from '@/components/users/NotAuthenticated';
import { createChapter } from '@/redux/slices/chaptersSlice';
import { updateCourse, deleteCourse } from '@/redux/slices/coursesSlice';
import validators from '@/utils/validators';
import { notify } from '@/utils/notifyToast';

// Constants
const VALIDATION_CONFIG = {
  minTitle: 4,
  minDesc: 4,
  maxTitle: 80,
  maxDesc: 200,
};

// Chapter Form Component
const ChapterForm = ({ state, setState, firstInputRef }) => (
  <>
    <FormGroup>
      <Label for="chapterTitle">Chapter Title</Label>
      <Input
        innerRef={firstInputRef}
        type="text"
        name="title"
        id="chapterTitle"
        placeholder="Enter chapter title"
        value={state.title || ''}
        onChange={(e) => setState({ ...state, title: e.target.value })}
        required
      />
    </FormGroup>
    <FormGroup>
      <Label for="chapterDescription">Chapter Description</Label>
      <Input
        type="textarea"
        name="description"
        id="chapterDescription"
        placeholder="Enter chapter description"
        value={state.description || ''}
        onChange={(e) => setState({ ...state, description: e.target.value })}
        rows="4"
        required
      />
    </FormGroup>
  </>
);

// Course Form Component
const CourseForm = ({ state, setState, firstInputRef, isUpdate = false }) => (
  <>
    <FormGroup>
      <Label for={isUpdate ? "courseName" : "courseTitle"}>Course Title</Label>
      <Input
        innerRef={firstInputRef}
        type="text"
        name={isUpdate ? "name" : "title"}
        id={isUpdate ? "courseName" : "courseTitle"}
        placeholder="Enter course title"
        value={isUpdate ? state.name || '' : state.title || ''}
        onChange={(e) =>
          setState({ ...state, [isUpdate ? 'name' : 'title']: e.target.value })
        }
        required
      />
    </FormGroup>
    <FormGroup>
      <Label for="courseDescription">Course Description</Label>
      <Input
        type="textarea"
        name="description"
        id="courseDescription"
        placeholder="Enter course description"
        value={state.description || ''}
        onChange={(e) => setState({ ...state, description: e.target.value })}
        rows="4"
        required
      />
    </FormGroup>
  </>
);

// Course Action Buttons Component
const CourseActions = ({
  course,
  canEdit,
  onCreateChapter,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  if (!canEdit) return null;

  return (
    <div className="d-flex gap-2 flex-wrap">
      <AddModal
        title="Add New Chapter"
        triggerText="Chapter"
        initialState={{
          title: '',
          description: '',
        }}
        submitFn={onCreateChapter}
        renderForm={(state, setState, ref) => (
          <ChapterForm state={state} setState={setState} firstInputRef={ref} />
        )}
      />
      <UpdateModal
        title="Edit Course"
        triggerText="Edit"
        initialUpdateData={{
          idToUpdate: course._id,
          name: course.title,
          description: course.description,
        }}
        submitFn={onUpdateCourse}
        renderForm={(state, setState, ref) => (
          <CourseForm
            state={state}
            setState={setState}
            firstInputRef={ref}
            isUpdate
          />
        )}
      />
      <DeleteModal
        deleteFnName="deleteCourse"
        deleteFn={onDeleteCourse}
        delID={course._id}
        delTitle={course.title}
      />
    </div>
  );
};

// Individual Course Card Component
const CourseCard = ({ course, canEdit, userId }) => {
  // Validate and create chapter
  const handleCreateChapter = useCallback(
    (formData) => {
      const { title, description } = formData;
      const validation = validators.validateTitleDesc(
        title,
        description,
        VALIDATION_CONFIG
      );

      if (!validation.ok) {
        notify('Insufficient info! Please check title and description.', 'error');
        return Promise.reject(new Error('validation'));
      }

      return createChapter({
        ...formData,
        course: course._id,
        courseCategory: course.courseCategory,
        created_by: userId,
      });
    },
    [course._id, course.courseCategory, userId]
  );

  // Validate and update course
  const handleUpdateCourse = useCallback((data) => {
    const { name, description } = data;
    const validation = validators.validateTitleDesc(
      name,
      description,
      VALIDATION_CONFIG
    );

    if (!validation.ok) {
      notify('Insufficient info! Please check title and description.', 'error');
      return Promise.reject(new Error('validation'));
    }

    return updateCourse({
      idToUpdate: data.idToUpdate,
      title: name,
      description,
    });
  }, []);

  // Handle course deletion
  const handleDeleteCourse = useCallback(() => {
    return deleteCourse(course._id);
  }, [course._id]);

  return (
    <Card
      className="course-card my-3 shadow-sm"
      body
      outline
      color="warning"
      role="article"
      aria-label={`Course: ${course.title}`}
    >
      <CardTitle tag="h3" className="h5 mb-3">
        {course.title}
      </CardTitle>
      <CardText className="text-muted mb-4">
        {course.description}
      </CardText>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <Button
          color="primary"
          tag={Link}
          to={`/view-course/${course._id}`}
          className="view-course-btn"
          aria-label={`View notes for ${course.title}`}
        >
          View Notes
        </Button>

        <CourseActions
          course={course}
          canEdit={canEdit}
          onCreateChapter={handleCreateChapter}
          onUpdateCourse={handleUpdateCourse}
          onDeleteCourse={handleDeleteCourse}
        />
      </div>
    </Card>
  );
};

// Main Component
const CoursesHolder = () => {
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const { isLoading, coursesByCategory } = useSelector((state) => state.courses);

  // Determine if user can edit
  const canEdit = useMemo(
    () => isAuthenticated && user?.role !== 'Visitor',
    [isAuthenticated, user?.role]
  );

  // Early returns for loading and auth states
  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  if (isLoading) {
    return <QBLoadingSM title="courses" />;
  }

  // Handle empty state
  if (!coursesByCategory || coursesByCategory.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No courses available in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="courses-holder" role="feed" aria-label="Course list">
      {coursesByCategory.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          canEdit={canEdit}
          userId={user?._id}
        />
      ))}
    </div>
  );
};

export default CoursesHolder;
