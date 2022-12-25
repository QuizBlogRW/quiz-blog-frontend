import React from 'react'
import { Table, Button, Alert } from 'reactstrap'
import { Link } from "react-router-dom"
import moment from 'moment'
import trash from '../../../images/trash.svg'

const BPTable = ({ bpostsToUse, currentUser, deleteBlogPost }) => {

    const uRole = currentUser && currentUser.role
    const usr = currentUser && currentUser

    return (

        <>
            {bpostsToUse && bpostsToUse.length > 0 ?

                <Table bordered className='all-scores table-success' hover responsive striped size="sm">
                    <thead className='text-uppercase table-dark'>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">TITLE</th>
                            <th scope="col">CATEGORY</th>
                            <th scope="col">CREATOR</th>
                            <th scope="col">DATE</th>
                            <th scope="col" className={`${(uRole === 'Admin' || uRole === 'SuperAdmin') ? '' : 'd-none'}`}>EDIT</th>
                            <th scope="col" className={`${(uRole === 'Admin' || uRole === 'SuperAdmin') ? '' : 'd-none'}`}>❌</th>
                        </tr>
                    </thead>

                    <tbody>

                        {bpostsToUse && bpostsToUse.map((bPost, index) => {

                            const numero = index + 1
                            const bPTitle = bPost && bPost.title
                            const catg = bPost && bPost.postCategory && bPost.postCategory.title
                            const creator = bPost && bPost.creator && bPost.creator.name
                            const creat = bPost && bPost.creator
                            let date = bPost && new Date(bPost.createdAt)

                            return (<tr key={index}>
                                <th scope="row" className="table-dark">{numero && numero}</th>
                                <td className='text-uppercase'>{bPTitle && bPTitle}</td>
                                <td>{catg && catg}</td>
                                <td>{creator && creator}</td>
                                <td>{date && moment(date).format('YYYY-MM-DD, HH:MM')}</td>
                                <td className={`${((uRole === 'Admin' || uRole === 'SuperAdmin') || creat._id === usr._id) ? '' : 'd-none'}`}>
                                    <Link to={`/edit-bpost/${bPost.slug}`}>Edit</Link>
                                </td>
                                <td className={`${((uRole === 'Admin' || uRole === 'SuperAdmin') || creat._id === usr._id) ? '' : 'd-none'}`}>
                                    <Button size="sm" color="link" className="mt-0 p-0" onClick={() => deleteBlogPost(bPost._id)}>
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

export default BPTable