import AddModal from '@/utils/AddModal'
import { createCourse } from '@/redux/slices/coursesSlice'
import { useSelector } from 'react-redux'
import AddIcon from '@/images/plus.svg'
import { notify } from '@/utils/notifyToast'
import { useDispatch } from 'react-redux'
import { getCoursesByCategory } from '@/redux/slices/coursesSlice'


const AddCourse = ({ categoryId }) => {
    const { user, isLoading } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const initialState = { title: '', description: '' }

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = e => setFormState({ ...formState, [e.target.name]: e.target.value })
        return (
            <div>
                <label><strong>Title</strong></label>
                <input ref={firstInputRef} type="text" name="title" id="title" placeholder="Course title ..." className="form-control mb-3" onChange={onChange} value={formState.title} />

                <label><strong>Description</strong></label>
                <input type="text" name="description" id="description" placeholder="Course description ..." className="form-control mb-3" onChange={onChange} value={formState.description} />
            </div>
        )
    }

    const submitFn = (formState) => {
        const { title, description } = formState
        if (!title || title.length < 4 || !description || description.length < 4) {
            notify('Insufficient info!', 'error')
            throw new Error('validation')
        }
        if (title.length > 80) {
            notify('Title is too long!', 'error')
            throw new Error('validation')
        }
        if (description.length > 200) {
            notify('Description is too long!', 'error')
            throw new Error('validation')
        }

        const newCourse = {
            title,
            description,
            courseCategory: categoryId,
            created_by: isLoading === false ? user._id : null
        }

        return (dispatch) => dispatch(createCourse(newCourse))
    }

    const onSuccess = () => {
        notify('Course added', 'success')
        if (categoryId) dispatch(getCoursesByCategory(categoryId))
    }

    return (
        <AddModal
            title="Add New Course"
            submitFn={submitFn}
            renderForm={renderForm}
            initialState={initialState}
            triggerText={<><img src={AddIcon} alt="" width="10" height="10" className="mb-1" />&nbsp;Course</>}
            onSuccess={onSuccess}
        />
    )
}

export default AddCourse