import AddModal from '@/utils/AddModal';
import { createAdvert } from '@/redux/slices/advertsSlice';
import { Input } from 'reactstrap';

const CreateAdvert = () => {

    return (
        <AddModal
            title="Create Advert"
            triggerText="Create Advert"
            initialState={{ caption: '', phone: '', owner: '', email: '', link: '', advert_image: null }}
            submitFn={data => {
                const { caption, phone, owner, email, link, advert_image } = data;
                if (!caption || caption.length < 4 || !phone || phone.length < 4 || !owner || owner.length < 4 || !email || email.length < 4) {
                    return Promise.reject(new Error('validation'));
                }

                const formData = new FormData();
                formData.append('caption', caption);
                formData.append('phone', phone);
                formData.append('owner', owner);
                formData.append('email', email);
                formData.append('link', link || '');
                if (advert_image) formData.append('advert_image', advert_image);

                return createAdvert(formData);
            }}
            renderForm={(state, setState, firstInputRef) => (
                <>
                    <Input ref={firstInputRef} type="text" name="caption" placeholder="Advert caption ..." className="mb-3" onChange={e => setState({ ...state, caption: e.target.value })} value={state.caption || ''} />
                    <Input type="text" name="owner" placeholder="Advert owner ..." className="mb-3" onChange={e => setState({ ...state, owner: e.target.value })} value={state.owner || ''} />
                    <Input type="text" name="email" placeholder="Email ..." className="mb-3" onChange={e => setState({ ...state, email: e.target.value })} value={state.email || ''} />
                    <Input type="text" name="link" placeholder="Link if any ..." className="mb-3" onChange={e => setState({ ...state, link: e.target.value })} value={state.link || ''} />
                    <Input type="text" name="phone" placeholder="Phone ..." className="mb-3" onChange={e => setState({ ...state, phone: e.target.value })} value={state.phone || ''} />
                    <Input bsSize="sm" type="file" accept=".jpg, .jpeg, .png, .svg" name="advert_image" onChange={e => setState({ ...state, advert_image: e.target.files && e.target.files[0] })} id="advert_image" />
                </>
            )}
        />
    );
};

export default CreateAdvert;