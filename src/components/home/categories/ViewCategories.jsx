import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Button, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { useSelector } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const ViewCategories = () => {
    
    const [openCategoryId, setOpenCategoryId] = useState(null);
    const { allcategories, isLoading } = useSelector(state => state.categories);

    const toggleCategory = (id) => {
        setOpenCategoryId(prev => (prev === id ? null : id));
    };

    if (isLoading) return <QBLoadingSM title="categories" />;
    if (!allcategories || allcategories.length === 0) return null;

    return (
        <>
            {allcategories.slice(0, 20).map(category => (
                category?.quizes?.length > 1 && (
                    <React.Fragment key={category._id}>
                        <Button
                            outline
                            id={category.title?.split(' ').join('-').replace(/[^a-zA-Z0-9]/g, '-')}
                            block
                            className="mt-2 mob-cat-btn d-flex align-items-center category-toggle"
                            onClick={() => toggleCategory(category._id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') toggleCategory(category._id);
                            }}
                            aria-expanded={openCategoryId === category._id}
                            aria-controls={`${category._id}-collapse`}
                        >
                            <small className="text-truncate text-uppercase fw-bolder">{category.title}</small>
                            <i
                                className={`fa-solid fa-chevron-${openCategoryId === category._id ? 'up' : 'down'} ms-auto`}
                                aria-hidden="true"
                            ></i>
                        </Button>

                        <Collapse isOpen={openCategoryId === category._id} className="w-100 mt-2" id={`${category._id}-collapse`}>
                            <ListGroup flush>
                                {category.quizes.map(quiz => (
                                    <ListGroupItem key={quiz._id} className="d-flex justify-content-between align-items-center px-2 py-1">
                                        <Link
                                            to={`/view-quiz/${quiz.slug}`}
                                            className="m-0 text-capitalize mob-quiz quiz-link text-truncate"
                                            title={quiz.title}
                                        >
                                            {quiz.title}
                                        </Link>
                                        <Badge color="dark" pill>
                                            {quiz.questions?.length > 30 ? '30+' : quiz.questions?.length || 0}
                                        </Badge>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </Collapse>
                    </React.Fragment>
                )
            ))}
        </>
    );
};

export default ViewCategories;
