import { useState, useEffect } from 'react';
import { Col, Form, FormGroup, Label, Input, Button, Alert, TabPane } from 'reactstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { getSchools, deleteSchool, createSchool } from '@/redux/slices/schoolsSlice';
import { fetchSchoolLevels, deleteLevel, createLevel } from '@/redux/slices/levelsSlice';
import { useSelector, useDispatch } from 'react-redux';
import AddModal from '@/utils/AddModal';
import { createFaculty } from '@/redux/slices/facultiesSlice';
import { notify } from '@/utils/notifyToast';
import validators from '@/utils/validators';
import EditSchoolModal from './EditSchoolModal';
import FacultiesCollapse from './FacultiesCollapse';
import EditLevelModal from './EditLevelModal';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import DeleteModal from '@/utils/DeleteModal';

const SchoolsTabPane = () => {

    // Redux
    const schools = useSelector(state => state.schools);
    const schoolLevels = useSelector(state => state.levels.schoolLevels);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    // State
    const [selectedSchool, setSelectedSchool] = useState('');
    const [schoolList, setSchoolList] = useState([]);
    const [levelList, setLevelList] = useState([]);

    // Lifecycle methods
    useEffect(() => {
        dispatch(getSchools());
    }, [dispatch]);

    useEffect(() => {
        setSchoolList(schools.allSchools || []);
        setLevelList(schoolLevels || []);
    }, [schools, schoolLevels]);

    const handleSchoolChange = (e) => {
        e.preventDefault();
        setSelectedSchool(e.target.value);
        dispatch(fetchSchoolLevels(e.target.value));
    };

    const renderSchoolOptions = () => (
        schoolList.map(school => (
            <option key={school._id} value={school._id}>
                {school.title}
            </option>
        ))
    );

    const renderLevelTabs = () => (
        levelList.map(level => (
            <Tab key={level._id}>
                <div className='d-flex'>
                    <h6 className='fw-bolder'>{level.title}</h6>
                    <span>
                        <Button size="sm" color="link" className="mx-1">
                            <EditLevelModal idToUpdate={level._id} editTitle={level.title} />
                        </Button>
                        <DeleteModal deleteFnName="deleteLevel" deleteFn={deleteLevel} delID={level._id} delTitle={level.title} />
                    </span>
                </div>
            </Tab>
        ))
    );

    const renderLevelPanels = () => (
        levelList.map(level => (
            <TabPanel key={level._id}>
                <div className="mt-lg-3 ms-lg-5 pl-lg-5 pt-lg-3 d-flex justify-content-around align-items-center">
                    <div className="ms-auto d-inline-block">
                        <strong>
                            <AddModal
                                title="Add New Faculty"
                                triggerText="Faculty"
                                initialState={{ title: '', school: level && level.school, level: level && level._id, years: [] }}
                                submitFn={data => {
                                    const { title, years } = data;
                                    const res = validators.validateTitleDesc(title, 'x', { minTitle: 3, minDesc: 1, maxTitle: 70, maxDesc: 1 });
                                    if (!res.ok || !years) {
                                        notify('Insufficient info!', 'error');
                                        return Promise.reject(new Error('validation'));
                                    }
                                    return createFaculty({ ...data, created_by: user && user._id ? user._id : null });
                                }}
                                renderForm={(state, setState, firstInputRef) => (
                                    <FormGroup>
                                        <Label for="title"><strong>Title</strong></Label>
                                        <Input ref={firstInputRef} type="text" name="title" id="title" placeholder="Faculty title ..." className="mb-3" value={state.title || ''} onChange={e => setState({ ...state, title: e.target.value })} required />

                                        <Label for="faculty"><strong>Learning years</strong></Label>
                                        <Input type="select" name="selectYear" onChange={e => {
                                            const yearsnbr = [];
                                            for (let i = 1; i <= e.target.value; i++) {
                                                yearsnbr.push(`Year ${i}`);
                                            }
                                            setState({ ...state, years: yearsnbr });
                                        }}>
                                            <option>-- Select --</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>
                                        </Input>
                                    </FormGroup>
                                )}
                            />
                        </strong>
                    </div>
                </div>
                <FacultiesCollapse levelID={level._id} />
            </TabPanel>
        ))
    );

    return (<TabPane tabId="3">
        <div className="add-school mt-lg-5 mx-lg-5 px-lg-5 py-lg-3 d-flex justify-content-around align-items-center border rounded">
            <h5 className='fw-bolder text-info d-none d-sm-block'>SCHOOLS | LEVELS | FACULTIES | YEARS</h5>
            <div className="d-inline-block" style={{ display: 'inline', marginLeft: 'auto' }}>
                <AddModal
                    title="Add New School"
                    triggerText="School"
                    initialState={{ title: '', location: '', website: '' }}
                    submitFn={data => {
                        const { title, location, website } = data;
                        const res = validators.validateTitleDesc(title, location, { minTitle: 3, minDesc: 4, maxTitle: 70, maxDesc: 120 });
                        if (!res.ok) {
                            notify('Insufficient info!', 'error');
                            return Promise.reject(new Error('validation'));
                        }
                        if (!validators.validateWebsite(website)) {
                            notify('Invalid website!', 'error');
                            return Promise.reject(new Error('validation'));
                        }
                        return createSchool({ ...data, created_by: user && user._id ? user._id : null });
                    }}
                    renderForm={(state, setState, firstInputRef) => (
                        <FormGroup>
                            <Label for="title"><strong>Title</strong></Label>
                            <Input ref={firstInputRef} type="text" name="title" id="title" placeholder="School title ..." className="mb-3" value={state.title || ''} onChange={e => setState({ ...state, title: e.target.value })} required />

                            <Label for="location"><strong>Location</strong></Label>
                            <Input type="text" name="location" id="location" placeholder="School location ..." className="mb-3" value={state.location || ''} onChange={e => setState({ ...state, location: e.target.value })} required />

                            <Label for="website"><strong>Website</strong></Label>
                            <Input type="text" name="website" id="website" placeholder="School website ..." className="mb-3" value={state.website || ''} onChange={e => setState({ ...state, website: e.target.value })} required />
                        </FormGroup>
                    )}
                />
            </div>
        </div>

        <div className="select-add-school mt-lg-5 mx-lg-5 px-lg-5 pt-lg-3 d-flex justify-content-around align-items-center bg-light border rounded border-success">
            {!schools.isLoading ? (
                <Form>
                    <FormGroup>
                        <Label for="schoolSelect" className='mt-2 mt-sm-0'>
                            <u className='fw-bolder'>Select School</u>
                        </Label>
                        <Input type="select" onChange={handleSchoolChange}>
                            <option value=''>{selectedSchool ? schoolList.find(school => school._id === selectedSchool)?.title : '-- Select --'}</option>
                            {renderSchoolOptions()}
                        </Input>
                    </FormGroup>
                </Form>
            ) : (
                <QBLoadingSM />
            )}

            <div className="d-flex align-items-center">
                {selectedSchool && (
                    <>
                        <span className="mx-1 d-inline-block">
                            <EditSchoolModal idToUpdate={selectedSchool} />
                        </span>
                        <span className="mx-1 d-inline-block">
                            <DeleteModal deleteFnName="deleteSchool" deleteFn={deleteSchool} delID={selectedSchool} />
                        </span>
                    </>
                )}
                <div className="ms-auto mb-3 mb-sm-0 d-inline-block">
                    <strong>
                        <AddModal
                            title="Add New Level"
                            triggerText="Level"
                            initialState={{ title: '', school: '' }}
                            submitFn={data => {
                                const { title, school } = data;
                                const res = validators.validateTitleDesc(title, 'x', { minTitle: 3, minDesc: 1, maxTitle: 70, maxDesc: 1 });
                                if (!res.ok || !school) {
                                    notify('Insufficient info!', 'error');
                                    return Promise.reject(new Error('validation'));
                                }
                                return createLevel({ ...data, created_by: user && user._id ? user._id : null });
                            }}
                            renderForm={(state, setState, firstInputRef) => (
                                <FormGroup>
                                    <Label for="title"><strong>Title</strong></Label>
                                    <Input ref={firstInputRef} type="text" name="title" id="title" placeholder="Level title ..." className="mb-3" value={state.title || ''} onChange={e => setState({ ...state, title: e.target.value })} required />

                                    <Label for="school"><strong>School</strong></Label>
                                    <Input type="select" name="school" value={state.school || ''} onChange={e => setState({ ...state, school: e.target.value })}>
                                        <option value="">--Choose a School--</option>
                                        {schoolList.map(school => (
                                            <option key={school._id} value={school._id}>{school.title}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            )}
                        />
                    </strong>
                </div>
            </div>
        </div>

        <div className="display-details min-vh-100 mt-lg-2 mx-lg-4 px-lg-5">
            <Col>
                <div className="docDetails">
                    <div className="tabs">
                        <Tabs>
                            <TabList>
                                {levelList.length === 0 ? null : renderLevelTabs()}
                            </TabList>

                            {levelList.length === 0 ? (
                                <Alert color="danger">Select school with levels!</Alert>
                            ) : (
                                renderLevelPanels()
                            )}
                        </Tabs>
                    </div>
                </div>
            </Col>
        </div>
    </TabPane>
    );
};

export default SchoolsTabPane;
