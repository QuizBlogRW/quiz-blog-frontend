import { lazy, Suspense, useMemo } from 'react';
import { Button } from 'reactstrap';
import { useSelector } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import NotAuthenticated from '@/components/users/NotAuthenticated';
import isAdEnabled from '@/utils/isAdEnabled';

const GridMultiplex = lazy(() => import('@/components/adsenses/GridMultiplex'));

// Constants
const SHARE_CONFIG = {
    phone: 'whatsappphonenumber', // Replace with actual phone number
    url: 'https://www.quizblog.rw/course-notes',
    message: 'View course notes shared by Quiz-Blog by logging on',
};

const QUOTE = {
    text: 'It does not matter where you go and what you study, what matters most is what you share with yourself and the world.',
    author: 'Santosh Kalwar',
};

// Quote Component
const InspirationalQuote = ({ text, author }) => (
    <div className="my-5" style={{ color: 'var(--brand)' }}>
        <p className="fw-bolder mt-2 mb-0">
            {text}
        </p>
        <small className="d-block fst-italic mt-2">~{author}~</small>
    </div>
);

// Share Button Component
const WhatsAppShareButton = ({ phone, message, url }) => {
    const shareUrl = useMemo(() => {
        const text = encodeURIComponent(`${message}\n${url}`);
        return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
    }, [phone, message, url]);

    return (
        <Button
            color="primary"
            style={{ backgroundColor: 'var(--brand)', border: 'none' }}
            className="ms-1 py-2 px-3 mb-0 share-btn"
            tag="a"
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
        >
            <i className="fa-brands fa-whatsapp me-2" aria-hidden="true"></i>
            Share on WhatsApp
        </Button>
    );
};

// Main Welcome Section Component
const WelcomeSection = ({ userName }) => (
    <section
        className="welcome-section text-center rounded px-3 px-sm-4 py-3 py-sm-5 mx-3 d-flex justify-content-center align-items-center flex-column"
        role="main"
        aria-label="Welcome and course introduction"
    >
        <h1 className="fw-bolder my-lg-4" style={{ color: 'var(--brand)' }}>
            Hello, {userName}!
        </h1>

        <p className="lead mb-4">
            Discover the user-friendly courses and resource portal at Quiz-Blog, where you can
            access a vast array of valuable information to enhance your learning and achieve
            academic success.
        </p>

        <p className="text-muted mb-4">
            With its well-organized categories, you can seamlessly choose the content you require
            through the navigation, making it effortless to access and download any resource,
            thus enhancing your overall learning experience.
        </p>

        <InspirationalQuote text={QUOTE.text} author={QUOTE.author} />

        <div className="share-section mt-4">
            <p className="share-text mb-3">
                <i className="fa fa-share-alt me-2" aria-hidden="true"></i>
                If you find this interesting, please share it with your friends via social media
                or any other means you prefer.
            </p>

            <WhatsAppShareButton
                phone={SHARE_CONFIG.phone}
                message={SHARE_CONFIG.message}
                url={SHARE_CONFIG.url}
            />
        </div>
    </section>
);

// Main Component
const CategoriesHome = () => {
    const { user, isAuthenticated } = useSelector((state) => state.users);

    // Get user name with fallback
    const userName = useMemo(() => user?.name || 'Guest', [user?.name]);

    // Early return for unauthenticated users
    if (!isAuthenticated) {
        return <NotAuthenticated />;
    }

    return (
        <div className="categories-home">
            <WelcomeSection userName={userName} />

            {isAdEnabled() && (
                <Suspense fallback={<QBLoadingSM />}>
                    <div className="ad-section mt-4">
                        <GridMultiplex />
                    </div>
                </Suspense>
            )}
        </div>
    );
};

export default CategoriesHome;