import { useState, useEffect } from 'react';
import resourceImg from '@/images/resourceImg.svg';

const ImageWithFallback = ({ src, alt, fallbackSrc = resourceImg, id, className, ...props }) => {
    const [imageSrc, setImageSrc] = useState(src || fallbackSrc);

    // Update imageSrc if src prop changes
    useEffect(() => {
        setImageSrc(src || fallbackSrc);
    }, [src, fallbackSrc]);

    const handleError = () => setImageSrc(fallbackSrc);

    return (
        <img
            src={imageSrc}
            alt={alt}
            id={id}
            className={className}
            onError={handleError}
            {...props}
        />
    );
};

export default ImageWithFallback;
