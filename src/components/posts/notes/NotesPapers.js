import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Col, Row, Button, Spinner } from 'reactstrap'
import ReactLoading from "react-loading"
// import SearchInput from '../SearchInput'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getLandingDisplayNotes, getLandingDisplayNotesNoLimit } from '../../../redux/notes/notes.actions'

const ResponsiveAd = lazy(() => import('../../adsenses/ResponsiveAd'))
const SquareAd = lazy(() => import('../../adsenses/SquareAd'))
const SideResizable = lazy(() => import('../../adsenses/SideResizable'))
const ResponsiveHorizontal = lazy(() => import('../../adsenses/ResponsiveHorizontal'))
const GridMultiplex = lazy(() => import('../../adsenses/GridMultiplex'))
const InFeedAd = lazy(() => import('../../adsenses/InFeedAd'))
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
            <Row className="px-1 px-lg-4 my-1 w-100">
                {/* Google responsive 1 ad */}
                <Col sm="12" className='w-100'>
                    <div className='w-100'>
                        <ResponsiveAd />
                    </div>
                </Col>
            </Row>

            <Row className="px-1 px-lg-4 my-1 w-100">
                <Col sm="6" className='p-1 p-lg-2 d-flex flex-column justify-content-around w-100'>
                    <Suspense fallback={<div className="p-1 m-1 d-flex justify-content-center align-items-center w-100">
                        <Spinner color="primary" />
                    </div>}>
                        <div className='w-100'>
                            <SideResizable />
                        </div>
                    </Suspense>
                </Col>
                <Col sm="6" className='w-100'>
                    <div className='w-100'>
                        <SquareAd />
                    </div>
                </Col>
            </Row>

            <Row className="m-1 p-1 px-sm-5 notes-paper">
                <Col sm="12" className="px-1 y-1 w-100">
                    <h3 className="inversed-title mt-0 mt-lg-3 pt-4 py-lg-3 text-danger text-center font-weight-bold">
                        <span class="part1">NEWEST NOTES</span>
                        <span style={{textDecoration: "none"}}> & </span>
                        <span class="part2">PAST PAPERS</span>
                    </h3>
                </Col>

                <Col sm="12" className="px-0 px-sm-5 w-100">

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

                                        {/* Google in-feed ad when half the number of notes*/}
                                        {lDLimitedNotes.length > 0 && lDLimitedNotes.indexOf(note) === Math.floor(lDLimitedNotes.length / 2) ?
                                            <Col sm="12" className="w-100">
                                                <InFeedAd />
                                            </Col> : null}

                                    </Suspense>
                                ))}


                            {/* Newest 10 notes */}
                            {lDLimitedNotes.length > 0 ?

                                <div className="mt-sm-5 mb-sm-4 d-flex justify-content-center">
                                    <Link to="/course-notes">
                                        <Button outline color="info" className='view-all-btn'>
                                            More Notes & Past Papers &nbsp; <i className="fa fa-arrow-right"></i>
                                        </Button>
                                    </Link>
                                </div> :
                                null}

                            <Suspense fallback={<div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                <Spinner color="primary" />
                            </div>}>
                                <GridMultiplex />
                            </Suspense>
                        </>
                    }
                </Col>
            </Row>

            <Row className="my-1 w-100">
                <Col sm="12" className="px-1 y-1 w-100">
                    <Suspense fallback={<div className="p-1 m-1 d-flex justify-content-center align-items-center w-100">
                        <Spinner color="primary" />
                    </div>}>
                        <div className='w-100'>
                            <ResponsiveHorizontal />
                        </div>
                    </Suspense>
                </Col>
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