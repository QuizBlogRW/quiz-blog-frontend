import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, TabPane, ListGroup, ListGroupItem, Alert } from 'reactstrap';

import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import SearchInput from '@/utils/SearchInput';
import Pagination from '@/components/dashboard/utils/Pagination';
import PageOf from '@/components/dashboard/utils/PageOf';
import QuizToast from './QuizToast';

import { getQuestions } from '@/redux/slices/questionsSlice';
import { getPaginatedQuizzes, getQuizzes } from '@/redux/slices/quizzesSlice';

const QuizzesTabPane = () => {
  const dispatch = useDispatch();

  // -----------------------------
  // Redux state
  // -----------------------------
  const { user } = useSelector((state) => state.users);
  const categories = useSelector((state) => state.categories);

  const {
    isLoading: quizzesLoading,
    loadingPaginated,
    quizzes,
    paginatedQuizzes,
    totalPages,
  } = useSelector((state) => state.quizzes);

  const {
    isLoading: questionsLoading,
    questionsData,
  } = useSelector((state) => state.questions);

  // -----------------------------
  // Local state
  // -----------------------------
  const [pageNo, setPageNo] = useState(1);
  const [quizSearch, setQuizSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');

  // -----------------------------
  // Role helpers
  // -----------------------------
  const isAdmin = user?.role?.includes('Admin');
  const isVisitor = user?.role === 'Visitor';

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => {
    dispatch(getQuizzes());
    dispatch(getQuestions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPaginatedQuizzes({ pageNo }));
  }, [dispatch, pageNo]);

  // -----------------------------
  // Derived data (memoized)
  // -----------------------------
  const quizzesToUse = useMemo(() => {
    if (!paginatedQuizzes) return [];
    if (isAdmin) return paginatedQuizzes;

    return paginatedQuizzes.filter(
      (quiz) => quiz.created_by?._id === user?._id
    );
  }, [paginatedQuizzes, isAdmin, user?._id]);

  const questionsToUse = useMemo(() => {
    if (!questionsData) return [];
    if (isAdmin) return questionsData;

    return questionsData.filter(
      (question) => question.created_by?._id === user?._id
    );
  }, [questionsData, isAdmin, user?._id]);

  const filteredQuizzes = useMemo(() => {
    if (!quizSearch) return [];
    return quizzes?.filter((quiz) =>
      quiz.title.toLowerCase().includes(quizSearch.toLowerCase())
    );
  }, [quizzes, quizSearch]);

  const filteredQuestions = useMemo(() => {
    if (!questionSearch) return [];
    return questionsToUse.filter((question) =>
      question.questionText
        .toLowerCase()
        .includes(questionSearch.toLowerCase())
    );
  }, [questionsToUse, questionSearch]);

  // -----------------------------
  // Loading & empty states
  // -----------------------------
  if (loadingPaginated) {
    return (
      <TabPane tabId="2">
        <QBLoadingSM title="paginated quizzes" />
      </TabPane>
    );
  }

  if (!quizzesToUse.length) {
    return (
      <TabPane tabId="2">
        <Alert
          color="danger"
          className="w-50 text-center mx-auto"
          style={{ border: '2px solid var(--brand)' }}
        >
          You have not created any quiz yet!
        </Alert>
      </TabPane>
    );
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <TabPane tabId="2">
      {isAdmin && (
        <PageOf pageNo={pageNo} numberOfPages={totalPages} />
      )}

      {(quizzesLoading || questionsLoading) ? (
        <div className="p-1 m-1 d-flex justify-content-center">
          <QBLoadingSM />
        </div>
      ) : (
        <Row>
          <Col sm="6">
            <SearchInput
              setSearchKey={setQuizSearch}
              placeholder="Search quizzes here..."
            />
          </Col>
          <Col sm="6">
            <SearchInput
              setSearchKey={setQuestionSearch}
              placeholder="Search questions here..."
            />
          </Col>
        </Row>
      )}

      {/* Question search results */}
      {questionSearch && (
        <Row>
          <ListGroup>
            {filteredQuestions.map((question) => (
              <ListGroupItem
                key={question._id}
                tag="a"
                href={`/view-question/${question._id}`}
              >
                {question.questionText}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Row>
      )}

      {/* Quiz search results OR paginated list */}
      <Row>
        {(quizSearch ? filteredQuizzes : quizzesToUse).map((quiz) => (
          <QuizToast
            key={quiz._id}
            quiz={quiz}
            categories={categories}
            fromSearch={Boolean(quizSearch)}
          />
        ))}
      </Row>

      {!isVisitor && (
        <Pagination
          pageNo={pageNo}
          setPageNo={setPageNo}
          numberOfPages={totalPages}
        />
      )}
    </TabPane>
  );
};

export default QuizzesTabPane;
