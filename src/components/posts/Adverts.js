import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getAdverts } from '../../redux/adverts/adverts.actions'

const Adverts = ({ adverts, getAdverts }) => {

    // Lifecycle method
    useEffect(() => {
        getAdverts()
    }, [getAdverts])

    // const allAdverts = adverts && adverts.allAdverts
    const lastAdvert = adverts && adverts.allAdverts &&
        adverts.allAdverts[adverts.allAdverts.length - 1]

    return (
        <div className='d-flex flex-column justify-content-center align-items-center p-1 mt-5 mt-lg-0'>
            <img
                src={lastAdvert && lastAdvert.advert_image} alt="adv"
                style={{ maxWidth: "100%" }} />

            <p className="legend mt-3 p-1 border rounded" style={{ background: "#ff6666" }}>
                {lastAdvert && lastAdvert.caption}
            </p>
        </div>
    )
}

const mapStateToProps = state => ({
    adverts: state.advertsReducer
})

export default connect(mapStateToProps, { getAdverts })(Adverts)