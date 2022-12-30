import React, { useState, useEffect } from 'react'
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap'
import { connect } from 'react-redux'
import { getAdverts } from '../../redux/adverts/adverts.actions'


const Advert = ({ adverts, getAdverts }) => {

    // Lifecycle method
    useEffect(() => {
        getAdverts()
    }, [getAdverts])

    const allAdverts = adverts && adverts.allAdverts
    const [activeIndexAd, setActiveIndexAd] = useState(0)
    const [animatingAd, setAnimatingAd] = useState(false)

    const nextAd = () => {
        if (animatingAd) return
        const nextIndex = activeIndexAd === allAdverts.length - 1 ? 0 : activeIndexAd + 1
        setActiveIndexAd(nextIndex)
    }

    const previousAd = () => {
        if (animatingAd) return
        const nextIndex = activeIndexAd === 0 ? allAdverts.length - 1 : activeIndexAd - 1
        setActiveIndexAd(nextIndex)
    }

    const goToIndexAd = (newIndex) => {
        if (animatingAd) return
        setActiveIndexAd(newIndex)
    }

    // adverts items to the carousel
    const advertItems = allAdverts && allAdverts.map(advert => {
        return (
            <CarouselItem className="custom-tag" tag="div" key={advert._id}
                onExiting={() => setAnimatingAd(true)}
                onExited={() => setAnimatingAd(false)}>
                <img src={advert.advert_image} alt={advert.altText} />
                <CarouselCaption className="text-yellow mx-auto" captionText={advert.caption} captionHeader={advert.altText} />
            </CarouselItem>
        )
    })

    return (
        <Carousel activeIndexAd={activeIndexAd} next={nextAd} previous={previousAd}>
            <CarouselIndicators items={advertItems} activeIndexAd={activeIndexAd} onClickHandler={goToIndexAd} />
            {console.log(allAdverts)}
            {advertItems}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previousAd} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={nextAd} />
        </Carousel>
    )
}

const mapStateToProps = state => ({
    adverts: state.advertsReducer
})

export default connect(mapStateToProps, { getAdverts })(Advert)