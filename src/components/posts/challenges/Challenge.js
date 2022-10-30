import React from 'react'
import { Card, CardTitle, CardText } from 'reactstrap'
import { Link } from "react-router-dom"

const Challenge = ({ chall, fromSearch }) => {

    const { _id, title, description, duration, category, questions, created_by, createdAt } = chall

    let date = new Date(createdAt)

    return (
        <Card body className={fromSearch ? 'bg-info text-white py-3 px-1 px-lg-3 my-2 my-lg-3 mx-0 mx-sm-5' : 'bg-secondary py-3 px-1 px-lg-3 my-2 my-lg-3 mx-0 mx-sm-5'}>

            <CardTitle tag="h5" className={`mb-0 ${fromSearch ? 'text-white' : 'text-primary'} text-uppercase`}>
                <Link to={`/view-challenge/${_id}`}>{title && title}
                    <span className="text-lowercase"> ({questions && questions.length} questions)</span>
                </Link>
            </CardTitle>

            <div className="small-text d-flex justify">
                <p className="mr-2 mr-md-5 my-1 text-dark">{date.toDateString()}</p>
                <p className="mr-2 mr-md-5 my-1 text-dark">{duration && duration} sec</p>
                <p className="mr-2 mr-md-5 my-1 text-dark">- {category && category.title}
                    <small>&nbsp;({created_by && created_by.name})</small>
                </p>
            </div>

            <CardText className="mt-1 details text-secondary text-capitalize">{description && description}</CardText>
        </Card>
    )
}

export default Challenge