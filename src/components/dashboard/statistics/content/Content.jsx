import { Outlet } from 'react-router-dom';

import Topbar from './Topbar';
import Charts from './Charts';

const Content = ({ sidebarIsOpen, toggleSidebar }) => (
  <div fluid className={sidebarIsOpen ? 'content is-open' : 'content'}>

    <Topbar toggleSidebar={toggleSidebar} />
    
    {
      (window.location.pathname === '/statistics' || window.location.pathname === '/statistics/') && <Charts />
    }

    <Outlet />
  </div>
);

export default Content;
