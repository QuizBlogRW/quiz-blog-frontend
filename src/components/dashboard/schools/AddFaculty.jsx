import AddModal from '@/utils/AddModal'
import { createFaculty } from '@/redux/slices/facultiesSlice'
import { Input } from 'reactstrap'

const AddFaculty = ({ facultyLevel }) => {

    return (
        <AddModal
            title="Add New Faculty"
            triggerText="Faculty"
            initialState={{ title: '', school: facultyLevel && facultyLevel.school, level: facultyLevel && facultyLevel._id, years: [] }}
            submitFn={data => {
                const { title, years } = data
                if (!years || years.length === 0) return Promise.reject(new Error('validation'))
                if (title.length < 3) return Promise.reject(new Error('validation'))
                if (title.length > 70) return Promise.reject(new Error('validation'))
                return createFaculty(data)
            }}
            renderForm={(state, setState, firstInputRef) => (
                <>
                    <Input ref={firstInputRef} type="text" name="title" id="title" placeholder="Faculty title ..." className="mb-3" onChange={e => setState({ ...state, title: e.target.value })} value={state.title || ''} />
                    <Input type="select" name="selectYear" onChange={e => {
                        const yearsnbr = []
                        for (let i = 1; i <= e.target.value; i++) yearsnbr.push(`Year ${i}`)
                        setState({ ...state, years: yearsnbr })
                    }}>
                        <option>-- Select --</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                    </Input>
                </>
            )}
        />
    )
}

export default AddFaculty