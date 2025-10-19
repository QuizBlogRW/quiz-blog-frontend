import { useState, useEffect } from 'react'
import { Col, Form, FormGroup, Label, Input, Button, Alert, TabPane } from 'reactstrap'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { getSchools, deleteSchool } from '@/redux/slices/schoolsSlice'
import { fetchSchoolLevels, deleteLevel } from '@/redux/slices/levelsSlice'
import { useSelector, useDispatch } from 'react-redux'
import AddSchool from './AddSchool'
import AddLevel from './AddLevel'
import AddFaculty from './AddFaculty'
import EditSchoolModal from './EditSchoolModal'
import FacultiesCollapse from './FacultiesCollapse'
import EditLevelModal from './EditLevelModal'
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM'
import DeleteModal from '@/utils/DeleteModal'

const SchoolsTabPane = () => {

    // Redux
    const schools = useSelector(state => state.schools)
    const schoolLevels = useSelector(state => state.levels.schoolLevels)
    const dispatch = useDispatch()

    // State
    const [selectedSchool, setSelectedSchool] = useState('')
    const [schoolList, setSchoolList] = useState([])
    const [levelList, setLevelList] = useState([])

    // Lifecycle methods
    useEffect(() => {
        dispatch(getSchools())
    }, [dispatch])

    useEffect(() => {
        setSchoolList(schools.allSchools || [])
        setLevelList(schoolLevels || [])
    }, [schools, schoolLevels])

    const handleSchoolChange = (e) => {
        e.preventDefault()
        setSelectedSchool(e.target.value)
        dispatch(fetchSchoolLevels(e.target.value))
    }

    const renderSchoolOptions = () => (
        schoolList.map(school => (
            <option key={school._id} value={school._id}>
                {school.title}
            </option>
        ))
    )

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
    )

    const renderLevelPanels = () => (
        levelList.map(level => (
            <TabPanel key={level._id}>
                <div className="mt-lg-3 ms-lg-5 pl-lg-5 pt-lg-3 d-flex justify-content-around align-items-center">
                    <Button size="md" outline color="info" className="ms-auto">
                        <strong>
                            <AddFaculty facultyLevel={level} />
                        </strong>
                    </Button>
                </div>
                <FacultiesCollapse levelID={level._id} />
            </TabPanel>
        ))
    )

    return (<TabPane tabId="3">
        <div className="add-school mt-lg-5 mx-lg-5 px-lg-5 py-lg-3 d-flex justify-content-around align-items-center border rounded">
            <h5 className='fw-bolder text-info d-none d-sm-block'>SCHOOLS | LEVELS | FACULTIES | YEARS</h5>
            <Button size="sm" outline color="dark" style={{ display: "inline", marginLeft: "auto", border: "3px solid black" }}>
                <AddSchool />
            </Button>
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
                    <span>
                        <Button size="sm" color="link" className="mx-1">
                            <EditSchoolModal idToUpdate={selectedSchool} />
                        </Button>
                        <DeleteModal deleteFnName="deleteSchool" deleteFn={deleteSchool} delID={selectedSchool} />
                    </span>
                )}
                <Button size="md" outline color="warning" className="ms-auto mb-3 mb-sm-0">
                    <strong><AddLevel schools={schoolList} /></strong>
                </Button>
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
    )
}

export default SchoolsTabPane
