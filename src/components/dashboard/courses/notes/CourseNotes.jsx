import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getNotesByChapter,
  deleteNotes,
  removeQzNt,
} from "@/redux/slices/notesSlice";
import { saveDownload } from "@/redux/slices/downloadsSlice";
import { useSelector, useDispatch } from "react-redux";
import img from "@/images/resourceImg.svg";
import DeleteIcon from "@/images/trash.svg";
import AddNotesModal from "./AddNotesModal";
import UpdateModal from "@/utils/UpdateModal";
import AddRelatedQuiz from "./AddRelatedQuiz";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from "reactstrap";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import DeleteModal from "@/utils/DeleteModal";

const CourseNotes = ({ chapter }) => {
  // Redux
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNotesByChapter(chapter?._id));
  }, [dispatch, chapter]);

  const { notesByChapter, isLoading } = useSelector((state) => state.notes);
  const { user } = useSelector((state) => state.auth);

  const onDownload = (note) => {
    const newDownload = {
      notes: note._id,
      chapter: note.chapter,
      course: note.course,
      courseCategory: note.courseCategory,
      downloaded_by: user ? user._id : null,
    };

    dispatch(saveDownload(newDownload));
  };

  return isLoading ? (
    <QBLoadingSM title="notes" />
  ) : (
    <>
      {user.role !== "Visitor" ? (
        <Row>
          {chapter ? (
            <Button
              size="sm"
              outline
              color="success"
              className="ms-auto me-1 mx-sm-auto my-2 add-notes-btn"
            >
              <strong>
                <AddNotesModal chapter={chapter} />
              </strong>
            </Button>
          ) : null}
        </Row>
      ) : null}
      {console.log("notesByChapter: ", notesByChapter)}
      <Row>
        {notesByChapter?.map((note, key) => (
          <Col
            key={note?._id ? note?._id : key}
            sm="12"
            className="mb-3 resouces-card c-notes"
          >
            <Card className="d-flex flex-row p-1 p-sm-4">
              <CardImg
                top
                width="12%"
                src={img}
                alt="Card image cap"
                className="pl-1"
              />
              <CardBody style={{ width: "77%" }}>
                <CardTitle
                  tag="h6"
                  className="text-success fw-bolder mb-1"
                  style={{ fontSize: ".7rem" }}
                >
                  {note?.title}
                </CardTitle>

                <CardSubtitle
                  tag="small"
                  className="mb-2 text-muted fw-bolder"
                  style={{ fontSize: ".6rem" }}
                >
                  {note?.courseCategory?.title}
                </CardSubtitle>

                <CardText className="mb-1">
                  <small>{note?.description}</small>
                  <br />
                  <i
                    className="fw-bolder text-success"
                    style={{ fontSize: ".5rem" }}
                  >
                    {note?.notes_file &&
                      note?.notes_file
                        .split("/")
                        .pop()
                        .replace(/%20|%5B|%5D/g, " ")}
                  </i>
                </CardText>

                {note?.quizzes && note?.quizzes.length > 0 ? (
                  <>
                    <h6
                      style={{
                        fontSize: ".7rem",
                        fontWeight: "bolder",
                        marginTop: "1rem",
                        color: "magenta",
                      }}
                    >
                      <u>RELATED QUIZZES</u>
                    </h6>

                    <ol style={{ fontSize: ".65rem" }}>
                      {note?.quizzes &&
                        note?.quizzes.map((qz, index) => (
                          <li key={qz && qz?._id ? qz?._id : index}>
                            <Link to={`/view-quiz/${qz && qz?.slug}`}>
                              {qz?.title}
                            </Link>

                            {user.role !== "Visitor" ? (
                              <Button
                                size="sm"
                                color="link"
                                className="ms-2"
                                onClick={() =>
                                  dispatch(removeQzNt(note?._id, qz && qz?._id))
                                }
                              >
                                <img
                                  src={DeleteIcon}
                                  alt=""
                                  width="10"
                                  height="10"
                                />
                              </Button>
                            ) : null}
                          </li>
                        ))}
                    </ol>
                  </>
                ) : null}

                <div className="d-flex">
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: "var(--accent)",
                      border: "2px solid var(--brand)",
                    }}
                  >
                    <a
                      href={note?.notes_file}
                      style={{ color: "var(--brand)", fontWeight: "bold" }}
                      onClick={() => onDownload(note)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </Button>

                  {user.role !== "Visitor" ? (
                    <>
                      <UpdateModal
                        title="Edit Notes"
                        initialData={{
                          idToUpdate: note?._id,
                          title: note?.title,
                          description: note?.description,
                        }}
                        submitFn={(data) => {
                          // data may include a File in notes_file
                          const { title, description, notes_file } = data;
                          const res = validators.validateTitleDesc(
                            title,
                            description,
                            {
                              minTitle: 4,
                              minDesc: 4,
                              maxTitle: 80,
                              maxDesc: 200,
                            }
                          );
                          if (!res.ok)
                            return Promise.reject(new Error("validation"));

                          const formData = new FormData();
                          formData.append("title", title);
                          formData.append("description", description);
                          if (notes_file)
                            formData.append("notes_file", notes_file);

                          return updateNotes({
                            idToUpdate: data.idToUpdate,
                            formData,
                          });
                        }}
                        renderForm={(state, setState, firstInputRef) => (
                          <>
                            <Input
                              ref={firstInputRef}
                              type="text"
                              name="title"
                              id="title"
                              placeholder="Notes title ..."
                              className="mb-3"
                              value={state.title || ""}
                              onChange={(e) =>
                                setState({ ...state, title: e.target.value })
                              }
                            />
                            <Input
                              type="text"
                              name="description"
                              id="description"
                              placeholder="Notes description ..."
                              className="mb-3"
                              value={state.description || ""}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  description: e.target.value,
                                })
                              }
                            />
                            <Input
                              bsSize="sm"
                              type="file"
                              accept=".pdf, .doc, .docx, .ppt, .pptx"
                              name="notes_file"
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  notes_file:
                                    e.target.files && e.target.files[0],
                                })
                              }
                              id="notes_file_pick"
                            />
                          </>
                        )}
                      />
                      <DeleteModal
                        deleteFnName="deleteNotes"
                        deleteFn={deleteNotes}
                        delID={note?._id}
                        delTitle={note?.title}
                      />
                      <AddRelatedQuiz
                        courseCategoryID={note?.courseCategory}
                        noteID={note?._id}
                      />
                    </>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CourseNotes;
