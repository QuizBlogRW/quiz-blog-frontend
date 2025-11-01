import React from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Button, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { useSelector } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const ViewCategories = () => {

    const [openCategoryId, setOpenCategoryId] = React.useState(null);
    const toggle = (categoryId) => setOpenCategoryId(prev => prev === categoryId ? null : categoryId);
    const { allcategories, isLoading } = useSelector(state => state.categories);

    if (isLoading) return <QBLoadingSM title='categories' />
    else if (allcategories?.length > 0)
        return (
            allcategories.slice(0, 20)?.map(category =>
                category?.quizes && category?.quizes?.length > 1 ?
                    <React.Fragment key={category._id}>
                        <Button outline
                            id={category.title?.split(' ').join('-').replace(/[^a-zA-Z0-9]/g, '-')}
                            block
                            className="mt-2 mob-cat-btn d-flex align-items-center category-toggle"
                            onClick={() => toggle(category._id)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(category._id); }}
                            aria-expanded={openCategoryId === category._id}
                            aria-controls={`${category._id}-collapse`}
                        >

                            <small className='text-truncate text-uppercase fw-bolder'>
                                {category.title}
                            </small>
                            <i className={`fa-solid fa-chevron-${openCategoryId === category._id ? 'up' : 'down'} ms-auto`} aria-hidden="true"></i>
                        </Button>

                        <Collapse isOpen={openCategoryId === category._id} className="w-100 mt-2" id={`${category._id}-collapse`}>
                            <ListGroup>
                                {category.quizes?.map(quiz =>
                                    <ListGroupItem key={quiz._id} className="d-flex justify-content-between px-1">
                                        <Link to={`/view-quiz/${quiz.slug}`} className="m-0 text-capitalize mob-quiz quiz-link">
                                            {quiz.title}
                                        </Link>
                                        <Badge color="dark" className="ms-lg-2 quiz-count">{quiz.questions?.length > 30 ? '30' : quiz.questions?.length}</Badge>
                                    </ListGroupItem>
                                )}

                            </ListGroup>
                        </Collapse>
                    </React.Fragment> : null
            )
        )
};

export default ViewCategories;
