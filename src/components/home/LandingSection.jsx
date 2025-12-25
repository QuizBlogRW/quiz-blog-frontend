import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import srcQuestion from '@/images/undraw_Question2.svg';
import Adverts from './Adverts';
import { logRegContext } from '@/contexts/appContexts';

const LandingSection = () => {

  const { isAuthenticated } = useSelector((state) => state.users);
  const { toggleR } = useContext(logRegContext);
  const title = 'Knowledge matters, and so does the joy of quizzing!';

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      toggleR();
      return;
    }

    const target = document.getElementById('latest-quizzes');
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section className="intro-landing w-100 d-flex flex-column flex-lg-row justify-content-around align-items-center mx-auto py-5" aria-label="Landing">

      <Col sm={12} lg={7} className="d-flex flex-column text-start px-3 px-lg-5">
        <h1 className="text-primary fw-bolder mb-3 landing-title">
          {title.split(' ').map((word) => (
            <span key={word} className="d-inline-block me-1">{capitalize(word)}&nbsp;</span>
          ))}
        </h1>

        <p className="lead fs-5 pt-3">
          Dive into quizzes, challenge yourself, build confidence, and have fun while learning!
          <span role="img" aria-label="celebrate"> 📚🧠🌟🎉</span>
        </p>

        <img
          src={srcQuestion}
          alt="quiz illustration"
          className="landing-illustration my-4 mx-auto d-block"
          style={{ maxWidth: '80%', height: 'auto' }}
        />

        <div className="d-flex flex-wrap gap-3 mt-3 justify-content-around">
          <Button color="success" className="landing-cta px-4 py-2 fw-bold" onClick={handleGetStarted} aria-label="Get started">
            Get Started
          </Button>

          <Link to="/course-notes" className="text-decoration-none">
            <Button color="success" outline className="landing-cta px-4 py-2 fw-bold" aria-label="Read notes">
              Read Notes
            </Button>
          </Link>
        </div>
      </Col>

      <Col sm={12} lg={5} className="py-3 p-md-5">
        <Adverts />
      </Col>

    </section>
  );
};

export default LandingSection;
