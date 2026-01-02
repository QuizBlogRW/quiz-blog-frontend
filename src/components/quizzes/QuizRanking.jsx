import { useEffect, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  BreadcrumbItem,
  Badge,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';

import { setRankingScores } from '@/redux/slices/scoresSlice';
import Dashboard from '../dashboard/Dashboard';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import AddVideo from '@/components/dashboard/quizzing/quizzes/AddVideo';
import ViewQuizComments from './ViewQuizComments';

const QuizRanking = () => {
  const dispatch = useDispatch();
  const { quizID } = useParams();

  const { rankingScores, isLoading } = useSelector((state) => state.scores);
  const { user } = useSelector((state) => state.users);

  // Fetch rankings on mount
  useEffect(() => {
    if (quizID) {
      dispatch(setRankingScores(quizID));
    }
  }, [dispatch, quizID]);

  // Memoize quiz metadata
  const quizMetadata = useMemo(() => {
    const firstRanking = rankingScores?.[0];
    return {
      categoryTitle: firstRanking?.category?.title || 'Category',
      quizTitle: firstRanking?.quiz?.title || 'Quiz',
      totalParticipants: rankingScores?.filter(r => r?.quiz?._id === quizID).length || 0,
    };
  }, [rankingScores, quizID]);

  // Filter and sort rankings
  const filteredRankings = useMemo(() => {
    if (!rankingScores || !quizID) return [];

    return rankingScores
      .filter((rank) => rank?.quiz?._id === quizID)
      .sort((a, b) => {
        // Sort by marks (descending), then by name (ascending)
        const marksA = a.marks / a.out_of;
        const marksB = b.marks / b.out_of;

        if (marksB !== marksA) {
          return marksB - marksA;
        }

        const nameA = a.taken_by?.name || 'Unknown';
        const nameB = b.taken_by?.name || 'Unknown';
        return nameA.localeCompare(nameB);
      });
  }, [rankingScores, quizID]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!filteredRankings.length) {
      return { average: 0, highest: 0, lowest: 0, passRate: 0 };
    }

    const percentages = filteredRankings.map(r => (r.marks / r.out_of) * 100);
    const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    const passRate = (percentages.filter(p => p >= 50).length / percentages.length) * 100;

    return {
      average: Math.round(average),
      highest: Math.round(highest),
      lowest: Math.round(lowest),
      passRate: Math.round(passRate),
    };
  }, [filteredRankings]);

  // Get rank badge color
  const getRankBadgeColor = useCallback((position) => {
    if (position === 1) return 'warning'; // Gold
    if (position === 2) return 'secondary'; // Silver
    if (position === 3) return 'danger'; // Bronze
    return 'light';
  }, []);

  // Get score badge color
  const getScoreBadgeColor = useCallback((marks, outOf) => {
    const percentage = (marks / outOf) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  }, []);

  // Render table rows
  const renderTableRows = useCallback(() => {
    if (!filteredRankings.length) {
      return (
        <tr>
          <td colSpan="5" className="text-center text-muted py-4">
            <i className="fa fa-inbox fa-2x mb-2 d-block"></i>
            No rankings available yet
          </td>
        </tr>
      );
    }

    return filteredRankings.map((rank, index) => {
      const position = index + 1;
      const percentage = Math.round((rank.marks / rank.out_of) * 100);
      const isCurrentUser = rank.taken_by?._id === user?._id;

      return (
        <tr
          key={rank._id || `rank-${index}`}
          className={isCurrentUser ? 'table-active' : ''}
          style={{
            backgroundColor: isCurrentUser ? '#f0f8ff' : 'transparent',
            fontWeight: isCurrentUser ? 'bold' : 'normal',
          }}
        >
          <th scope="row">
            <Badge
              color={getRankBadgeColor(position)}
              pill
              className="px-2"
            >
              {position <= 3 && (
                <i className={`fa fa-trophy me-1`}></i>
              )}
              #{position}
            </Badge>
          </th>
          <td>
            {rank.taken_by?.name || 'Anonymous'}
            {isCurrentUser && (
              <Badge color="info" className="ms-2" pill>You</Badge>
            )}
          </td>
          <td className="text-muted small">
            {rank.taken_by?.email || 'No email'}
          </td>
          <td>
            <Badge color={getScoreBadgeColor(rank.marks, rank.out_of)}>
              {rank.marks}/{rank.out_of}
            </Badge>
          </td>
          <td>
            <span className="fw-bold">{percentage}%</span>
          </td>
        </tr>
      );
    });
  }, [filteredRankings, user?._id, getRankBadgeColor, getScoreBadgeColor]);

  // Guard: Visitor role redirect
  if (user?.role === 'Visitor') {
    return <Dashboard />;
  }

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
        {filteredRankings.length > 0 && (
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
              {isLoading ? (
                <div className="p-5">
                  <QBLoadingSM />
                </div>
              ) : (
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
                  <tbody>{renderTableRows()}</tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default QuizRanking;
