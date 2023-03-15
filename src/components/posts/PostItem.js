import React from 'react'
import { Card, CardTitle, CardText } from 'reactstrap'
import { Link } from "react-router-dom"
import moment from 'moment'

const PostItem = ({ quiz, fromSearch }) => {

    const { slug, title, description, creation_date, category, created_by, questions } = quiz

    return (
        <Card body className={fromSearch ? 'bg-info text-white py-3 px-1 px-sm-3 my-2 my-sm-3 border' : 'bg-secondary py-3 px-1 px-sm-3 my-2 my-sm-3 border'}>

            <CardTitle tag="h5" className={`mb-0 ${fromSearch ? 'text-white' : 'text-primary'} text-uppercase`}>
                <Link to={`/view-quiz/${slug}`}>{title && title}
                    &nbsp;<span className="text-danger">({questions && questions.length})</span>
                </Link>
            </CardTitle>

            <div className="small-text d-flex justify">
                <p className="mr-2 mr-md-5 my-1 text-dark">
                    {moment(new Date(creation_date)).format('DD MMM YYYY, HH:mm')}
                </p>
                <p className="mr-0 mr-md-5 my-1 text-dark">-{category && category.title}
                    <small>&nbsp;({created_by && created_by.name})</small>
                </p>
            </div>

            <CardText className="mt-1 details text-secondary text-capitalize">{description && description}</CardText>
        </Card>
    )
}
export default PostItem