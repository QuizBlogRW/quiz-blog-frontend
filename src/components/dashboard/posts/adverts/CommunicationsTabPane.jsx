import { useEffect } from 'react';
import { Row, Col, Button, TabPane, Alert } from 'reactstrap';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { getAdverts } from '@/redux/slices/advertsSlice';
import { useSelector, useDispatch } from 'react-redux';
import AdvertCard from './AdvertCard';
import CreateAdvert from './CreateAdvert';

const CommunicationsTabPane = () => {
  // Redux
  const dispatch = useDispatch();
  const adverts = useSelector((state) => state.adverts);
  const { isLoading, allAdverts } = adverts;

  // Lifecycle method
  useEffect(() => {
    dispatch(getAdverts());
  }, [dispatch]);

  return (
    <TabPane tabId="10">
      <p className="m-3 w-100">
        To see more about broadcasts, click here 👉
        <button className="btn btn-sm btn-outline-warning ms-2">
          <a
            href={'/broadcasts'}
            style={{ color: 'var(--brand)', fontWeight: 'bolder' }}
          >
            Broadcasts
          </a>
        </button>
      </p>
      <CreateAdvert />
      {isLoading ? (
        <QBLoadingSM title="adverts" />
      ) : allAdverts && allAdverts.length < 1 ? (
        <Alert
          color="danger"
          className="w-50 text-center mx-auto"
          style={{ border: '2px solid #157A6E' }}
        >
          No adverts created yet!
        </Alert>
      ) : (
        <Row>
          {allAdverts &&
            allAdverts.map((advert) => (
              <Col sm="6" className="mt-2" key={advert._id}>
                <AdvertCard advert={advert} />
              </Col>
            ))}
        </Row>
      )}
    </TabPane>
  );
};

export default CommunicationsTabPane;
