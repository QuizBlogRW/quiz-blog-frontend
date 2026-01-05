import { useEffect, useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Table, Breadcrumb, BreadcrumbItem, Badge, Card, CardHeader, CardBody } from 'reactstrap';
import { getRankingScores } from '@/redux/slices/scoresSlice';
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import NotAuthenticated from "@/components/users/NotAuthenticated";
import Unauthorized from "@/components/users/Unauthorized";
import AddVideo from '@/components/dashboard/quizzing/quizzes/AddVideo';
import ViewQuizComments from './ViewQuizComments';

const QuizRanking = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  const { quizID } = useParams();
  const thisQuiz = location.state;

  const { isLoading, rankingScores } = useSelector((state) => state.scores);
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const isAdmin = user?.role?.includes("Admin");

  // Fetch rankings on mount
  useEffect(() => {
    if (quizID) {
      dispatch(getRankingScores(quizID));
    }
  }, [dispatch, quizID]);

  // Memoize quiz metadata
  const quizMetadata = useMemo(() => {

    return {
      quizTitle: thisQuiz?.title || 'Quiz',
      categoryTitle: thisQuiz?.category?.title || 'Category',
      totalParticipants: rankingScores?.length || 0,
    };
  }, [rankingScores, quizID]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!rankingScores.length) {
      return null;
    }

    const percentages = rankingScores
      .filter(r => r.out_of > 0)
      .map(r => (r.marks / r.out_of) * 100);

    const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;

    return {
      participants: rankingScores.length,
      average: Math.round(avg),
      highest: Math.round(Math.max(...percentages)),
      lowest: Math.round(Math.min(...percentages)),
      passRate: Math.round(
        (percentages.filter(p => p >= 50).length / percentages.length) * 100
      )
    };
  }, [rankingScores]);

  const rankColor = pos =>
    pos === 1 ? 'warning' :
      pos === 2 ? 'secondary' :
        pos === 3 ? 'danger' :
          'light';

  const scoreColor = pct =>
    pct >= 80 ? 'success' :
      pct >= 50 ? 'warning' :
        'danger';

  // Guard: Visitor role redirect
  if (isLoading) return <QBLoadingSM />;
  if (!isAuthenticated) return <NotAuthenticated />;
  if (!isAdmin) return <Unauthorized />;

  return (
    <>
      <div className="mt-4 mx-3 mx-lg-5 single-category">
        <Row className="mb-3 mx-0 d-flex justify-content-between align-items-center">
          {/* Breadcrumb */}
          <Col xs="12" md="auto">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/dashboard">
                  <i className="fa fa-home me-1"></i>
                  {quizMetadata.categoryTitle}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>
                {quizMetadata.quizTitle}
              </BreadcrumbItem>
            </Breadcrumb>
          </Col>

          {/* Add Video Button */}
          <Col xs="12" md="auto" className="text-end">
            <AddVideo quizID={quizID} />
          </Col>
        </Row>

        {/* Statistics Cards */}
        {statistics && (
          <Row className="mb-4">
            <Col xs="6" md="3" className="mb-3 mb-md-0">
              <Card className="text-center border-0 shadow-sm">
                <CardBody className="py-3">
                  <small className="text-muted d-block">Participants</small>
                  <h4 className="mb-0 text-primary">
                    <i className="fa fa-users me-2"></i>
                    {quizMetadata.totalParticipants}
                  </h4>
                </CardBody>
              </Card>
            </Col>
            <Col xs="6" md="3" className="mb-3 mb-md-0">
              <Card className="text-center border-0 shadow-sm">
                <CardBody className="py-3">
                  <small className="text-muted d-block">Average Score</small>
                  <h4 className="mb-0 text-info">
                    <i className="fa fa-chart-line me-2"></i>
                    {statistics.average}%
                  </h4>
                </CardBody>
              </Card>
            </Col>
            <Col xs="6" md="3" className="mb-3 mb-md-0">
              <Card className="text-center border-0 shadow-sm">
                <CardBody className="py-3">
                  <small className="text-muted d-block">Highest Score</small>
                  <h4 className="mb-0 text-success">
                    <i className="fa fa-arrow-up me-2"></i>
                    {statistics.highest}%
                  </h4>
                </CardBody>
              </Card>
            </Col>
            <Col xs="6" md="3">
              <Card className="text-center border-0 shadow-sm">
                <CardBody className="py-3">
                  <small className="text-muted d-block">Pass Rate</small>
                  <h4 className="mb-0 text-warning">
                    <i className="fa fa-percent me-2"></i>
                    {statistics.passRate}%
                  </h4>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </div>

      {/* Main Content */}
      <Row className="mx-2 mx-lg-5 g-3">
        {/* Comments Section */}
        <Col lg="6" className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <CardHeader className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="fa fa-comments me-2 text-primary"></i>
                Comments
              </h5>
            </CardHeader>
            <CardBody
              className="overflow-auto"
              style={{ maxHeight: '600px' }}
            >
              <ViewQuizComments quizID={quizID} />
            </CardBody>
          </Card>
        </Col>

        {/* Rankings Section */}
        <Col lg="6" className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <CardHeader className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="fa fa-trophy me-2 text-warning"></i>
                Leaderboard
              </h5>
            </CardHeader>
            <CardBody
              className="overflow-auto p-0"
              style={{ maxHeight: '600px' }}
            >
              <Table hover responsive className="mb-0">
                <thead className="sticky-top bg-white">
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Score</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {!rankingScores.length ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        <i className="fa fa-inbox fa-2x mb-2 d-block"></i>
                        No rankings available yet
                      </td>
                    </tr>
                  ) : (
                    rankingScores.map((rank, i) => {
                      const pct = rank.out_of
                        ? Math.round((rank.marks / rank.out_of) * 100)
                        : 0;

                      const isMe = rank.taken_by?._id === user?._id;

                      return (
                        <tr key={rank.userId} className={isMe ? 'table-active' : ''}>
                          <td>
                            <Badge color={rankColor(i + 1)}>#{i + 1}</Badge>
                          </td>
                          <td>
                            {rank.taken_by?.name}
                            {isMe && <Badge color="info" pill className="ms-2">You</Badge>}
                          </td>
                          <td>{rank.taken_by?.email ?? '-'}</td>
                          <td>
                            <Badge color={scoreColor(pct)}>
                              {rank.marks}/{rank.out_of}
                            </Badge>
                          </td>
                          <td>{pct}%</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default QuizRanking;
