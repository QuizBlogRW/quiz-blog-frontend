import React, { useState, useEffect, useContext } from 'react'
import { Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { getSchools, deleteSchool } from '../../redux/slices/schoolsSlice'
import { fetchSchoolLevels, deleteLevel } from '../../redux/slices/levelsSlice'
import { useSelector, useDispatch } from 'react-redux'
import AddSchool from './AddSchool'
import AddLevel from './AddLevel'
import AddFaculty from './AddFaculty'
import EditSchoolModal from './EditSchoolModal'
import Dashboard from '../dashboard/Dashboard'
import FacultiesCollapse from './FacultiesCollapse'
import EditLevelModal from './EditLevelModal'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import { authContext, currentUserContext, logRegContext } from '../../appContexts'
import DeleteModal from '../../utils/DeleteModal'

const SchoolsLanding = () => {

    // Redux
    const schools = useSelector(state => state.schools)
    const schoolLevels = useSelector(state => state.levels.schoolLevels)
    const dispatch = useDispatch()

    // context
    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)
    const { toggleL } = useContext(logRegContext)

    // Lifecycle methods
    useEffect(() => { dispatch(getSchools()) }, [dispatch])

    const [schoolState, setSchoolState] = useState([])
    useEffect(() => { setSchoolState(schools && schools.allSchools) }, [schools])

    const [levelsState, setLevelsState] = useState([])
    useEffect(() => { setLevelsState(schoolLevels && schoolLevels) }, [schoolLevels])

    const [schoolToEdit, setSchoolToEdit] = useState('')

    const levelsHandler = (e) => {
        e.preventDefault()
        setSchoolToEdit(e.target.value)
        dispatch(fetchSchoolLevels(e.target.value))
    }

    return (

        auth.isAuthenticated ?

            currentUser.role === 'Visitor' ?

                <Dashboard /> :
                <>
                    <div className="add-school mt-lg-5 mx-lg-5 px-lg-5 py-lg-3 d-flex justify-content-around align-items-center border rounded">
                        <h5 className='fw-bolder text-info d-none d-sm-block'>SCHOOLS | LEVELS | FACULTIES | YEARS</h5>
                        <Button size="lg" outline color="dark" style={{ display: "inline", marginLeft: "auto", border: "3px solid black" }}>
                            <AddSchool auth={auth} />
                        </Button>
                    </div>

                    <div className="select-add-school mt-lg-5 mx-lg-5 px-lg-5 pt-lg-3 d-flex justify-content-around align-items-center bg-light border rounded border-success">
                        {
                            !schools.isLoading ?
                                <Form>
                                    <FormGroup>
                                        <Label for="schoolSelect" className='mt-2 mt-sm-0'>
                                            <u className='fw-bolder'>Select School</u>
                                        </Label>

                                        <Input type="select" onChange={levelsHandler}>
                                            <option>-- Select --</option>
                                            {schoolState.map(school =>
                                                <option key={school._id} value={school._id}>
                                                    {school.title}
                                                </option>
                                            )}
                                        </Input>
                                    </FormGroup>
                                </Form> :

                                <QBLoadingSM />
                        }


                        <div className="d-flex align-items-center">
                            {schoolToEdit && <span>
                                <Button size="sm" color="link" className="mx-1">
                                    <EditSchoolModal idToUpdate={schoolToEdit} auth={auth} />
                                </Button>
                                <DeleteModal deleteFnName="deleteSchool" deleteFn={deleteSchool} delID={schoolToEdit} />
                            </span>}
                            <Button size="md" outline color="warning" className="ms-auto mb-3 mb-sm-0">
                                <strong><AddLevel schools={schoolState} auth={auth} /></strong>
                            </Button>
                        </div>

                    </div>

                    <div className="display-details min-vh-100 mt-lg-2 mx-lg-4 px-lg-5 ">
                        <Col>
                            <div className="docDetails">
                                <div className="tabs">
                                    <Tabs>
                                        <TabList>
                                            {levelsState.length === 0 ?
                                                null :
                                                levelsState.map(level =>
                                                    <Tab key={level._id}>
                                                        <div className='d-flex'>
                                                            <h6 className='fw-bolder'>
                                                                {level.title}
                                                            </h6>
                                                            <span>
                                                                <Button size="sm" color="link" className="mx-1">
                                                                    <EditLevelModal idToUpdate={level._id} editTitle={level.title} auth={auth} />
                                                                </Button>
                                                                <DeleteModal deleteFnName="deleteLevel" deleteFn={deleteLevel} delID={level._id} delTitle={level.title} />
                                                            </span>
                                                        </div>
                                                    </Tab>)}
                                        </TabList>

                                        {levelsState.length === 0 ?
                                            <Alert color="danger">Select school with levels!</Alert> :

                                            levelsState.map(level =>
                                                <TabPanel key={level._id}>

                                                    <div className="mt-lg-3 ms-lg-5 pl-lg-5 pt-lg-3 d-flex justify-content-around align-items-center">
                                                        <Button size="md" outline color="info" className="ms-auto">
                                                            <strong>
                                                                <AddFaculty facultyLevel={level} auth={auth} />
                                                            </strong>
                                                        </Button>
                                                    </div>

                                                    <FacultiesCollapse levelID={level._id} auth={auth} />
                                                </TabPanel>
                                            )}
                                    </Tabs>
                                </div>
                            </div>
                        </Col>
                    </div>
                </> :

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

export default SchoolsLanding