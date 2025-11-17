import { useState, useEffect } from 'react';
import { Col, Row, TabPane, Card, Alert, ListGroup, Button } from 'reactstrap';
import {
  getAllQuestionsComments,
  getPaginatedQuestionsComments,
} from '@/redux/slices/questionsCommentsSlice';
import { getAllQuizzesComments } from '@/redux/slices/quizzesCommentsSlice';
import { useSelector, useDispatch } from 'react-redux';
import PendingComments from './PendingComments';
import SearchInput from '@/utils/SearchInput';
import Pagination from '@/components/dashboard/utils/Pagination';
import PageOf from '@/components/dashboard/utils/PageOf';
import QBLoading from '@/utils/rLoading/QBLoadingSM';
import Comment from './Comment';

const CommentsTabPane = () => {
  // Local state
  const [pageNo, setPageNo] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyQ, setSearchKeyQ] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { allQuizzesComments } = useSelector((state) => state.quizzesComments);
  const { allQuestionsComments, paginatedQuestionsComments, isLoading } =
    useSelector((state) => state.questionsComments);

  // Lifecycle methods
  useEffect(() => {
    dispatch(getAllQuestionsComments());
    dispatch(getAllQuizzesComments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPaginatedQuestionsComments(pageNo));
  }, [dispatch, pageNo]);

  const totPages =
    paginatedQuestionsComments && paginatedQuestionsComments.totalPages;
  useEffect(() => {
    setNumberOfPages(totPages);
  }, [totPages]);

  const filteredQuestionsComments = filterComments(
    allQuestionsComments,
    searchKeyQ
  );
  const filteredQuizComments = filterComments(allQuizzesComments, searchKey);

  return (
    <TabPane tabId="9">
      <Row>
        <PendingComments />
      </Row>
      <Row>
        {isLoading?.paginatedQuestionsComments ? (
          <QBLoading />
        ) : paginatedQuestionsComments?.paginatedQuestionsComments?.length ===
          0 ? (
          <Alert color="danger" className="w-100 text-center my-3">
            Comments not listed yet...
          </Alert>
        ) : (
          <>
            {user?.role?.includes('Admin') && (
              <PageOf pageNo={pageNo} numberOfPages={numberOfPages} />
            )}
            {renderSearchBars(setSearchKeyQ, setSearchKey)}
            <Row>
              <ListGroup>
                {filteredQuestionsComments.map((cmnt) => (
                  <Comment comment={cmnt} key={cmnt._id} />
                ))}
              </ListGroup>
            </Row>
            <Row>
              <ListGroup>
                {filteredQuizComments.map((cmnt) => (
                  <Comment comment={cmnt} key={cmnt._id} />
                ))}
              </ListGroup>
            </Row>
            <Row>
              <Col sm={12} className="mt-2 comments-card">
                <Card body>
                  {paginatedQuestionsComments?.paginatedQuestionsComments?.map(
                    (comment, i) => (
                      <Comment comment={comment} key={i} />
                    )
                  )}
                  {renderShowAllButton(showAll, setShowAll, allQuizzesComments)}
                </Card>
              </Col>
            </Row>
            {user?.role !== 'Visitor' && (
              <Pagination
                pageNo={pageNo}
                setPageNo={setPageNo}
                numberOfPages={numberOfPages}
              />
            )}
          </>
        )}
      </Row>
    </TabPane>
  );
};

const filterComments = (comments, searchKey) => {
  return (
    comments &&
    comments.filter((cmnt) =>
      searchKey === ''
        ? false
        : cmnt.comment.toLowerCase().includes(searchKey.toLowerCase())
    )
  );
};

const renderSearchBars = (setSearchKeyQ, setSearchKey) => {
  return (
    <Row className="mt-0 w-100">
      <Col sm="6">
        <SearchInput
          setSearchKey={setSearchKeyQ}
          placeholder=" Search question comments here ...  "
        />
      </Col>
      <Col sm="6">
        <SearchInput
          setSearchKey={setSearchKey}
          placeholder=" Search quiz comments here ...  "
        />
      </Col>
    </Row>
  );
};

const renderShowAllButton = (showAll, setShowAll, allQuizzesComments) => {
  return (
    <>
      {allQuizzesComments.length > 0 &&
        allQuizzesComments.map(
          (comment, i) => showAll && <Comment comment={comment} key={i} />
        )}
      <Button
        color="warning"
        outline
        className="mt-2 mx-auto d-block text-success text-uppercase fw-bolder"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? 'Hide' : 'Show'} all old quizzes comments
      </Button>
    </>
  );
};

export default CommentsTabPane;
