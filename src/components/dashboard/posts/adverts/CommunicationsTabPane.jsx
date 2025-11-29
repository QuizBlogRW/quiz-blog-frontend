import { useEffect } from 'react';
import { Row, Col, TabPane, Alert } from 'reactstrap';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { getAdverts } from '@/redux/slices/advertsSlice';
import { useSelector, useDispatch } from 'react-redux';
import AdvertCard from './AdvertCard';
import CreateAdvert from './CreateAdvert';

const CommunicationsTabPane = () => {
  const dispatch = useDispatch();
  const { isLoading, adverts } = useSelector((state) => state.adverts);

  useEffect(() => {
    dispatch(getAdverts());
  }, [dispatch]);

  return (
    <TabPane tabId="10" className="pt-3">
      <div className="m-3">
        To see more about broadcasts, click here 👉
        <a
          className="btn btn-sm btn-outline-warning ms-2 fw-bold"
          href="/broadcasts"
        >
          Broadcasts
        </a>
      </div>

      <CreateAdvert />

      {isLoading ? (
        <QBLoadingSM title="adverts" />
      ) : adverts?.length < 1 ? (
        <Alert
          color="danger"
          className="w-50 text-center mx-auto"
          style={{ border: '2px solid #157A6E' }}
        >
          No adverts created yet!
        </Alert>
      ) : (
        <Row className="g-3">
          {adverts.map((advert) => (
            <Col key={advert._id} xs="12" sm="6" md="4">
              <AdvertCard advert={advert} />
            </Col>
          ))}
        </Row>
      )}
    </TabPane>
  );
};

export default CommunicationsTabPane;
