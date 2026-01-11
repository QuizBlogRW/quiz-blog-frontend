import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap';
import dashimg from '@/images/dashboard.svg';

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
};

// Welcome Message Component
const WelcomeMessage = ({ role }) => {
  const isVisitor = role === 'Visitor';

  return (
    <>
      <hr />
      <p className="mb-0" style={isVisitor ? { fontSize: '.9rem', color: '#FFF' } : {}}>
        {isVisitor
          ? 'Here you can view your scores, downloads and contacts, cheers!'
          : 'Here you can add, edit and remove features, cheers!'
        }
      </p>
    </>
  );
};

// Dashboard Image Component
const DashboardImage = ({ onNavigate }) => {
  const handleClick = () => {
    onNavigate('/chat');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate('/chat');
    }
  };

  return (
    <div className="dashboard-img w-auto m-2 m-sm-0">
      <img
        src={dashimg}
        alt="Navigate to chat"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Navigate to chat page"
        style={{ cursor: 'pointer', maxHeight: '200px' }}
        className="shadow-sm animated infinite pulse blink_me"
      />
    </div>
  );
};

// User Alert Component
const UserAlert = ({ user }) => {
  if (!user) return null;

  const userName = capitalizeFirstLetter(user.name);
  const userRole = user.role || 'User';

  return (
    <Alert
      style={{
        background: 'var(--accent)',
        color: 'var(--brand)',
        border: '2px solid var(--brand)'
      }}
      className="text-center m-2 m-sm-0"
    >
      <h4 className="alert-heading">
        <strong>{userName}</strong>
      </h4>
      <p>
        <strong>Welcome to the {userRole} dashboard page</strong>
      </p>
      <WelcomeMessage role={userRole} />
    </Alert>
  );
};

// Main Component
const TopRow = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.users);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-100 mx-1 m-lg-4 px-lg-5 d-flex flex-column flex-lg-row justify-content-around align-items-center">
      <UserAlert user={user} />
      <DashboardImage onNavigate={handleNavigation} />
    </div>
  );
};

export default TopRow;