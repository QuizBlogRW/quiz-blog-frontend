import React, { useState, useContext } from 'react'
import { Button, Form, FormGroup, Label, Input, Row, Col, Alert, Breadcrumb, BreadcrumbItem, Progress } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { clearErrors } from '../../../redux/slices/errorSlice'
import { clearSuccess } from '../../../redux/slices/successSlice'
import { createBlogPost } from '../../../redux/slices/blogPostsSlice'
import { useSelector, useDispatch } from "react-redux"
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import UploadPostPhotos from './UploadPostPhotos'
import YourImages from './YourImages'
import { authContext, currentUserContext, logRegContext } from '../../../appContexts'

const AddBlogPost = () => {

    // redux
    const dispatch = useDispatch()
    const errors = useSelector(state => state.error)
    const successful = useSelector(state => state.success)

    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)
    const { toggleL } = useContext(logRegContext)

    const isAuthenticated = auth && auth.isAuthenticated
    const userLoading = auth && auth.isLoading

    const curUserRole = currentUser && currentUser.role
    const isAuthorized = curUserRole === 'Admin' || curUserRole === 'SuperAdmin' || curUserRole === 'Creator'

    const { bPCatID } = useParams()
    const [bPState, setBPState] = useState({
        title: '',
        markdown: '',
        bgColor: ''
    })

    const [post_image, setPost_image] = useState('')
    const [progress, setProgress] = useState()

    // Alert
    const [visible, setVisible] = useState(true)
    const onDismiss = () => setVisible(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    const onChangeHandler = e => {
        dispatch(clearErrors())
        dispatch(clearSuccess())
        setBPState({ ...bPState, [e.target.name]: e.target.value })
    }

    const onFileHandler = (e) => {
        setErrorsState([])
        dispatch(clearErrors())
        dispatch(clearSuccess())
        setPost_image(e.target.files[0])
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const formData = new FormData()
        const { title, markdown, bgColor } = bPState

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
        formData.append('title', title)
        formData.append('postCategory', bPCatID)
        formData.append('markdown', markdown)
        formData.append('post_image', post_image)
        formData.append('bgColor', bgColor)
        formData.append('creator', auth.isLoading === false ? currentUser._id : null)

        const onUploadProgress = (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total))
        }

        // Attempt to create
        dispatch(createBlogPost({ formData, onUploadProgress }))

        // Reset form fields
        setBPState({
            title: '',
            markdown: '',
            bgColor: '',
        })
        setPost_image('')
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
                    <Row className="p-2 pt-lg-5">

                        <Col sm="8" className="mt-md-2">
                            <Breadcrumb>
                                <BreadcrumbItem active>Create new blog post</BreadcrumbItem>
                            </Breadcrumb>


                            <div className="px-2">
                                {progress &&
                                    <div className={`${errors.id || successful.msg ? 'd-none' : ''} text-center text-danger fw-bolder`}>
                                        {progress - 1}%
                                        <Progress animated color="info" value={progress - 1} className='mb-2' />
                                    </div>}

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
                                            <strong className='text-success'>Title</strong>
                                        </Label>

                                        <Input type="text" name="title" placeholder="Blog post title ..." className="mb-3" onChange={onChangeHandler} value={bPState.title || ''} />

                                        <Label for="bgColor">
                                            <strong className='text-success'>Background color</strong>
                                        </Label>

                                        <Input type="text" name="bgColor" placeholder="Type the post background color ..." className="mb-3" onChange={onChangeHandler} value={bPState.bgColor || ''} />

                                        <Label for="markdown">
                                            <strong className='text-success'>Markdown</strong>
                                        </Label>

                                        <Input type="textarea" name="markdown" placeholder="Blog post details ..." minLength="100" rows="15" className="mb-2" onChange={onChangeHandler} value={bPState.markdown || ''} />

                                        <Label for="post_image">
                                            <strong className='text-success'>Representing Image</strong>&nbsp;
                                            <small className="text-info">.jpg, .png, .jpeg, .svg</small>
                                        </Label>
                                        <Col>
                                            <Input bsSize="sm" type="file" accept=".jpg, .png, .jpeg, .svg" name="post_image" onChange={onFileHandler} label="Pick an image ..." id="post_image_pick" required />
                                        </Col>

                                        <Button color="success" style={{ marginTop: '2rem' }} block >Create</Button>
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
                <Alert color="danger" className='m-5 text-center'>Access Denied!</Alert>
    )
}

export default AddBlogPost