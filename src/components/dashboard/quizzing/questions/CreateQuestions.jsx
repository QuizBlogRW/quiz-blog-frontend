import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Button,
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
import { addQuestion, getQuestions } from '@/redux/slices/questionsSlice';
import { getOneQuiz, notifying } from '@/redux/slices/quizzesSlice';
import { notify } from '@/utils/notifyToast';
import NotAuthenticated from '@/components/users/NotAuthenticated';

/* ---------------------------------------------
   Local client id (NO nanoid / uuid)
----------------------------------------------*/
const createClientId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/* ---------------------------------------------
   Component
----------------------------------------------*/
const CreateQuestions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizSlug } = useParams();

  const { oneQuiz } = useSelector(state => state.quizzes);
  const { user, isAuthenticated, isLoading: isUserLoading } = useSelector(
    state => state.users
  );

  /* ---------------------------------------------
     Form state
  ----------------------------------------------*/
  const [form, setForm] = useState({
    questionText: '',
    duration: 24,
    questionImage: null,
    answerOptions: [
      {
        clientId: createClientId(),
        answerText: '',
        explanations: '',
        isCorrect: false,
      },
    ],
  });

  /* ---------------------------------------------
     Fetch quiz & questions
  ----------------------------------------------*/
  useEffect(() => {
    dispatch(getOneQuiz(quizSlug));
    dispatch(getQuestions(quizSlug));
  }, [dispatch, quizSlug]);

  /* ---------------------------------------------
     Handlers
  ----------------------------------------------*/
  const updateForm = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const updateAnswer = useCallback((clientId, field, value) => {
    setForm(prev => ({
      ...prev,
      answerOptions: prev.answerOptions.map(opt =>
        opt.clientId === clientId
          ? { ...opt, [field]: value }
          : opt
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

  /* ---------------------------------------------
     Validation
  ----------------------------------------------*/
  const validateForm = () => {
    const { questionText, answerOptions } = form;

    if (!questionText && !form.questionImage) {
      notify('Please provide question text or image', 'error');
      return false;
    }

    if (questionText.length < 4 || questionText.length > 700) {
      notify('Question length is invalid', 'error');
      return false;
    }

    if (answerOptions.length < 2) {
      notify('At least two answers are required', 'error');
      return false;
    }

    if (answerOptions.some(a => !a.answerText.trim())) {
      notify('All answers must have text', 'error');
      return false;
    }

    if (!answerOptions.some(a => a.isCorrect)) {
      notify('Please select at least one correct answer', 'error');
      return false;
    }

    return true;
  };

  /* ---------------------------------------------
     Submit
  ----------------------------------------------*/
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('questionText', form.questionText);
    formData.append('duration', form.duration);

    if (form.questionImage) {
      formData.append('question_image', form.questionImage);
    }

    form.answerOptions.forEach(opt => {
      const payload = { ...opt };
      delete payload.clientId;
      formData.append('answerOptions', JSON.stringify(payload));
    });

    formData.append('category', oneQuiz.category._id);
    formData.append('quiz', oneQuiz._id);

    if (!isUserLoading && user?._id) {
      formData.append('created_by', user._id);
    }

    const result = await dispatch(addQuestion(formData));

    if (addQuestion.fulfilled.match(result)) {
      notify('Question added successfully', 'success');
    }

    /* Reset */
    setForm({
      questionText: '',
      duration: 24,
      questionImage: null,
      answerOptions: [
        {
          clientId: createClientId(),
          answerText: '',
          explanations: '',
          isCorrect: false,
        },
      ],
    });
  };

  /* ---------------------------------------------
     Finish & notify
  ----------------------------------------------*/
  const finishAndNotify = () => {
    dispatch(
      notifying({
        quiz_Id: oneQuiz._id,
        title: oneQuiz.title,
        category: oneQuiz.category.title,
        created_by: oneQuiz.created_by?.name,
      })
    );

    navigate(-1);
  };

  /* ---------------------------------------------
     Guards
  ----------------------------------------------*/
  if (!isAuthenticated) return <NotAuthenticated />;
  if (user?.role === 'Visitor') return <Dashboard />;
  if (!oneQuiz?.category) return null;

  /* ---------------------------------------------
     Render
  ----------------------------------------------*/
  return (
    <Form
      className="my-3 mt-lg-5 mx-3 mx-lg-5 create-question"
      onSubmit={handleSubmit}
    >
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/dashboard">{oneQuiz.category.title}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to={`/category/${oneQuiz.category._id}`}>
            {oneQuiz.title}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>Create Question</BreadcrumbItem>
      </Breadcrumb>

      <Button
        size="sm"
        color="danger"
        className="ms-auto d-block mb-3"
        onClick={finishAndNotify}
      >
        Finish & Notify
      </Button>

      <FormGroup row>
        <Label sm={2}>Question</Label>
        <Col sm={10}>
          <Input
            value={form.questionText}
            onChange={e =>
              updateForm('questionText', e.target.value)
            }
            required
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label sm={2}>Upload</Label>
        <Col sm={10}>
          <Input
            type="file"
            accept=".jpg,.png,.jpeg,.svg"
            onChange={e =>
              updateForm('questionImage', e.target.files[0])
            }
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label sm={2}>Duration</Label>
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

      {form.answerOptions.map(opt => (
        <FormGroup row key={opt.clientId}>
          <Label sm={2}>Answer</Label>

          <Col sm={7}>
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

          <Col sm={2}>
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
            />{' '}
            Correct
          </Col>

          <Col sm={1} className="d-flex gap-2">
            <Button
              color="danger"
              disabled={form.answerOptions.length === 1}
              onClick={() => removeAnswer(opt.clientId)}
              className='text-white font-weight-bolder'
            >
              –
            </Button>{' '}
            <Button color="success" onClick={addAnswer} className='text-white font-weight-bolder'>
              +
            </Button>
          </Col>

          <Col sm={{ size: 7, offset: 2 }} className="mt-2">
            <Input
              type="textarea"
              value={opt.explanations}
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
      ))}

      <Button type="submit" color="success" size="sm">
        Add New
      </Button>
    </Form>
  );
};

export default CreateQuestions;
