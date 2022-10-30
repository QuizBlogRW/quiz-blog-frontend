import React, { useState } from 'react';
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import srcQuiz from '../../images/undraw_quiz.svg';
import srcQuestion from '../../images/undraw_Question.svg';
import srcTest from '../../images/undraw_online_test.svg';

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
];

const CarouselQuiz = (props) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = items.map((item) => {

        return (
            <CarouselItem
                className="custom-tag"
                tag="div"
                key={item.id}
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}>
                <img src={item.src} alt={item.altText} />
                <CarouselCaption className="text-yellow mx-auto" captionText={item.caption} captionHeader={item.altText} />
            </CarouselItem>
        );
    });

    return (
        <div className="quiz-carousel w-100">

            <Carousel
                activeIndex={activeIndex}
                next={next}
                previous={previous}
            >

                <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
                {slides}
                <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
            </Carousel>
        </div>
    );
}

export default CarouselQuiz;