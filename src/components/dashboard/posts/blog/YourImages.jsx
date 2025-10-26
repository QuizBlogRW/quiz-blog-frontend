import { useState, useEffect } from 'react';
import { Col, Row, Card, Alert, Button } from 'reactstrap';
import {
  getImageUploadsByOwner,
  deleteImageUpload,
} from '@/redux/slices/imageUploadsSlice';
import { useSelector, useDispatch } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import DeleteModal from '@/utils/DeleteModal';
import './yourimages.css';

const YourImages = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getImageUploadsByOwner(user?._id));
  }, [dispatch, user?._id]);

  const { imageUploadsByOwner, isLoading } = useSelector(
    (state) => state.imageUploads
  );
  const [show, setShow] = useState(false);
  const [imgTitle, setImgTitle] = useState('');

  const copying = (img) => {
    var cp = navigator.clipboard.writeText(img && img.uploadImage);
    setShow(true);
    setImgTitle(img && img.imageTitle);

    if (cp) {
      window.setTimeout(() => setShow(false), 3000);
    } else return null;
  };

  return isLoading ? (
    <QBLoadingSM />
  ) : (
    <>
      <h5 className="text-center d-block">AVAILABLE IMAGES</h5>
      <small className="d-block text-warning text-center fw-bolder">
        {show ? `${imgTitle} copied` : ''}
      </small>
      <Row>
        {imageUploadsByOwner && imageUploadsByOwner.length === 0 ? (
          <Alert color="danger">You have not uploaded any image!</Alert>
        ) : (
          imageUploadsByOwner &&
          imageUploadsByOwner.map((img) => (
            <Col sm="6" className="yourOneImg" key={img && img._id}>
              <DeleteModal
                deleteFnName="deleteImageUpload"
                deleteFn={deleteImageUpload}
                delID={img._id}
                delTitle={img.imageTitle}
              />
              <Card inverse>
                <img src={img && img.uploadImage} alt="" />
                <Button
                  className="btn-info mt-1 py-0"
                  onClick={(event) => copying(img, event)}
                >
                  <small className="d-block">{img && img.imageTitle}</small>
                  <small className="d-block">Click to copy</small>
                </Button>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </>
  );
};

export default YourImages;
