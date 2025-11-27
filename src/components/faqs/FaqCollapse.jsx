import { useEffect, useState, lazy, Suspense } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { Collapse } from 'react-collapse';
import classNames from 'classnames';
import faqsStyle from './faqsStyle.module.css';
import AddIcon from '@/images/plus1.svg';
import MinusIcon from '@/images/minus.svg';
import { getFaqs, deleteFaq } from '@/redux/slices/faqsSlice';
import { useSelector, useDispatch } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import CreateFaq from '@/components/dashboard/posts/faqs/CreateFaq';
import EditFaq from '@/components/dashboard/posts/faqs/EditFaq';
import AddVideo from '@/components/dashboard/quizzing/quizzes/AddVideo';
import EmbeddedVideos from '@/components/quizzes/EmbeddedVideos';
import DeleteModal from '@/utils/DeleteModal';
import isAdEnabled from '@/utils/isAdEnabled';

const GridMultiplex = lazy(() => import('@/components/adsenses/GridMultiplex'));
const InFeedAd = lazy(() => import('@/components/adsenses/InFeedAd'));

const FaqCollapse = () => {
  // Redux
  const dispatch = useDispatch();
  const faqs = useSelector((state) => state.faqs);
  const { user } = useSelector((state) => state.auth);
  const faqsToUse = faqs && faqs.allFaqs;

  // Lifecycle methods
  useEffect(() => {
    dispatch(getFaqs());
  }, [dispatch]);

  const [state, setState] = useState({
    activeIndex: null,
  });

  const toggleClass = (index) => {
    setState({ activeIndex: state.activeIndex === index ? null : index });
  };

  const moreLess = (index) => {
    if (state.activeIndex === index) {
      return (
        <span>
          <img src={MinusIcon} alt="collapse" width={20} height={20} />
        </span>
      );
    } else {
      return (
        <span>
          <img src={AddIcon} alt="expand" width={20} height={20} />
        </span>
      );
    }
  };

  const { activeIndex } = state;

  return faqs.isLoading ? (
    <QBLoadingSM title="faqs" />
  ) : (
    <div className="py-0 px-3 py-lg-5 w-100">
      <div className="jbtron rounded px-3 px-sm-4 py-3 py-sm-5 p-2 py-lg-4 my-3 my-sm-4 text-center border border-info">
        <h1 className="display-5 fw-bolder text-white">
          Frequently Asked Questions
        </h1>
        <p className="lead mb-1 text-white">
          Answers to the questions people most often ask about Quiz-Blog.
        </p>

        <p className="text-white">
          Quiz-Blog helps you practice across many categories so you can review
          what you studied and prepare for exams.
        </p>

        <small className="fw-bolder text-white">
          Have more questions? Reach us at{' '}
          <a
            href="mailto:quizblog.rw@gmail.com?subject=Contact%20Quiz%20Blog"
            style={{ color: 'var(--accent)' }}
          >
            <u>quizblog.rw@gmail.com</u>
          </a>
          .
        </small>
        <hr
          className="my-2"
          style={{
            height: '2px',
            borderWidth: 0,
            color: 'var(--brand)',
            backgroundColor: 'var(--brand)',
          }}
        />
      </div>

      {user?.role?.includes('Admin') ? (
        <Row className="m-lg-4 px-lg-5 d-flex justify-content-around align-items-center text-primary">
          <CreateFaq />
        </Row>
      ) : (isAdEnabled() && <Suspense fallback={<QBLoadingSM />}>
        <InFeedAd />
      </Suspense>)}

      <Row className="m-lg-4 px-lg-5 d-flex justify-content-around align-items-center text-primary">
        <ul className={faqsStyle.docsList}>
          {faqsToUse &&
            faqsToUse.map((faq, index) => {
              return (
                <li key={index}>
                  <div className={faqsStyle.titleToggler}>
                    <h3
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleClass(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          toggleClass(index);
                      }}
                      aria-controls={`faq-collapse-${index}`}
                      aria-expanded={activeIndex === index}
                    >
                      {faq.title}
                    </h3>

                    <span className={faqsStyle.actionGroup}>
                      <Button
                        className={
                          'btn btn-warning btn-xs ' + faqsStyle.faqToggleBtn
                        }
                        onClick={() => toggleClass(index)}
                        aria-label={
                          activeIndex === index
                            ? 'Collapse answer'
                            : 'Expand answer'
                        }
                        aria-controls={`faq-collapse-${index}`}
                        aria-expanded={activeIndex === index}
                      >
                        {moreLess(index)}
                      </Button>

                      {user?.role?.includes('Admin') ? (
                        <>
                          <EditFaq faqToEdit={faq} />
                          <DeleteModal
                            deleteFnName="deleteFaq"
                            deleteFn={deleteFaq}
                            delID={faq._id}
                            delTitle={faq.title}
                          />
                          <AddVideo faqID={faq._id} isFromFaqs={true} />
                        </>
                      ) : null}
                    </span>
                  </div>

                  <Collapse isOpened={activeIndex === index}>
                    <div
                      id={`faq-collapse-${index}`}
                      className={classNames('alert alert-secondary msg', {
                        show: activeIndex === index,
                        hide: activeIndex !== index,
                      })}
                    >
                      <div className={faqsStyle.collapseContent}>
                        <div className={faqsStyle.docsLinks}>
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </div>

                    <EmbeddedVideos faq={faq} isFromFaqs={true} />
                  </Collapse>
                </li>
              );
            })}
        </ul>

        {isAdEnabled() && <Col sm="12">
          <Suspense fallback={<QBLoadingSM />}>
            <GridMultiplex />
          </Suspense>
        </Col>}
      </Row>
    </div>
  );
};

export default FaqCollapse;
