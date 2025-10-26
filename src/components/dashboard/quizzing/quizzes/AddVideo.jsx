import AddModal from '@/utils/AddModal';
import { addVidLink } from '@/redux/slices/quizzesSlice';
import { addFaqVidLink } from '@/redux/slices/faqsSlice';
import { notify } from '@/utils/notifyToast';

const AddVideo = ({ isFromFaqs, faqID, quizID }) => {

    const initialState = {
        vtitle: '',
        vlink: ''
    };

    const submitFn = (payload) => {
        // payload is the formState from AddModal
        const newVidLink = { vtitle: payload.vtitle, vlink: payload.vlink };
        if (isFromFaqs) {
            // some thunks expect (data, id) signature; wrap in a thunk to dispatch properly
            return (dispatch) => dispatch(addFaqVidLink(newVidLink, faqID));
        }
        return (dispatch) => dispatch(addVidLink(newVidLink, quizID));
    };

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} type="text" name="vtitle" placeholder="Video Title ..." className="form-control mb-3" onChange={onChange} value={formState.vtitle} />
                </div>

                <div className="mb-2">
                    <label><strong>Link</strong></label>
                    <input type="text" name="vlink" placeholder="Video link ..." className="form-control mb-3" onChange={onChange} value={formState.vlink} />
                </div>
            </div>
        );
    };

    const validateAndNotify = (formState) => {
        const { vtitle, vlink } = formState;
        if (!vtitle || !vlink || vtitle.length < 4 || vlink.length < 4) {
            notify('Insufficient info!', 'error');
            // throw to keep modal open
            throw new Error('validation');
        }
        else if (vtitle.length > 200) {
            notify('Title is too long!', 'error');
            throw new Error('validation');
        }
        else if (vlink.length > 1000) {
            notify('Link is too long!', 'error');
            throw new Error('validation');
        }
        return true;
    };

    // Wrap submitFn so AddModal gets synchronous validation first
    const submitWrapper = async (formState) => {
        validateAndNotify(formState);
        // submitFn returns a thunk; AddModal's runSubmit will dispatch it
        return submitFn(formState);
    };

    return (
        <AddModal
            title="Add a YouTube Video Link"
            submitFn={submitWrapper}
            renderForm={renderForm}
            initialState={initialState}

            triggerText={'+ Video'}
        />
    );
};

export default AddVideo;