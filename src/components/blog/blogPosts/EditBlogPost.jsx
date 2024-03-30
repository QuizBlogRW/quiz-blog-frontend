import React, { useState, useEffect, useContext } from 'react'
import { Button, Form, FormGroup, Label, Input, Row, Col, Alert, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { clearErrors } from '../../../redux/slices/errorSlice'
import { clearSuccess } from '../../../redux/slices/successSlice'
import { updateBlogPost, getOneBlogPost } from '../../../redux/slices/blogPostsSlice'
import { getPostCategories } from '../../../redux/slices/postCategoriesSlice'
import { useSelector, useDispatch } from "react-redux"
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import UploadPostPhotos from './UploadPostPhotos'
import YourImages from './YourImages'
import { authContext, currentUserContext, logRegContext } from '../../../appContexts'

const EditBlogPost = () => {

  // redux
  const dispatch = useDispatch()
  const bposts = useSelector(state => state.blogPosts)
  const bPcats = useSelector(state => state.postCategories)
  const errors = useSelector(state => state.error)
  const successful = useSelector(state => state.success)

  const auth = useContext(authContext)
  const currentUser = useContext(currentUserContext)
  const { toggleL } = useContext(logRegContext)

  const { bPSlug } = useParams()

  // Lifecycle methods
  useEffect(() => {
    dispatch(getOneBlogPost(bPSlug))
    dispatch(getPostCategories())
  }, [bPSlug, dispatch])

  const bPToUse = bposts && bposts.oneBlogPost

  const [bPState, setBPState] = useState()

  useEffect(() => {
    setBPState({
      blogPostID: bPToUse && bPToUse._id,
      title: bPToUse && bPToUse.title,
      postCategory: bPToUse && bPToUse.postCategory,
      bgColor: bPToUse && bPToUse.bgColor,
      markdown: bPToUse && bPToUse.markdown
    })
  }, [bPToUse])

  const bPCategories = bPcats && bPcats.allPostCategories
  const isAuthenticated = auth && auth.isAuthenticated
  const userLoading = auth && auth.isLoading

  const curUserRole = currentUser && currentUser.role

  const creatorID = bPToUse.creator && bPToUse.creator._id
  const currentUserID = bPToUse.creator && bPToUse.creator._id
  const isAuthorized = (curUserRole === 'Admin' || curUserRole === 'SuperAdmin' || currentUserID === creatorID)

  // Alert
  const [visible, setVisible] = useState(true)
  const onDismiss = () => setVisible(false)

  // Errors state on form
  const [errorsState, setErrorsState] = useState([])

  const onChangeHandler = e => {
    clearErrors()
    clearSuccess()
    setBPState({ ...bPState, [e.target.name]: e.target.value })
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    const { blogPostID, title, postCategory, bgColor, markdown } = bPState

    // VALIDATE
    if (title.length < 4 || markdown.length < 4) {
      setErrorsState(['Insufficient info!'])
      return
    }
    else if (title.length > 70) {
      setErrorsState(['Title is too long!'])
      return
    }

    // Create new BP object
    const updatedBP = {
      blogPostID,
      title,
      postCategory,
      bgColor,
      markdown
    }

    // Attempt to create
    dispatch(updateBlogPost(updatedBP))
  }

  return (
    !isAuthenticated ?
      <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
        {
          userLoading ?
            <QBLoadingSM /> :
            <Button color="link" className="fw-bolder my-5 border rounded" onClick={toggleL} style={{ backgroundColor: "#ffc107", color: "#157A6E", fontSize: "1.5vw", boxShadow: "-2px 2px 1px 2px #157A6E", border: "2px solid #157A6E" }}>
              Login first
            </Button>
        }
      </div> :

      isAuthorized ?
        <>
          <Row className="m-5">
            <Col sm="8" className="mt-md-2">
              <Breadcrumb>
                <BreadcrumbItem active>Edit Blog Post</BreadcrumbItem>
              </Breadcrumb>

              <div className="mx-5">

                {/* Error frontend*/}
                {errorsState.length > 0 ?
                  errorsState.map(err =>
                    <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                      {err}
                    </Alert>) :
                  null
                }

                {/* Error backend */}
                {errors.id ?
                  <Alert isOpen={visible} toggle={onDismiss} color='danger'>
                    <small>{errors.msg && errors.msg.msg}</small>
                  </Alert> :

                  successful.id ?
                    <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                      <small>{successful.msg && successful.msg}</small>
                    </Alert> : null
                }

                <Form onSubmit={onSubmitHandler}>

                  <FormGroup>

                    <Label for="title">
                      <strong>Title</strong>
                    </Label>

                    <Input type="text" name="title" className="mb-3" onChange={onChangeHandler} value={bPState && bPState.title} />

                    <Label for="bgColor">
                      <strong>Background color</strong>
                    </Label>

                    <Input type="text" name="bgColor" className="mb-3" onChange={onChangeHandler} value={bPState && bPState.bgColor} />

                    <Label for="title">
                      <strong>Post Category</strong>
                    </Label>

                    <Input type="select" name="postCategory" placeholder="Category title..." className="mb-3" onChange={onChangeHandler} value={bPState && bPState.postCategory && bPState.postCategory._id}>

                      {bPState && !bPState.postCategory ?
                        <option>-- Select a Category--</option> :
                        null}

                      {bPCategories && bPCategories.map(bpCat =>
                        <option key={bpCat._id} value={bpCat._id}>
                          {bpCat.title}
                        </option>)}
                    </Input>

                    <Label for="markdown">
                      <strong>Markdown</strong>
                    </Label>

                    <Input type="textarea" name="markdown" minLength="80" rows="15" className="mb-2" onChange={onChangeHandler} value={bPState && bPState.markdown} />

                    {/* {post_image &&
                  <div className="my-3 mx-sm-5 px-sm-5 d-flex justify-content-center align-items-center">
                    <img className="my-2 mt-lg-0" src={post_image} alt="Blog post" />
                  </div>}

                <CustomInput bsSize="sm" type="file" accept=".jpg, .png, .jpeg, .svg" name="post_image" onChange={onFileHandler} label="Replace image ..." id="post_image_pick" /> */}

                    <Button color="success" style={{ marginTop: '2rem' }} block >Update</Button>
                  </FormGroup>
                </Form>
              </div>
            </Col>

            <Col sm="4" className="mt-md-2">
              <UploadPostPhotos currentUser={currentUser} />
              <YourImages currentUser={currentUser} />
            </Col>

          </Row>
        </> :

        <Alert color="danger" className='m-5 text-center'>Access Denied!</Alert>)
}

export default EditBlogPost