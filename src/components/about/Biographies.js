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
                            Patrice Bruce NDATIMANA is an enthusiastic and caring student nurse who finds joy in assisting others. Known for his strong work ethic, he takes the initiative and remains self-motivated in all his endeavors. Patrice is highly adaptable and persistent, demonstrating the ability to complete assigned tasks promptly, even in challenging situations.

                            Apart from his passion for nursing, Patrice is an avid ICT enthusiast. Currently pursuing his undergraduate degree at the University of Rwanda, College of Medicine and Health Sciences in Rwamagana campus, he is dedicated to achieving a Bachelor's with Honors in Nursing.

                            In 2019, Patrice gained valuable experience as a Data Entry Officer at NAEB/PRICE. This opportunity sparked his interest in data management and data entry across various domains, further fueling his passion for the field.

                            Patrice's diverse skill set and compassionate nature make him an asset in any professional setting. His commitment to helping others and enthusiasm for technology open up exciting opportunities for his future career.
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
                            Niyomwungeri Parmenide ISHIMWE is a dedicated engineer with a strong belief in the potential of cutting-edge computing technologies. He is an enthusiastic advocate for Information and Communication Technology (ICT) and is passionate about using his knowledge and skills to solve problems. Parmenide is always eager to learn and explore new skills and the latest technologies, constantly striving to enhance his expertise and gain fresh experiences.

                            Whether it's working on small individual projects or collaborating with teams on larger ventures, Parmenide puts in great effort to ensure customer satisfaction. His commitment to excellence led him to achieve a Bachelor's degree with honors in Computer Science from the University of Rwanda. With his extensive experience as a full-stack web developer, he has successfully worked on a variety of design and development software projects, showcasing his versatility and proficiency in the field.
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
                            Thierry TUYIZERE is a dedicated student nurse currently pursuing a Bachelor of Sciences (Hons) in Nursing at the University of Rwanda, College of Medicine and Health Science (UR-CMHS). Alongside his passion for healthcare, he also possesses a keen interest in technology. Thierry holds certifications as a Social Media Manager and Typographer, and his talent as an essay writer has earned him prestigious awards.

                            With a love for creating meaningful content on the internet, Thierry enjoys using technology to develop projects that benefit others. Since 2020, he has been actively involved with various organizations and groups, lending his skills as a typographer and graphic designer. Additionally, he has served as a proficient social media manager, contributing to the success of numerous ventures.

                            Thierry's diverse talents and dedication to both nursing and technology make him a promising individual with a bright future ahead.
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