import { useEffect } from 'react';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getNotesByCCatg } from '@/redux/slices/notesSlice';
import { useSelector, useDispatch } from 'react-redux';
import Unavailable from './Unavailable';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const RelatedNotes = ({ ccatgID }) => {
  const dispatch = useDispatch();
  const notesCCatg = useSelector(state => state.notes);

  useEffect(() => {
    dispatch(getNotesByCCatg(ccatgID));
  }, [dispatch, ccatgID]);

  const thisCatNotes = notesCCatg?.notesByCCatg;

  return (
    !notesCCatg.isByCCatgLoading ? (
      thisCatNotes && thisCatNotes.length > 0 ? (
        <Row className="mx-2 mx-sm-3 w-100">
          <h4 className="text-center col-12 mb-4 fw-bolder text-uppercase border-bottom pb-2">
            Notes and resources that may interest you
          </h4>
          {thisCatNotes
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(notes => (
              <Col xs="12" sm="6" md="4" key={notes._id} className="mb-3">
                <Card body className="h-100 shadow-sm border-0 rounded-3">
                  <CardTitle tag="h5" className="text-uppercase fw-bold mb-2">
                    {notes.title}
                  </CardTitle>
                  <CardText className="text-muted mb-3" style={{ fontSize: '0.95rem', minHeight: '60px' }}>
                    {notes.description}
                  </CardText>
                  <Button color="success" className="mt-auto">
                    <Link to={`/view-note-paper/${notes.slug}`} className="text-white text-decoration-none">
                      Download
                    </Link>
                  </Button>
                </Card>
              </Col>
            ))}
        </Row>
      ) : (
        <Unavailable title="No related notes available yet" link="/course-notes" more="notes" />
      )
    ) : (
      <QBLoadingSM title="notes" />
    )
  );
};

export default RelatedNotes;
