import React, { useEffect, lazy, Suspense, useState, useCallback } from 'react'
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { Toast } from 'reactstrap'
import ReactGA from "react-ga4"

// TOASTIFY
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// CONTEXTS
import { authContext, currentUserContext, categoriesContext, courseCategoriesContext, bPcatsContext, logRegContext } from './appContexts'

// REDUX
import { getCategories } from './redux/slices/categoriesSlice'
import { getCourseCategories } from './redux/slices/courseCategoriesSlice'
import { getPostCategories } from './redux/slices/postCategoriesSlice'
import { getLandingDisplayNotes } from './redux/slices/notesSlice'
import { loadUser } from './redux/slices/authSlice'
import { useSelector, useDispatch } from "react-redux"

// auth components
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import Unsubscribe from './components/auth/Unsubscribe'
import EditProfile from './components/auth/EditProfile'
import Subscribers from './components/users/Subscribers'

// others components
import Contact from './components/contacts/Contact'
import ChatWrapper from './components/contacts/ChatWrapper'
import FaqCollapse from './components/faqs/FaqCollapse'
import About from './components/about/About'
import Privacy from './components/others/Privacy'
import Disclaimer from './components/others/Disclaimer'
import NotFound404 from './components/others/NotFound404'
import QBLoading from './components/rLoading/QBLoading'

// categories components
import SingleCategory from './components/categories/SingleCategory'
import AllCategories from './components/categories/AllCategories'

// quizes components
import QuizQuestions from './components/quizes/QuizQuestions'
import QuizResults from './components/quizes/questionsScore/QuizResults'
import GetReady from './components/quizes/GetReady'
import ReviewQuiz from './components/quizes/review/ReviewQuiz'
import QuizRanking from './components/quizes/QuizRanking'

// questions components
import CreateQuestions from './components/questions/CreateQuestions'
import SingleQuestion from './components/questions/SingleQuestion'
import EditQuestion from './components/questions/EditQuestion'

// Dashboard components
import Broadcasts from './components/broadcasts/Broadcasts'
import Dashboard from './components/dashboard/Dashboard'

// courseNotes components
import Index from './components/courseNotes/Index'
import ViewCourse from './components/courseNotes/ViewCourse'

// Schools components
import SchoolsLanding from './components/schools/SchoolsLanding'

// Blog posts components
import AllBlogPosts from './components/blog/public/AllBlogPosts'
import AddBlogPost from './components/blog/blogPosts/AddBlogPost'
import EditBlogPost from './components/blog/blogPosts/EditBlogPost'
import ViewBlogPost from './components/blog/public/ViewBlogPost'
import ByCategory from './components/blog/public/ByCategory'

// Statistics components
import UsersStats from './components/statistics/content/users/UsersStats'
import BlogStats from './components/statistics/content/blogposts/BlogStats'
import Verify from './components/auth/Verify'

// components lazy loading
const Header = lazy(() => import('./components/header/Header'))
const Footer = lazy(() => import('./components/footer/Footer'))

// lazy loading posts
const Statistics = lazy(() => import('./components/statistics/Statistics'))
const Posts = lazy(() => import('./components/posts/Posts'))
const AllPosts = lazy(() => import('./components/posts/AllPosts'))
const ViewNotePaper = lazy(() => import('./components/posts/notes/ViewNotePaper'))

// Google analytics
// Initialize google analytics page view tracking
ReactGA.initialize('G-GXLLDMB41B', {
    debug: true,
    gaOptions: {
        siteSpeedSampleRate: 100
    }
})

