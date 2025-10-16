import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Row, Col, Card, Button, CardTitle, CardText, TabPane } from 'reactstrap'
import { deleteCategory } from '@/redux/slices/categoriesSlice'
import AddQuiz from './AddQuiz'
import EditCategory from './EditCategory'
import CreateCategory from './CreateCategory'
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM'
import DeleteModal from '@/utils/DeleteModal'

const CategoriesTabPane = () => {

    const { allcategories, isLoading } = useSelector(state => state.categories)
    const { user } = useSelector(state => state.auth)

    const renderCategory = (category) => (
        <Col sm="6" className="mt-2" key={category._id}>
            <Card body>
                <CardTitle>
                    <Link to={`/category/${category._id}`} className="text-success text-uppercase fw-bolder">
                        {category.title} Quizzes ({category.quizes.length})
                    </Link>
                </CardTitle>
                <CardText>{category.description}</CardText>
                <div className="actions ms-3">
                    <Button size="sm" outline className="mx-2" style={{ color: '#157A6E', backgroundColor: '#ffc107' }}>
                        <AddQuiz category={category} />
                    </Button>
                    {
                        (user.role === 'Admin' || user.role === 'SuperAdmin') && (
                            <>
                                <Button size="sm" color="link" className="mx-2">
                                    <EditCategory
                                        categoryToEdit={category} />
                                </Button>
                                <Button size="sm" color="link" className="mx-2">
                                    <DeleteModal
                                        deleteFnName="deleteCategory"
                                        deleteFn={deleteCategory}
                                        delTitle={category.title}
                                        delID={category._id} />
                                </Button>
                                <small style={{ color: '#157A6E' }} className="ms-sm-5 text-center text-uppercase">
                                    <u>{category.courseCategory && category.courseCategory.title}</u>
                                </small>
                            </>
                        )
                    }
                </div>
            </Card>
        </Col>
    )

    return (
        <TabPane tabId="1">
            <Button size="sm" outline color="info" className="mx-3 mb-2 p-2 btn btn-warning">
                <CreateCategory />
            </Button>
            {isLoading ? (
                <QBLoadingSM title='categories' />
            ) : (
                <Row>
                    {allcategories && allcategories.map(renderCategory)}
                </Row>
            )}
        </TabPane>
    )
}

export default CategoriesTabPane