import { Container } from 'reactstrap';

const socials = [
    { href: 'https://www.instagram.com/quizblogrw/', icon: 'fab fa-instagram', label: 'Instagram' },
    { key: 'twitter', icon: 'fab fa-twitter', label: 'Twitter' },
    { href: 'https://www.facebook.com/QuizblogRw/', icon: 'fab fa-facebook-f', label: 'Facebook' },
    { href: 'https://www.linkedin.com/company/quiz-blog/', icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
];

const FollowUs = ({ articleName, articleCreator }) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <section className="mt-5">
            <Container className="p-3 bg-white rounded-3 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                <p className="mb-2 mb-md-0 fw-semibold text-muted text-center text-md-start">
                    Follow us on social media
                </p>

                <ul className="list-unstyled d-flex mb-0 gap-2">
                    {socials.map(({ href, icon, label, key }, i) => (
                        <li key={i}>
                            <a
                                href={
                                    key === 'twitter'
                                        ? `https://twitter.com/share?text=${encodeURIComponent(articleName)}&url=${encodeURIComponent(
                                            url
                                        )}&hashtags=${encodeURIComponent(`${articleName},QuizBlog,${articleCreator}`)}`
                                        : href
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                title={label}
                                className="d-flex align-items-center justify-content-center rounded-circle text-white bg-primary hover-opacity"
                                style={{ width: 44, height: 44 }}
                            >
                                <i className={`${icon} fs-5`} />
                            </a>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
};

export default FollowUs;
