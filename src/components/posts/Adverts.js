import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { getActiveAdverts } from '../../redux/adverts/adverts.actions'
import adPlaceholder from '../../images/Einstein.jpg'

const Adverts = ({ adverts, getActiveAdverts }) => {

    const allActiveAdverts = adverts && adverts.activeAdverts
    const [adShow, setAdShow] = useState()

    // Show each advert for 5 seconds before showing the next one in the array of adverts from the database. Do that repeatedly and continuously.
    const showAdverts = useCallback(() => {
        setAdShow(prevState => {
            if (isNaN(prevState)) {
                return 0
            }
            return (prevState + 1) % allActiveAdverts.length
        })
    }, [allActiveAdverts])

    // Lifecycle method
    useEffect(() => {
        getActiveAdverts()
    }, [getActiveAdverts])

    // call showAdverts() every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            showAdverts()
        }, 10000)
        // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
        return () => clearInterval(interval)
    }, [showAdverts, adShow])

    const advertToDisplay = allActiveAdverts && allActiveAdverts[adShow]

    return (
        <div className='d-flex flex-column justify-content-center align-items-center p-1 mt-5 mt-lg-0'>
            {advertToDisplay ?
                <>
                    <img
                        src={advertToDisplay && advertToDisplay.advert_image} alt="Quiz Blog Rwanda"
                        style={{ maxWidth: "100%" }} />
                    <p className="legend mt-2 mb-0 p-1 border rounded" style={{ background: "#ff6666" }}>
                        {advertToDisplay && advertToDisplay.caption}
                    </p>
                </> : 

                <>
                    <img
                        src={adPlaceholder && adPlaceholder} alt="Quiz Blog Rwanda"
                        style={{ maxWidth: "100%" }} />
                    <p className="legend mt-2 mb-0 p-1 border rounded" style={{ background: "#ff6666" }}>
                        "Welcome to Quiz Blog. Take and review any multiple choice questions quiz you want from Quiz Blog."
                    </p>
                </>}
        </div>
    )
}

const mapStateToProps = state => ({
    adverts: state.advertsReducer
})

export default connect(mapStateToProps, { getActiveAdverts })(Adverts)