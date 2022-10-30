import React from 'react'
import { Button } from 'reactstrap';

import bruce from '../../images/Bruce.jpg'
import parmenide from '../../images/nideimage.JPG'
import thierry from '../../images/thierry.jpeg'
import instagram from '../../../src/images/instagram.svg';
import linkedin from '../../../src/images/linkedin.svg';
import facebook from '../../../src/images/facebook.svg';
import twitter from '../../../src/images/twitter.svg';
import whatsapp from '../../../src/images/whatsapp.svg';

const Biographies = () => {
    return (
        <>
            <h2 className="font-weight-bold text-center text-success mb-4 mb-lg-5">
                <u>Meet our team</u>
            </h2>
            <div className="row mx-sm-4 my-4 my-sm-5">

                <div className="col-12 col-sm-4 px-0 px-sm-3 d-flex flex-column align-items-center justify-content-center">
                    <div className="memberImg">
                        <img className="w-100 mt-2 mt-lg-0" src={bruce && bruce} alt="quiz" />
                    </div>
                </div>

                <div className="memberText col-12 col-sm-8 px-0 px-sm-3">
                    <h4 className="py-3 font-weight-bolder w-100 text-info">Patrice Bruce NDATIMANA</h4>
                    <h6 className="font-weight-bolder">Owner and Idea Innovator</h6>
                    <div className="mt-lg-2">
                        <small className='text-justify'>
                            Patrice Bruce NDATIMANA is a passionate student nurse who is happy to help others. He is a hard worker, initiative, self-motivated, highly adaptable, persistent person, able to complete assigned tasks within the deadline, and capable of working under any challenging situation. He is an ICT enthusiast and he is currently an undergraduate student at the University of Rwanda, College of Medicine and Health Sciences at Rwamagana campus where he is doing a Bachelor with Honors in Nursing. He worked at NAEB/PRICE as Data Entry Officer in 2019, and he is interested in data management and data entry of various types.
                        </small>
                    </div>

                    <div className="social w-100 d-flex justify-content-around mx-0 px-md-1 py-md-1">
                        <strong>
                            <img src={whatsapp} alt="0780579067" width="20" height="20" />&nbsp;&nbsp;<span style={{ verticalAlign: "sub" }}>0780579067</span>
                        </strong>
                        <Button size="sm" color="link">
                            <a href="https://www.linkedin.com/in/ndatimana-patrice-bruce-20b363195">
                                <img src={linkedin} alt="ndatimana-patrice-bruce" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link">
                            <a href="https://www.instagram.com/dr.active4">
                                <img src={instagram} alt="dr.active4" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link">
                            <a href="https://www.facebook.com/ndatimana.bruce">
                                <img src={facebook} alt="ndatimana.bruce" width="20" height="20" />
                            </a>
                        </Button>
                    </div>
                </div>

            </div>

            <hr />

            <div className="row mx-sm-4 my-4 my-sm-5">
                <div className="memberText col-12 col-sm-8 px-0 px-sm-3">
                    <h4 className="py-3 font-weight-bolder w-100 text-info">Niyomwungeri Parmenide ISHIMWE</h4>
                    <h6 className="font-weight-bolder">Application Developer</h6>
                    <div className="mt-lg-2">
                        <small className='text-justify'>
                            Niyomwungeri Parmenide ISHIMWE is a well-disciplined engineer who believes passionately in new computing technologies. He is an ICT enthusiast and passionate about solving the problem using ICT knowledge and skills. He puts great effort to learn and discover new skills and latest technologies and hence developing them to achieve newer experiences. He is comfortable working on small and big projects personally and with teams and usually striving for customer satisfaction. He holds a Bachelor's degree with honors in Computer Science from the University of Rwanda. He is an experienced full- stack web developer, as he worked on various designs and development software projects.
                        </small>
                    </div>
                    <div className="social w-100 d-flex justify-content-around mx-0 px-md-1 py-md-1">
                        <strong>
                            <img src={whatsapp} alt="0788551997" width="20" height="20" />&nbsp;&nbsp;<span style={{ verticalAlign: "sub" }}>0788551997</span>
                        </strong>
                        <Button size="sm" color="link" className="ml-0 pl-0 mr-2">
                            <a href="https://www.linkedin.com/in/niyomwungeri-parmenide-ishimwe-1a5394123/">
                                <img src={linkedin} alt="niyomwungeri-parmenide-ishimwe-1a5394123" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link" className="mx-2">
                            <a href="https://www.instagram.com/ishimwe_parmenide/">
                                <img src={instagram} alt="ishimwe_parmenide" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link" className="mx-2">
                            <a href="https://www.facebook.com/nide.drogba.7/">
                                <img src={facebook} alt="nide.drogba.7" width="20" height="20" />
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="col-12 col-sm-4 px-0 px-sm-3 d-flex flex-column align-items-center justify-content-center">
                    <div className="memberImg">
                        <img className="w-100 mt-2 mt-lg-0" src={parmenide && parmenide} alt="quiz" />
                    </div>
                </div>
            </div>

            <hr />

            <div className="row mx-sm-4 my-4 my-sm-5">

                <div className="col-12 col-sm-4 px-0 px-sm-3 d-flex flex-column align-items-center justify-content-center">
                    <div className="memberImg">
                        <img className="w-100 mt-2 mt-lg-0" src={thierry && thierry} alt="quiz" />
                    </div>
                </div>

                <div className="memberText col-12 col-sm-8 px-0 px-sm-3">
                    <h4 className="py-3 font-weight-bolder w-100 text-info">Thierry TUYIZERE</h4>
                    <h6 className="font-weight-bolder">Content Creator and Social Media Manager</h6>
                    <div className="mt-lg-2">
                        <small className='text-justify'>
                            Thierry TUYIZERE is a student nurse University of Rwanda, College of Medicine and Health Science (UR-CMHS), doing Bachelor of Sciences (Hons) in Nursing. He is a young man who likes and is interested in technology. He is a CERTIFIED Social Media Manager, Typographer, and an award winning essay writer. He likes using and working with internet creating something helpful to others. Since 2020, He has worked with different organizations and groups as a typographer/graphic designer and a social media manager.
                        </small>
                    </div>

                    <div className="social w-100 d-flex justify-content-around mx-0 px-md-1 py-md-1">
                        <strong>
                            <img src={whatsapp} alt="0784553202" width="20" height="20" />&nbsp;&nbsp;<span style={{ verticalAlign: "sub" }}>0784553202</span>
                        </strong>
                        <Button size="sm" color="link">
                            <a href="http://www.twitter.com/tuyi_terry/">
                                <img src={twitter} alt="tuyi_terry" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link">
                            <a href="http://www.instagram.com/tuyi_terry/">
                                <img src={instagram} alt="tuyi_terry" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link">
                            <a href="https://www.facebook.com/profile.php?id=100018717315946">
                                <img src={facebook} alt="Thierry-Tuyizere" width="20" height="20" />
                            </a>
                        </Button>
                    </div>
                </div>

            </div>
            <hr />
        </>
    )
}

export default Biographies