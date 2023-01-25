import React, { useContext } from 'react'
import { Row, Col, Card, Button, CardTitle, CardText, TabPane } from 'reactstrap'
import { Link } from "react-router-dom"
import AddQuiz from '../quizes/AddQuiz'
import EditCategory from './EditCategory'
import DeleteCategory from './DeleteCategory'
import CreateCategory from '../categories/CreateCategory'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { authContext, categoriesContext, courseCategoriesContext } from '../../appContexts'

const CategoriesTabPane = () => {

    // Context
    const auth = useContext(authContext)
    const categories = useContext(categoriesContext)
    const courseCategories = useContext(courseCategoriesContext)

    return (
        <TabPane tabId="1">

            <Button size="sm" outline color="info" className="mx-3 mb-2 p-2 btn btn-warning">
                <CreateCategory courseCategories={courseCategories.allCourseCategories} />
            </Button>

            {categories.isLoading ?
                <SpinningBubbles title='categories'/> :
                <Row>
                    {categories.allcategories && categories.allcategories.map(category => (

                        <Col sm="6" className="mt-2" key={category._id}>
                            <Card body>

                                <CardTitle>
                                    <Link to={`/category/${category._id}`} className="text-success text-uppercase">
                                        {category.title} Quizes ({category.quizes.length})
                                    </Link>
                                </CardTitle>

                                <CardText>{category.description}</CardText>

                                <div className="actions ml-3">

                                    <Button size="sm" outline color="info" className="mx-2">
                                        <strong>
                                            <AddQuiz category={category} />
                                        </strong>
                                    </Button>

                                    {
                                        auth.user.role === 'Admin' || auth.user.role === 'SuperAdmin' ?
                                            <>
                                                <Button size="sm" color="link" className="mx-2">
                                                    <EditCategory
                                                        categoryToEdit={category}
                                                        courseCategories={courseCategories.allCourseCategories} />
                                                </Button>

                                                <Button size="sm" color="link" className="mx-2" >
                                                    <DeleteCategory 
                                                    catTitle={category.title}
                                                    catID={category._id} />
                                                </Button>

                                                <small className="text-info ml-sm-5 text-center text-uppercase">
                                                    <u>{category.courseCategory.title}</u>
                                                </small>
                                            </>
                                            : null
                                    }

                                </div>

                            </Card>
                        </Col>
                    ))}
                </Row>
            }

        </TabPane>
    )
}

export default CategoriesTabPane