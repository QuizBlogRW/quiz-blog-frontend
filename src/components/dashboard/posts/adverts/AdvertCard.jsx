import { Card, CardText, Button, CardImg } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, deleteAdvert } from '@/redux/slices/advertsSlice';
import adImage from '@/images/quizLogo.svg';
import DeleteModal from '@/utils/DeleteModal';

const AdvertCard = ({ advert }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    return (
        <Card body className="h-100 shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <Link to={`/advert/${advert._id}`} className="text-success fw-bold text-uppercase">
                    {advert.caption}
                </Link>

                <DeleteModal
                    deleteFnName="deleteAdvert"
                    deleteFn={deleteAdvert}
                    delID={advert._id}
                    delTitle={advert.caption}
                />
            </div>

            {/* Responsive Row inside Card */}
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <CardImg
                        src={advert.advert_image || adImage}
                        alt="advert"
                        className="img-fluid rounded"
                    />
                </div>

                <div className="col-12 col-md-6">
                    <CardText className="mb-2 text-wrap text-break">{advert.owner}</CardText>
                    <CardText className="mb-2 text-wrap text-break">{advert.email}</CardText>
                    <CardText className="mb-2 text-wrap text-break">{advert.phone}</CardText>
                    <CardText className="mb-3 text-info text-wrap text-break">
                        <u>{advert.link || 'No link'}</u>
                    </CardText>

                    {user.role?.includes('Admin') && (
                        <Button
                            color={advert.status === 'Active' ? 'danger' : 'success'}
                            className="text-white text-uppercase"
                            onClick={() =>
                                dispatch(
                                    changeStatus({
                                        advertID: advert._id,
                                        status: advert.status === 'Active' ? 'Inactive' : 'Active'
                                    })
                                )
                            }
                        >
                            {advert.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default AdvertCard;
