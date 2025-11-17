import { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col, Alert, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { createBlogPost } from '@/redux/slices';
import { useDispatch, useSelector } from 'react-redux';
import UploadPostPhotos from './UploadPostPhotos';
import YourImages from './YourImages';
import { notify } from '@/utils/notifyToast';
import NotAuthenticated from '@/components/auth/NotAuthenticated';

const AddBlogPost = () => {

    // redux
    const dispatch = useDispatch();
    const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);

    const curUserRole = user?.role;
    const isAuthorized = curUserRole?.includes('Admin') || curUserRole === 'Creator';

    const { bPCatID } = useParams();
    const [bPState, setBPState] = useState({
        title: '',
        markdown: '',
        bgColor: ''
    });
    const [post_image, setPost_image] = useState('');
    const onChangeHandler = e => {
        setBPState({ ...bPState, [e.target.name]: e.target.value });
    };

    const onFileHandler = (e) => {
        setPost_image(e.target.files[0]);
    };

    const onSubmitHandler = e => {
        e.preventDefault();

        const formData = new FormData();
        const { title, markdown, bgColor } = bPState;

        // VALIDATE
        if (title.length < 4 || markdown.length < 4) {
            notify('Insufficient info!', 'error');
            return;
        }
        else if (title.length > 70) {
            notify('Title is too long!', 'error');
            return;
        }

        // Create new BP object
        formData.append('title', title);
        formData.append('postCategory', bPCatID);
        formData.append('markdown', markdown);
        formData.append('post_image', post_image);
        formData.append('bgColor', bgColor);
        formData.append('creator', isLoading === false ? user._id : null);

        // Attempt to create
        dispatch(createBlogPost(formData));

        // Reset form fields
        setBPState({
            title: '',
            markdown: '',
            bgColor: '',
        });
        setPost_image('');
    };

    return (
        !isAuthenticated ?
            <NotAuthenticated /> :

            !isAuthorized ?
                <Alert color="danger" className='m-5 text-center'>Access Denied!</Alert> :
                <>
                    <Row className="p-2 pt-lg-5">

                        <Col sm="8" className="mt-md-2">
                            <Breadcrumb>
                                <BreadcrumbItem active>Create new blog post</BreadcrumbItem>
                            </Breadcrumb>


                            <div className="px-2">
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
                            <UploadPostPhotos />
                            <YourImages />
                        </Col>
                    </Row>
                </>
    );
};

export default AddBlogPost;
