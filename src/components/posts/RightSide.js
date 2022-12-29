import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Col, Row, Form, FormGroup, Input, Button, Alert, Spinner } from 'reactstrap'
import subscribe from '../../images/undraw_subscribe.svg'
// import AdSense from 'react-adsense'
import { connect } from 'react-redux'
import { subscribeToNewsLetter } from '../../redux/subscribers/subscribers.actions'
import { clearErrors } from '../../redux/error/error.actions'

const ViewCategory = lazy(() => import('../categories/ViewCategory'))
// const GoogleAds = lazy(() => import('../adsenses/GoogleAds'))
const SquareAd = lazy(() => import('../adsenses/SquareAd'))
const ResponsiveAd = lazy(() => import('../adsenses/ResponsiveAd'))

const RightSide = ({ auth, subscribeToNewsLetter, clearErrors, error, categories }) => {

    const currentUser = auth && auth.user

    const [subscriberState, setsubscriberState] = useState({
        name: '',
        email: ''
    })

    // Lifecycle methods
    useEffect(() => {
        if (currentUser) {
            setsubscriberState(subscriberState => ({ ...subscriberState, name: currentUser.name, email: currentUser.email }))
        }
    }, [currentUser])

    const onChangeHandler = e => {
        clearErrors()
        const { name, value } = e.target
        setsubscriberState(subscriberState => ({ ...subscriberState, [name]: value }))
    }

    const onSubscribe = e => {
        e.preventDefault()

        const { name, email } = subscriberState

        // Create user object
        const subscribedUser = {
            name,
            email
        }

        // Attempt to subscribe
        subscribeToNewsLetter(subscribedUser)

        // Reset fields
        setsubscriberState({
            name: '',
            email: ''
        })
    }

    return (
        <Col sm="4" className='d-flex flex-column justify-content-around w-100'>
            {/* <AdSense.Google
                client='ca-pub-8918850949540829'
                slot='5114335506'
                style={{ display: 'block' }}
                layout="in-article"
                format="fluid"
            /> */}
            {/* <GoogleAds slot="5114335506" /> */}
            {/* Google square ad */}
            <Row className='w-100'>
                <Col sm="12" className='w-100'>
                    <div className='w-100'>
                        <SquareAd />
                    </div>
                </Col>
            </Row>
            <Row className="mb-4 my-1 d-none d-lg-flex side-category">
                <Suspense
                    fallback=
                    {
                        <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                            <Spinner style={{ width: '5rem', height: '5rem' }} />{' '}
                        </div>
                    }>
                    <ViewCategory categories={categories} />
                </Suspense>
            </Row>
            <Row className='w-100'>
                <Col sm="12" className='w-100'>
                    <div className='w-100'>
                        <ResponsiveAd />
                    </div>
                </Col>
            </Row>
            {/* <GoogleAds slot="9642045284" /> */}

            <Row className="mb-5">

                <Form onSubmit={onSubscribe} className="subscribe-form">

                    <FormGroup>
                        {error.id === "SUBSCRIBE_FAIL" ?
                            <Alert color='danger' className='border border-warning'>
                                <small>{error.msg.msg}</small>
                            </Alert> :
                            null
                        }

                        <img src={subscribe} alt={subscribe} />

                        <h6 className="mt-5">
                            <b>Subscribe for updates</b>
                        </h6>

                        <Input type="text" name="name" value={subscriberState.name} bsSize="sm" placeholder="Your name" className="mt-4" onChange={onChangeHandler} minLength="4" maxLength="30" required />

                        <Input type="email" name="email" value={subscriberState.email} bsSize="sm" placeholder="Your Email" className="mt-4" onChange={onChangeHandler} required />

                        <Button color="info" size="sm" className="mt-4">Subscribe</Button>
                    </FormGroup>
                </Form>

            </Row>

            {/* Google square ad */}
            <Row className='w-100'>
                <Col sm="12" className='w-100'>
                    <div className='w-100'>
                        <SquareAd />
                    </div>
                </Col>
            </Row>

        </Col>
    )
}

const mapStateToProps = state => ({
    error: state.errorReducer
})

export default connect(mapStateToProps, { subscribeToNewsLetter, clearErrors })(RightSide)
