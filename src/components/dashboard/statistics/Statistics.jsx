import { useState } from 'react';
import { useSelector } from 'react-redux';
import SideBar from './sidebar/SideBar';
import Content from './content/Content';
import Dashboard from '../Dashboard';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import NotAuthenticated from '@/components/auth/NotAuthenticated';
import './statistics.css';

const Statistics = () => {

  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  const { isLoading, isAuthenticated, user } = useSelector(state => state.auth);

  if (isLoading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
        <QBLoadingSM />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  if (user?.role === 'Visitor') {
    return <Dashboard />;
  }

  return (
    <div className="Statistics wrapper">
      <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
      <Content toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} />
    </div>
  );
};

export default Statistics;
