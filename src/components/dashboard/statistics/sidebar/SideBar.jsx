import { Nav } from 'reactstrap';
import SubMenu from './SubMenu';

const SideBar = ({ isOpen, toggle }) => (

  <div className={isOpen ? 'sidebar is-open' : 'sidebar'}>

    <div className="sidebar-header">
      <span color="success" onClick={toggle} style={{ color: '#fff' }}>
        X
      </span>
      <a href="/statistics">
        <h3>Quiz-Blog Statistics</h3>
      </a>
    </div>

    <div className="side-menu">
      <Nav vertical className="list-unstyled pb-3">

        <p>Titles</p>

        <SubMenu title="Users" icon={'user'} items={submenus[0]} />
        <SubMenu title="Users Stats" icon={'group'} items={submenus[1]} />
        <SubMenu title="Quizzes" icon={'keyboard-o'} items={submenus[2]} />
        <SubMenu title="Notes" icon={'book'} items={submenus[3]} />
        <SubMenu title="Blog Posts" icon={'book'} items={submenus[4]} />
      </Nav>
    </div>
  </div>
);

const submenus = [
  [
    {
      title: '50 Newest Users',
      target: 'new-50-users',
    },
    {
      title: 'With Image',
      target: 'with-image',
    },
    {
      title: 'With School',
      target: 'with-school',
    },
    {
      title: 'With Level',
      target: 'with-level',
    },
    {
      title: 'With Faculty',
      target: 'with-faculty',
    },
    {
      title: 'With Interests',
      target: 'with-interests',
    },
    {
      title: 'With About',
      target: 'with-about',
    },
    {
      title: 'All Users',
      target: 'all-users',
    },
  ],
  [
    {
      title: 'Top 10 Quizzing',
      target: 'top-10-quizzing-users',
    },
    {
      title: 'Top 10 Downloaders',
      target: 'top-10-downloaders',
    },
  ],
  [
    {
      title: 'Top 10 Quizzes',
      target: 'top-10-quizzes',
    },
  ],
  [
    {
      title: 'Top 10 Notes',
      target: 'top-10-notes',
    },
  ],
  [
    {
      title: 'Recent 10 Views',
      target: 'recent-ten-views',
    },
    {
      title: 'All Views',
      target: 'all-posts-views',
    },
  ],
];

export default SideBar;
