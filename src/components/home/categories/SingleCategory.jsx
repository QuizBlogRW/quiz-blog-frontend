import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import NotAuthenticated from '@/components/users/NotAuthenticated';

const SingleCategory = () => {
    const { isLoading, allcategories } = useSelector(state => state.categories);
    const { isAuthenticated } = useSelector(state => state.users);
    const { categoryId } = useParams();

    if (!isAuthenticated) return <NotAuthenticated />;
    if (isLoading) return <QBLoadingSM title="category" />;

    const category = allcategories?.find(c => c._id === categoryId);
    if (!category) return null;

    const makeAnchorId = (cat) =>
        `${cat.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')}-${cat._id}`;

    const anchorId = makeAnchorId(category);

    return (
        <div className="my-3 my-lg-5 mx-3 mx-lg-5 single-category">

            {/* Breadcrumb */}
            <Row className="justify-content-center mb-2">
                <Breadcrumb className="bg-transparent mb-0">
                    <BreadcrumbItem>
                        <Link to="/dashboard" className="text-success fw-semibold">
                            {category.title}
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active className="text-muted">
                        Quizzes
                    </BreadcrumbItem>
                </Breadcrumb>
            </Row>

            {/* Description */}
            <p className="text-center text-muted fst-italic mb-4 px-3">
                {category.description}
            </p>

            {/* Category Card */}
            <Row className="justify-content-center">
                <Col sm="12" lg="10" id={anchorId}>
                    <Card className="shadow-sm border-0">

                        <CardHeader className="bg-white border-bottom-0">
                            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
                                <a
                                    href={`/all-categories/#${anchorId}`}
                                    className="text-dark text-uppercase fw-bold text-decoration-none"
                                >
                                    {category.title}
                                </a>
                                <small className="text-muted mt-1 mt-lg-0">
                                    {category.quizes?.length} quiz
                                    {category.quizes?.length !== 1 && 'zes'}
                                </small>
                            </div>
                        </CardHeader>

                        <CardBody>
                            {category.quizes?.length === 0 && (
                                <p className="text-muted text-center">
                                    No quizzes available in this category yet.
                                </p>
                            )}

                            <ul className="list-unstyled">
                                {category.quizes?.map((quiz, index) => {
                                    const count = quiz.questions?.length || 0;

                                    return (
                                        <li
                                            key={quiz._id}
                                            className="d-flex justify-content-between align-items-center py-2 border-bottom"
                                        >
                                            <div>
                                                <span className="me-2 text-muted">
                                                    {index + 1}.
                                                </span>
                                                <Link
                                                    to={`/view-quiz/${quiz.slug}`}
                                                    className="fw-semibold text-decoration-none text-success"
                                                >
                                                    {quiz.title}
                                                </Link>
                                            </div>

                                            <small className="text-warning">
                                                {count === 0
                                                    ? 'No questions'
                                                    : `${count} question${count > 1 ? 's' : ''}`}
                                            </small>
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardBody>

                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SingleCategory;
