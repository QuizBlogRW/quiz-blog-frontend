const BackLikeShare = ({ articleName, articleCreator }) => {
    
    const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
    const whatsappText = encodeURIComponent(`${articleName}\n${currentUrl}`)
    const twitterText = encodeURIComponent(articleName)

    return (
        <div className="back-share px-2 d-flex justify-content-between align-items-center">
            <div className="like-share d-flex align-items-center">
                <p className='mb-0 me-3'>Share this article on</p>
                <ul className='social-list d-flex mb-0 list-unstyled gap-2'>
                    <li>
                        <a href={`https://api.whatsapp.com/send?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Share on WhatsApp" title="WhatsApp">
                            <i className="fa-brands fa-whatsapp"></i>
                        </a>
                    </li>

                    <li>
                        <a href={`https://www.facebook.com/share.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Share on Facebook" title="Facebook">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                    </li>

                    <li>
                        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(articleName)}&summary=${encodeURIComponent(articleCreator)}&source=Quiz-Blog`} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Share on LinkedIn" title="LinkedIn">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                    </li>

                    <li>
                        <a href={`https://www.instagram.com/?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Share on Instagram" title="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                    </li>

                    <li>
                        <a href={`http://twitter.com/share?text=${twitterText}&url=${encodeURIComponent(currentUrl)}&hashtags=${encodeURIComponent(articleName + ',QuizBlog,' + (articleCreator || ''))}`} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Share on X (Twitter)" title="Twitter">
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default BackLikeShare
