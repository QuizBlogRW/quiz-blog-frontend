import { DropdownItem } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/usersSlice';
import powerOff from '@/images/power-off.svg';
import ConfirmModal from '@/components/dashboard/utils/ConfirmModal';

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
      <ConfirmModal isOpen={logoutModal} toggleModal={toggleLogoutModal} handleClick={handleLogout} actionName="Logout" />
    </>
  );
};

export default Logout;
