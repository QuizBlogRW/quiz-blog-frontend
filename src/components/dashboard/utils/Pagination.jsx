import { Button } from 'reactstrap';
import { useMemo } from 'react';

const Pagination = ({ pageNo, setPageNo, numberOfPages }) => {
    // Generate page numbers to display
    const pageNumbers = useMemo(() => {
        if (numberOfPages <= 7) {
            // Show all pages if 7 or fewer
            return Array.from({ length: numberOfPages }, (_, i) => i + 1);
        }

        const pages = [];

        // Always show first page
        pages.push(1);

        if (pageNo <= 3) {
            // Near start: show 1, 2, 3, 4, ..., last
            pages.push(2, 3, 4, '...', numberOfPages);
        } else if (pageNo >= numberOfPages - 2) {
            // Near end: show 1, ..., last-3, last-2, last-1, last
            pages.push('...', numberOfPages - 3, numberOfPages - 2, numberOfPages - 1, numberOfPages);
        } else {
            // In middle: show 1, ..., current-1, current, current+1, ..., last
            pages.push('...', pageNo - 1, pageNo, pageNo + 1, '...', numberOfPages);
        }

        return pages;
    }, [pageNo, numberOfPages]);

    const goToPage = (page) => {
        if (page >= 1 && page <= numberOfPages) {
            setPageNo(page);
        }
    };

    const previousPage = () => {
        goToPage(pageNo - 1);
    };

    const nextPage = () => {
        goToPage(pageNo + 1);
    };

    if (numberOfPages <= 1) {
        return null;
    }

    return (
        <nav aria-label="Pagination navigation">
            <div className="d-flex justify-content-center align-items-center gap-1 mt-3 flex-wrap">
                {/* Previous Button */}
                <Button
                    color="success"
                    size="sm"
                    disabled={pageNo === 1}
                    onClick={previousPage}
                    aria-label="Previous page"
                    className={pageNo === 1 ? 'invisible' : ''}
                >
                    &#171;
                </Button>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-muted"
                                aria-hidden="true"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = pageNo === page;

                    return (
                        <Button
                            key={page}
                            outline={!isActive}
                            color="success"
                            size="sm"
                            onClick={() => goToPage(page)}
                            disabled={isActive}
                            aria-label={`${isActive ? 'Current page, ' : ''}Page ${page}`}
                            aria-current={isActive ? 'page' : undefined}
                            style={
                                isActive
                                    ? { backgroundColor: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' }
                                    : {}
                            }
                        >
                            {page}
                        </Button>
                    );
                })}

                {/* Next Button */}
                <Button
                    color="success"
                    size="sm"
                    disabled={pageNo === numberOfPages}
                    onClick={nextPage}
                    aria-label="Next page"
                    className={pageNo === numberOfPages ? 'invisible' : ''}
                >
                    &#187;
                </Button>
            </div>
        </nav>
    );
};

export default Pagination;