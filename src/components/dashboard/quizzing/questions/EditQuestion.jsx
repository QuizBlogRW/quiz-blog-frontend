import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Button,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import Dashboard from '../../Dashboard';
import { getOneQuestion, updateQuestion } from '@/redux/slices/questionsSlice';
import { notify } from '@/utils/notifyToast';
import NotAuthenticated from '@/components/users/NotAuthenticated';
import QBLoading from '@/utils/rLoading/QBLoadingSM';

const createClientId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const EditQuestion = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { questionID } = useParams();

    const { oneQuestion: quest, isLoading: isQnLoading } = useSelector(
        state => state.questions
    );
    const { isAuthenticated, user, isLoading: isUserLoading } = useSelector(
        state => state.users
    );

    const [form, setForm] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        dispatch(getOneQuestion(questionID));
    }, [dispatch, questionID]);

    useEffect(() => {
        if (!quest) return;

        setForm({
            questionText: quest.questionText || '',
            duration: quest.duration || 0,
            answerOptions: (quest.answerOptions || []).map(opt => ({
                ...opt,
                clientId: opt._id || createClientId(),
            })),
        });
    }, [quest]);

    const updateForm = useCallback((name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const updateAnswer = useCallback((clientId, field, value) => {
        setForm(prev => ({
            ...prev,
            answerOptions: prev.answerOptions.map(opt =>
                opt.clientId === clientId ? { ...opt, [field]: value } : opt
            ),
        }));
    }, []);

    const addAnswer = () => {
        setForm(prev => ({
            ...prev,
            answerOptions: [
                ...prev.answerOptions,
                {
                    clientId: createClientId(),
                    answerText: '',
                    explanations: '',
                    isCorrect: false,
                },
            ],
        }));
    };

    const removeAnswer = clientId => {
        setForm(prev => ({
            ...prev,
            answerOptions: prev.answerOptions.filter(
                opt => opt.clientId !== clientId
            ),
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form) return;

        const { questionText, duration, answerOptions } = form;

        if (questionText.length < 4 || questionText.length > 700) {
            notify('Question length is invalid', 'error');
            return;
        }

        if (duration <= 0) {
            notify('Duration must be greater than zero', 'error');
            return;
        }

        if (answerOptions.length < 2) {
            notify('At least two answers are required', 'error');
            return;
        }

        if (answerOptions.some(a => !a.answerText.trim())) {
            notify('All answers must have text', 'error');
            return;
        }

        if (answerOptions.filter(a => a.isCorrect).length === 0) {
            notify('Select at least one correct answer', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('questionText', questionText);
        formData.append('duration', duration);

        if (imageFile) {
            formData.append('question_image', imageFile);
        }

        answerOptions.forEach(opt => {
            const payload = { ...opt };
            delete payload.clientId;
            formData.append('answerOptions', JSON.stringify(payload));
        });

        if (!isUserLoading && user?._id) {
            formData.append('last_updated_by', user._id);
        }

        const result = await dispatch(
            updateQuestion({ questionID, formData })
        );

        if (updateQuestion.fulfilled.match(result)) {
            navigate(-1);
        }
    };

    if (!isAuthenticated) return <NotAuthenticated />;
    if (user?.role === 'Visitor') return <Dashboard />;
    if (isQnLoading || !form) return <QBLoading />;

    const { category, quiz } = quest;

    const imageSrc =
        imageFile instanceof File
            ? URL.createObjectURL(imageFile)
            : quest.question_image;

    return (
        <Form
            className="mt-3 mt-lg-5 mx-3 mx-lg-5 border rounded shadow-sm bg-white p-3 p-lg-4"
            onSubmit={handleSubmit}
        >
            {/* Breadcrumb */}
            <Row className="mb-3">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link to={`/category/${category?._id}`}>{category?.title}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to={`/view-quiz/${quiz?.slug}`}>{quiz?.title}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Edit Question</BreadcrumbItem>
                </Breadcrumb>
            </Row>

            {/* Question */}
            <FormGroup row className="mb-4">
                <Label sm={2} className="fw-semibold">
                    Question
                </Label>
                <Col sm={10}>
                    <Input
                        type="text"
                        value={form.questionText}
                        onChange={e => updateForm('questionText', e.target.value)}
                        required
                    />
                </Col>
            </FormGroup>

            {/* Image */}
            {imageSrc && (
                <div className="text-center my-3">
                    <img
                        src={imageSrc}
                        className="img-fluid rounded"
                        alt="Question"
                    />
                </div>
            )}

            <div className="mb-4">
                <Input
                    type="file"
                    accept=".jpg,.png,.jpeg,.svg"
                    onChange={e => setImageFile(e.target.files[0])}
                />
            </div>

            {/* Duration */}
            <FormGroup row className="mb-4">
                <Label sm={2} className="fw-semibold">
                    Duration
                </Label>
                <Col sm={3}>
                    <Input
                        type="number"
                        value={form.duration}
                        onChange={e =>
                            updateForm('duration', Number(e.target.value))
                        }
                        required
                    />
                </Col>
            </FormGroup>

            {/* Answers */}
            {form.answerOptions.map((opt, index) => (
                <div
                    key={opt.clientId}
                    className="border rounded p-3 mb-3 bg-light"
                >
                    <FormGroup row className="align-items-center">
                        <Label sm={2} className="fw-semibold">
                            Answer {index + 1}
                        </Label>

                        <Col sm={6}>
                            <Input
                                value={opt.answerText}
                                onChange={e =>
                                    updateAnswer(
                                        opt.clientId,
                                        'answerText',
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </Col>

                        <Col sm={2} className="d-flex align-items-center">
                            <Input
                                type="checkbox"
                                checked={opt.isCorrect}
                                onChange={e =>
                                    updateAnswer(
                                        opt.clientId,
                                        'isCorrect',
                                        e.target.checked
                                    )
                                }
                                className="mt-0"
                            />{' '}
                            <span className="ms-1">Correct</span>
                        </Col>

                        <Col sm={2} className="d-flex gap-2">
                            <Button
                                color="warning"
                                size="sm"
                                disabled={form.answerOptions.length === 1}
                                onClick={() => removeAnswer(opt.clientId)}
                                className='text-white font-weight-bolder'
                            >
                                –
                            </Button>
                            <Button
                                color="success"
                                size="sm"
                                onClick={addAnswer}
                                className='text-white font-weight-bolder'
                            >
                                +
                            </Button>
                        </Col>
                    </FormGroup>

                    <FormGroup row className="mt-2">
                        <Col sm={{ size: 6, offset: 2 }}>
                            <Input
                                type="textarea"
                                value={opt.explanations || ''}
                                onChange={e =>
                                    updateAnswer(
                                        opt.clientId,
                                        'explanations',
                                        e.target.value
                                    )
                                }
                                placeholder="Explanation (optional)"
                            />
                        </Col>
                    </FormGroup>
                </div>
            ))}

            {/* Actions */}
            <div className="d-flex justify-content-end mt-4">
                <Button type="submit" color="success">
                    Update Question
                </Button>
            </div>
        </Form>
    );
};

export default EditQuestion;
