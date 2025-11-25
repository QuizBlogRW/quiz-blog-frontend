import { Container } from 'reactstrap';

const BackLikeShare = ({ articleName, articleCreator }) => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const whatsappText = encodeURIComponent(`${articleName}\n${currentUrl}`);
    const twitterText = encodeURIComponent(articleName);

    const socialLinks = [
        { href: `https://api.whatsapp.com/send?text=${whatsappText}`, icon: 'fab fa-whatsapp', label: 'WhatsApp' },
        { href: `https://www.facebook.com/share.php?u=${encodeURIComponent(currentUrl)}`, icon: 'fab fa-facebook-f', label: 'Facebook' },
        { href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(articleName)}&summary=${encodeURIComponent(articleCreator)}&source=Quiz-Blog`, icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
        { href: `https://www.instagram.com/?url=${encodeURIComponent(currentUrl)}`, icon: 'fab fa-instagram', label: 'Instagram' },
        { href: `http://twitter.com/share?text=${twitterText}&url=${encodeURIComponent(currentUrl)}&hashtags=${encodeURIComponent(articleName + ',QuizBlog,' + (articleCreator || ''))}`, icon: 'fab fa-twitter', label: 'Twitter' },
    ];

    return (
        <section className="">
            <Container className="p-4 bg-white rounded-4 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between border" style={{ borderColor: 'var(--accent)' }}>

                {/* Social Icons */}
                <ul className="list-unstyled d-flex mb-0 gap-3">
                    <li style={{ color: 'var(--brand)' }}>
                        <p className='d-flex align-items-center justify-content-center'>
                            Share on &nbsp;&nbsp;
                        </p>
                    </li>
                    {socialLinks.map((social, idx) => (
                        <li key={idx}>
                            <a
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="d-flex align-items-center justify-content-center rounded-circle text-white"
                                style={{
                                    width: 50,
                                    height: 50,
                                    fontSize: 20,
                                    backgroundColor: 'var(--accent)',
                                    transition: 'all 0.3s ease',
                                }}
                                aria-label={social.label}
                                title={social.label}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--brand)';
                                    e.currentTarget.style.transform = 'scale(1.15)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--accent)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <i className={social.icon}></i>
                            </a>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
};

export default BackLikeShare;
