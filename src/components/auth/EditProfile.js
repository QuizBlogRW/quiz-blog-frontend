import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'
import { Button, Row, Col, Form, FormGroup, Label, Input, Breadcrumb, BreadcrumbItem, Alert, Progress } from 'reactstrap';
import LoginModal from '../auth/LoginModal'
import { connect } from 'react-redux';
import { updateProfile } from '../../redux/auth/auth.actions';
import { getSchools } from '../../redux/schools/schools.actions';
import { fetchSchoolLevels } from '../../redux/levels/levels.actions';
import { fetchLevelFaculties } from '../../redux/faculties/faculties.actions';
import SpinningBubbles from '../rLoading/SpinningBubbles';
import { authContext } from '../../appContexts';

const EditProfile = ({ getSchools, schools, fetchSchoolLevels, schoolLevels, fetchLevelFaculties, levelFaculties, updateProfile, errors, successful }) => {

    // Context
    const auth = useContext(authContext)

    // Access route parameters & history
    const { userId } = useParams()

    // Alert
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    const [progress, setProgress] = useState(false);

    const profile = auth && auth.user
    const [profileState, setProfileState] = useState(profile)
    useEffect(() => { setProfileState(profile) }, [profile])

    const inters = profile && profile.interests
    const [interestsState, setInterestsState] = useState(inters && inters)
    useEffect(() => { setInterestsState(inters) }, [inters])

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    // Schools data
    useEffect(() => { getSchools(); }, [getSchools]);

    const [schoolState, setSchoolState] = useState([])
    useEffect(() => { setSchoolState(schools && schools.allSchools) }, [schools])

    // Levels
    const [levelsState, setLevelsState] = useState([])
    useEffect(() => { setLevelsState(schoolLevels && schoolLevels) }, [schoolLevels])

    const levelsHandler = (e) => {
        e.preventDefault()
        setProfileState(profileState => ({ ...profileState, school: e.target.value }))
        fetchSchoolLevels(e.target.value)
    }

    // Faculties
    const [facultiesState, setFacultiesState] = useState([])
    useEffect(() => { setFacultiesState(levelFaculties && levelFaculties) }, [levelFaculties])

    const facultiesHandler = (e) => {
        e.preventDefault()
        setProfileState(profileState => ({ ...profileState, level: e.target.value }))
        fetchLevelFaculties(e.target.value)
    }

    // Years
    const [yearsState, setYearsState] = useState([])
    const yearsHandler = (e) => {
        e.preventDefault()
        setProfileState(profileState => ({ ...profileState, faculty: e.target.value }))
        const selectedFaculty = facultiesState.filter(fac => fac._id === e.target.value)
        setYearsState(selectedFaculty[0].years)
    }

    // All
    const allSelectsHandler = (e) => {
        e.preventDefault()
        setProfileState(profileState => ({ ...profileState, year: e.target.value }))
    }

    // Handle non select fields
    const onChangeHandler = e => {
        const { name, value } = e.target
        setProfileState(profileState => ({ ...profileState, [name]: value }))
    }

    const handleInterestsChangeInput = (id, e) => {
        const { name, value } = e.target
        const updatedInterests = interestsState && interestsState.map((oneInterest, index) => {

            if (id === index) {
                oneInterest[name] = value
            }
            return oneInterest;
        })

        setInterestsState((updatedInterests));
    }

    const handleAddFields = () => {
        setInterestsState([...interestsState, { favorite: '' }])
    }

    const handleRemoveFields = _id => {

        const values = [...interestsState];
        values.splice(values.findIndex((value, index) => index === _id), 1);
        setInterestsState(values);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // VALIDATE
        if (profileState.name.about < 4 || profileState.name.length < 4 || profileState.school.length < 4 || profileState.year.length < 4 || profileState.faculty.length < 4 || profileState.level.length < 4) {
            setErrorsState(['Insufficient info!']);
            return
        }

        else if (profileState.name.length > 100 || profileState.school.length > 100 || profileState.year.length > 100 || profileState.faculty.length > 100 || profileState.level.length > 100) {
            setErrorsState(['Too long!']);
            return
        }

        else if (profileState.about.length > 2000) {
            setErrorsState(['Too long!']);
            return
        }

        else if (interestsState.length > 20) {
            alert('Limit reached!')
            return
        }

        const updatedProfile = {
            uId: userId,
            name: profileState.name,
            school: profileState.school,
            level: profileState.level,
            faculty: profileState.faculty,
            year: profileState.year,
            interests: interestsState,
            about: profileState.about
        }

        updateProfile(updatedProfile);
        setProgress(true)
    };

    return (
        auth.isAuthenticated ?

            <Form className="my-3 mt-lg-5 mx-3 mx-lg-5 edit-question" onSubmit={handleSubmit}>

                <Row className="mb-0 mb-lg-3 mx-0">
                    <Breadcrumb>
                        <BreadcrumbItem>{auth.user && auth.user.name}</BreadcrumbItem>
                        <BreadcrumbItem>{auth.user && auth.user.email}</BreadcrumbItem>
                        <BreadcrumbItem active>Edit Profile</BreadcrumbItem>
                    </Breadcrumb>
                </Row>

                {/* Error frontend*/}
                {errorsState.length > 0 ?
                    errorsState.map(err =>
                        <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                            {err}
                        </Alert>) :
                    null
                }

                {/* Error backend */}
                {errors.id ?
                    <Alert isOpen={visible} toggle={onDismiss} color='danger' className='border border-warning'>
                        <small>{errors.msg && errors.msg}</small>
                    </Alert> :
                    successful.id ?
                        <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                            <small>{successful.msg && successful.msg}</small>
                        </Alert> : null
                }

                {(progress && !successful.id && !errors.id) ? <Progress animated color="warning" value={100} className='mb-2' /> : null}


                <FormGroup row className="mx-0">
                    <Label sm={3}>Update Name</Label>
                    <Col sm={7}>
                        <Input type="text" name="name" value={(profileState && profileState.name) || ''} placeholder="Name here ..." onChange={onChangeHandler} />
                    </Col>
                    <Col sm={2}>
                        <Input disabled type="text" value='Current Record' className='text-success' />
                    </Col>
                </FormGroup>

                <FormGroup row className="mx-0">
                    <Label sm={3}>Update School</Label>
                    <Col sm={7}>
                        <Input type="select" onChange={levelsHandler} value={(profileState && profileState.school) || ''} required>
                            <option>-- Select your school--</option>
                            {schoolState.map(school =>
                                <option key={school._id} value={school._id}>
                                    {school.title}
                                </option>
                            )}
                        </Input>
                    </Col>
                    <Col sm={2}>
                        <Input disabled type="text"
                            value={(profileState && profileState.school && profileState.school.title) || ''} />
                    </Col>
                </FormGroup>

                <FormGroup row className={`mx-0 ${levelsState.length > 0 ? '' : 'd-none'}`}>
                    <Label sm={3}>Update Level</Label>
                    <Col sm={7}>
                        <Input type="select" onChange={facultiesHandler}
                            value={(profileState && profileState.level) || ''} required>
                            <option>-- Select your level--</option>
                            {levelsState.map(level =>
                                <option key={level._id} value={level._id}>
                                    {level.title}
                                </option>
                            )}
                        </Input>
                    </Col>
                    <Col sm={2}>
                        <Input disabled type="text"
                            value={(profileState && profileState.level && profileState.level.title) || ''} />
                    </Col>
                </FormGroup>

                <FormGroup row className={`mx-0 ${facultiesState.length > 0 ? '' : 'd-none'}`}>
                    <Label sm={3}>Update Faculty</Label>
                    <Col sm={7}>
                        <Input type="select" onChange={yearsHandler}
                            value={(profileState && profileState.faculty) || ''} required>
                            <option>-- Select your faculty--</option>
                            {facultiesState.map(faculty =>
                                <option key={faculty._id} value={faculty._id}>
                                    {faculty.title}
                                </option>
                            )}
                        </Input>
                    </Col>
                    <Col sm={2}>
                        <Input disabled type="text"
                            value={(profileState && profileState.faculty && profileState.faculty.title) || ''} />
                    </Col>
                </FormGroup>

                <FormGroup row className={`mx-0 ${yearsState.length > 0 ? '' : 'd-none'}`}>
                    <Label sm={3}>Update Year</Label>
                    <Col sm={7}>
                        <Input type="select" onChange={allSelectsHandler}
                            value={(profileState && profileState.year) || ''} required>
                            <option>-- Select the year--</option>
                            {yearsState.map(year =>
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            )}
                        </Input>
                    </Col>

                    <Col sm={2}>
                        <Input disabled type="text" value={''} />
                    </Col>

                </FormGroup>

                {
                    interestsState && interestsState.length < 1 ?
                        <FormGroup row className="mx-0">
                            <Label sm={3}>Update Interest</Label>

                            <Col sm={9} className="my-3 my-sm-2">
                                <strong className='text-info'>Add Favorite Subject &nbsp;</strong>
                                <Button className="px-2 py-1" color="success" onClick={handleAddFields}> + </Button>{' '}
                            </Col>
                        </FormGroup> :

                        interestsState && interestsState.map((interest, index) => (
                            <FormGroup row className="mx-0" key={index}>
                                <Label sm={3}>Update Interest</Label>

                                <Col sm={7}>
                                    <Input type="text" name="favorite" value={interest.favorite || ''} placeholder="New interest here ..." onChange={event => handleInterestsChangeInput(index, event)} />
                                </Col>

                                <Col sm={2} className="my-3 my-sm-2">
                                    <Button className="px-2 py-1" disabled={interestsState && interestsState.length <= 1} color="danger" onClick={() => handleRemoveFields(index)}> - </Button>{' '}

                                    <Button className="px-2 py-1" color="success" onClick={handleAddFields}> + </Button>{' '}
                                </Col>
                            </FormGroup>
                        ))}

                <FormGroup row className="mx-0">
                    <Label sm={3}>Update About You</Label>
                    <Col sm={9}>
                        <Input type="textarea" name="about" placeholder="about you ..." minLength="5" maxLength="2000" onChange={onChangeHandler} value={(profileState && profileState.about) || ''} />
                    </Col>
                </FormGroup>

                <FormGroup check row className="mx-0">
                    <Col sm={{ size: 10, offset: 2 }} className="pl-0">
                        <Button className="btn btn-info btn-sm" type="submit" onClick={handleSubmit}>Update</Button>
                    </Col>
                </FormGroup>

            </Form> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                }
            </div>
    )
}

// Map the question to state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer,
    schools: state.schoolsReducer,
    schoolLevels: state.levelsReducer.schoolLevels,
    levelFaculties: state.facultiesReducer.levelFaculties
});

export default connect(mapStateToProps, { getSchools, fetchSchoolLevels, fetchLevelFaculties, updateProfile })(EditProfile);