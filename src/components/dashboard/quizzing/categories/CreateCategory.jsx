import AddModal from "@/utils/AddModal";
import { createCategory } from "@/redux/slices/categoriesSlice";
import { useSelector } from "react-redux";
import validators from "@/utils/validators";
import { Input } from "reactstrap";

const CreateCategory = () => {

  const { user, isLoading } = useSelector((state) => state.auth);
  const { allCourseCategories } = useSelector(
    (state) => state.courseCategories
  );

  return (
    <AddModal
      title="Create Category"
      triggerText="Create Category"
      initialState={{ name: "", description: "", courseCategory: "" }}
      submitFn={(data) => {
        const { name, description, courseCategory } = data;
        // basic validation
        if (!courseCategory) return Promise.reject(new Error("validation"));
        const res = validators.validateTitleDesc(name, description, {
          minTitle: 4,
          minDesc: 4,
          maxTitle: 50,
          maxDesc: 100,
        });
        if (!res.ok) return Promise.reject(new Error("validation"));

        const payload = {
          title: name,
          description,
          creation_date: Date.now(),
          created_by: isLoading === false ? user._id : null,
          courseCategory,
        };

        return createCategory(payload);
      }}
      renderForm={(state, setState, firstInputRef) => (
        <>
          <Input
            ref={firstInputRef}
            type="text"
            name="name"
            id="name"
            placeholder="Category name ..."
            className="mb-3"
            onChange={(e) => setState({ ...state, name: e.target.value })}
            value={state.name || ""}
          />
          <Input
            type="text"
            name="description"
            id="description"
            placeholder="Category description ..."
            className="mb-3"
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
            value={state.description || ""}
          />
          <Input
            type="select"
            name="courseCategory"
            placeholder="Category title..."
            className="mb-3"
            onChange={(e) =>
              setState({ ...state, courseCategory: e.target.value })
            }
            value={state.courseCategory || ""}
          >
            {!state.courseCategory ? (
              <option>Choose a course category ...</option>
            ) : null}
            {allCourseCategories &&
              allCourseCategories.map((courseCategory) => (
                <option key={courseCategory._id} value={courseCategory._id}>
                  {courseCategory.title}
                </option>
              ))}
          </Input>
        </>
      )}
    />
  );
};

export default CreateCategory;
