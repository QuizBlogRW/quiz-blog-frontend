import AddModal from '@/utils/AddModal'
import { createLevel } from '@/redux/slices/levelsSlice'
import validators from '@/utils/validators'
import { Input } from 'reactstrap'

const AddLevel = ({ schools }) => {
    return (
        <AddModal
            title="Add New Level"
            triggerText="Level"
            initialState={{ title: '', school: '' }}
            submitFn={data => {
                const { title, school } = data
                if (!school) return Promise.reject(new Error('validation'))
                const res = validators.minLength(title, 3)
                if (!res) return Promise.reject(new Error('validation'))
                if (title.length > 70) return Promise.reject(new Error('validation'))
                return createLevel({ title, school })
            }}
            renderForm={(state, setState, firstInputRef) => (
                <>
                    <Input ref={firstInputRef} type="text" name="title" id="title" placeholder="Level title ..." className="mb-3" onChange={e => setState({ ...state, title: e.target.value })} value={state.title || ''} />
                    <Input type="select" name="school" onChange={e => setState({ ...state, school: e.target.value })} value={state.school || ''}>
                        <option>--Choose a School--</option>
                        {schools && schools.map(school => <option key={school._id} value={school._id}>{school.title}</option>)}
                    </Input>
                </>
            )}
        />
    )
}

export default AddLevel