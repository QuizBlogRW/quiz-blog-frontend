import React, { useEffect, useContext } from 'react'
import { Row, Col, Card, Button, CardTitle, CardText, TabPane } from 'reactstrap'
import { connect } from 'react-redux'
import { getPostCategories, deletePostCategory } from '../../../redux/blog/postCategories/postCategories.actions'
import { Link } from 'react-router-dom'

import EditBPCategory from './EditBPCategory'
import CreateBPCategory from './CreateBPCategory'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import trash from '../../../images/trash.svg'
import { currentUserContext } from '../../../appContexts'

const PostCategoriesTabPane = ({ bPcats, getPostCategories, deletePostCategory }) => {

  const currentUser = useContext(currentUserContext)

  useEffect(() => {
    getPostCategories()
  }, [getPostCategories])

  return (
    <TabPane tabId="7">

      <Button size="sm" outline color="info" className="mx-3 mb-2 p-2 btn btn-warning">
        <CreateBPCategory />
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
                    currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin' ?
                      <>
                        <Button size="sm" color="link" className="mx-2">
                          <EditBPCategory
                            categoryToEdit={category} />
                        </Button>

                        <Button size="sm" color="link" className="mx-2 mt-0 p-0" onClick={() => deletePostCategory(category._id)}>
                          <img src={trash} alt="" width="16" height="16" />
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

export default connect(mapStateToProps, { getPostCategories, deletePostCategory })(PostCategoriesTabPane)