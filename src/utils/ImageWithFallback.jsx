import { useState } from 'react';
import uploadimage from '@/images/uploadimage.svg';

const ImageWithFallback = ({ src, alt, fallbackSrc = uploadimage, id, className, ...props }) => {
    const [imageSrc, setImageSrc] = useState(src);

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
