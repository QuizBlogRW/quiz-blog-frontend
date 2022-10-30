import React, { useState, useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import DeleteIcon from '../../images/remove.svg';
import { connect } from 'react-redux'
import { getSchools, deleteSchool } from '../../redux/schools/schools.actions';
import { fetchSchoolLevels, deleteLevel } from '../../redux/levels/levels.actions';
import AddSchool from './AddSchool';
import AddLevel from './AddLevel';
import AddFaculty from './AddFaculty';
import EditSchoolModal from './EditSchoolModal';
import ReactLoading from "react-loading";
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import FacultiesCollapse from './FacultiesCollapse';
import EditLevelModal from './EditLevelModal';
import SpinningBubbles from '../rLoading/SpinningBubbles';


const SchoolsLanding = ({ getSchools, fetchSchoolLevels, schools, schoolLevels, deleteLevel, deleteSchool, auth }) => {

    // Lifecycle methods
    useEffect(() => { getSchools() }, [getSchools]);

    const [schoolState, setSchoolState] = useState([])
    useEffect(() => { setSchoolState(schools && schools.allSchools) }, [schools])

    const [levelsState, setLevelsState] = useState([])
    useEffect(() => { setLevelsState(schoolLevels && schoolLevels) }, [schoolLevels])

    const [schoolToEdit, setSchoolToEdit] = useState('')

    const levelsHandler = (e) => {
        e.preventDefault()
        setSchoolToEdit(e.target.value)
        fetchSchoolLevels(e.target.value)
    }

    return (

        auth.isAuthenticated ?

            auth.user.role === 'Visitor' ?

                <Webmaster auth={auth} /> :
                <>
                    <Row className="add-school mt-lg-5 mx-lg-5 px-lg-5 py-lg-3 d-flex justify-content-around align-items-center border rounded">
                        <h5 className='font-weight-bolder text-info d-none d-sm-block'>SCHOOLS | LEVELS | FACULTIES | YEARS</h5>
                        <Button size="lg" outline color="dark" className="m-2 m-sm-0 ml-auto p-0 p-sm-1">
                            <strong><AddSchool auth={auth} /></strong>
                        </Button>
                    </Row>

                    <Row className="select-add-school mt-lg-5 mx-lg-5 px-lg-5 pt-lg-3 d-flex justify-content-around align-items-center bg-light border rounded border-success">

                        {
                            !schools.isLoading ?
                                <Form>
                                    <FormGroup>
                                        <Label for="schoolSelect" className='mt-2 mt-sm-0'>
                                            <u className='font-weight-bold'>Select School</u>
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

                                <ReactLoading type="spinningBubbles" color="#33FFFC" />
                        }


                        <div className="d-flex align-items-center">
                            {schoolToEdit && <span>
                                <Button size="sm" color="link" className="mx-1">
                                    <EditSchoolModal auth={auth} idToUpdate={schoolToEdit} />
                                </Button>
                                <Button size="sm" color="link" className="mr-1" onClick={() => deleteSchool(schoolToEdit)}>
                                    <img src={DeleteIcon} alt="" width="14" height="14" />
                                </Button>
                            </span>}
                            <Button size="md" outline color="warning" className="ml-auto mb-3 mb-sm-0">
                                <strong><AddLevel auth={auth} schools={schoolState} /></strong>
                            </Button>
                        </div>

                    </Row>

                    <Row className="display-details min-vh-100 mt-lg-2 mx-lg-4 px-lg-5 ">
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
                                                            <h6 className='font-weight-bold'>
                                                                {level.title}
                                                            </h6>
                                                            <span>
                                                                <Button size="sm" color="link" className="mx-1">
                                                                    <EditLevelModal auth={auth} idToUpdate={level._id} editTitle={level.title} />
                                                                </Button>
                                                                <Button size="sm" color="link" className="mr-1" onClick={() => deleteLevel(level._id)}>
                                                                    <img src={DeleteIcon} alt="" width="14" height="14" />
                                                                </Button>
                                                            </span>
                                                        </div>
                                                    </Tab>)}
                                        </TabList>

                                        {levelsState.length === 0 ?
                                            <Alert color="danger">Select school with levels!</Alert> :

                                            levelsState.map(level =>
                                                <TabPanel key={level._id}>

                                                    <Row className="mt-lg-3 ml-lg-5 pl-lg-5 pt-lg-3 d-flex justify-content-around align-items-center">
                                                        <Button size="md" outline color="info" className="ml-auto">
                                                            <strong>
                                                                <AddFaculty auth={auth} facultyLevel={level} />
                                                            </strong>
                                                        </Button>
                                                    </Row>

                                                    <FacultiesCollapse auth={auth} levelID={level._id} />
                                                </TabPanel>
                                            )}
                                    </Tabs>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'}
                            isAuthenticated={auth.isAuthenticated} />
                }
            </div>
    )
}

// Map the question to state props
const mapStateToProps = state => ({
    schools: state.schoolsReducer,
    schoolLevels: state.levelsReducer.schoolLevels
});

export default connect(mapStateToProps, { getSchools, fetchSchoolLevels, deleteLevel, deleteSchool })(SchoolsLanding);