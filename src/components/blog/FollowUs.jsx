import { Container } from 'reactstrap';

const FollowUs = ({ articleName, articleCreator }) => {
    return (
        <section className="mt-4">
            <Container className="p-3 bg-white rounded-3 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between">
                {/* Text */}
                <p className="mb-3 mb-md-0 fw-semibold text-muted">
                    Follow us on social media
                </p>

                {/* Social Icons */}
                <ul className="list-unstyled d-flex mb-0 gap-3">
                    {[
                        { href: 'https://www.instagram.com/quizblogrw/', icon: 'fab fa-instagram', label: 'Instagram' },
                        { href: `http://twitter.com/share?text=${articleName}&url=${window.location.href}&hashtags=${articleName},QuizBlog,${articleCreator}`, icon: 'fab fa-twitter', label: 'Twitter' },
                        { href: 'https://www.facebook.com/QuizblogRw/', icon: 'fab fa-facebook-f', label: 'Facebook' },
                        { href: 'https://www.linkedin.com/company/quiz-blog/', icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
                    ].map((social, idx) => (
                        <li key={idx}>
                            <a
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="d-flex align-items-center justify-content-center rounded-circle text-white"
                                style={{
                                    width: 45,
                                    height: 45,
                                    fontSize: 18,
                                    backgroundColor: 'var(--brand)',
                                    transition: 'all 0.3s',
                                }}
                                aria-label={social.label}
                                title={social.label}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--brand)'}
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

export default FollowUs;
