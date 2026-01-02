import { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Collapse } from 'react-collapse';
import AddIcon from '@/images/plusIcon.svg';
import SubtractIcon from '@/images/minusIcon.svg';
import { fetchLevelFaculties, deleteFaculty } from '@/redux/slices/facultiesSlice';
import { useSelector, useDispatch } from 'react-redux';
import EditFacultyModal from './EditFacultyModal';
import DeleteModal from '@/utils/DeleteModal';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const FacultiesCollapse = ({ levelID }) => {

  // Redux
  const { isLoading, levelFaculties } = useSelector((state) => state.faculties);
  const dispatch = useDispatch();

  // State - simplified from object to simple value
  const [activeIndex, setActiveIndex] = useState(null);

  // Lifecycle methods
  useEffect(() => {
    if (levelID) dispatch(fetchLevelFaculties(levelID));
  }, [dispatch, levelID]);

  const toggleClass = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (isLoading) return <QBLoadingSM />;

  return (
    <ul className="docsList mt-lg-5">
      {levelFaculties?.map((faculty) => {
        const isOpen = activeIndex === faculty._id;

        return (
          <li key={faculty._id}>
            <div className="titleToggler">
              <h3>{faculty.title}</h3>

              <span className="d-flex me-3">
                <EditFacultyModal
                  idToUpdate={faculty._id}
                  editTitle={faculty.title}
                />
                <DeleteModal
                  deleteFnName="deleteFaculty"
                  deleteFn={deleteFaculty}
                  delID={faculty._id}
                  delTitle={faculty.title}
                />

                <button
                  className="btn btn-primary btn-xs"
                  onClick={() => toggleClass(faculty._id)}
                  aria-label={isOpen ? 'Collapse faculty details' : 'Expand faculty details'}
                  aria-expanded={isOpen}
                >
                  <img
                    src={isOpen ? SubtractIcon : AddIcon}
                    alt=""
                    width="24"
                    height="24"
                    className="mb-1"
                  />
                </button>
              </span>
            </div>

            <Collapse isOpened={isOpen}>
              <div className="alert alert-info msg">
                <ListGroup>
                  {Array.isArray(faculty.years) && faculty.years.map((year) => (
                    <ListGroupItem key={year}>{year}</ListGroupItem>
                  ))}
                </ListGroup>
              </div>
            </Collapse>
          </li>
        );
      })}
    </ul>
  );
};

export default FacultiesCollapse;