const App = () => {

    // Hooks
    let location = useLocation()
    const dispatch = useDispatch()

    // States
    const [isOpenL, setIsOpenL] = useState(false)
    const [isOpenR, setIsOpenR] = useState(false)

    // Toggles for login and register modals
    const toggleL = useCallback(() => {
        setIsOpenR(false)
        setIsOpenL(prevIsOpenL => !prevIsOpenL)
    }, [])

    const toggleR = useCallback(() => {
        setIsOpenL(false)
        setIsOpenR(prevIsOpenR => !prevIsOpenR)
    }, [])


    //showing and hiding modal
    const toggle = () => setModal(!modal)

    // Tracking page views
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search, title: `${location.pathname + location.search}` });

    // Load user and categories on page load
    useEffect(() => {
        dispatch(loadUser())
        dispatch(getCategories())
        dispatch(getCourseCategories())
        dispatch(getPostCategories())
        dispatch(getLandingDisplayNotes())
    }, [dispatch])

    // Selectors from redux store using hooks
    const auth = useSelector(state => state.auth)
    const categories = useSelector(state => state.categories)
    const courseCategories = useSelector(state => state.courseCategories)
    const bPcats = useSelector(state => state.postCategories)

    // Profile non empty details - Those with not empty strings and not null values
    let NonEmptyFields = 14;
    NonEmptyFields = auth && auth.isAuthenticated && Object
        .keys(auth.user)
        .filter(key => ((auth.user[key] && auth.user[key]) !== '')
            && ((auth.user[key] && auth.user[key]) !== null))
        .length

    const percentage = (NonEmptyFields - 4) * 10
    const [modal, setModal] = useState(false)
    useEffect(() => { auth.isAuthenticated && percentage < 100 && setModal(true) }, [auth.isAuthenticated, percentage])
    const currentUser = auth && auth.user

    return (
        // Contexts
        <authContext.Provider value={auth}>
            <logRegContext.Provider value={{ isOpenL, toggleL, isOpenR, toggleR }}>
                <currentUserContext.Provider value={currentUser}>
                    <categoriesContext.Provider value={categories}>
                        <courseCategoriesContext.Provider value={courseCategories}>
                            <bPcatsContext.Provider value={bPcats}>

                                {/* router */}
                                <Suspense fallback={<QBLoading />}>

                                    <Toast isOpen={modal} className={`w-100 popup-toast`}>

                                        <div className="bg-warning py-2 px-3 d-flex justify-content-between align-items-center">
                                            <p className='text-danger text-center fw-bolder d-block mb-0'>
                                                &nbsp;&nbsp;Your profile is {`${percentage && percentage}`} % up to date!
                                                &nbsp;&nbsp;
                                                <Link to={`/edit-profile/${auth.user && auth.user._id}`}>
                                                    <strong className='px-1' style={{ color: '#157A6E', textDecoration: 'underline' }}>
                                                        Consider updating ...
                                                    </strong>
                                                </Link>
                                            </p>

                                            <button onClick={toggle} className="btn btn-sm btn-danger ms-2">
                                                <i className="fa fa-times"></i>
                                            </button>
                                        </div>
                                    </Toast>

                                    <Header />
                                    <Routes fallback={<QBLoading />}>
                                        <Route path="/about" element={<About />} />
                                        <Route path="/privacy" element={<Privacy />} />
                                        <Route path="/disclaimer" element={<Disclaimer />} />

                                        <Route exact path="/unsubscribe" element={<Unsubscribe />} />
                                        <Route exact path="/forgot-password" element={<ForgotPassword />} />
                                        <Route exact path="/reset-password" element={<ResetPassword />} />
                                        <Route exact path="/verify" element={<Verify />} />

                                        <Route exact path="/category/:categoryId" element={<SingleCategory />} />
                                        <Route exact path="/edit-profile/:userId" element={<EditProfile />} />
                                        <Route exact path="/view-quiz/:quizSlug" element={<GetReady />} />
                                        <Route exact path="/attempt-quiz/:quizSlug" element={<QuizQuestions />} />
                                        <Route exact path="/quiz-results/:quizSlug" element={<QuizResults />} />

                                        <Route exact path="/view-question/:questionID" element={<SingleQuestion />} />
                                        <Route exact path="/edit-question/:questionID" element={<EditQuestion />} />

                                        <Route exact path="/review-quiz/:reviewId" element={<ReviewQuiz />} />
                                        <Route exact path="/quiz-ranking/:quizID" element={<QuizRanking />} />
                                        <Route exact path="/questions-create/:quizSlug" element={<CreateQuestions />} />

                                        <Route exact path="/contact" element={<Contact />} />
                                        <Route exact path="/contact-chat" element={<ChatWrapper />} />
                                        <Route exact path="/faqs" element={<FaqCollapse />} />
                                        <Route path="/all-categories" element={<AllCategories />} />
                                        <Route path="/course-notes" element={<Index />} />
                                        <Route exact path="/view-course/:courseId" element={<ViewCourse />} />
                                        <Route exact path="/schools" element={<SchoolsLanding />} />
                                        <Route exact path="/subscribers" element={<Subscribers />} />
                                        <Route exact path="/broadcasts" element={<Broadcasts />} />

                                        <Route exact path="/blog" element={<AllBlogPosts />} />
                                        <Route exact path="/blog/:bPCatID" element={<ByCategory />} />
                                        <Route exact path="/create-bpost/:bPCatID" element={<AddBlogPost />} />
                                        <Route exact path="/edit-bpost/:bPSlug" element={<EditBlogPost />} />
                                        <Route exact path="/view-blog-post/:bPSlug" element={<ViewBlogPost />} />

                                        <Route path="/ads.txt" element={<div>
                                            google.com, pub-8918850949540829, DIRECT, f08c47fec0942fa0</div>} />

                                        <Route exact path="/" element={<Posts toggleR={toggleR} />} />
                                        <Route exact path="/allposts" element={<AllPosts />} />
                                        <Route exact path="/view-note-paper/:noteSlug" element={<ViewNotePaper />} />
                                        <Route exact path="/dashboard" element={<Dashboard />} />

                                        {/* STATISTICS DASHBOARD */}
                                        <Route exact path="/statistics" element={<Statistics />}>
                                            {/* <Route path="/statistics/blogposts" element={<NotFound404 />} /> */}
                                            {/* USERS */}
                                            <Route path="/statistics/new-50-users" element={<UsersStats />} />
                                            <Route path="/statistics/with-image" element={<UsersStats />} />
                                            <Route path="/statistics/with-school" element={<UsersStats />} />
                                            <Route path="/statistics/with-level" element={<UsersStats />} />
                                            <Route path="/statistics/with-faculty" element={<UsersStats />} />
                                            <Route path="/statistics/with-interests" element={<UsersStats />} />
                                            <Route path="/statistics/with-about" element={<UsersStats />} />
                                            <Route path="/statistics/all-users" element={<UsersStats />} />

                                            {/* USERS STATS */}
                                            <Route path="/statistics/top-100-quizzing" element={<UsersStats />} />
                                            <Route path="/statistics/top-100-downloaders" element={<UsersStats />} />

                                            {/* QUIZ STATS */}
                                            <Route path="/statistics/top-20-quizzes" element={<UsersStats />} />
                                            <Route path="/statistics/quizzes-stats" element={<UsersStats />} />

                                            {/* NOTES STATS */}
                                            <Route path="/statistics/top-20-notes" element={<UsersStats />} />
                                            <Route path="/statistics/notes-stats" element={<UsersStats />} />

                                            {/* QUIZ CATEGORIES STATS */}
                                            <Route path="/statistics/quiz-categories-stats" element={<UsersStats />} />
                                            <Route path="/statistics/notes-categories-stats" element={<UsersStats />} />

                                            {/* BLOG POSTS STATS */}
                                            <Route path="/statistics/recent-ten-views" element={<BlogStats />} />
                                            <Route path="/statistics/all-posts-views" element={<BlogStats />} />
                                        </Route>
                                        <Route path="/*" element={<NotFound404 />} />
                                    </Routes>
                                    <ToastContainer />
                                    <Footer />
                                </Suspense>
                            </bPcatsContext.Provider>
                        </courseCategoriesContext.Provider>
                    </categoriesContext.Provider>
                </currentUserContext.Provider>
            </logRegContext.Provider>
        </authContext.Provider>
    )
}

export default App