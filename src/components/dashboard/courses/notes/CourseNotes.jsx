import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText, Button, Input } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getNotesByChapter, deleteNotes, removeQuizFromNotes, updateNotes } from '@/redux/slices/notesSlice';
import { saveDownload } from '@/redux/slices/downloadsSlice';
import AddRelatedQuiz from './AddRelatedQuiz';
import UpdateModal from '@/utils/UpdateModal';
import DeleteModal from '@/utils/DeleteModal';
import AddNotesModal from './AddNotesModal';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import validators from '@/utils/validators';
import DeleteIcon from '@/images/trash.svg';
import Unauthorized from "@/components/users/Unauthorized";
import NotAuthenticated from "@/components/users/NotAuthenticated";

const CourseNotes = ({ chapter }) => {

  const dispatch = useDispatch();
  const { notesByChapter, isLoading } = useSelector((state) => state.notes);
  const { user, isAuthenticated } = useSelector(state => state.users);

  const isVisitor = useMemo(() => user?.role === "Visitor", [user?.role]);

  useEffect(() => {
    if (chapter?._id) dispatch(getNotesByChapter(chapter._id));
  }, [chapter, dispatch]);

  const handleDownload = (note) => {
    dispatch(
      saveDownload({
        notes: note._id,
        chapter: note.chapter,
        course: note.course,
        courseCategory: note.courseCategory,
        downloaded_by: user?._id
      })
    );
  };

  const updateFn = (data) => {
    const { title, description, notes_file } = data;
    const res = validators.validateTitleDesc(
      title,
      description,
      { minTitle: 4, minDesc: 4, maxTitle: 80, maxDesc: 200 }
    );
    if (!res.ok) return Promise.reject("validation");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (notes_file) formData.append("notes_file", notes_file);

    return updateNotes({
      idToUpdate: data.idToUpdate,
      formData,
    });
  }
  const updateForm = (state, setState, firstInputRef) => (
    <>
      <Input
        innerRef={firstInputRef}
        type="text"
        id="title"
        placeholder="Notes title..."
        className="mb-3"
        value={state.title}
        onChange={(e) => setState({ ...state, title: e.target.value })}
      />
      <Input
        type="text"
        id="description"
        placeholder="Notes description..."
        className="mb-3"
        value={state.description}
        onChange={(e) =>
          setState({ ...state, description: e.target.value })
        }
      />
      <Input
        bsSize="sm"
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        onChange={(e) =>
          setState({
            ...state,
            notes_file: e.target.files?.[0],
          })
        }
      />
    </>
  )

  if (isLoading) return <QBLoadingSM title="notes" />
  if (!isAuthenticated) return <NotAuthenticated />
  if (isVisitor) return <Unauthorized />

  return (
    <>
      {<AddNotesModal chapter={chapter} />}

      <Row className='mt-lg-3'>
        {notesByChapter?.map((note) => {

          const initialUpdateData = { idToUpdate: note._id, title: note.title, description: note.description };

          return (
            <Col sm="12" key={note._id} className="mb-3">
              <Card className="p-sm-4 p-2 d-flex flex-column flex-sm-row">

                <CardBody className="flex-grow-1">

                  {/* Title */}
                  <CardTitle tag="h6" className="text-success fw-bold mb-1 small">
                    {note.title}
                  </CardTitle>

                  {/* Category */}
                  <CardSubtitle tag="small" className="text-muted fw-bold mb-2">
                    {note?.courseCategory?.title}
                  </CardSubtitle>

                  {/* Description + filename */}
                  <CardText className="mb-1">
                    <small>{note?.description}</small>
                    <br />
                    {note?.notes_file && (
                      <i className="fw-bold text-success small">
                        {decodeURIComponent(
                          note.notes_file.split("/").pop()
                        )}
                      </i>
                    )}
                  </CardText>

                  {/* Related quizzes */}
                  {note?.quizes?.length > 0 && (
                    <>
                      <h6 className="fw-bold mt-3" style={{ color: "magenta", fontSize: ".75rem" }}>
                        <u>RELATED QUIZZES</u>
                      </h6>

                      <ol className="small">
                        {note.quizes.map((qz) => (
                          <li key={qz._id}>
                            <Link to={`/view-quiz/${qz.slug}`}>
                              {qz.title}
                            </Link>

                            {!isVisitor && (
                              <Button
                                size="sm"
                                color="link"
                                className="ms-2 p-0"
                                onClick={() =>
                                  dispatch(
                                    removeQuizFromNotes({
                                      noteID: note._id,
                                      quizID: qz._id
                                    })
                                  )
                                }
                              >
                                <img src={DeleteIcon} alt="" width="10" height="10" />
                              </Button>
                            )}
                          </li>
                        ))}
                      </ol>
                    </>
                  )}

                  {/* Actions */}
                  <div className="d-flex flex-wrap gap-2 mt-2">

                    <Button
                      size="sm"
                      tag="a"
                      href={note?.notes_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleDownload(note)}
                      style={{
                        backgroundColor: 'var(--accent)',
                        border: '2px solid var(--brand)',
                        color: 'var(--brand)',
                        fontWeight: 'bold'
                      }}
                    >
                      Download
                    </Button>

                    {!isVisitor && (
                      <>
                        {/* Update */}
                        <UpdateModal
                          title="Edit Notes"
                          initialUpdateData={initialUpdateData}
                          submitFn={updateFn}
                          renderForm={updateForm}
                        />

                        {/* Delete */}
                        <DeleteModal
                          deleteFnName="deleteNotes"
                          deleteFn={deleteNotes}
                          delID={note._id}
                          delTitle={note.title}
                        />

                        {/* Add quiz */}
                        <AddRelatedQuiz note={note} />
                      </>
                    )}
                  </div>
                </CardBody>

              </Card>
            </Col>
          )
        })}
      </Row>
    </>
  );
};

export default CourseNotes;
