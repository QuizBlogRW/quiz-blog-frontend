import React, { useState, useEffect } from 'react'
import { Row, Col, Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap'
import srcQuiz from '../../images/undraw_quiz.svg'
import srcQuestion from '../../images/undraw_Question.svg'
import srcTest from '../../images/undraw_online_test.svg'
import { connect } from 'react-redux'
import { getAdverts } from '../../redux/adverts/adverts.actions'
import Adverts from './Adverts'

const items = [
    {
        id: 1,
        src: srcQuiz,
        altText: 'Quizes',
        caption: 'Take any quiz you want from Quiz Blog'
    },
    {
        id: 2,
        src: srcQuestion,
        altText: 'Questions',
        caption: 'Every quiz has multiple choice questions'
    },
    {
        id: 3,
        src: srcTest,
        altText: 'Scores',
        caption: 'You can review any quiz taken while signed in'
    }
]

const CarouselQuiz = ({ adverts, getAdverts }) => {

    const [carouselWidth, setCarouselWidth] = useState(0)
    const [advertWidth, setAdvertWidth] = useState(0)

    // Lifecycle method
    useEffect(() => {
        getAdverts()
    }, [getAdverts])

    const allAdverts = adverts && adverts.allAdverts
    const [activeIndex, setActiveIndex] = useState(0)
    const [animating, setAnimating] = useState(false)

    const nextC = () => {
        if (animating) return
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
        setActiveIndex(nextIndex)
    }

    const previousC = () => {
        if (animating) return
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
        setActiveIndex(nextIndex)
    }

    const goToIndexCar = (newIndex) => {
        if (animating) return
        setActiveIndex(newIndex)
    }

    // IF THE ADVERTS ARRAY LENGTH IS GREATER THAN 0, THEN SET THE WIDTH OF THE CAROUSEL TO 8 COLUMNS, AND THE ADVERTS TO 4 COLUMNS, ELSE SET THE WIDTH OF THE CAROUSEL TO 12 COLUMNS, AND THE ADVERTS TO 0 COLUMNS
    // Use the useEffect hook to set the carousel and advert widths based on the allAdverts variable
    useEffect(() => {
        if (allAdverts && allAdverts.length > 0) {
            setCarouselWidth(8)
            setAdvertWidth(4)
        } else {
            setCarouselWidth(12)
            setAdvertWidth(0)
        }
    }, [allAdverts])

    const slides = items.map((item) => {

        return (
            <CarouselItem className="custom-tag" tag="div" key={item.id}
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}>

                <img src={item.src} alt={item.altText} />

                <CarouselCaption className="text-yellow mx-auto" captionText={item.caption} captionHeader={item.altText} />
            </CarouselItem>
        )
    })

    // adverts items to the carousel
    const advertItems = allAdverts && allAdverts.map(advert => {
        return (
            <CarouselItem className="custom-tag" tag="div" key={advert._id}
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}>
                <img src={advert.advert_image} alt={advert.altText} />
                <CarouselCaption className="text-yellow mx-auto" captionText={advert.caption} captionHeader={advert.altText} />
            </CarouselItem>
        )
    })

    return (
        <Row className="quiz-carousel w-100 mx-0 d-flex">
            <Col sm={carouselWidth} className="d-flex px-0">

                <Carousel activeIndex={activeIndex} next={nextC} previous={previousC}>
                    <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndexCar} />
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={previousC} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={nextC} />
                </Carousel>

            </Col>

            <Col sm={advertWidth}>
                <Adverts />
            </Col>
        </Row>
    )
}

const mapStateToProps = state => ({
    adverts: state.advertsReducer
})

export default connect(mapStateToProps, { getAdverts })(CarouselQuiz)