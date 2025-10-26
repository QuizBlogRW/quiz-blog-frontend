import { useSelector } from "react-redux";
import AddModal from "@/utils/AddModal";
import { createQuiz } from "@/redux/slices/quizzesSlice";
import validators from "@/utils/validators";

const AddQuiz = ({ category }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

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

  return (
    <AddModal
      title={<>Add Quiz</>}
      submitFn={(formState) => {
        const { name, description } = formState;
        const res = validators.validateTitleDesc(name, description, {
          minTitle: 4,
          minDesc: 4,
          maxTitle: 50,
          maxDesc: 100,
        });
        if (!res.ok) return Promise.reject(new Error("validation"));

        const newQuiz = {
          title: formState.name,
          description: formState.description,
          category: category._id,
          created_by: isLoading === false ? user._id : null,
        };
        return createQuiz(newQuiz);
      }}
      renderForm={renderForm}
      initialState={initialState}
      triggerText={"Quiz"}
    />
  );
};

export default AddQuiz;
