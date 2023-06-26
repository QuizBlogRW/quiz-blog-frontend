import React from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

const OnLastAnswer = ({ isAuthenticated, thisQuiz, goBack }) => {
  return (
      isAuthenticated ?

          <div className='score-section text-center py-4'>

              <h5 className="text-center font-weight-bold">Reviewing finished!</h5>

              <Link to={`/view-quiz/${thisQuiz.slug}`}>
                  <button type="button" className="mt-3 btn btn-outline-success">
                      Retake
                  </button>
              </Link>

              <Button color="success" className="mt-3 share-btn mx-1 mx-md-3">
                  <i className="fa fa-whatsapp"></i>&nbsp;
                  <a className="text-white" href={`https://api.whatsapp.com/send?phone=whatsappphonenumber&text=Attempt this ${thisQuiz.title} on Quiz Blog
                        \nhttp://www.quizblog.rw/view-quiz/${thisQuiz.slug}`}>Share</a>
              </Button>

              <button type="button" className="btn btn-outline-info mt-3" onClick={goBack}>
                  Back
              </button>

          </div> :

          <div className='score-section text-center'>
              <h5>Only members are allowed!</h5>
          </div>
  )
}

export default OnLastAnswer
