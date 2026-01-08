// ============================================
// Date Formatting
// ============================================

/**
 * Formats a date string into a readable format
 * @param {string | Date} date - The date to format
 * @returns {string} Formatted date string (DD/MM/YYYY, HH:mm)
 */
export const formatDateTime = (date) => {
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
 * Formats a date string into a readable format
 * @param {string | Date} date - The date to format
 * @returns {string} Formatted date string (DD/MM/YYYY)
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
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};

/**
 * Formats a date string into a readable format
 * @param {string | Date} date - The date to format
 * @returns {string} Formatted date string (HH:mm)
 */
export const formatTime = (date) =>
    new Date(date)
        .toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        .slice(0, 5);
