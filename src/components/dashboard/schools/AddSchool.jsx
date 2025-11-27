import AddModal from '@/utils/AddModal';
import { createSchool } from '@/redux/slices/schoolsSlice';
import validators from '@/utils/validators';
import { Input } from 'reactstrap';

const AddSchool = () => {

    return (
        <AddModal
            title="Add New School"
            triggerText="School"
            initialState={{ title: '', location: '', website: '' }}
            submitFn={data => {
                const { title, location, website } = data;
                // const res = validators.validateWebsite(title, location); // not ideal but reuse validators
                // We'll use validateTitleDesc for title/location and validateWebsite for website
                const res2 = validators.validateTitleDesc(title, location, { minTitle: 3, minDesc: 4, maxTitle: 70, maxDesc: 120 });
                if (!res2.ok) return Promise.reject(new Error('validation'));
                const websiteRes = validators.validateWebsite(website);
                if (!websiteRes.ok) return Promise.reject(new Error('validation'));
                return createSchool({ title, location, website });
            }}
            renderForm={(state, setState, firstInputRef) => (
                <>
                    <Input ref={firstInputRef} type="text" name="title" id="title" placeholder="School title ..." className="mb-3" onChange={e => setState({ ...state, title: e.target.value })} value={state.title || ''} />
                    <Input type="text" name="location" id="location" placeholder="School location ..." className="mb-3" onChange={e => setState({ ...state, location: e.target.value })} value={state.location || ''} />
                    <Input type="text" name="website" id="website" placeholder="School website ..." className="mb-3" onChange={e => setState({ ...state, website: e.target.value })} value={state.website || ''} />
                </>
            )}
        />
    );
};

export default AddSchool;