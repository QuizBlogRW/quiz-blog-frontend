import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardTitle, CardText, TabPane } from 'reactstrap';
import { deleteCategory } from '@/redux/slices/categoriesSlice';
import AddQuiz from './AddQuiz';
import EditCategory from './EditCategory';
import CreateCategory from './CreateCategory';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import DeleteModal from '@/utils/DeleteModal';

const CategoriesTabPane = () => {
  const { allcategories, isLoading } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);

  const renderCategory = (category) => (
    <Col sm="6" className="mt-2" key={category._id}>
      <Card body>
        <CardTitle>
          <Link
            to={`/category/${category._id}`}
            className="text-success text-uppercase fw-bolder"
          >
            {category.title} Quizzes ({category.quizes.length})
          </Link>
        </CardTitle>
        <CardText>{category.description}</CardText>
        <div className="actions ms-3">
          <AddQuiz category={category} />
          {(user.role === 'Admin' || user.role === 'SuperAdmin') && (
            <>
              <EditCategory categoryToEdit={category} />
              <DeleteModal
                deleteFnName="deleteCategory"
                deleteFn={deleteCategory}
                delTitle={category.title}
                delID={category._id}
              />
              <small
                style={{ color: 'var(--brand)' }}
                className="ms-sm-5 text-center text-uppercase"
              >
                <u>
                  {category.courseCategory && category.courseCategory.title}
                </u>
              </small>
            </>
          )}
        </div>
      </Card>
    </Col>
  );

  return (
    <TabPane tabId="1">
      <CreateCategory />
      {isLoading ? (
        <QBLoadingSM title="categories" />
      ) : (
        <Row>{allcategories && allcategories.map(renderCategory)}</Row>
      )}
    </TabPane>
  );
};

export default CategoriesTabPane;
