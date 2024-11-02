import React, { useState, useEffect, useContext } from 'react'
import { Button, Row, Col, Form, FormGroup, Label, Input, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { updateProfile } from '../../redux/slices/authSlice'
import { getSchools } from '../../redux/slices/schoolsSlice'
import { fetchSchoolLevels } from '../../redux/slices/levelsSlice'
import { fetchLevelFaculties } from '../../redux/slices/facultiesSlice'
import { authContext, currentUserContext, logRegContext } from '../../appContexts'
import QBLoadingSM from '../rLoading/QBLoadingSM'

const EditProfile = () => {

    // Access route parameters & history
    const { userId } = useParams()

    // Context API data
    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)
    const { toggleL } = useContext(logRegContext)

    // Redux - Selecting the state from the store
    const schools = useSelector(state => state.schools.allSchools)
    const schoolLevels = useSelector(state => state.levels.schoolLevels)
    const levelFaculties = useSelector(state => state.faculties.levelFaculties)

    const profile = currentUser && currentUser
    const [profileState, setProfileState] = useState(profile)
    useEffect(() => { setProfileState(profile) }, [profile])

    const inters = profile && profile.interests
    const [interestsState, setInterestsState] = useState(inters && inters)
    useEffect(() => { setInterestsState(inters) }, [inters])

    // States 
    const [schoolState, setSchoolState] = useState([])
    const [levelsState, setLevelsState] = useState([])
    const [facultiesState, setFacultiesState] = useState([])
    const [yearsState, setYearsState] = useState([])

    // Get schools and update school state
    const dispatch = useDispatch()
    useEffect(() => { dispatch(getSchools()) }, [dispatch])
    useEffect(() => { setSchoolState(schools && schools) }, [schools])

    // Get levels from selected school and update levels state
    const levelsHandler = (e) => {
        e.preventDefault()
        setProfileState(profileState => ({ ...profileState, school: e.target.value }))
        dispatch(fetchSchoolLevels(e.target.value))
    }
    useEffect(() => { setLevelsState(schoolLevels && schoolLevels) }, [schoolLevels])

    // Get faculties from selected level and update faculties state
    const facultiesHandler = (e) => {
        e.preventDefault()
        setProfileState(profileState => ({ ...profileState, level: e.target.value }))
        dispatch(fetchLevelFaculties(e.target.value))
    }
    useEffect(() => { setFacultiesState(levelFaculties && levelFaculties) }, [levelFaculties])

    // Get years from selected faculty and update years state
    const yearsHandler = (e) => {
        e.preventDefault()
        setProfileState(profileState => ({ ...profileState, faculty: e.target.value }))
        const selectedFaculty = facultiesState.filter(fac => fac._id === e.target.value)
        setYearsState(selectedFaculty && selectedFaculty[0].years)
    }
    useEffect(() => { setYearsState(yearsState) }, [yearsState])

    // Handle select fields for all selects
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
            return oneInterest
        })
        setInterestsState((updatedInterests))
    }

    const handleAddFields = () => {
        setInterestsState([...interestsState, { favorite: '' }])
    }

    const handleRemoveFields = _id => {
        const values = [...interestsState]
        values.splice(values.findIndex((value, index) => index === _id), 1)
        setInterestsState(values)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // VALIDATE
        if (profileState.name.about < 4 || profileState.name.length < 4 || profileState.school.length < 4 || profileState.year.length < 4 || profileState.faculty.length < 4 || profileState.level.length < 4) {
            notify('Insufficient info!')
            return
        }

        else if (profileState.name.length > 100 || profileState.school.length > 100 || profileState.year.length > 100 || profileState.faculty.length > 100 || profileState.level.length > 100) {
            notify('Too long!')
            return
        }

        else if (profileState.about.length > 2000) {
            notify('Too long!')
            return
        }

        else if (interestsState && interestsState.length > 20) {
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

        // Attempt to update
        dispatch(updateProfile(updatedProfile))
    }

    return (
        auth.isAuthenticated ?

            <Form className="my-3 mt-lg-5 mx-3 mx-lg-5 edit-question" onSubmit={handleSubmit}>

                <Row className="mb-0 mb-lg-3 mx-0">
                    <Breadcrumb>
                        <BreadcrumbItem>{currentUser && currentUser.name}</BreadcrumbItem>
                        <BreadcrumbItem>{currentUser && currentUser.email}</BreadcrumbItem>
                        <BreadcrumbItem active>Edit Profile</BreadcrumbItem>
                    </Breadcrumb>
                </Row>

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
                        <Input type="select" className="form-control" onChange={levelsHandler} value={(profileState && profileState.school) || ''} required>
                            {profileState && profileState.school ? <option>{profileState.school.title}</option> : <option>-- Select your school--</option>}

                            {schoolState && schoolState.map(school =>
                                <option key={school._id} value={school._id}>
                                    {school.title}
                                </option>
                            )}
                        </Input>
                    </Col>
                    <Col sm={2}>
                        <Input disabled type="text"
                            value={(profileState && profileState.school && profileState.school.title) || ''}
                            style={{ color: "#157A6E" }}
                        />
                    </Col>
                </FormGroup>

                <FormGroup row className={`mx-0 ${levelsState && levelsState.length > 0 ? '' : 'd-none'}`}>
                    <Label sm={3}>Update Level</Label>
                    <Col sm={7}>
                        <Input type="select" className="form-control" onChange={facultiesHandler}
                            value={(profileState && profileState.level) || ''} required>

                            {profileState && profileState.level ? <option>{profileState.level.title}</option> : <option>-- Select your level--</option>}
                            {levelsState && levelsState.map(level =>
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
                        <Input type="select" className="form-control" onChange={yearsHandler}
                            value={(profileState && profileState.faculty) || ''} required>

                            {profileState && profileState.faculty ? <option>{profileState.faculty.title}</option> : <option>-- Select your faculty--</option>}
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

                <FormGroup row className={`mx-0 ${yearsState && yearsState.length > 0 ? '' : 'd-none'}`}>
                    <Label sm={3}>Update Year</Label>
                    <Col sm={7}>
                        <Input type="select" className="form-control" onChange={allSelectsHandler}
                            value={(profileState && profileState.year) || ''} required>

                            {profileState && profileState.year ? <option>{profileState.year}</option> : <option>-- Select your year--</option>}
                            {yearsState && yearsState.map(year =>
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

                <FormGroup check row className="mx-0 mt-md-4">
                    <Col sm={{ size: 10, offset: 2 }} className="pl-0">
                        <Button className="btn btn-info text-white" type="submit" onClick={handleSubmit} style={{ backgroundColor: "#157A6E" }}>
                            Update
                        </Button>
                    </Col>
                </FormGroup>

            </Form> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <QBLoadingSM /> :
                        <Button color="link" className="fw-bolder my-5 border rounded" onClick={toggleL} style={{ backgroundColor: "#ffc107", color: "#157A6E", fontSize: "1.5vw", boxShadow: "-2px 2px 1px 2px #157A6E", border: "2px solid #157A6E" }}>
                            Login first
                        </Button>
                }
            </div>
    )
}

export default EditProfile