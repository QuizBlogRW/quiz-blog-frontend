import { useEffect } from "react";
import { Col, Card, Alert } from "reactstrap";
import { getPendingQnsComments } from "@/redux/slices/questionsCommentsSlice";
import { useSelector, useDispatch } from "react-redux";
import Comment from "./Comment";
import QBLoading from "@/utils/rLoading/QBLoadingSM";

const renderComments = (pendingComments) => (
  <>
    <h5 className="text-center w-100 my-4 fw-bolder">
      PENDING COMMENTS ({pendingComments.length})
    </h5>
    <Col sm={12} className="mt-2 comments-card">
      <Card body>
        {pendingComments.map((comment, i) => (
          <Comment comment={comment} isFromPending={true} key={i} />
        ))}
      </Card>
    </Col>
  </>
);

const renderNoComments = () => (
  <Alert color="success" className="w-100 text-center">
    Hooray, no comments yet! ...
  </Alert>
);

const PendingComments = () => {
  // Redux
  const dispatch = useDispatch();
  const { pendingQnsComments, isLoading } = useSelector(
    (state) => state.questionsComments
  );

  // Lifecycle methods
  useEffect(() => {
    dispatch(getPendingQnsComments());
  }, [dispatch]);
  return isLoading.pendingQnsComments ? (
    <QBLoading />
  ) : pendingQnsComments.length > 0 ? (
    renderComments(pendingQnsComments)
  ) : (
    renderNoComments()
  );
};

export default PendingComments;
