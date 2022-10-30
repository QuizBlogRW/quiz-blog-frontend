import React, { useState, useEffect } from 'react'
import { ListGroup, ListGroupItem, Button } from 'reactstrap'
import { Collapse } from "react-collapse"
import AddIcon from '../../images/plusIcon.svg'
import SubtractIcon from '../../images/minusIcon.svg'
import DeleteIcon from '../../images/remove.svg'
import { connect } from 'react-redux'
import { getFaculties, deleteFaculty } from '../../redux/faculties/faculties.actions'
import EditFacultyModal from './EditFacultyModal'

const FacultiesCollapse = ({ auth, getFaculties, deleteFaculty, faculties, levelID }) => {

    // Lifecycle methods
    useEffect(() => { getFaculties() }, [getFaculties])

    const levelFaculties = faculties && faculties.allFaculties.filter(fac => fac.level === levelID)
    const [activeState, setActiveState] = useState({ activeIndex: null })

    const toggleClass = (index, e) => {
        setActiveState({ activeIndex: activeState.activeIndex === index ? null : index })
    }

    let content
    const { activeIndex } = activeState

    content = levelFaculties && levelFaculties.length > 0 ?

        levelFaculties && levelFaculties.map((faculty, index) => {

            return (
                <li key={index}>
                    <div className="titleToggler">
                        <h3>{faculty.title}</h3>

                        <span className='d-flex mr-3'>
                            <Button size="sm" color="link" className="mx-2">
                                <EditFacultyModal auth={auth} idToUpdate={faculty._id} editTitle={faculty.title} />
                            </Button>

                            <Button size="sm" color="link" className="mr-2" onClick={() => deleteFaculty(faculty._id)}>
                                <img src={DeleteIcon} alt="" width="16" height="16" />
                            </Button>

                        <button className="btn btn-primary btn-xs" onClick={() => toggleClass(index)}>
                            <span>
                                <img src={activeState.activeIndex === index ? SubtractIcon : AddIcon} alt="" width="24" height="24" className="mb-1" />
                            </span>
                        </button>
                        </span>
                    </div>

                    <Collapse isOpened={activeIndex === index}>
                        <div className={`alert alert-info msg ${activeIndex === index ? 'show' : 'hide'}`}>

                            <ListGroup>

                                {typeof faculty.years === 'object' ?
                                    faculty.years.map(yer => <ListGroupItem key={yer}>{yer}</ListGroupItem>) : null}
                            </ListGroup>

                        </div>
                    </Collapse>
                </li>
            )
        }) : null

    return (<ul className="docsList mt-lg-5">{content}</ul>)
}
// Map the question to state props
const mapStateToProps = state => ({
    faculties: state.facultiesReducer,
})

export default connect(mapStateToProps, { getFaculties, deleteFaculty })(FacultiesCollapse)