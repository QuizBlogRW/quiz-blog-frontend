import { Container } from 'reactstrap';
import { useMemo } from 'react';

const ICON_STYLE = {
    width: 48,
    height: 48,
    fontSize: 20,
    backgroundColor: 'var(--accent)',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
};

const BackLikeShare = ({ articleName, articleCreator }) => {
    const currentUrl = useMemo(() => {
        if (typeof window === 'undefined') return '';
        return window.location.href;
    }, []);

    const socialLinks = useMemo(() => {
        const encodedUrl = encodeURIComponent(currentUrl);
        const encodedTitle = encodeURIComponent(articleName || '');

        return [
            {
                label: 'WhatsApp',
                icon: 'fab fa-whatsapp',
                href: `https://api.whatsapp.com/send?text=${encodedTitle}%0A${encodedUrl}`,
            },
            {
                label: 'Facebook',
                icon: 'fab fa-facebook-f',
                href: `https://www.facebook.com/share.php?u=${encodedUrl}`,
            },
            {
                label: 'LinkedIn',
                icon: 'fab fa-linkedin-in',
                href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodeURIComponent(
                    articleCreator || ''
                )}`,
            },
            {
                label: 'Instagram',
                icon: 'fab fa-instagram',
                href: `https://www.instagram.com/?url=${encodedUrl}`,
            },
            {
                label: 'Twitter',
                icon: 'fab fa-twitter',
                href: `https://twitter.com/share?text=${encodedTitle}&url=${encodedUrl}`,
            },
        ];
    }, [articleName, articleCreator, currentUrl]);

    const handleHover = (e, active) => {
        e.currentTarget.style.transform = active ? 'scale(1.15)' : 'scale(1)';
        e.currentTarget.style.backgroundColor = active
            ? 'var(--brand)'
            : 'var(--accent)';
    };

    return (
        <section>
            <Container className="p-3 bg-white rounded-3 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">

                <strong className="text-center text-md-start mb-2 me-md-3" style={{ color: 'var(--brand)' }}>
                    Share on
                </strong>

                <ul className="list-unstyled d-flex gap-2 gap-lg-3 mb-0">
                    {socialLinks.map(({ href, icon, label }) => (
                        <li key={label}>
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                title={label}
                                className="d-flex align-items-center justify-content-center rounded-circle text-white"
                                style={ICON_STYLE}
                                onMouseEnter={(e) => handleHover(e, true)}
                                onMouseLeave={(e) => handleHover(e, false)}
                                onFocus={(e) => handleHover(e, true)}
                                onBlur={(e) => handleHover(e, false)}
                            >
                                <i className={icon} aria-hidden="true" />
                            </a>
                        </li>
                    ))}
                </ul>

            </Container>
        </section>
    );
};

export default BackLikeShare;
