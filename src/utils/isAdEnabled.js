/**
 * Determine if Google AdSense should be displayed based on environment
 * 
 * AdSense is enabled ONLY on quizblog.rw domain
 * Disabled on: localhost, Vercel (quizblog.online), and other environments
 * 
 * @returns {boolean} true if ads should be shown
 */
export const isAdEnabled = () => {
    // Get the current hostname
    const hostname = window.location.hostname;

    // Show ads ONLY on quizblog.rw
    // Disable on: localhost, Vercel deployments (quizblog.online), and any other domain
    return hostname === 'quizblog.rw';
};

export default isAdEnabled;
