import DOMPurify from 'dompurify';

// ============================================
// Content Detection
// ============================================

/**
 * Detects whether content is HTML, Markdown, or empty
 * @param {string} content - The content to analyze
 * @returns {'html' | 'markdown' | 'empty'} The detected content type
 */
export const detectContentType = (content) => {
    if (!content) return 'empty';

    const trimmed = content.trim();

    // Count HTML-like tags vs Markdown patterns
    const htmlTags = (trimmed.match(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi) || []).length;
    const markdownPatterns = [
        /^#{1,6}\s/gm,              // Headers
        /!\[.*?\]\(.*?\)/g,         // Images
        /\[.*?\]\(.*?\)/g,          // Links
        /^\s*[-*+]\s/gm,            // Unordered lists
        /^\s*\d+\.\s/gm,            // Ordered lists
        /```[\s\S]*?```/g,          // Code blocks
        /\*\*.*?\*\*/g,             // Bold
        /\*.*?\*/g,                 // Italic
    ];

    const markdownCount = markdownPatterns.reduce((count, pattern) => {
        return count + (trimmed.match(pattern) || []).length;
    }, 0);

    // If we have significant Markdown patterns and few/no HTML tags, it's Markdown
    if (markdownCount > 5 && htmlTags < 3) {
        return 'markdown';
    }

    // If we have HTML tags and it starts with a tag, it's HTML
    if (htmlTags > 0 && /^\s*<[a-z]/i.test(trimmed)) {
        return 'html';
    }

    // Default to Markdown for plain text
    return 'markdown';
};

// ============================================
// HTML Sanitization
// ============================================

/**
 * Sanitizes HTML to prevent XSS attacks
 * @param {string} html - The HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = (html) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 'b', 'i',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li',
            'a', 'img',
            'blockquote', 'code', 'pre',
            'div', 'span', 'table', 'thead', 'tbody',
            'tr', 'th', 'td'
        ],
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'style',
            'width', 'height', 'target', 'rel', 'id'
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
        ALLOW_DATA_ATTR: false,
    });
};

// ============================================
// Device Detection
// ============================================

/**
 * Detects if the user is on mobile or desktop
 * @returns {'mobile' | 'desktop'} The device type
 */
export const getDeviceType = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    return mobileRegex.test(userAgent) ? 'mobile' : 'desktop';
};

// ============================================
// Date Formatting
// ============================================

/**
 * Formats a date string into a readable format
 * @param {string | Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    try {
        const dateObj = new Date(date);

        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return 'Invalid date';
        }

        return dateObj.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};

/**
 * Gets relative time (e.g., "2 hours ago")
 * @param {string | Date} date - The date to format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    try {
        const dateObj = new Date(date);
        const now = new Date();
        const diffInSeconds = Math.floor((now - dateObj) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 },
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    } catch (error) {
        console.error('Error getting relative time:', error);
        return '';
    }
};

// ============================================
// Text Utilities
// ============================================

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
};

/**
 * Strips HTML tags from a string
 * @param {string} html - The HTML string
 * @returns {string} Plain text
 */
export const stripHTML = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};

/**
 * Estimates reading time for content
 * @param {string} content - The content to analyze
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} Estimated reading time in minutes
 */
export const estimateReadingTime = (content, wordsPerMinute = 200) => {
    if (!content) return 0;

    const plainText = stripHTML(content);
    const wordCount = plainText.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    return minutes;
};

// ============================================
// URL Utilities
// ============================================

/**
 * Generates a slug from a string
 * @param {string} text - The text to slugify
 * @returns {string} URL-friendly slug
 */
export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w-]+/g, '')     // Remove all non-word chars
        .replace(/--+/g, '-')        // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Copies text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};