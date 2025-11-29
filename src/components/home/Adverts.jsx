import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getActiveAdverts } from "@/redux/slices/advertsSlice";
import adPlaceholder from "@/images/Einstein.jpg";
import ImageWithFallback from '@/utils/ImageWithFallback';

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
                    "Welcome to Quiz-Blog! Take and review any multiple-choice quiz you want.",
                link: "#",
                fallback: true,
            };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-3">
            <Link to={advert.link || "#"} target="_blank" className="d-flex justify-content-center w-100">
                <ImageWithFallback
                    src={advert.advert_image || advert.fallback}
                    alt="Advert"
                    fallback={adPlaceholder}
                    className="img-fluid shadow-sm"
                    style={{
                        maxWidth: "90%",
                        border: "2px solid var(--brand)",
                        borderRadius: "22px",
                        transition: "transform 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
            </Link>

            <p
                className="mt-3 mb-0 text-center px-3 py-2 fw-bold"
                style={{
                    maxWidth: "90%",
                    backgroundColor: "rgb(255, 193, 7)",
                    color: "#000",
                    border: "2px solid var(--brand)",
                    borderRadius: "5px",
                    fontSize: "0.9rem",
                }}
            >
                {advert.caption}
            </p>
        </div>
    );
};

export default Adverts;
