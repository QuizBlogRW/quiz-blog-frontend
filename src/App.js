import React, { useEffect, lazy, Suspense, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Link } from "react-router-dom"
import { Spinner, Toast, ToastHeader } from 'reactstrap'

// Socket Settings
import io from 'socket.io-client';
import { apiURL } from './redux/config'

// REDUX
import { connect } from 'react-redux'
import store from './redux/store'
import { setCategories } from './redux/categories/categories.actions'
import { getCourseCategories } from './redux/courseCategories/courseCategories.actions'
import { getPostCategories } from './redux/blog/postCategories/postCategories.actions'
import { loadUser } from './redux/auth/auth.actions'

// CONTEXTS
import { authContext, currentUserContext, socketContext, onlineListContext, categoriesContext, courseCategoriesContext, bPcatsContext } from './appContexts'

// components
import Contact from './components/contact/Contact'
import ContactChat from './components/contacts/chat/ContactChat'
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

// Statistics
import UsersStats from './components/statistics/content/users/UsersStats'

// components
const Header = lazy(() => import('./components/Header'))
const Footer = lazy(() => import('./components/footer/Footer'))

// lazy loading posts
const Webmaster = lazy(() => import('./components/webmaster/Webmaster'))
const Statistics = lazy(() => import('./components/statistics/Statistics'))
const Posts = lazy(() => import('./components/posts/Posts'))
const AllPosts = lazy(() => import('./components/posts/AllPosts'))
const ViewNotePaper = lazy(() => import('./components/posts/notes/ViewNotePaper'))

const socket = io.connect(apiURL);

