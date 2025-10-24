import AddModal from '@/utils/AddModal'
import { createPostCategory } from '@/redux/slices/postCategoriesSlice'
import { useSelector } from 'react-redux'
import validators from '@/utils/validators'
import { Input } from 'reactstrap'
import { notify } from '@/utils/notifyToast'

const CreateBPCategory = () => {
    const { user, isLoading } = useSelector(state => state.auth)

    return (
        <AddModal
            title="Create Blog Post Category"
            triggerText="BP Category"
            initialState={{ title: '', description: '' }}
            submitFn={data => {
                const { title, description } = data
                const res = validators.validateTitleDesc(title, description, { minTitle: 4, minDesc: 4, maxTitle: 50, maxDesc: 100 })
                if (!res.ok) return Promise.reject(new Error('validation'))
                return createPostCategory({ title, description, creator: isLoading === false ? user._id : null })
            }}
            onSuccess={() => notify('Category created', 'success')}
                renderForm={(state, setState, firstInputRef) => (
                <>
                    <Input ref={firstInputRef} type="text" name="title" id="title" placeholder="Category title ..." className="mb-3" onChange={e => setState({ ...state, title: e.target.value })} value={state.title || ''} />
                    <Input type="text" name="description" id="description" placeholder="Category description ..." className="mb-3" onChange={e => setState({ ...state, description: e.target.value })} value={state.description || ''} />
                </>
            )}
        />
    )
}

export default CreateBPCategory
