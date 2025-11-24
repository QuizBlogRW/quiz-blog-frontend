import { useEffect, lazy } from 'react';
import { Col, Row, ListGroup, ListGroupItem, Badge, Card, CardBody, CardText } from 'reactstrap';
import uploadimage from '@/images/avatar.svg';
import { getPopularToday, getUserOfMonth } from '@/redux/slices/scoresSlice';
import { useSelector, useDispatch } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import ImageWithFallback from '@/utils/ImageWithFallback';

const SquareAd = lazy(() => import('@/components/adsenses/SquareAd'));

const Popular = () => {
    const dispatch = useDispatch();
    const { popularQuizzes, monthlyUser, isLoading } = useSelector(state => state.scores);

    useEffect(() => {
        dispatch(getPopularToday());
        dispatch(getUserOfMonth());
    }, [dispatch]);

    if (!popularQuizzes || popularQuizzes.length === 0 || !monthlyUser) return null;

    return (
        <>
            {/* Google square ad for mobile */}
            <Row className="d-block d-lg-none mb-3">
                <Col className="d-flex justify-content-center align-items-center">
                    <SquareAd />
                </Col>
            </Row>

            <div className="popular my-3 py-3 d-flex flex-column flex-lg-row justify-content-between bg-white shadow-sm rounded">
                {/* Popular Quizzes */}
                <div className="w-100 w-lg-75 mx-lg-2 mb-3 mb-lg-0">
                    <h6 className="text-uppercase fancy fw-bolder mb-3 mb-lg-4 text-center">
                        <u>Top 3 Popular Quizzes Today</u>
                    </h6>

                    {!isLoading ? (
                        <ListGroup flush>
                            {popularQuizzes.map((quiz, index) => (
                                <ListGroupItem
                                    tag="a"
                                    href={`/view-quiz/${quiz.slug}`}
                                    color="success"
                                    key={quiz._id || index}
                                    className="d-flex justify-content-between align-items-center"
                                    action
                                >
                                    <span>{index + 1}. {quiz.title?.toUpperCase()}</span>
                                    <Badge color="success" pill>{quiz.count}</Badge>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    ) : (
                        <QBLoadingSM title="popular quizzes today" />
                    )}
                </div>

                {/* User of the Month */}
                <div className="month-user w-100 w-lg-25 px-1 d-flex flex-column align-items-center">
                    <h6 className="text-uppercase fancy fw-bolder mb-3 mb-lg-4 text-center">
                        <u>User of the Month</u>
                    </h6>

                    <Card className="w-100 p-2 shadow-sm rounded text-center">
                        {/* Center the image */}
                        <div className="d-flex justify-content-center mb-2">
                            <ImageWithFallback
                                src={monthlyUser.uPhoto}
                                fallbackSrc={uploadimage}
                                alt="User of the Month"
                                className="rounded-circle"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        </div>
                        <hr className="my-2" />
                        <CardBody className="p-2">
                            <CardText>
                                <small className="text-muted fw-bold">{monthlyUser.uName}</small>
                            </CardText>
                        </CardBody>
                    </Card>
                </div>

            </div>
        </>
    );
};

export default Popular;
