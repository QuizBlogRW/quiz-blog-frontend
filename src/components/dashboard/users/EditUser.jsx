import UpdateModal from '@/utils/UpdateModal'
import { updateUser } from '@/redux/slices/authSlice'
import { notify } from '@/utils/notifyToast'

const EditUser = ({ userToUse }) => {
    const initialData = {
        uId: userToUse?._id,
        name: userToUse?.name || '',
        role: userToUse?.role || '',
        email: userToUse?.email || ''
    }

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = e => setFormState({ ...formState, [e.target.name]: e.target.value })
        return (
            <div>
                <div className="mb-3">
                    <label><strong>Name</strong></label>
                    <input ref={firstInputRef} type="text" name="name" id="name" placeholder="User name ..." className="form-control mb-3" onChange={onChange} value={formState.name} />
                </div>

                <div className="mb-3">
                    <label><strong>Role</strong></label>
                    <select name="role" className="form-control mb-3" onChange={onChange} value={formState.role}>
                        <option>SuperAdmin</option>
                        <option>Admin</option>
                        <option>Creator</option>
                        <option>Visitor</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label><strong>Email</strong></label>
                    <input type="email" name="email" id="email" placeholder="Category email ..." className="form-control mb-3" onChange={onChange} value={formState.email} />
                </div>
            </div>
        )
    }

    const submitFn = (formState) => {
        const { uId, name, role, email } = formState
        if (!name || name.length < 4 || !role || role.length < 4 || !email || email.length < 4) {
            notify('Insufficient info!', 'error')
            throw new Error('validation')
        }
        if (name.length > 30) {
            notify('Name is too long!', 'error')
            throw new Error('validation')
        }
        if (role === '') {
            notify('Role is required!', 'error')
            throw new Error('validation')
        }

        return (dispatch) => dispatch(updateUser({ uId, name, role, email }))
    }
    return (
        <UpdateModal
            title="Edit User"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}

        />
    )
}

export default EditUser