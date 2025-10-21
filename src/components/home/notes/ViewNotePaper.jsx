import { useEffect, lazy, Suspense, useContext } from "react";
import {
  Container,
  Col,
  Row,
  Card,
  Button,
  CardTitle,
  CardText,
} from "reactstrap";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { getOneNotePaper } from "@/redux/slices/notesSlice";
import { saveDownload } from "@/redux/slices/downloadsSlice";
import { useSelector, useDispatch } from "react-redux";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import { logRegContext } from "@/contexts/appContexts";

const GridMultiplex = lazy(() => import("@/components/adsenses/GridMultiplex"));

const ViewNotePaper = () => {
  // Access route parameters
  const { noteSlug } = useParams();

  // Redux
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOneNotePaper(noteSlug));
  }, [dispatch, noteSlug]);

  const noteDownload = useSelector((state) => state.notes);
  console.log("noteDownload: ", noteDownload);
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const { toggleL } = useContext(logRegContext);

  const {
    title,
    description,
    courseCategory,
    course,
    chapter,
    notes_file,
    createdAt,
  } = noteDownload.oneNotePaper;

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

  return noteDownload.isOneNotePaperLoading ? (
    <QBLoadingSM />
  ) : notes_file && notes_file ? (
    <main
      aria-label="Note paper"
      className="main mx-auto d-flex flex-column justify-content-center my-5 py-4"
    >
      <article className="mx-auto w-100 w-md-75 rounded border border-primary p-3">
        <div className="question-view p-2">
          <Row>
            <Col>
              <Card body className="question-section text-center my-2 mx-auto">
                <CardTitle
                  tag="h1"
                  className="note-title text-uppercase text-center fw-bolder mb-3"
                >
                  {title}
                </CardTitle>

                <CardText className="mb-2">{description}</CardText>

                <time
                  dateTime={createdAt}
                  className="d-block text-center text-success fw-bolder mb-2"
                >
                  {moment(new Date(createdAt)).format("DD MMM YYYY, HH:mm")}
                </time>

                {!isAuthenticated ? (
                  <div className="d-flex justify-content-center align-items-center text-danger">
                    {isLoading ? (
                      <QBLoadingSM />
                    ) : (
                      <Button
                        className="header-cta mt-3"
                        onClick={toggleL}
                        aria-label="Login to download"
                      >
                        Login to download
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="answer d-flex justify-content-center flex-wrap gap-2 mx-auto mt-2">
                    <a
                      href={notes_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open notes file in new tab"
                    >
                      <Button
                        className="header-cta"
                        onClick={() =>
                          onDownload(noteDownload && noteDownload.oneNotePaper)
                        }
                        aria-label="Download notes"
                      >
                        Download
                      </Button>
                    </a>
                    <Button
                      className="header-cta"
                      onClick={() => (window.location.href = "/")}
                      aria-label="Back to home"
                    >
                      Back
                    </Button>
                  </div>
                )}

                <p className="note-meta mt-3 text-center text-muted">
                  {courseCategory && courseCategory.title} &middot;{" "}
                  {course && course.title} &middot; {chapter && chapter.title}
                </p>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col sm="12">
              <Suspense fallback={<QBLoadingSM />}>
                {process.env.NODE_ENV !== "development" ? (
                  <GridMultiplex />
                ) : null}
              </Suspense>
            </Col>
          </Row>
        </div>
      </article>
    </main>
  ) : (
    <div className="pt-5 d-flex justify-content-center align-items-center flex-column">
      <h4 className="mb-3">This file is unavailable!</h4>
      <Link to={"/"}>
        <Button
          className="btn btn-outline-primary mt-3"
          aria-label="Go back to home"
        >
          Go back
        </Button>
      </Link>
    </div>
  );
};

export default ViewNotePaper;
