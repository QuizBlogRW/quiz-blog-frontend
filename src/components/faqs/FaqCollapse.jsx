import { useEffect, useState, lazy, Suspense, useCallback } from 'react';
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
  const dispatch = useDispatch();
  const { allFaqs, isLoading } = useSelector((state) => state.faqs);
  const { user } = useSelector((state) => state.users);

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    dispatch(getFaqs());
  }, [dispatch]);

  const toggleFAQ = useCallback(
    (index) => {
      setActiveIndex((prev) => (prev === index ? null : index));
    },
    []
  );

  const ToggleIcon = ({ isOpen }) => (
    <img
      src={isOpen ? MinusIcon : AddIcon}
      alt={isOpen ? 'collapse' : 'expand'}
      width={20}
      height={20}
    />
  );

  if (isLoading) return <QBLoadingSM title="faqs" />;

  return (
    <div className="py-0 px-3 py-lg-5 w-100">

      {/* Jumbotron */}
      <div className="jbtron rounded px-3 px-sm-4 py-3 py-sm-5 p-2 py-lg-4 my-3 my-sm-4 text-center border border-info">
        <h1 className="display-5 fw-bolder text-white">Frequently Asked Questions</h1>

        <p className="lead mb-1 text-white">
          Answers to the questions people most often ask about Quiz-Blog.
        </p>

        <p className="text-white">
          Quiz-Blog helps you practice across many categories so you can review what you
          studied and prepare for exams.
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
            backgroundColor: 'var(--brand)',
          }}
        />
      </div>

      {/* Admin create FAQ OR Advertisement */}
      <Row className="m-lg-4 px-lg-5 d-flex justify-content-around align-items-center text-primary">
        {user?.role?.includes('Admin') ? (
          <Col xs="auto" className="mb-2">
            <CreateFaq />
          </Col>
        ) : (
          isAdEnabled() && (
            <Suspense fallback={<QBLoadingSM />}>
              <InFeedAd />
            </Suspense>
          )
        )}
      </Row>

      {/* FAQ List */}
      <Row className="m-lg-4 px-lg-5 text-primary">
        <ul className={faqsStyle.docsList}>
          {allFaqs?.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <li key={faq._id}>
                <div className={faqsStyle.titleToggler}>
                  <h3
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleFAQ(index)}
                    onKeyDown={(e) => (e.key === 'Enter' ? toggleFAQ(index) : null)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                  >
                    {faq.title}
                  </h3>

                  <div className={faqsStyle.actionGroup}>
                    <Button
                      className={`btn btn-warning btn-xs ${faqsStyle.faqToggleBtn}`}
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                    >
                      <ToggleIcon isOpen={isOpen} />
                    </Button>

                    {user?.role?.includes('Admin') && (
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
                    )}
                  </div>
                </div>

                <Collapse isOpened={isOpen}>
                  <div
                    id={`faq-panel-${index}`}
                    className={classNames('alert alert-secondary msg')}
                  >
                    <div className={faqsStyle.collapseContent}>
                      <p>{faq.answer}</p>
                    </div>

                    <EmbeddedVideos faq={faq} isFromFaqs={true} />
                  </div>
                </Collapse>
              </li>
            );
          })}
        </ul>

        {/* Bottom Ad */}
        {isAdEnabled() && (
          <Col sm="12">
            <Suspense fallback={<QBLoadingSM />}>
              <GridMultiplex />
            </Suspense>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default FaqCollapse;
