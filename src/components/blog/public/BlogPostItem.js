import React from 'react'
import { Card, CardBody, CardTitle } from 'reactstrap'
import { Link } from "react-router-dom"
import altImage from '../../../images/dashboard.svg'

const BlogPostItem = ({ blogPost }) => {

    const { slug, title, postCategory, post_image, brand, creator, createdAt } = blogPost

    let date = new Date(createdAt)

    return (
        <Card className={`bg-light py-3 px-1 px-sm-3 my-2 my-sm-3 border`}>
            <Link to={`/view-blog-post/${slug}`}>
                <CardBody>
                    <CardTitle tag="h5" className={`mb-3 text-primary text-uppercase font-weight-bolder`}>
                        {title && title}
                    </CardTitle>
                </CardBody>

                <div className="PostImage">
                    <img src={post_image || altImage} alt={brand} />
                </div>
            </Link>

            <CardBody>
                <div className="small-text d-flex flex-column flex-sm-row justify-content-center">
                    <p className="mr-2 mr-md-5 my-1 text-dark">{date.toDateString()}</p>
                    <p className="mr-2 mr-md-5 my-1 text-dark">{postCategory && postCategory.title}
                        <small>&nbsp;({creator && creator.name})</small>
                    </p>
                </div>
            </CardBody>
        </Card>
    )
}
export default BlogPostItem