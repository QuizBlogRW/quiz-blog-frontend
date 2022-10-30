import React, { useEffect, lazy, Suspense, useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Link } from "react-router-dom"
import { Spinner, Toast, ToastHeader } from 'reactstrap'

// REDUX
import { connect } from 'react-redux'
import store from './redux/store'
import { setCategories } from './redux/categories/categories.actions'
import { getCourseCategories } from './redux/courseCategories/courseCategories.actions'
import { getPostCategories } from './redux/blog/postCategories/postCategories.actions'
import { loadUser } from './redux/auth/auth.actions'

// components
import Contact from './components/contact/Contact'
import FaqCollapse from './components/faqs/FaqCollapse'
import About from './components/about/About'

// auth
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import Unsubscribe from './components/auth/Unsubscribe'
import EditProfile from './components/auth/EditProfile'
import UserLogs from './components/users/UserLogs'
import Subscribers from './components/users/Subscribers'

// others
import Privacy from './components/others/Privacy'
import Disclaimer from './components/others/Disclaimer'
import Placeholder from './components/others/Placeholder'

// categories
import SingleCategory from './components/categories/SingleCategory'
import AllCategories from './components/categories/AllCategories'

// quizes
import QuizQuestions from './components/quizes/questionsScore/QuizQuestions'
import GetReady from './components/quizes/GetReady'
import ReviewQuiz from './components/quizes/review/ReviewQuiz'
import QuizRanking from './components/quizes/QuizRanking'
// import SelectChallengee from './components/quizes/SelectChallengee'

// Challenge
import EditChallengeQuiz from './components/challenges/adminView/EditChallengeQuiz'
import TakeChallenge from './components/challenges/userView/TakeChallenge'
import Challenges from './components/challenges/adminView/Challenges'
import AllChallenges from './components/challenges/userView/AllChallenges'
import ViewChallenge from './components/posts/challenges/ViewChallenge'

// questions
import CreateQuestions from './components/questions/CreateQuestions'
import SingleQuestion from './components/questions/SingleQuestion'
import EditQuestion from './components/questions/EditQuestion'

// webmaster
import ReportsAdmin from './components/webmaster/ReportsAdmin'
import Broadcasts from './components/broadcasts/Broadcasts'

// courseNotes
import Index from './components/courseNotes/Index'
import ViewCourse from './components/courseNotes/ViewCourse'

// Schools
import SchoolsLanding from './components/schools/SchoolsLanding'

// Blog posts
import AllBlogPosts from './components/blog/public/AllBlogPosts'
import AddBlogPost from './components/blog/blogPosts/AddBlogPost'
import EditBlogPost from './components/blog/blogPosts/EditBlogPost'
import ViewBlogPost from './components/blog/public/ViewBlogPost'
import ByCategory from './components/blog/public/ByCategory'

// components
const Header = lazy(() => import('./components/Header'))
const Footer = lazy(() => import('./components/footer/Footer'))

// lazy loading posts
const Webmaster = lazy(() => import('./components/webmaster/Webmaster'))
const Posts = lazy(() => import('./components/posts/Posts'))
const AllPosts = lazy(() => import('./components/posts/AllPosts'))
const ViewNotePaper = lazy(() => import('./components/posts/notes/ViewNotePaper'))
const ViewPDF = lazy(() => import('./components/posts/notes/ViewPDF'))

