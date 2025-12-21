import { Card, Button, CardTitle, CardText, Alert } from 'reactstrap';
import { memo, useMemo, useState } from 'react';
import DeleteIcon from '@/images/trash.svg';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ConfirmModal from '@/components/dashboard/utils/ConfirmModal';

// Constants
const DATE_FORMAT = 'DD MMM YYYY, HH:mm';
const CARD_HEIGHT = '150px';

// Generic Card Component
const GenericCard = memo(({ item, config, preview, actions, permissions }) => {

    const [confirmModal, setConfirmModal] = useState(false);

    // Extract data based on config
    const {
        id = item._id,
        title = config.getTitle(item),
        subtitle = config.getSubtitle(item),
        message = config.getMessage(item),
        date = config.getDate(item),
        count = preview?.count || config.getCount?.(item) || 0,
    } = {};

    const formattedDate = useMemo(
        () => moment(date).format(DATE_FORMAT),
        [date]
    );

    const handleCardClick = () => actions?.onClick(item, preview);

    const handleDelete = (e) => {
        e.stopPropagation();
        actions?.onDelete(id);
    };

    const toggleConfirmModal = () => setConfirmModal(prev => !prev);

    const openConfirmModal = (e) => {
        e.stopPropagation();
        setConfirmModal(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <Card
            className="m-1 p-1 mb-2"
            style={{ height: CARD_HEIGHT, cursor: 'pointer' }}
            tabIndex={0}
            role="button"
            aria-label={config.getAriaLabel?.(item) || `Card for ${title}`}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
        >
            <CardTitle
                className="p-1 d-flex justify-content-between align-items-center"
                style={{ fontSize: '.65rem', backgroundColor: 'honeydew' }}
            >
                <small style={{ width: '80%', overflow: 'hidden' }}>
                    <b
                        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                        className='d-block overflow-hidden'
                        title={title}
                    >
                        {title}
                    </b>
                    <span className="text-muted" style={{ fontSize: '.5rem' }}>
                        {subtitle}
                    </span>
                </small>

                {count > 0 && (
                    <span
                        className='border bg-secondary text-warning text-center'
                        style={{
                            padding: '4px',
                            borderRadius: '50%',
                            minWidth: '25px',
                            height: '25px',
                            fontSize: '.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        aria-label={config.getCountLabel?.(count) || `${count} items`}
                    >
                        {count}
                    </span>
                )}
            </CardTitle>

            <CardText
                style={{
                    fontSize: '.7rem',
                    marginLeft: '6px',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                title={message}
            >
                {message}
            </CardText>

            <div
                className="d-flex justify-content-between align-items-center p-1"
                style={{ backgroundColor: 'whitesmoke' }}
            >
                <small
                    className="text-info"
                    style={{ fontSize: '.65rem' }}
                    aria-label={formattedDate !== 'Invalid date' ? `Sent on ${formattedDate}` : ''}
                >
                    <i>{formattedDate !== 'Invalid date' ? formattedDate : ''}</i>
                </small>

                {permissions?.showDelete && (
                    <>
                        <Button
                            size="sm"
                            color="link"
                            className="me-2 p-0"
                            onClick={openConfirmModal}
                            aria-label={`Delete ${title}`}
                        >
                            <img src={DeleteIcon} alt="" width="16" height="16" />
                        </Button>
                        <ConfirmModal
                            isOpen={confirmModal}
                            toggleModal={toggleConfirmModal}
                            handleClick={handleDelete}
                            actionName="Delete"
                        />
                    </>
                )}
            </div>
        </Card>
    );
});

GenericCard.displayName = 'GenericCard';

// Main Generic Panel Component
const GenericPanel = ({
    items = [],
    config,
    actions,
    permissions,
    loading,
    emptyMessage,
    emptyLink
}) => {
    if (loading) {
        return config.LoadingComponent ? <config.LoadingComponent /> : null;
    }

    if (!items?.length) {
        return (
            <Alert
                color="danger"
                className="w-100 w-lg-50 mt-4 text-center mx-auto"
                style={{ border: '2px solid var(--brand)' }}
            >
                {emptyLink ? (
                    <Link to={emptyLink.to} aria-label={emptyLink.label}>
                        {emptyLink.text}
                    </Link>
                ) : (
                    emptyMessage || 'No items yet!'
                )}
            </Alert>
        );
    }

    return (
        <>
            {items.map(item => {
                
                const preview = config.getPreview?.(item);

                return (
                    <GenericCard
                        key={item._id}
                        item={item}
                        config={config}
                        preview={preview}
                        actions={actions}
                        permissions={permissions}
                    />
                );
            })}
        </>
    );
};

export default memo(GenericPanel);