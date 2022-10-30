import React, { useEffect, useState } from 'react'
import { Container, Row, Button, Spinner } from 'reactstrap'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { getOneNotePaper } from '../../../redux/notes/notes.actions'
import LoginModal from '../../auth/LoginModal'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import { Document, Page } from "react-pdf/dist/esm/entry.webpack"
import './viewpdf.css'

const ViewPDF = ({ auth, nPaper, getOneNotePaper }) => {

    // Access route parameters
    const { noteSlug } = useParams()

    useEffect(() => {
        getOneNotePaper(noteSlug)
    }, [getOneNotePaper, noteSlug])

    const { title, notes_file } = nPaper.oneNotePaper

    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
    }

    const goToPrevPage = () =>
        setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1)

    const goToNextPage = () =>
        setPageNumber(
            pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
        )

    return (

        !auth.isAuthenticated ?

            // If not authenticated or loading
            <div className="d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first to download this file'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'}
                            isAuthenticated={auth.isAuthenticated} />
                }
            </div> :

            nPaper.isOneNotePaperLoading ?

                <>
                    <div className="py-3 d-flex justify-content-center align-items-center">
                        <Spinner color="warning" style={{ width: '10rem', height: '10rem' }} />
                    </div>
                    <div className="py-3 d-flex justify-content-center align-items-center">
                        <h4 className="blink_load">Loading ...</h4>
                    </div>
                    <div className="py-3 d-flex justify-content-center align-items-center">
                        <Spinner type="grow" color="success" style={{ width: '10rem', height: '10rem' }} />
                    </div>
                </> :

                notes_file && notes_file ?

                    <Container className="view-pdf d-flex flex-column justify-content-center border rounded border-primary my-5 py-2 w-80">

                        <h2 className='text-center font-weight-bolder my-4'>{title && title}</h2>

                        <Row className='d-flex justify-content-between'>
                            <Button className={`btn btn-outline-warning my-2 text-white d-${pageNumber === 1 ? 'none' : 'inline-block'}`} onClick={goToPrevPage} color="info">
                                Prev
                            </Button>

                            <p className='text-warning font-weight-bold my-lg-3'>Page {pageNumber} of {numPages}</p>

                            <Button className={`btn btn-outline-warning my-2 text-white d-${pageNumber === numPages ? 'none' : 'inline-block'}`} onClick={goToNextPage} color="info">
                                Next
                            </Button>
                        </Row>

                        <Row className='d-flex justify-content-center'>
                            <Document
                                file={notes_file}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                <Page pageNumber={pageNumber} />
                            </Document>
                        </Row>
                    </Container> :

                    <div className="pt-5 d-flex justify-content-center align-items-center">
                        <h4>This file is unavailable!</h4>
                        <Link to={'/'}>
                            <Button className="btn btn-outline-primary mt-3">
                                Go back
                            </Button>
                        </Link>
                    </div>
    )
}

const mapStateToProps = state => ({
    nPaper: state.notesReducer
})

export default connect(mapStateToProps, { getOneNotePaper })(ViewPDF)