const App = ({ auth, categories, courseCategories, bPcats, setCategories, getCourseCategories, getPostCategories }) => {

    useEffect(() => {
        store.dispatch(loadUser())
        setCategories()
        getCourseCategories()
        getPostCategories()
    }, [setCategories, getCourseCategories, getPostCategories])

    const NonEmptyFields = auth.isAuthenticated && Object
        .keys(auth.user)
        .filter(x => auth.user[x].length !== 0 || auth.user[x] !== '')
        .length

    const percentage = (NonEmptyFields - 3) * 10

    // const initial = successful.id ? true : errors.id ? true : false
    const initial = (auth.isAuthenticated && percentage < 100) ? true : false

    //properties of the modal
    const [modal, setModal] = useState(initial)
    useEffect(() => { setModal(initial) }, [initial])

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    return (
        <Router>

            <Toast isOpen={modal} className={`mw-100 popup-toast`}>
                <ToastHeader toggle={toggle} className="bg-warning" icon="danger">
                    <p className='text-dark text-center font-weight-bolder d-block mb-0'>
                        Your profile is {`${percentage && percentage}`} % up to date!
                        &nbsp;&nbsp;&nbsp;
                        <Link to={`/edit-profile/${auth.user && auth.user._id}`}>
                            <strong className='px-1 text-underline text-danger bg-dark'>Consider updating ...</strong>
                        </Link>
                    </p>
                </ToastHeader>
            </Toast>

            {/* <Toast isOpen={modal} className={`mw-100 popup-toast`}>
                <ToastHeader toggle={toggle} className={`${successful.id ? 'bg-dark' : 'bg-danger'}`}>
                    {successful.id ?
                        <p className='text-white text-center d-block mb-0'>
                            {successful.msg}
                        </p> :
                        errors.id ?
                            <p className='text-white text-center d-block mb-0'>
                                {errors.status === 500 ? 'Something went wrong please refresh ...' : errors.msg}
                            </p> : ''}
                </ToastHeader>
            </Toast> */}

            <Suspense fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                <Spinner style={{ width: '8rem', height: '8rem' }} />
            </div>}>
                <Header auth={auth} categories={categories} />
            </Suspense>

            <Switch>
                <Route path="/about" component={About} />
                <Route path="/privacy" component={Privacy} />
                <Route path="/disclaimer" component={Disclaimer} />
                <Route exact path="/unsubscribe" render={() => <Unsubscribe auth={auth} />} />
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route exact path="/reset-password" render={() => <ResetPassword auth={auth} />} />

                <Route exact path="/category/:categoryId" render={() => <SingleCategory auth={auth} categories={categories} />} />
                <Route exact path="/edit-profile/:userId" render={() => <EditProfile auth={auth} />} />
                <Route exact path="/view-quiz/:quizSlug" render={() => <GetReady auth={auth} />} />
                <Route exact path="/attempt-quiz/:quizSlug" render={() => <QuizQuestions auth={auth} categories={categories} />} />

                <Route exact path="/take-challenge/:challengeId" render={() => <TakeChallenge auth={auth} categories={categories} />} />
                <Route exact path="/edit-challenge/:challengeId" render={() => <EditChallengeQuiz auth={auth} />} />
                <Route exact path="/view-challenge/:challengeId" render={() => <ViewChallenge auth={auth} />} />
                <Route exact path="/challenges" render={() => <Challenges auth={auth} />} />
                <Route exact path="/all-challenges" render={() => <AllChallenges />} />

                <Route exact path="/view-question/:questionId" render={() => <SingleQuestion auth={auth} />} />
                <Route exact path="/edit-question/:questionId" render={() => <EditQuestion auth={auth} categories={categories} />} />

                <Route exact path="/review-quiz/:reviewId" render={() => <ReviewQuiz auth={auth} />} />
                <Route exact path="/reports-admin" render={() => <ReportsAdmin auth={auth} />} />
                <Route exact path="/quiz-ranking/:quizID" render={() => <QuizRanking auth={auth} />} />
                <Route exact path="/questions-create/:quizSlug" render={() => <CreateQuestions auth={auth} categories={categories} />} />
                {/* <Route exact path="/challenge/:quizSlug/:userId/" render={() => <SelectChallengee auth={auth} />} /> */}

                <Route exact path="/contact" render={() => <Contact auth={auth} />} />
                <Route exact path="/faqs" render={() => <FaqCollapse auth={auth} />} />
                <Route path="/all-categories" render={() => <AllCategories categories={categories} />} />
                <Route path="/course-notes" render={() => <Index auth={auth} />} />
                <Route exact path="/view-course/:courseId" render={() => <ViewCourse auth={auth} />} />
                <Route exact path="/schools" render={() => <SchoolsLanding auth={auth} />} />
                <Route exact path="/logs" render={() => <UserLogs auth={auth} />} />
                <Route exact path="/subscribers" render={() => <Subscribers auth={auth} />} />
                <Route exact path="/broadcasts" render={() => <Broadcasts auth={auth} />} />

                <Route exact path="/blog" render={() => <AllBlogPosts bPcats={bPcats}/>} />
                <Route exact path="/blog/:bPCatID" render={() => <ByCategory bPcats={bPcats} />} />
                <Route exact path="/create-bpost/:bPCatID" render={() => <AddBlogPost auth={auth} />} />
                <Route exact path="/edit-bpost/:bPSlug" render={() => <EditBlogPost auth={auth} />} />
                <Route exact path="/view-blog-post/:bPSlug" render={() => <ViewBlogPost />} />

                <Route path="/ads.txt">
                    google.com, pub-8918850949540829, DIRECT, f08c47fec0942fa0
                </Route>

                <Suspense fallback={<div className="p-5 m-5 d-flex justify-content-center align-items-center">
                    <Spinner style={{ width: '10rem', height: '10rem' }} />
                </div>}>
                    <Route exact path="/"><Posts categories={categories} auth={auth} /></Route>
                    <Route exact path="/allposts"><AllPosts /></Route>
                    <Route exact path="/view-note-paper/:noteSlug" render={() => <ViewNotePaper auth={auth} />} />
                    <Route exact path="/view-pdf-notes/:noteSlug" render={() => <ViewPDF auth={auth} />} />
                    <Route exact path="/webmaster"><Webmaster auth={auth} categories={categories} courseCategories={courseCategories} /></Route>
                </Suspense>
                <Route path="/*"><Placeholder /></Route>
            </Switch>

            <Suspense fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                <Spinner style={{ width: '8rem', height: '8rem' }} />
            </div>}>
                <Footer />
            </Suspense>
        </Router>
    )
}

const mapStateToProps = state => ({
    auth: state.authReducer,
    categories: state.categoriesReducer,
    courseCategories: state.courseCategoriesReducer,     
    bPcats: state.postCategoriesReducer,     
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { setCategories, getCourseCategories, getPostCategories })(App)