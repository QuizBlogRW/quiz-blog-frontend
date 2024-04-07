import { io } from 'socket.io-client'

export const qbURL = 'https://myqb-245fdbd30c9b.herokuapp.com/'
export const apiURL = 'https://quiz-blog-rw-server.onrender.com/'
export const devApiURL = 'http://localhost:4000/'

// const serverUrl = process.env.NODE_ENV === 'development' ? devApiURL : (qbURL || apiURL)
const serverUrl = apiURL

export const socket = io(serverUrl);