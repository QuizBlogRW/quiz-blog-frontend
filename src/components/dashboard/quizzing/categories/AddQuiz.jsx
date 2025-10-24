import { useSelector } from "react-redux";
import AddModal from "@/utils/AddModal";
import { createQuiz } from "@/redux/slices/quizzesSlice";
import AddIcon from "@/images/plus.svg";
import { notify } from "@/utils/notifyToast";
import { useDispatch } from "react-redux";
import { getQuizzesByCategory } from "@/redux/slices/quizzesSlice";

const AddQuiz = ({ category }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const initialState = {
    name: "",
    description: "",
  };

  const renderForm = (formState, setFormState, firstInputRef) => {
    const onChange = (e) =>
      setFormState({ ...formState, [e.target.name]: e.target.value });
    return (
      <div>
        <div className="mb-2">
          <label>
            <strong>Title</strong>
          </label>
          <input
            ref={firstInputRef}
            type="text"
            name="name"
            placeholder="Quiz name ..."
            className="form-control mb-3"
            onChange={onChange}
            value={formState.name}
          />
        </div>

        <div className="mb-2">
          <label>
            <strong>Description</strong>
          </label>
          <input
            type="text"
            name="description"
            placeholder="Quiz description ..."
            className="form-control mb-3"
            onChange={onChange}
            value={formState.description}
          />
        </div>
      </div>
    );
  };

  const validate = (formState) => {
    const { name, description } = formState;
    if (!name || name.length < 4 || !description || description.length < 4) {
      notify("Insufficient info!", "error");
      throw new Error("validation");
    }
    if (name.length > 70) {
      notify("Title is too long!", "error");
      throw new Error("validation");
    }
    if (description.length > 120) {
      notify("Description is too long!", "error");
      throw new Error("validation");
    }
    return true;
  };

  const submitFn = (formState) => {
    const newQuiz = {
      title: formState.name,
      description: formState.description,
      category: category._id,
      created_by: isLoading === false ? user._id : null,
    };
    return (dispatch) => dispatch(createQuiz(newQuiz));
  };

  const submitWrapper = async (formState) => {
    validate(formState);
    return submitFn(formState);
  };

  const onSuccess = () => {
    notify("Quiz added", "success");
    if (category && category._id) dispatch(getQuizzesByCategory(category._id));
  };

  return (
    <AddModal
      title={"Add Quiz"}
      submitFn={submitWrapper}
      renderForm={renderForm}
      initialState={initialState}
      onSuccess={onSuccess}
      triggerText={null}
    />
  );
};

export default AddQuiz;
