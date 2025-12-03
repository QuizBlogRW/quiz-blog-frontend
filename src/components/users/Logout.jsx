import { Button, Modal, ModalBody, DropdownItem } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/usersSlice';
import powerOff from '@/images/power-off.svg';

const Logout = ({ userId, logoutModal, toggleLogoutModal }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout(userId));
    setTimeout(() => (window.location.href = '/'), 1000);
  };

  return (
    <>
      {/* Dropdown trigger */}
      <DropdownItem onClick={toggleLogoutModal} className="logout-item">
        <span className="logout-badge p-1 d-flex align-items-center">
          <img src={powerOff} alt="Logout" width={16} height={16} />
          <span className="ms-1">Sign Out</span>
        </span>
      </DropdownItem>

      {/* Confirmation modal */}
      <Modal isOpen={logoutModal} toggle={toggleLogoutModal} centered>
        <div className="d-flex justify-content-between align-items-center p-2 fw-bold" style={{ color: 'var(--brand)' }}>
          <span>Are you sure you want to logout?</span>
          <Button
            color="danger"
            size="sm"
            onClick={toggleLogoutModal}
            style={{ padding: '0.2rem 0.5rem', fontSize: '.7rem' }}
            aria-label="Close logout modal"
          >
            X
          </Button>
        </div>

        <ModalBody className="d-flex justify-content-around mt-3">
          <Button color="danger" onClick={handleLogout}>
            Logout
          </Button>
          <Button color="primary" style={{ backgroundColor: 'var(--brand)' }} onClick={toggleLogoutModal}>
            Cancel
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Logout;
