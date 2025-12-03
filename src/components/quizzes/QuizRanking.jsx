import { useEffect } from 'react';
import Dashboard from '../dashboard/Dashboard';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Table, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { setRankingScores } from '@/redux/slices/scoresSlice';
import { useSelector, useDispatch } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import AddVideo from '@/components/dashboard/quizzing/quizzes/AddVideo';
import ViewQuizComments from './ViewQuizComments';

const QuizRanking = () => {
  // Redux
  const dispatch = useDispatch();
  const scores = useSelector((state) => state.scores);
  const { user } = useSelector((state) => state.users);
  const { quizID } = useParams();

  useEffect(() => {
    dispatch(setRankingScores(quizID));
  }, [dispatch, quizID]);

  const rankings = scores?.rankingScores;
  const cTitle = rankings?.[0]?.category?.title;
  const title = rankings?.[0]?.quiz?.title;

  const renderTableRows = () => {
    let i = 1;
    return rankings?.map((rank) =>
      rank?.quiz?._id === quizID ? (
        <tr key={rank._id}>
          <th scope="row">{i++}</th>
          <td>{rank.taken_by?.name || 'No name'}</td>
          <td>{rank.taken_by?.email || 'No mail'}</td>
          <td>
            {rank.marks}/{rank.out_of}
          </td>
        </tr>
      ) : null
    );
  };

  return user?.role == 'Visitor' ?
    <Dashboard /> :
    <>
      <div className="mt-5 mx-5 single-category">
        <Row className="mb-0 mb-lg-3 mx-0 d-flex justify-content-around align-items-center">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/dashboard">{cTitle}</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              {title} - Comments & Ranking
            </BreadcrumbItem>
          </Breadcrumb>
          <AddVideo quizID={quizID} />
        </Row>
      </div>
      <Row className="mx-2 mx-lg-5">
        <Col sm="6" style={{ height: '95%' }} className="my-2 overflow-auto">
          <ViewQuizComments quizID={quizID} />
        </Col>

        <Col sm="6" style={{ height: '95%' }} className="my-2 overflow-auto">
          {scores.isLoading ?
            <QBLoadingSM /> :
            <Table hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Marks</th>
                </tr>
              </thead>

              <tbody>{renderTableRows()}</tbody>
            </Table>
          }
        </Col>
      </Row>
    </>
};

export default QuizRanking;
