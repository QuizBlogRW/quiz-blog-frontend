import AddModal from '@/utils/AddModal';
import { sendBroadcast } from '@/redux/slices/broadcastsSlice';
import { useSelector } from 'react-redux';
import { notify } from '@/utils/notifyToast';

const BroadcastModal = () => {
    const { user } = useSelector(state => state.auth);
    const userId = user && user._id;

    const initialState = { title: '', message: '' };

    const renderForm = (formState, setFormState, firstInputRef) => (
        <>
            <label><strong>Title</strong></label>
            <input ref={firstInputRef} type="text" name="title" placeholder="Broadcast title ..." className="form-control mb-3" onChange={e => setFormState({ ...formState, title: e.target.value })} value={formState.title || ''} />

            <label><strong>Message</strong></label>
            <textarea name="message" placeholder="Broadcast message ..." className="form-control mb-3" minLength="5" maxLength="1000" onChange={e => setFormState({ ...formState, message: e.target.value })} value={formState.message || ''} />
        </>
    );

    const submitFn = (formState) => {
        const { title, message } = formState;
        if (!title || title.length < 4 || !message || message.length < 4) {
            notify('Insufficient info!', 'error');
            throw new Error('validation');
        }
        if (title.length > 200) {
            notify('Title is too long!', 'error');
            throw new Error('validation');
        }
        if (message.length > 1000) {
            notify('message is too long!', 'error');
            throw new Error('validation');
        }

        const newMessage = { title, message, sent_by: userId };
        return sendBroadcast(newMessage);
    };

    return (
        <AddModal
            title="Send a broadcast message"
            triggerText={"Broadcast"}
            initialState={initialState}
            submitFn={submitFn}
            renderForm={renderForm}
        />
    );
};

export default BroadcastModal;
