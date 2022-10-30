import React, { useEffect } from 'react'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap'
import { Link } from "react-router-dom"
import { connect } from 'react-redux'
import { getNotesByCCatg } from '../../../redux/notes/notes.actions'
import Unavailable from './Unavailable'
// import Bubbles from '../../rLoading/Bubbles'
import SpinningBubbles from '../../rLoading/SpinningBubbles'

const RelatedNotes = ({ getNotesByCCatg, notesCCatg, ccatgID }) => {

  useEffect(() => { getNotesByCCatg(ccatgID) }, [getNotesByCCatg, ccatgID])
  const thisCatNotes = notesCCatg && notesCCatg.notesByCCatg

  return (

    !notesCCatg.isByCCatgLoading ?

      thisCatNotes && thisCatNotes.length > 0 ?
        <>
          {
            <Row className="similar-quizes mx-3">
              <h4 className="text-center col-12 mb-4 font-weight-bolder text-uppercase text-underline">
                Related useful notes and resources</h4>
              {
                thisCatNotes && thisCatNotes
                  .sort(() => 0.5 - Math.random())
                  .map(notes => (
                    <Col sm="4" key={notes._id} className="my-1 my-sm-4">
                      <Card body>
                        <CardTitle tag="h5" className="text-uppercase">{notes.title}</CardTitle>
                        <CardText>{notes.description}</CardText>
                        <Button color="success">
                          <Link to={`/view-note-paper/${notes.slug}`} className="text-white">
                            Download
                          </Link>
                        </Button>
                      </Card>
                    </Col>
                  )).slice(0, 3)}
            </Row>
          }
        </> :
        <Unavailable title='No related notes available yet' link='/course-notes' more='notes' /> : <SpinningBubbles title='notes' />
  )
}

// Map  state props
const mapStateToProps = state => ({
  notesCCatg: state.notesReducer
})

export default connect(mapStateToProps, { getNotesByCCatg })(RelatedNotes)