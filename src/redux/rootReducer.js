import { combineReducers } from 'redux'
import subscribersReducer from './subscribers/subscribers.reducer'
import questionsReducer from './questions/questions.reducer'
import errorReducer from './error/error.reducer'
import successReducer from './success/success.reducer'
import authReducer from './auth/auth.reducer'
import logsReducer from './logs/logs.reducer'
import categoriesReducer from './categories/categories.reducer'
import quizesReducer from './quizes/quizes.reducer'
import scoresReducer from './scores/scores.reducer'
import contactsReducer from './contacts/contacts.reducer'
import broadcastsReducer from './broadcasts/broadcasts.reducer'
import courseCategoriesReducer from './courseCategories/courseCategories.reducer'
import coursesReducer from './courses/courses.reducer'
import chaptersReducer from './chapters/chapters.reducer'
import notesReducer from './notes/notes.reducer'
import downloadsReducer from './downloads/downloads.reducer'
import faqsReducer from './faqs/faqs.reducer'
import quizCommentsReducer from './quizComments/quizComments.reducer'
// import challengesReducer from './challenges/challenges.reducer'
import challengeQuizesReducer from './challenges/challengeQuizzes/challengeQuizzes.reducer'

// Schools
import schoolsReducer from './schools/schools.reducer'
import levelsReducer from './levels/levels.reducer'
import facultiesReducer from './faculties/faculties.reducer'

// Blog
import postCategoriesReducer from './blog/postCategories/postCategories.reducer'
import blogPostsReducer from './blog/blogPosts/blogPosts.reducer'
import imageUploadsReducer from './blog/blogPosts/uploadImages/uploadImages.reducer'

const rootReducer = combineReducers({ subscribersReducer, questionsReducer, errorReducer, successReducer, authReducer, categoriesReducer, quizesReducer, scoresReducer, contactsReducer, broadcastsReducer, courseCategoriesReducer, coursesReducer, chaptersReducer, notesReducer, downloadsReducer, schoolsReducer, levelsReducer, facultiesReducer, logsReducer, faqsReducer, quizCommentsReducer, challengeQuizesReducer, postCategoriesReducer, blogPostsReducer, imageUploadsReducer })

export default rootReducer