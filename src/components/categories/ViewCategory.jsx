import React from 'react';
import { Link } from "react-router-dom";
import { UncontrolledCollapse, Button, ListGroup, ListGroupItem, Badge } from 'reactstrap';

const ViewCategory = ({ categories }) => {

    const [isOpen, setIsOpen] = React.useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        categories && categories.allcategories.slice(0, 20).map(category =>

            category.quizes.length > 1 ?

                <React.Fragment key={category._id}>
                    <Button outline
                        id={category.title.split(' ').join('-').replace(/[^a-zA-Z0-9]/g, '-')} block
                        className="mt-2 mob-cat-btn d-flex align-items-center" onClick={toggle}>

                        <small className='text-truncate text-uppercase fw-bolder'>
                            {category.title}
                        </small>
                        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} ms-auto`}></i>
                    </Button>

                    <UncontrolledCollapse toggler={`#${category.title.split(' ').join('-').replace(/[^a-zA-Z0-9]/g, '-')}`} className="w-100 mt-2">
                        <ListGroup>
                            {category.quizes.map(quiz =>
                                <ListGroupItem key={quiz._id} className="d-flex justify-content-between px-1">
                                    <Link to={`/view-quiz/${quiz.slug}`} className="m-0 text-capitalize mob-quiz" style={{ color: '#157A6E' }}>
                                        {quiz.title}
                                    </Link>
                                    <Badge color="dark" className="ms-lg-2">{quiz.questions.length > 30 ? '30' : quiz.questions.length}</Badge>
                                </ListGroupItem>
                            )}

                        </ListGroup>
                    </UncontrolledCollapse>
                </React.Fragment> : null
        )
    );
}

export default ViewCategory;