import React from 'react'
import { Table, Button, Alert } from 'reactstrap'
import { Link } from "react-router-dom"
import moment from 'moment'
import trash from '../../../images/trash.svg';
import AddChallengeModal from './AddChallengeModal'

const ChallengesTable = ({ chQuizzesToUse, currentUser, deleteChQuiz, categories }) => {

    const uRole = currentUser && currentUser.role

    return (

        <>
            <span className='w-100 d-flex justify-content-end pr-sm-4 mb-sm-4'>
                <Button color="warning" size="sm">
                    <AddChallengeModal currentUser={currentUser && currentUser} categories={categories} />
                </Button>
            </span>

            {chQuizzesToUse && chQuizzesToUse.length > 0 ?

                <Table bordered className='all-scores table-success' hover responsive striped size="sm">
                    <thead className='text-uppercase table-dark'>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">TITLE</th>
                            <th scope="col">CATEGORY</th>
                            <th scope="col">QUESTIONS</th>
                            <th scope="col">CREATOR</th>
                            <th scope="col">DATE</th>
                            <th scope="col">DURATION</th>
                            <th scope="col">VIEW</th>
                            <th scope="col" className={`${(uRole === 'Admin' || uRole === 'SuperAdmin') ? '' : 'd-none'}`}>❌</th>
                        </tr>
                    </thead>

                    <tbody>

                        {chQuizzesToUse && chQuizzesToUse.map((chQuiz, index) => {

                            const numero = index + 1
                            const chTitle = chQuiz && chQuiz.title
                            const catg = chQuiz && chQuiz.category && chQuiz.category.title
                            const qns = chQuiz && chQuiz.questions && chQuiz.questions.length
                            const creator = chQuiz && chQuiz.created_by && chQuiz.created_by.name
                            let date = chQuiz && new Date(chQuiz.createdAt)
                            const duration = chQuiz && chQuiz.duration

                            return (<tr key={index}>
                                <th scope="row" className="table-dark">{numero && numero}</th>
                                <td className='text-uppercase'>{chTitle && chTitle}</td>
                                <td>{catg && catg}</td>
                                <td>{qns && qns}</td>
                                <td>{creator && creator}</td>
                                <td>{date && moment(date).format('YYYY-MM-DD, HH:mm')}</td>
                                <td>{duration && duration}</td>
                                <td>
                                    <Link to={`/edit-challenge/${chQuiz._id}`}>View</Link>
                                </td>
                                <td className={`table-dark ${(uRole === 'Admin' || uRole === 'SuperAdmin') ? '' : 'd-none'}`}>
                                    <Button size="sm" color="link" className="mt-0 p-0" onClick={() => deleteChQuiz(chQuiz._id)}>
                                        <img src={trash} alt="" width="16" height="16" />
                                    </Button>
                                </td>
                            </tr>)
                        })}

                    </tbody>
                </Table> :

                <Alert color="danger" className="w-100 text-center">
                    Seems like you have nothing here!
                </Alert>}
        </>
    )
}

export default ChallengesTable