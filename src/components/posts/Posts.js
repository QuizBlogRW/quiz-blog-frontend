import React, { useEffect, useState, lazy, Suspense, useContext } from 'react'
import { Container, Col, Row, Button, Spinner } from 'reactstrap'
import ReactLoading from "react-loading"
// import SearchInput from '../SearchInput'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setQuizes, setAllNoLimitQuizes } from '../../redux/quizes/quizes.actions'
import { categoriesContext } from '../../appContexts'

const CarouselQuiz = lazy(() => import('./CarouselQuiz'))
const PostItem = lazy(() => import('./PostItem'))
const RightSide = lazy(() => import('./RightSide'))
const Popular = lazy(() => import('./Popular'))
const ResponsiveAd = lazy(() => import('../adsenses/ResponsiveAd'))
const SquareAd = lazy(() => import('../adsenses/SquareAd'))
const InFeedAd = lazy(() => import('../adsenses/InFeedAd'))
const NotesPapers = lazy(() => import('./notes/NotesPapers'))
const Challenges = lazy(() => import('./challenges/Challenges'))
const BlogPosts = lazy(() => import('../blog/public/BlogPosts'))
const ViewCategory = lazy(() => import('../categories/ViewCategory'))

const Posts = ({ setQuizes, setAllNoLimitQuizes, limitedQuizes, limitedQuizesLoading }) => {

    const categories = useContext(categoriesContext)

    // const [searchKey, setSearchKey] = useState('')
    const [limit] = useState(10)

    // Lifecycle methods
    useEffect(() => {
        setQuizes(limit)
        // setAllNoLimitQuizes()
    }, [setQuizes, setAllNoLimitQuizes, limit])

    const mystyle = {
        color: "#B4654A",
        textAlign: "center",
        animationDuration: "2s",
        animationName: "slidein",
        animationIterationCount: "infinite",
        animationDirection: "alternate"
    }

    return (
        <Container className="posts main w-100 px-0 mt-4">

            <blockquote className="blockquote text-center mt-2 mt-sm-4">
                <h1 className="mb-3 lead text-uppercase font-weight-bold">Knowing matter, so does quizzing!</h1>
                <small className="text-muted p-1 ml-lg-2">
                    &nbsp;~&nbsp; Welcome, test your knowledge as you wish! &nbsp;~&nbsp;
                </small>
            </blockquote>

            <Row className="mt-lg-5 mx-0 px-1 px-lg-5">
                <Col sm="12">
                    <Suspense fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                        <Spinner style={{ width: '8rem', height: '8rem' }} />
                    </div>}>
                        <CarouselQuiz />
                    </Suspense>
                </Col>
            </Row>

            <Row className="mt-5 mx-0">
                <div style={mystyle} className="soon">
                    <h4 className='d-inline border border-success rounded p-lg-1'>
                        Ready? Let's link you to your exam success! 🍾🎉</h4>
                </div>
            </Row>

            <hr />
            <Row className="m-2 mt-lg-3 px-2 d-flex d-lg-none mobile-categories side-category">
                <Suspense
                    fallback=
                    {
                        <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                            <Spinner style={{ width: '5rem', height: '5rem' }} />{' '}
                        </div>
                    }>
                    <ViewCategory categories={categories} />
                </Suspense>
            </Row>

            <Row className="mt-5 mx-0 py-sm-3 quizzes-list">

                <Col sm="8" className="px-1 px-lg-4 mt-md-2 w-100">
                    <h3 className="inversed-title mt-0 mt-lg-3 pt-4 py-lg-3 text-danger text-center font-weight-bold pt-2">
                        <span className="part1">NEWEST</span>
                        <span className="part2">QUIZZES</span>
                    </h3>

                    {limitedQuizesLoading ?
                        <div className="p-5 m-5 d-flex justify-content-center align-items-center">
                            <ReactLoading type="spokes" color="#33FFFC" />
                        </div> :

                        <>
                            {/* Search input*/}
                            {/* {
                                allNoLimitLoading ?
                                    <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                        <ReactLoading type="bubbles" color="#33FFFC" /> </div> :
                                    <SearchInput setSearchKey={setSearchKey} placeholder=" Search quizes here ...  " />
                            } */}
                            {/* {searchKey === "" ? null :

                                allNoLimit && allNoLimit
                                    .map(quiz => (

                                        quiz.title.toLowerCase().includes(searchKey.toLowerCase()) ?
                                            <PostItem key={quiz._id} quiz={quiz} fromSearch={true} /> : null
                                    ))} */}

                            {limitedQuizes && limitedQuizes
                                .map(quiz => (
                                    quiz.questions.length > 5 ?
                                        <Suspense key={quiz._id} fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center w-100">
                                            <Spinner style={{ width: '8rem', height: '8rem' }} />
                                        </div>}>
                                            <PostItem quiz={quiz} />

                                            {/* ON HALF THE NUMBER OF QUIZZES, DIPLAY THE ad */}
                                            {limitedQuizes.length > 0 && limitedQuizes.indexOf(quiz) === Math.floor(limitedQuizes.length / 2) ?

                                                <div className='w-100 d-flex justify-content-center align-items-center'>
                                                    <SquareAd />
                                                </div> : null}
                                        </Suspense> : null
                                ))}

                            {limitedQuizes.length > 0 ?

                                <div className="my-3 d-flex justify-content-center">
                                    <Link to="/allposts">
                                        <Button outline color="info" className='view-all-btn'>
                                            More Quizzes Here &nbsp;<i className="fa fa-arrow-right"></i>
                                        </Button>
                                    </Link>
                                </div> :
                                null}
                        </>
                    }
                    <Popular />

                    {/* ad */}
                    <Row className='w-100 d-flex justify-content-center align-items-center'>
                        <Col sm="12" className='w-100 d-flex justify-content-center align-items-center'>
                            <div className='w-100 d-flex justify-content-center align-items-center'>
                                <InFeedAd />
                            </div>
                        </Col>
                    </Row>
                </Col>

                <RightSide categories={categories} />
            </Row>

            <Suspense fallback={<div className="p-3 d-flex justify-content-center align-items-center">
                <Spinner style={{ width: '8rem', height: '8rem' }} />
            </div>}>
                <BlogPosts />
            </Suspense>

            <Suspense fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                <Spinner style={{ width: '8rem', height: '8rem' }} />
            </div>}>
                <NotesPapers />
            </Suspense>

            <Suspense fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                <Spinner style={{ width: '8rem', height: '8rem' }} />
            </div>}>
                <Challenges />
            </Suspense>

            <Row className='w-100 d-flex justify-content-center align-items-center'>
                <Col sm="12" className='w-100 d-flex justify-content-center align-items-center'>
                    <div className='w-100 d-flex justify-content-center align-items-center'>
                        <ResponsiveAd />
                    </div>
                </Col>
            </Row>

        </Container>
    )
}

const mapStateToProps = state => ({
    subscribedUsers: state.subscribersReducer.subscribedUsers,
    limitedQuizes: state.quizesReducer.allQuizes,
    limitedQuizesLoading: state.quizesReducer.isLoading,
    // allNoLimit: state.quizesReducer.allQuizesNoLimit,
    // allNoLimitLoading: state.quizesReducer.isNoLimitLoading
})

export default connect(mapStateToProps, { setQuizes, setAllNoLimitQuizes })(Posts)