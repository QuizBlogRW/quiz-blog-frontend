import { Badge } from 'reactstrap';
import { memo } from 'react';

const PageOf = ({
    pageNo,
    numberOfPages,
    variant = 'default', // 'default' | 'compact' | 'detailed'
    className = ''
}) => {
    // Validation
    if (!numberOfPages || numberOfPages < 1 || !pageNo) {
        return null;
    }

    // Calculate percentage for detailed view
    const percentage = Math.round((pageNo / numberOfPages) * 100);

    // Compact variant (minimal space)
    if (variant === 'compact') {
        return (
            <div
                className={`text-end ${className}`}
                role="status"
                aria-live="polite"
                aria-label={`Page ${pageNo} of ${numberOfPages}`}
            >
                <small className="text-muted">
                    {pageNo}/{numberOfPages}
                </small>
            </div>
        );
    }

    // Detailed variant (with progress indicator)
    if (variant === 'detailed') {
        return (
            <div
                className={`text-end my-3 ${className}`}
                role="status"
                aria-live="polite"
                aria-label={`Page ${pageNo} of ${numberOfPages}, ${percentage}% complete`}
            >
                <div className="d-inline-flex flex-column align-items-end gap-1">
                    <span className="d-inline-flex align-items-center gap-2 rounded p-2 bg-warning border border-warning">
                        <Badge
                            color="success"
                            className="d-flex align-items-center justify-content-center"
                            style={{ minWidth: '2rem', padding: '0.25rem 0.5rem' }}
                        >
                            <span className="text-white fw-bold">{pageNo}</span>
                        </Badge>

                        <span className="text-dark fw-semibold" aria-hidden="true">of</span>

                        <Badge
                            color="success"
                            className="d-flex align-items-center justify-content-center"
                            style={{ minWidth: '2rem', padding: '0.25rem 0.5rem' }}
                        >
                            <span className="text-white fw-bold">{numberOfPages}</span>
                        </Badge>
                    </span>

                    {/* Progress indicator */}
                    <div
                        className="progress"
                        style={{ width: '150px', height: '4px' }}
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        <div
                            className="progress-bar bg-success"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Default variant
    return (
        <div
            className={`text-end my-3 ${className}`}
            role="status"
            aria-live="polite"
            aria-label={`Page ${pageNo} of ${numberOfPages}`}
        >
            <span
                className="d-inline-flex align-items-center gap-2 rounded p-2 bg-warning border border-warning"
                style={{ fontSize: '0.875rem' }}
            >
                <Badge
                    color="success"
                    className="d-flex align-items-center justify-content-center"
                    style={{ minWidth: '2rem', padding: '0.25rem 0.5rem' }}
                >
                    <span className="text-white fw-bold">{pageNo}</span>
                </Badge>

                <span className="text-dark fw-semibold" aria-hidden="true">of</span>

                <Badge
                    color="success"
                    className="d-flex align-items-center justify-content-center"
                    style={{ minWidth: '2rem', padding: '0.25rem 0.5rem' }}
                >
                    <span className="text-white fw-bold">{numberOfPages}</span>
                </Badge>
            </span>
        </div>
    );
};

export default memo(PageOf);