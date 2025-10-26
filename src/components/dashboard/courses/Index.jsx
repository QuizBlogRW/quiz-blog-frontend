import { useState, useEffect, lazy, Suspense, useContext } from 'react';
import {
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  ListGroup,
  ListGroupItem,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import {
  getCourseCategories,
  deleteCourseCategory,
  createCourseCategory,
} from '@/redux/slices/courseCategoriesSlice';
import { useSelector, useDispatch } from 'react-redux';
import AddModal from '@/utils/AddModal';
import UpdateModal from '@/utils/UpdateModal';
import { updateCourseCategory } from '@/redux/slices/courseCategoriesSlice';
import {
  createCourse,
  getCoursesByCategory,
} from '@/redux/slices/coursesSlice';
import { notify } from '@/utils/notifyToast';
import validators from '@/utils/validators';
import CoursesHolder from './CoursesHolder';
import CategoriesHome from './CategoriesHome';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { logRegContext } from '@/contexts/appContexts';
import DeleteModal from '@/utils/DeleteModal';

const InFeedAd = lazy(() => import('@/components/adsenses/InFeedAd'));

const MobileNavbar = ({
  allCourseCategories,
  activeTab,
  toggle,
  toggleNavbar,
  collapsed,
  dispatch,
}) => (
  <Navbar color="faded" light className="d-sm-none w-100 py-0">
    <NavbarBrand
      className={`me-auto nav-link header py-lg-2 px-0 ${
        activeTab === 'header' ? 'active' : ''
      }`}
      id={'v-pills-header-tab'}
      data-toggle="pill"
      href={'#v-pills-header'}
      role="tab"
      aria-controls={'v-pills-header'}
      aria-selected="true"
      onClick={() => toggle('header')}
    >
      <i className="fa fa-home" aria-hidden="true">
        {' '}
      </i>
      &nbsp;&nbsp;Categories
    </NavbarBrand>
    <button
      aria-label="Toggle navigation"
      type="button"
      className="me-2 navbar-toggler"
      onClick={toggleNavbar}
    >
      <span>
        <i className="fa fa-bars"></i>
      </span>
    </button>
    <Collapse isOpen={!collapsed} navbar>
      <Nav navbar>
        {allCourseCategories && allCourseCategories.length < 1 ? (
          <>{window.location.reload()}</>
        ) : (
          allCourseCategories &&
          allCourseCategories.map((cCategory) => (
            <NavItem key={cCategory._id}>
              <NavLink
                className={`nav-link item ${
                  activeTab === cCategory.title ? 'active' : ''
                }`}
                id={`v-pills-${cCategory.title}-tab`}
                data-toggle="pill"
                href={`#v-pills-${cCategory.title}`}
                role="tab"
                aria-controls={`v-pills-${cCategory.title}`}
                aria-selected="true"
                onClick={() => {
                  toggle(cCategory.title);
                  dispatch(getCoursesByCategory(cCategory._id));
                }}
              >
                {cCategory.title}
              </NavLink>
            </NavItem>
          ))
        )}
      </Nav>
    </Collapse>
  </Navbar>
);

const DesktopNavbar = ({
  allCourseCategories,
  activeTab,
  toggle,
  dispatch,
}) => (
  <div className="col-12 col-sm-4 courses-categories px-1 d-none d-sm-block ms-lg-3">
    <div
      className="nav flex-sm-column justify-content-around nav-pills"
      id="v-pills-tab"
      role="tablist"
      aria-orientation="vertical"
    >
      <a
        className={`nav-link header py-lg-3 ${
          activeTab === 'header' ? 'active' : ''
        }`}
        id={'v-pills-header-tab'}
        data-toggle="pill"
        href={'#v-pills-header'}
        role="tab"
        aria-controls={'v-pills-header'}
        aria-selected="true"
        onClick={() => toggle('header')}
      >
        <i className="fa fa-home" aria-hidden="true">
          {' '}
        </i>
        &nbsp;&nbsp;Categories
      </a>
      {allCourseCategories &&
        allCourseCategories.map((cCategory) => (
          <a
            key={cCategory._id}
            className={`nav-link item ${
              activeTab === cCategory.title ? 'active' : ''
            }`}
            id={`v-pills-${cCategory.title}-tab`}
            data-toggle="pill"
            href={`#v-pills-${cCategory.title}`}
            role="tab"
            aria-controls={`v-pills-${cCategory.title}`}
            aria-selected="true"
            onClick={() => {
              toggle(cCategory.title);
              dispatch(getCoursesByCategory(cCategory._id));
            }}
          >
            {cCategory.title}
          </a>
        ))}
    </div>
  </div>
);

const Index = () => {
  const dispatch = useDispatch();
  const { allCourseCategories } = useSelector(
    (state) => state.courseCategories
  );
  const catLoading = useSelector((state) => state.courseCategories.isLoading);
  const courses = useSelector((state) => state.courses);
  const { toggleL } = useContext(logRegContext);
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);
  const [activeTab, setActiveTab] = useState('');
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    dispatch(getCourseCategories());
  }, [dispatch]);

  return !isAuthenticated ? (
    <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
      {isLoading ? (
        <QBLoadingSM title="course categories" />
      ) : (
        <Button
          color="link"
          className="fw-bolder my-5 border rounded"
          onClick={toggleL}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--brand)',
            fontSize: '1.5vw',
            boxShadow: '-2px 2px 1px 2px var(--brand)',
            border: '2px solid var(--brand)',
          }}
        >
          Login for Exclusive Notes Access
        </Button>
      )}
    </div>
  ) : (
    <div className="course-notes px-3">
      <Row className="mt-lg-5">
        <Col>
          <Breadcrumb tag="nav" listTag="div">
            <BreadcrumbItem
              tag="h4"
              className="text-white fw-bolder text-center w-100"
            >
              Welcome to Quiz-Blog Course Resources Portal
            </BreadcrumbItem>
            {user.role === 'Admin' || user.role === 'Creator' ? (
              <strong>
                <AddModal
                  title="Add Course Category"
                  triggerText="Course Category"
                  initialState={{ title: '', description: '' }}
                  submitFn={(data) => {
                    const { title, description } = data;
                    const res = validators.validateTitleDesc(
                      title,
                      description,
                      { minTitle: 4, minDesc: 4, maxTitle: 70, maxDesc: 120 }
                    );
                    if (!res.ok) {
                      notify('Insufficient info!', 'error');
                      return Promise.reject(new Error('validation'));
                    }

                    return createCourseCategory({
                      ...data,
                      created_by: user && user._id ? user._id : null,
                    });
                  }}
                  renderForm={(state, setState, firstInputRef) => (
                    <FormGroup>
                      <Label for="title">
                        <strong>Title</strong>
                      </Label>
                      <Input
                        ref={firstInputRef}
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Course category title ..."
                        className="mb-3"
                        value={state.title || ''}
                        onChange={(e) =>
                          setState({ ...state, title: e.target.value })
                        }
                      />

                      <Label for="description">
                        <strong>Description</strong>
                      </Label>
                      <Input
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Course category description ..."
                        className="mb-3"
                        value={state.description || ''}
                        onChange={(e) =>
                          setState({ ...state, description: e.target.value })
                        }
                      />
                    </FormGroup>
                  )}
                />
              </strong>
            ) : null}
          </Breadcrumb>
        </Col>
      </Row>
      {catLoading ? (
        <QBLoadingSM title="course categories" />
      ) : (
        <Row className="pt-lg-5 courses-content">
          <MobileNavbar
            allCourseCategories={allCourseCategories}
            activeTab={activeTab}
            toggle={toggle}
            toggleNavbar={toggleNavbar}
            collapsed={collapsed}
            dispatch={dispatch}
          />
          <DesktopNavbar
            allCourseCategories={allCourseCategories}
            activeTab={activeTab}
            toggle={toggle}
            dispatch={dispatch}
          />
          <div className="col-12 col-sm-7 px-1 mb-3 selected-category d-flex flex-column justify-content-center align-items-center">
            <div className="tab-content" id="v-pills-tabContent">
              {!activeTab || activeTab === 'header' ? (
                <div
                  className={'tab-pane show active'}
                  id={'v-pills-header'}
                  role="tabpanel"
                  aria-labelledby={'v-pills-header-tab'}
                >
                  <CategoriesHome />
                  <div className="d-block d-sm-none">
                    {allCourseCategories &&
                      allCourseCategories.map((cCategory) => (
                        <ListGroup key={cCategory._id} className="mb-1">
                          <ListGroupItem className="justify-content-between">
                            <NavLink
                              className={`nav-link item ${
                                activeTab === cCategory.title ? 'active' : ''
                              }`}
                              id={`v-pills-${cCategory.title}-tab`}
                              data-toggle="pill"
                              href={`#v-pills-${cCategory.title}`}
                              role="tab"
                              aria-controls={`v-pills-${cCategory.title}`}
                              aria-selected="true"
                              onClick={() => {
                                toggle(cCategory.title);
                                dispatch(getCoursesByCategory(cCategory._id));
                              }}
                            >
                              {cCategory.title}
                            </NavLink>
                          </ListGroupItem>
                        </ListGroup>
                      ))}
                  </div>
                </div>
              ) : (
                <>
                  <Row className="text-center d-block py-lg-3 w-100">
                    <Suspense fallback={<QBLoadingSM />}>
                      {process.env.NODE_ENV !== 'development' ? (
                        <InFeedAd />
                      ) : null}
                    </Suspense>
                    <h4
                      className="d-block fw-bolder"
                      style={{ color: 'var(--brand) ' }}
                    >
                      Available Courses
                    </h4>
                  </Row>
                  {allCourseCategories &&
                    allCourseCategories.map((cCategory) => (
                      <div
                        key={cCategory._id}
                        className={`tab-pane ${
                          activeTab === cCategory.title ? 'show active' : ''
                        }`}
                        id={`v-pills-${cCategory.title}`}
                        role="tabpanel"
                        aria-labelledby={`v-pills-${cCategory.title}-tab`}
                      >
                        {user.role === 'Admin' ||
                        (cCategory.created_by &&
                          user._id === cCategory.created_by) ? (
                          <span className="d-flex">
                            <strong>
                              <AddModal
                                title="Add New Course"
                                triggerText="Course"
                                initialState={{
                                  title: '',
                                  description: '',
                                  courseCategory: cCategory._id,
                                }}
                                submitFn={(data) => {
                                  const { title, description } = data;
                                  const res = validators.validateTitleDesc(
                                    title,
                                    description,
                                    {
                                      minTitle: 4,
                                      minDesc: 4,
                                      maxTitle: 80,
                                      maxDesc: 200,
                                    }
                                  );
                                  if (!res.ok) {
                                    notify('Insufficient info!', 'error');
                                    return Promise.reject(
                                      new Error('validation')
                                    );
                                  }

                                  // attach created_by when possible
                                  const payload = {
                                    ...data,
                                    courseCategory: cCategory._id,
                                    created_by:
                                      user && user._id ? user._id : null,
                                  };
                                  return createCourse(payload);
                                }}
                                renderForm={(
                                  state,
                                  setState,
                                  firstInputRef
                                ) => (
                                  <FormGroup>
                                    <Label for="title">
                                      <strong>Title</strong>
                                    </Label>
                                    <Input
                                      ref={firstInputRef}
                                      type="text"
                                      name="title"
                                      id="title"
                                      placeholder="Course title ..."
                                      className="mb-3"
                                      value={state.title || ''}
                                      onChange={(e) =>
                                        setState({
                                          ...state,
                                          title: e.target.value,
                                        })
                                      }
                                    />

                                    <Label for="description">
                                      <strong>Description</strong>
                                    </Label>
                                    <Input
                                      type="text"
                                      name="description"
                                      id="description"
                                      placeholder="Course description ..."
                                      className="mb-3"
                                      value={state.description || ''}
                                      onChange={(e) =>
                                        setState({
                                          ...state,
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </FormGroup>
                                )}
                              />
                            </strong>
                            <UpdateModal
                              title="Edit Course Category"
                              initialData={{
                                idToUpdate: cCategory._id,
                                name: cCategory.title,
                                description: cCategory.description,
                              }}
                              submitFn={(data) => {
                                const { name, description } = data;
                                const res = validators.validateTitleDesc(
                                  name,
                                  description,
                                  {
                                    minTitle: 4,
                                    minDesc: 4,
                                    maxTitle: 80,
                                    maxDesc: 200,
                                  }
                                );
                                if (!res.ok)
                                  return Promise.reject(
                                    new Error('validation')
                                  );
                                return updateCourseCategory({
                                  idToUpdate: data.idToUpdate,
                                  title: data.name,
                                  description: data.description,
                                });
                              }}
                              renderForm={(state, setState, firstInputRef) => (
                                <>
                                  <Input
                                    ref={firstInputRef}
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Course title ..."
                                    className="mb-3"
                                    value={state.name || ''}
                                    onChange={(e) =>
                                      setState({
                                        ...state,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                  <Input
                                    type="text"
                                    name="description"
                                    id="description"
                                    placeholder="Course description ..."
                                    className="mb-3"
                                    value={state.description || ''}
                                    onChange={(e) =>
                                      setState({
                                        ...state,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </>
                              )}
                            />
                            <DeleteModal
                              deleteFnName="deleteCourseCategory"
                              deleteFn={deleteCourseCategory}
                              delID={cCategory._id}
                              delTitle={cCategory.title}
                            />
                          </span>
                        ) : null}
                        <CoursesHolder courses={courses} />
                        {cCategory._id === '60f2b2f7bdbf4c47f0fd9430' ? (
                          <div className="d-flex" id="video-professsor-messer">
                            <iframe
                              className="mx-auto"
                              width="414"
                              height="240"
                              src="https://www.youtube-nocookie.com/embed/videoseries?list=PL_YW0h4ytNBtBBaPFgMzCNmnzlFalu-SA"
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : null}
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        </Row>
      )}
    </div>
  );
};

export default Index;
