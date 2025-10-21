const FollowUs = ({ articleName, articleCreator }) => {
    return (
        <section className="back-share px-2 d-flex justify-content-between align-items-center mt-3">
            <div className="like-share d-flex flex-column flex-sm-row justify-content-between align-items-center w-100 p-3">

                <p className='mb-0 me-3 text-muted'>Follow us on social media</p>

                <ul className='social-list d-flex mb-0 list-unstyled gap-2'>
                    <li>
                        <a href={`https://www.instagram.com/quizblogrw/`} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Follow on Instagram" title="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                    </li>

                    <li>
                        <a href={`http://twitter.com/share?text=${articleName}&url=${window.location.href}&hashtags=${articleName},QuizBlog,${articleCreator}`} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Share on X (Twitter)" title="Twitter">
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>
                    </li>

                    <li>
                        <a href={`https://www.facebook.com/QuizblogRw/`} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Follow on Facebook" title="Facebook">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                    </li>

                    <li>
                        <a href={`https://www.linkedin.com/company/quiz-blog/`} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Follow on LinkedIn" title="LinkedIn">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default FollowUs
