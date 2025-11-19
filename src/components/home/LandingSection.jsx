import { useContext } from 'react';
import { Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import srcQuestion from '@/images/undraw_Question2.svg';
import Adverts from './Adverts';
import { logRegContext } from '@/contexts/appContexts';

const LandingSection = () => {
  const { toggleR } = useContext(logRegContext);
  const title = 'KNOWLEDGE MATTERS, AND SO DOES THE JOY OF QUIZZING!';

  const capitalize = (str) => {
    const lower = str.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <section className="intro-landing w-100 d-flex justify-content-around align-items-center mx-auto" aria-label="Landing">
      <Col sm={7} className="d-flex flex-column text-start pt-5 px-3 p-lg-5">
        <h1 className="text-primary fw-bolder underline mb-3 mb-lg-0 landing-title">
          {title.split(' ').map((word) => (
            <span key={word} className="d-inline-block me-1">{capitalize(word)}&nbsp;</span>
          ))}
        </h1>

        <p className="lead pt-lg-4">
          Explore and test yourself — join the fun of quizzes, build confidence,
          and get ready to succeed.  <span role="img" aria-label="celebrate">📚🧠🔍🌟🎉</span>
        </p>

        <img src={srcQuestion} alt="question illustration" className="landing-illustration my-4 mx-auto d-block" />

        <div className="d-flex align-items-center gap-3 mt-2 mt-lg-4">
          <Button className="landing-cta" onClick={toggleR} aria-label="Get started">Get Started</Button>

          <Link to="/course-notes" className="text-decoration-none">
            <Button className="landing-cta alt" aria-label="Read notes">Read Notes</Button>
          </Link>
        </div>
      </Col>

      <Col sm={5} className="py-1 p-md-5">
        <Adverts />
      </Col>
    </section>
  );
};

export default LandingSection;
