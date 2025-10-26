import { useSelector } from 'react-redux'
import UpdateModal from '@/utils/UpdateModal'
import { updateCategory } from '@/redux/slices/categoriesSlice'
import { notify } from '@/utils/notifyToast'

const EditCategory = ({ categoryToEdit }) => {
    const { isLoading, user } = useSelector(state => state.auth)
    const { allCourseCategories } = useSelector(state => state.courseCategories)

    const initialData = {
        catID: categoryToEdit && categoryToEdit._id,
        name: categoryToEdit && categoryToEdit.title || '',
        description: categoryToEdit && categoryToEdit.description || '',
        oldCourseCatID: categoryToEdit && categoryToEdit.courseCategory && categoryToEdit.courseCategory._id || '',
        courseCategory: categoryToEdit && categoryToEdit.courseCategory && categoryToEdit.courseCategory._id || ''
    }

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value })

        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} type="text" name="name" placeholder="Category name ..." className="form-control mb-3" onChange={onChange} value={formState.name} />
                </div>

                <div className="mb-2">
                    <label><strong>Description</strong></label>
                    <input type="text" name="description" placeholder="Category description ..." className="form-control mb-3" onChange={onChange} value={formState.description} />
                </div>

                <div className="mb-2">
                    <label><strong>Course Category</strong></label>
                    <select name="courseCategory" className="form-control mb-3" onChange={onChange} value={formState.courseCategory}>
                        {!formState.courseCategory ? <option>Choose a course category ...</option> : null}
                        {allCourseCategories && allCourseCategories.map(courseCategory => (
                            <option key={courseCategory._id} value={courseCategory._id}>{courseCategory.title}</option>
                        ))}
                    </select>
                </div>
            </div>
        )
    }

    const submitFn = (formState) => {
        const { catID, name, description, oldCourseCatID, courseCategory } = formState

        // VALIDATE
        if (!name || name.length < 4 || !description || description.length < 4) {
            notify('Insufficient info!', 'error')
            throw new Error('validation')
        }
        if (name.length > 50) {
            notify('Title is too long!', 'error')
            throw new Error('validation')
        }
        if (description.length > 100) {
            notify('Description is too long!', 'error')
            throw new Error('validation')
        }

        const updatedCategory = {
            catID,
            title: name,
            description,
            oldCourseCatID,
            courseCategory,
            last_updated_by: isLoading ? null : user._id
        }

        return (dispatch) => dispatch(updateCategory(updatedCategory))
    }

    return (
        <UpdateModal
            title="Edit Category"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}
        />
    )
}

export default EditCategory
