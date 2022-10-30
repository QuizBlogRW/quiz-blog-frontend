import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Col, Row, Button, Spinner } from 'reactstrap'
import ReactLoading from "react-loading"
// import SearchInput from '../SearchInput'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getLandingDisplayNotes, getLandingDisplayNotesNoLimit } from '../../../redux/notes/notes.actions'

const ResponsiveAd = lazy(() => import('../../adsenses/ResponsiveAd'))
const SquareAd = lazy(() => import('../../adsenses/SquareAd'))
const NotesPapersItem = lazy(() => import('./NotesPapersItem'))

const NotesPapers = ({ getLandingDisplayNotes, getLandingDisplayNotesNoLimit, lDLimitedNotes, lDLimitedNotesLoading }) => {

    // const [searchKey, setSearchKey] = useState('')
    const [limit] = useState(10)

    // Lifecycle methods
    useEffect(() => {
        getLandingDisplayNotes(limit)
        // getLandingDisplayNotesNoLimit()
    }, [getLandingDisplayNotes, getLandingDisplayNotesNoLimit, limit])

    return (

        <>
            <Row sm="12" className="px-1 px-lg-4 my-1">
                {/* Google responsive 1 ad */}
                <ResponsiveAd />
            </Row>

            <Row className="m-1 m-sm-3 p-1 px-sm-5 notes-paper">

                {/* <Col sm="8" className="px-1 px-lg-4 mt-md-2"> */}
                <Col sm="12" className="px-0 px-sm-5">
                    <h3 className="mt-0 mt-lg-3 pt-4 py-lg-3 text-danger text-center font-weight-bold">NEWEST NOTES & PAST PAPERS</h3>

                    {lDLimitedNotesLoading ?
                        <div className="p-5 m-5 d-flex justify-content-center align-items-center">
                            <ReactLoading type="spokes" color="#33FFFC" />
                        </div> :
                        <>

                            {/* Search input*/}
                            {/* {
                            lDNotesNoLimitLoading ?
                                <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                    <ReactLoading type="bubbles" color="#33FFFC" /> </div> :
                                <SearchInput setSearchKey={setSearchKey} placeholder=" Search notes here ...  " />
                        } */}

                            {/* {searchKey === "" ? null :

                            lDNotesNoLimit && lDNotesNoLimit
                                .map(note => (

                                    note.title.toLowerCase().includes(searchKey.toLowerCase()) ?
                                        <NotesPapersItem key={note._id} note={note} fromSearch={true} /> : null
                                ))} */}


                            {lDLimitedNotes && lDLimitedNotes
                                .map(note => (
                                    <Suspense key={note._id} fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                                        <Spinner style={{ width: '8rem', height: '8rem' }} />
                                    </div>}>
                                        <NotesPapersItem note={note} />
                                    </Suspense>
                                ))}


                            {/* Newest 10 notes */}
                            {lDLimitedNotes.length > 0 ?

                                <div className="mt-sm-5 mb-sm-4 d-flex justify-content-center">
                                    <Link to="/course-notes">
                                        <Button outline color="info" className='view-all-btn'>
                                            View all notes
                                        </Button>
                                    </Link>
                                </div> :
                                null}
                        </>
                    }
                </Col>
            </Row>
            <Row className="my-1">
                {/* Google square ad */}
                <SquareAd />
            </Row>
        </>
    )
}

const mapStateToProps = state => ({
    lDLimitedNotes: state.notesReducer.allLandingDisplayNotesLimited,
    lDLimitedNotesLoading: state.notesReducer.isLandingDisplayNotesLimitedLoading,
    // lDNotesNoLimit: state.notesReducer.allLandingDisplayNotesNoLimit,
    // lDNotesNoLimitLoading: state.notesReducer.allLandingDisplayNotesNoLimitLoading
})

export default connect(mapStateToProps, { getLandingDisplayNotes, getLandingDisplayNotesNoLimit })(NotesPapers)