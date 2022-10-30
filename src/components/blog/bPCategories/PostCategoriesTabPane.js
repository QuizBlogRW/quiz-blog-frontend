import React, { useEffect } from 'react'
import { Row, Col, Card, Button, CardTitle, CardText, TabPane } from 'reactstrap'
import { connect } from 'react-redux'
import { getPostCategories } from '../../../redux/blog/postCategories/postCategories.actions'
import { Link } from 'react-router-dom'
import EditBPCategory from './EditBPCategory'
import DeleteBPCategory from './DeleteBPCategory'
import CreateBPCategory from './CreateBPCategory'
import SpinningBubbles from '../../rLoading/SpinningBubbles'

const PostCategoriesTabPane = ({ auth, bPcats, getPostCategories }) => {

  useEffect(() => {
    getPostCategories()
  }, [getPostCategories])

  return (
    <TabPane tabId="7">

      <Button size="sm" outline color="info" className="mx-3 mb-2 p-2 btn btn-warning">
        <CreateBPCategory auth={auth} />
      </Button>

      {bPcats.isLoading ?
        <SpinningBubbles title='Blog post categories' /> :

        <Row>
          {bPcats.allPostCategories && bPcats.allPostCategories.map(category => (

            <Col sm="6" className="mt-2" key={category._id}>
              <Card body>

                <CardTitle className="text-uppercase">
                  <strong>{category.title} Blog Posts</strong>
                </CardTitle>

                <CardText><small>{category.description}</small></CardText>

                <div className="actions ml-3">

                  <Button size="sm" outline color="info" className="mx-2">
                    <Link to={`/create-bpost/${category._id}`}>Add Blog Post</Link>
                  </Button>

                  {
                    auth.user.role === 'Admin' ?
                      <>
                        <Button size="sm" color="link" className="mx-2">
                          <EditBPCategory
                            auth={auth}
                            categoryToEdit={category} />
                        </Button>

                        <Button size="sm" color="link" className="mx-2" >
                          <DeleteBPCategory
                            catTitle={category.title}
                            catID={category._id} />
                        </Button>
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

const mapStateToProps = state => ({
  bPcats: state.postCategoriesReducer
})

export default connect(mapStateToProps, { getPostCategories })(PostCategoriesTabPane)