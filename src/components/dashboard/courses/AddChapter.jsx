import AddModal from "@/utils/AddModal";
import { createChapter } from "@/redux/slices/chaptersSlice";
import { useSelector } from "react-redux";
import validators from "@/utils/validators";
import { Input } from "reactstrap";

const AddChapter = ({ course }) => {
  const { isLoading, user } = useSelector((state) => state.auth);

  return (
    <AddModal
      title="Add New Chapter"
      triggerText="Chapter"
      initialState={{
        title: "",
        description: "",
        course: course._id,
        courseCategory: course.courseCategory,
      }}
      submitFn={(data) => {
        const { title, description } = data;
        const res = validators.validateTitleDesc(title, description, {
          minTitle: 4,
          minDesc: 4,
          maxTitle: 80,
          maxDesc: 200,
        });
        if (!res.ok) return Promise.reject(new Error("validation"));

        return createChapter({
          ...data,
          created_by: isLoading === false ? user?._id : null,
        });
      }}
      renderForm={(state, setState, firstInputRef) => (
        <>
          <Input
            ref={firstInputRef}
            type="text"
            name="title"
            id="title"
            placeholder="Chapter title ..."
            className="mb-3"
            onChange={(e) => setState({ ...state, title: e.target.value })}
            value={state.title || ""}
          />
          <Input
            type="text"
            name="description"
            id="description"
            placeholder="Chapter description ..."
            className="mb-3"
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
            value={state.description || ""}
          />
        </>
      )}
    />
  );
};

export default AddChapter;
