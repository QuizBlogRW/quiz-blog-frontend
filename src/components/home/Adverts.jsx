import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getActiveAdverts } from "@/redux/slices/advertsSlice";
import adPlaceholder from "@/images/Einstein.jpg";

const Adverts = () => {

    const { activeAdverts = [] } = useSelector((state) => state.adverts || {});
    const [index, setIndex] = useState(0);
    const dispatch = useDispatch();

    // Fetch adverts once
    useEffect(() => {
        dispatch(getActiveAdverts());
    }, [dispatch]);

    // Rotate adverts
    const rotateAdvert = useCallback(() => {
        if (activeAdverts.length > 0) {
            setIndex((prev) => (prev + 1) % activeAdverts.length);
        }
    }, [activeAdverts.length]);

    useEffect(() => {
        if (activeAdverts.length === 0) return;

        const interval = setInterval(rotateAdvert, 10000);
        return () => clearInterval(interval);
    }, [rotateAdvert, activeAdverts.length]);

    // Active or fallback advert
    const advert =
        activeAdverts.length > 0
            ? activeAdverts[index]
            : {
                advert_image: adPlaceholder,
                caption:
                    "Welcome to Quiz-Blog. Take and review any multiple choice questions quiz you want from Quiz-Blog.",
                link: "#",
                fallback: true,
            };

    // Shared styles
    const imgStyle = {
        maxWidth: "92%",
        border: `2px solid var(--brand)`,
        borderRadius: "20px",
    };

    const captionStyle = {
        maxWidth: "92%",
        background: "rgb(255, 193, 7)",
        fontSize: "1vw",
        fontWeight: "bold",
        border: `2px solid var(--brand)`,
        borderRadius: "5px",
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-0">
            <Link to={advert.link || '#'} target="_blank" className="d-flex justify-content-center">
                <img src={advert.advert_image || advert.fallback} alt="Advert" style={imgStyle} />
            </Link>
            <p className="mt-4 mb-0 p-1 text-center" style={captionStyle}>
                {advert.caption}
            </p>
        </div>
    );
};

export default Adverts;
