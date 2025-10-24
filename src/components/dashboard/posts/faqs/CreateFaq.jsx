import AddModal from '@/utils/AddModal'
import { createFq } from '@/redux/slices/faqsSlice'
import { useSelector } from 'react-redux'
import validators from '@/utils/validators'
import { notify } from '@/utils/notifyToast'
import { useDispatch } from 'react-redux'
import { getFaqs } from '@/redux/slices/faqsSlice'

const CreateFaq = () => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    return (
        <AddModal
            title="Create a FAQ"
            triggerText="FAQ"
            initialState={{ title: '', answer: '', created_by: user ? user._id : null }}
            submitFn={data => {
                const { title, answer } = data
                const res = validators.validateTitleDesc(title, answer, { minTitle: 4, minDesc: 4, maxTitle: 200, maxDesc: 1000 })
                if (!res.ok) return Promise.reject(new Error('validation'))
                return createFq({ ...data })
            }}
            onSuccess={() => {
                notify('FAQ added', 'success')
                dispatch(getFaqs())
            }}
            renderForm={(state, setState, firstInputRef) => (
                <>
                    <Input ref={firstInputRef} type="text" name="title" placeholder="FAQ title ..." className="mb-3" onChange={e => setState({ ...state, title: e.target.value })} value={state.title || ''} />
                    <Input type="textarea" name="answer" placeholder="FAQ answer ..." className="mb-3" minLength="5" maxLength="1000" onChange={e => setState({ ...state, answer: e.target.value })} value={state.answer || ''} />
                </>
            )}
        />
    )
}

export default CreateFaq