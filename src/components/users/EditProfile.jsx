import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Row, Form, Breadcrumb, BreadcrumbItem, FormGroup, Label, Col, Input } from 'reactstrap';
import { updateProfile } from '@/redux/slices/usersSlice';
import { getSchools } from '@/redux/slices/schoolsSlice';
import { fetchSchoolLevels } from '@/redux/slices/levelsSlice';
import { fetchLevelFaculties } from '@/redux/slices/facultiesSlice';
import NotAuthenticated from '@/components/users/NotAuthenticated';
import { notify } from '@/utils/notifyToast';
import SelectField from './SelectField';

const MIN_NAME_LENGTH = 4;
const MAX_ABOUT_LENGTH = 2000;
const MAX_INTERESTS = 20;

const EditProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isLoading } = useSelector((state) => state.users);
  const schools = useSelector((state) => state.schools?.allSchools || []);
  const schoolLevels = useSelector((state) => state.levels?.schoolLevels || []);
  const levelFaculties = useSelector((state) => state.faculties?.levelFaculties || []);

  const [profile, setProfile] = useState(user || {});
  const [interests, setInterests] = useState(user?.interests || []);
  const [years, setYears] = useState([]);

  useEffect(() => {
    setProfile(user || {});
    setInterests(user?.interests || []);
  }, [user]);

  useEffect(() => {
    dispatch(getSchools());
  }, [dispatch]);

  useEffect(() => {
    if (profile.school) dispatch(fetchSchoolLevels(profile.school._id));
  }, [dispatch, profile.school]);

  useEffect(() => {
    if (profile.level) dispatch(fetchLevelFaculties(profile.level._id));
  }, [dispatch, profile.level]);

  useEffect(() => {
    const faculty = levelFaculties.find((f) => f._id === profile.faculty?._id);
    setYears(faculty?.years || []);
  }, [profile.faculty, levelFaculties]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, list = null, fetchAction = null) => (e) => {
    const value = e.target.value || null;
    const selected = list?.find((item) => item._id === value) || value;

    setProfile((prev) => ({ ...prev, [field]: selected }));
    if (fetchAction && value) dispatch(fetchAction(value));
  };

  const handleAddInterest = () => setInterests((prev) => [...prev, { favorite: '' }]);
  const handleRemoveInterest = (index) => setInterests((prev) => prev.filter((_, i) => i !== index));
  const handleInterestChange = (index, e) => {
    const { name, value } = e.target;
    setInterests((prev) =>
      prev.map((interest, i) => (i === index ? { ...interest, [name]: value } : interest))
    );
  };

  const validateProfile = ({ name, school, level, faculty, year, about, interests }) => {
    if (!name || name.trim().length < MIN_NAME_LENGTH)
      return 'Name must be at least 4 characters long';

    if (school && (!year || !level || !faculty))
      return 'Year, Faculty and Level are required when school is provided';

    if (about && about.length > MAX_ABOUT_LENGTH)
      return `About section cannot exceed ${MAX_ABOUT_LENGTH} characters`;

    if (interests?.length > MAX_INTERESTS)
      return `You can select up to ${MAX_INTERESTS} interests only`;

    return null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, school, level, faculty, year, about } = profile;

    const validationError = validateProfile({
      name,
      school,
      level,
      faculty,
      year,
      about,
      interests,
    });

    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      await dispatch(
        updateProfile({
          _id: userId,
          name,
          school,
          level,
          faculty,
          year,
          interests,
          about,
        })
      ).unwrap();

      notify('Profile updated successfully!', 'success');
    } catch (err) {
      notify(err?.message || 'Failed to update profile', 'error');
    }
  };

  if (!isAuthenticated) return <NotAuthenticated />;

  return (
    <Form className="my-3 mt-lg-5 mx-3 mx-lg-5 edit-question" onSubmit={handleSubmit}>
      {/* Breadcrumb */}
      <Row className="mb-0 mb-lg-3 mx-0">
        <Breadcrumb>
          <BreadcrumbItem>{user?.name}</BreadcrumbItem>
          <BreadcrumbItem>{user?.email}</BreadcrumbItem>
          <BreadcrumbItem active>Edit Profile</BreadcrumbItem>
        </Breadcrumb>
      </Row>

      {/* Name */}
      <FormGroup row className="mx-0">
        <Label sm={3}>Update Name</Label>
        <Col sm={7}>
          <Input
            type="text"
            name="name"
            value={profile.name || ''}
            placeholder="Name here ..."
            onChange={handleInputChange}
          />
        </Col>
        <Col sm={2}>
          <Input disabled type="text" value="Current Record" className="text-success" />
        </Col>
      </FormGroup>

      {/* Select Fields */}
      <SelectField
        label="Update School"
        value={profile.school?._id}
        onChange={handleSelectChange('school', schools, fetchSchoolLevels)}
        options={schools}
        placeholder="-- Select your school --"
        disabledValue={profile.school?.title || ''}
      />

      <SelectField
        label="Update Level"
        value={profile.level?._id}
        onChange={handleSelectChange('level', schoolLevels, fetchLevelFaculties)}
        options={schoolLevels}
        placeholder="-- Select your level --"
        disabledValue={profile.level?.title || ''}
      />

      <SelectField
        label="Update Faculty"
        value={profile.faculty?._id}
        onChange={handleSelectChange('faculty', levelFaculties)}
        options={levelFaculties}
        placeholder="-- Select your faculty --"
        disabledValue={profile.faculty?.title || ''}
      />

      <SelectField
        label="Update Year"
        value={profile.year}
        onChange={handleSelectChange('year')}
        options={years}
        placeholder="-- Select your year --"
        disabledValue={profile.year || ''}
      />

      {/* Interests */}
      {interests.length === 0 ? (
        <FormGroup row className="mx-0">
          <Label sm={3}>Update Interest</Label>
          <Col sm={9} className="my-3 my-sm-2">
            <strong className="text-info">Add Favorite Subject &nbsp;</strong>
            <Button color="success" onClick={handleAddInterest}>
              +
            </Button>
          </Col>
        </FormGroup>
      ) : (
        interests.map((interest, idx) => (
          <FormGroup row className="mx-0" key={idx}>
            <Label sm={3}>Update Interest</Label>
            <Col sm={7}>
              <Input
                type="text"
                name="favorite"
                value={interest.favorite || ''}
                placeholder="New interest here ..."
                onChange={(e) => handleInterestChange(idx, e)}
              />
            </Col>
            <Col sm={2} className="my-3 my-sm-2 d-flex gap-2">
              <Button color="danger" disabled={interests.length <= 1} onClick={() => handleRemoveInterest(idx)}>
                -
              </Button>
              <Button color="success" onClick={handleAddInterest}>
                +
              </Button>
            </Col>
          </FormGroup>
        ))
      )}

      {/* About */}
      <FormGroup row className="mx-0">
        <Label sm={3}>Update About You</Label>
        <Col sm={9}>
          <Input
            type="textarea"
            name="about"
            placeholder="About you ..."
            minLength={5}
            maxLength={2000}
            value={profile.about || ''}
            onChange={handleInputChange}
          />
        </Col>
      </FormGroup>

      {/* Submit */}
      <FormGroup check row className="mx-0 mt-md-4">
        <Col sm={{ size: 10, offset: 2 }}>
          <Button type="submit" style={{ backgroundColor: 'var(--brand)' }} className="text-white">
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </Col>
      </FormGroup>
    </Form>
  );
};

export default EditProfile;
