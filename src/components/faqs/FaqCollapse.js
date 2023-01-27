import React, { useEffect, useState, lazy, Suspense, useContext } from 'react'
import { Row, Col, Jumbotron, Button, Spinner } from 'reactstrap'
import { Collapse } from "react-collapse"
import { connect } from 'react-redux'
import classNames from "classnames"
import faqsStyle from '../../stylesCSS/faqsStyle.module.css'
import AddIcon from '../../images/plus1.svg'
import MinusIcon from '../../images/minus.svg'
import { getFaqs, deleteFaq } from '../../redux/faqs/faqs.actions'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import CreateFaq from './CreateFaq'
import EditFaq from './EditFaq'
import DeleteFaq from './DeleteFaq'
import AddVideo from '../quizes/AddVideo'
import EmbeddedVideos from '../quizes/EmbeddedVideos'
import { currentUserContext } from '../../appContexts'

const GridMultiplex = lazy(() => import('../adsenses/GridMultiplex'))
const InFeedAd = lazy(() => import('../adsenses/InFeedAd'))

const FaqCollapse = ({ faqs, getFaqs }) => {

    const currentUser = useContext(currentUserContext)

    const faqsToUse = faqs && faqs.allFaqs

    // Lifecycle methods
    useEffect(() => {
        getFaqs()
    }, [getFaqs])

    const [state, setState] = useState({
        activeIndex: null
    })

    const toggleClass = (index, e) => {
        setState({ activeIndex: state.activeIndex === index ? null : index })
    }

    const moreLess = (index) => {
        if (state.activeIndex === index) {
            return (
                <span>
                    <img src={MinusIcon} alt='collapse' width={20} height={20} />
                </span>
            )
        } else {
            return (
                <span>
                    <img src={AddIcon} alt='expand' width={20} height={20} />
                </span>
            )
        }
    }

    const { activeIndex } = state

    return (
        faqs.isLoading ?
            <SpinningBubbles title='faqs' /> :

            <div className='py-0 px-3 py-lg-5 w-100'>
                <Jumbotron className="p-2 my-3 my-sm-0 text-center border border-info">
                    <h1 className="display-5 font-weight-bold text-success">
                        Frequently Asked Questions
                    </h1>
                    <p className="lead mb-1 text-dark">
                        Quiz Blog is a web application that provides a multi-category space for people to quiz from.
                    </p>

                    <p>It gives people good time to fix what they studied and even prepare for exams.</p>

                    <small className='font-weight-bolder'>Reach us on <a href="mailto:quizblog.rw@gmail.com?subject=Contact%20Quiz%20Blog" className='text-info'><u>quizblog.rw@gmail.com</u></a> for further details.</small>
                    <hr className="my-2" style={{ height: "2px", borderWidth: 0, color: "#157A6E", backgroundColor: "#157A6E" }} />
                </Jumbotron>

                {(currentUser && currentUser.role) === 'Admin' || (currentUser && currentUser.role) === 'SuperAdmin' ?
                    <Row className="m-lg-4 px-lg-5 d-flex justify-content-around align-items-center text-primary">
                        <CreateFaq />
                    </Row> :

                    <Suspense fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center w-100">
                        <Spinner style={{ width: '5rem', height: '5rem' }} />{' '}
                    </div>}>
                        <InFeedAd />
                    </Suspense>
                }

                <Row className="m-lg-4 px-lg-5 d-flex justify-content-around align-items-center text-primary">

                    <ul className={faqsStyle.docsList}>

                        {faqsToUse && faqsToUse.map((faq, index) => {

                            return (
                                <li key={index}>

                                    <div className={faqsStyle.titleToggler}>
                                        <h3>
                                            {faq.title}
                                        </h3>

                                        <span>
                                            <Button
                                                className="btn btn-warning btn-xs"
                                                onClick={() => toggleClass(index)}
                                            >
                                                {moreLess(index)}
                                            </Button>

                                            {
                                                (currentUser && currentUser.role) === 'Admin' || (currentUser && currentUser.role) === 'SuperAdmin' ?
                                                    <>
                                                        <Button size="sm" color="link" className="mx-2">
                                                            <EditFaq faqToEdit={faq} />
                                                        </Button>

                                                        <Button size="sm" color="link" className="mx-2" >
                                                            <DeleteFaq faqID={faq._id} />
                                                        </Button>
                                                        <AddVideo faqID={faq._id} isFromFaqs={true} />
                                                    </>
                                                    : null
                                            }
                                        </span>
                                    </div>

                                    <Collapse isOpened={activeIndex === index}>
                                        <div
                                            className={classNames("alert alert-secondary msg", {
                                                show: activeIndex === index,
                                                hide: activeIndex !== index
                                            })}
                                        >
                                            <div className={faqsStyle.collapseContent}>
                                                <div className={faqsStyle.docsLinks}>
                                                    <p>{faq.answer}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <EmbeddedVideos faq={faq} isFromFaqs={true} currentUser={currentUser} />
                                    </Collapse>
                                </li>
                            )
                        })
                        }
                    </ul>

                    <Col sm="12">
                        <Suspense fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                            <Spinner style={{ width: '5rem', height: '5rem' }} />{' '}
                        </div>}>
                            <GridMultiplex />
                        </Suspense>
                    </Col>
                </Row>
            </div>

    )
}

const mapStateToProps = state => ({
    faqs: state.faqsReducer
})

export default connect(mapStateToProps, { getFaqs, deleteFaq })(FaqCollapse)