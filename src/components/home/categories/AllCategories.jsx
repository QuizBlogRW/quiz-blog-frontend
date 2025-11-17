import { useEffect, useState } from 'react';
import { Row, Col, Toast, ToastBody, ToastHeader, TabPane, ListGroup, ListGroupItem } from 'reactstrap';
import SearchInput from '@/utils/SearchInput';
import { Link } from 'react-router-dom';
import { getQuizzes } from '@/redux/slices/quizzesSlice';
import { useDispatch, useSelector } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const AllCategories = () => {
    // Redux
    const dispatch = useDispatch();
    const quizzes = useSelector(state => state.quizzes);
    const categories = useSelector(state => state.categories);

    const [searchKeyC, setSearchKeyC] = useState('');
    const [searchKeyQ, setSearchKeyQ] = useState('');

    // Lifecycle methods
    useEffect(() => { dispatch(getQuizzes()); }, [dispatch]);

    const filterQuizzes = (quizzes, searchKey) => {
        return quizzes.filter(quiz => {
            if (searchKey === '') {
                return null;
            } else if (quiz.title.toLowerCase().includes(searchKey.toLowerCase())) {
                return quiz;
            }
            return null;
        });
    };

    const filterCategories = (categories, searchKey) => {
        return categories.filter(category => {
            if (searchKey === '') {
                return category;
            } else if (category.title.toLowerCase().includes(searchKey.toLowerCase())) {
                return category;
            }
            return null;
        });
    };

    return (
        <TabPane tabId="100">
            {categories.isLoading ? <QBLoadingSM title='categories' /> :
                <>
                    <Row className="mt-3">
                        {!quizzes.isLoading ?
                            <Col sm="6">
                                <SearchInput setSearchKey={setSearchKeyQ} placeholder=" Search quizzes here ...  " />
                            </Col> : null}
                        <Col sm="6">
                            <SearchInput setSearchKey={setSearchKeyC} placeholder=" Search categories here ...  " />
                        </Col>
                    </Row>

                    {/* Search quizzes */}
                    <Row>
                        <ListGroup>
                            {quizzes && filterQuizzes(quizzes.allQuizzes, searchKeyQ).map(quiz => (
                                <ListGroupItem key={quiz._id} tag="a" href={`/view-quiz/${quiz.slug}`}>
                                    {quiz.title}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Row>

                    {/* Search categories */}
                    <Row className="px-lg-5 pb-lg-5">
                        {categories && filterCategories(categories.allcategories, searchKeyC).map(category => (
                            category.quizes && category.quizes.length > 0 ?
                                <Col sm="6" key={category._id} className="mt-3 categories-toast" id={category.title.split(' ').join('-').replace(/[^a-zA-Z0-9]/g, '-') + category._id}>
                                    <Toast fade={false}>
                                        <ToastHeader className="text-success overflow-auto">
                                            <strong>
                                                <a href={`/all-categories/#${category.title.split(' ').join('-').replace(/[^a-zA-Z0-9]/g, '-') + category._id}`} className="text-success text-uppercase">
                                                    {category.title}
                                                </a>
                                            </strong>
                                        </ToastHeader>
                                        <ToastBody>
                                            <p className="mb-0">
                                                This category contains <span className="fw-bolder">{category.quizes.length}</span> quizzes</p>
                                            <small className="text-center">
                                                <b>{category.description}</b>
                                            </small>
                                            <p className="fw-bolder mt-2">Quizzes ({category.quizes.length})</p>
                                            <ul className="pl-1">
                                                {category && category.quizes.map((quiz, index) => {

                                                    const questionsCount = quiz.questions?.length;
                                                    const questionsText = questionsCount == 1 ? `1 - Question` : questionsCount > 1 ? `${questionsCount} - Questions` : 'No Questions';

                                                    return (
                                                        <li key={quiz._id} style={{ listStyle: 'none', marginBottom: '.3rem' }}>
                                                            {index + 1}.
                                                            &nbsp;
                                                            <Link to={`/view-quiz/${quiz.slug}`}>
                                                                {quiz.title}
                                                            </Link>
                                                            <strong className="text-warning">
                                                                &nbsp;
                                                                ({questionsText})
                                                            </strong>
                                                        </li>)
                                                }
                                                )}
                                            </ul>
                                        </ToastBody>
                                    </Toast>
                                </Col> : null
                        ))}
                    </Row>
                </>
            }
        </TabPane>
    );
};

export default AllCategories;