const App = ({ auth, categories, courseCategories, bPcats, setCategories, getCourseCategories, getPostCategories }) => {

    useEffect(() => {
        store.dispatch(loadUser())
        setCategories()
        getCourseCategories()
        getPostCategories()
    }, [setCategories, getCourseCategories, getPostCategories])

    const currentUser = auth && auth.user

    // Socket join on user load
    const [onlineList, setOnlineList] = useState([])

    useEffect(() => {
        if (currentUser && currentUser.email) {

            // Telling the server that a user has joined
            socket.emit('frontJoinedUser', { user_id: currentUser._id, username: currentUser && currentUser.name, email: currentUser && currentUser.email, role: currentUser && currentUser.role });

            // Receiving the last joined user
            socket.on('backJoinedUser', (joinedUser) => {
                console.log("Joined user: " + JSON.stringify(joinedUser));
            });

            socket.on('onlineUsersList', onlineUsers => {
                setOnlineList(onlineUsers)
            });
        }
    }, [currentUser]);

    // Profile non empty details - Those with not empty strings and not null values
    const NonEmptyFields = auth.isAuthenticated && Object
        .keys(auth.user)
        .filter(key => ((auth.user[key] && auth.user[key]) !== '')
            && ((auth.user[key] && auth.user[key]) !== null))
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
        // Contexts
        <authContext.Provider value={auth}>
            <currentUserContext.Provider value={currentUser}>
                <categoriesContext.Provider value={categories}>
                    <courseCategoriesContext.Provider value={courseCategories}>
                        <bPcatsContext.Provider value={bPcats}>
                        <socketContext.Provider value={socket}>
                            <onlineListContext.Provider value={onlineList}>

                                {/* router */}
                                <Router>
                                    <Suspense fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                                        <Spinner style={{ width: '8rem', height: '8rem' }} />
                                    </div>}>

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

                                        <Header />

                                        <Routes fallback={
                                            <div className="p-3 m-3 d-flex justify-content-center align-items-center">
                                                <Spinner style={{ width: '8rem', height: '8rem' }} />
                                            </div>
                                        }>
                                            <Route path="/about" element={<About />} />
                                            <Route path="/privacy" element={<Privacy />} />
                                            <Route path="/disclaimer" element={<Disclaimer />} />

                                            <Route exact path="/unsubscribe" element={<Unsubscribe />} />
                                            <Route exact path="/forgot-password" element={<ForgotPassword />} />
                                            <Route exact path="/reset-password" element={<ResetPassword />} />

                                            <Route exact path="/category/:categoryId" element={<SingleCategory />} />
                                            <Route exact path="/edit-profile/:userId" element={<EditProfile />} />
                                            <Route exact path="/view-quiz/:quizSlug" element={<GetReady />} />
                                            <Route exact path="/attempt-quiz/:quizSlug" element={<QuizQuestions />} />

                                            <Route exact path="/take-challenge/:challengeId" element={<TakeChallenge />} />
                                            <Route exact path="/edit-challenge/:challengeId" element={<EditChallengeQuiz />} />
                                            <Route exact path="/view-challenge/:challengeId" element={<ViewChallenge />} />
                                            <Route exact path="/challenges" element={<Challenges />} />
                                            <Route exact path="/all-challenges" element={<AllChallenges />} />

                                            <Route exact path="/view-question/:questionId" element={<SingleQuestion />} />
                                            <Route exact path="/edit-question/:questionId" element={<EditQuestion />} />

                                            <Route exact path="/review-quiz/:reviewId" element={<ReviewQuiz />} />

                                            <Route exact path="/quiz-ranking/:quizID" element={<QuizRanking />} />
                                            <Route exact path="/questions-create/:quizSlug" element={<CreateQuestions />} />
                                            {/* <Route exact path="/challenge/:quizSlug/:userId/" element={<SelectChallengee />} /> */}

                                            <Route exact path="/contact" element={<Contact />} />
                                            <Route exact path="/contact-chat" element={<ContactChat />} />
                                            <Route exact path="/faqs" element={<FaqCollapse />} />
                                            <Route path="/all-categories" element={<AllCategories />} />
                                            <Route path="/course-notes" element={<Index />} />
                                            <Route exact path="/view-course/:courseId" element={<ViewCourse />} />
                                            <Route exact path="/schools" element={<SchoolsLanding />} />
                                            <Route exact path="/logs" element={<UserLogs />} />
                                            <Route exact path="/subscribers" element={<Subscribers />} />
                                            <Route exact path="/broadcasts" element={<Broadcasts />} />

                                            <Route exact path="/blog" element={<AllBlogPosts />} />
                                            <Route exact path="/blog/:bPCatID" element={<ByCategory />} />
                                            <Route exact path="/create-bpost/:bPCatID" element={<AddBlogPost />} />
                                            <Route exact path="/edit-bpost/:bPSlug" element={<EditBlogPost />} />
                                            <Route exact path="/view-blog-post/:bPSlug" element={<ViewBlogPost />} />

                                            <Route path="/ads.txt" element={<div>
                                                google.com, pub-8918850949540829, DIRECT, f08c47fec0942fa0</div>} />

                                            <Route exact path="/" element={<Posts />} />
                                            <Route exact path="/allposts" element={<AllPosts />} />
                                            <Route exact path="/view-note-paper/:noteSlug" element={<ViewNotePaper />} />
                                            <Route exact path="/webmaster" element={<Webmaster />} />

                                            {/* STATISTICS DASHBOARD */}
                                            <Route exact path="/statistics" element={<Statistics />}>
                                                <Route path="/statistics/about" element={<About />} />
                                                <Route path="/statistics/blogposts" element={<Placeholder />} />
                                                <Route path="/statistics/faqs" element={<FaqCollapse />} />
                                                <Route path="/statistics/contacts" element={<ContactChat />} />

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
                                            </Route>

                                            <Route path="/*" element={<Placeholder />} />
                                        </Routes>
                                        <Footer />
                                    </Suspense>
                                </Router>

                            </onlineListContext.Provider>
                        </socketContext.Provider>
                        </bPcatsContext.Provider>
                    </courseCategoriesContext.Provider>
                </categoriesContext.Provider>
            </currentUserContext.Provider>
        </authContext.Provider>
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