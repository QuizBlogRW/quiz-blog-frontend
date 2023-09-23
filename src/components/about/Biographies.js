import React, { useEffect } from 'react';
import { Button } from 'reactstrap';
import bruce from '../../images/Bruce.jpg'
import parmenide from '../../images/nide.JPG'
import thierry from '../../images/thierry.jpg'
import annick from '../../images/annick.jpg'
import denyse from '../../images/denyse.jpg'
import instagram from '../../../src/images/instagram.svg';
import linkedin from '../../../src/images/linkedin.svg';
import facebook from '../../../src/images/facebook.svg';
import twitter from '../../../src/images/twitter.svg';
import whatsapp from '../../../src/images/whatsapp.svg';
import github from '../../../src/images/github.svg';
import web from '../../../src/images/web.svg';

const Biographies = () => {

    const handleIntersection = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2,
        };

        const observer = new IntersectionObserver(handleIntersection, options);

        // Observe each image element
        const imageElements = document.querySelectorAll('.memberImg img');
        imageElements.forEach((img) => {
            observer.observe(img);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <h2 className="font-weight-bold text-center text-success mb-4 my-lg-5">
                <u>Meet our team</u>
            </h2>
            <div className="row mx-sm-4 my-4 my-sm-5">

                <div className="col-12 col-sm-4 px-0 px-sm-3 d-flex flex-column align-items-center justify-content-center">
                    <div className="memberImg">
                        <img className="w-100 mt-2 mt-lg-0 fadeIn" src={bruce && bruce} alt="quiz" />
                    </div>
                </div>

                <div className="memberText col-12 col-sm-8 px-0 px-sm-3">
                    <h4 className="py-3 font-weight-bolder w-100 text-info">Patrice Bruce NDATIMANA</h4>
                    <h6 className="font-weight-bolder">Founder & Idea Innovator, Content Creator, and General Manager</h6>
                    <div className="mt-lg-2">
                        <small className='text-justify'>
                            Bruce is an enthusiastic and caring student nurse who finds joy in assisting others. Known for his strong work ethic, he takes the initiative and remains self-motivated in all his endeavors. He is highly adaptable and persistent, demonstrating the ability to complete assigned tasks promptly, even in challenging situations. Apart from his passion for nursing, He is an avid ICT enthusiast. Currently pursuing his undergraduate degree at the University of Rwanda, College of Medicine and Health Sciences in Rwamagana campus, he is dedicated to achieving a Bachelor's with Honors in Nursing.
                            <br /><br />
                            Bruce's diverse skill set and compassionate nature make him an asset in any professional setting. His commitment to helping others and enthusiasm for technology open up exciting opportunities for his future career.
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

            <div className="row mx-sm-4 my-4 my-sm-5">

                <div className="memberText col-12 col-sm-8 px-0 px-sm-3">
                    <h4 className="py-3 font-weight-bolder w-100 text-info">Thierry TUYIZERE</h4>
                    <h6 className="font-weight-bolder"> Co-founder, Content Creator, and Social Media Manager</h6>
                    <div className="mt-lg-2">
                        <small className='text-justify'>
                            Thierry is a dedicated student nurse currently pursuing a Bachelor of Sciences (Hons) in Nursing at the University of Rwanda, College of Medicine and Health Science (UR-CMHS). Alongside his passion for healthcare, he also possesses a keen interest in technology. He holds certifications as a Social Media Manager and Typographer, and his talent as an essay writer has earned him prestigious awards. With a love for creating meaningful content on the internet, he enjoys using technology to develop projects that benefit others. Since 2020, he has been actively involved with various organizations and groups, lending his skills as a typographer and graphic designer.
                            <br /><br />
                            Additionally, Thierry has served as a proficient social media manager, contributing to the success of numerous ventures. his diverse talents and dedication to both nursing and technology make him a promising individual with a bright future ahead.
                        </small>
                    </div>

                    <div className="social w-100 d-flex justify-content-around mx-0 px-md-1 py-md-1">
                        <strong>
                            <img src={whatsapp} alt="0784553202" width="20" height="20" />&nbsp;&nbsp;<span style={{ verticalAlign: "sub" }}>0784553202</span>
                        </strong>
                        <Button size="sm" color="link">
                            <a href="https://rw.linkedin.com/in/tuyiterry">
                                <img src={linkedin} alt="tuyi_terry" width="20" height="20" />
                            </a>
                        </Button>
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

                <div className="col-12 col-sm-4 px-0 px-sm-3 d-flex flex-column align-items-center justify-content-center">
                    <div className="memberImg">
                        <img className="w-100 mt-2 mt-lg-0 fadeIn" src={thierry && thierry} alt="quiz" />
                    </div>
                </div>

            </div>
            <hr />

            <hr />

            <div className="row mx-sm-4 my-4 my-sm-5">
                <div className="col-12 col-sm-4 px-0 px-sm-3 d-flex flex-column align-items-center justify-content-center">
                    <div className="memberImg">
                        <img className="w-100 mt-2 mt-lg-0 fadeIn" src={parmenide && parmenide} alt="quiz" />
                    </div>
                </div>

                <div className="memberText col-12 col-sm-8 px-0 px-sm-3">
                    <h4 className="py-3 font-weight-bolder w-100 text-info">Niyomwungeri Parmenide ISHIMWE</h4>
                    <h6 className="font-weight-bolder">Co-founder, Application Developer, and IT Manager</h6>
                    <div className="mt-lg-2">
                        <small className='text-justify'>
                            Parmenide is a dedicated engineer with a strong belief in the potential of cutting-edge computing technologies. He is an enthusiastic advocate for ICT and is passionate about using his knowledge and skills to solve problems. He is always eager to learn and explore new skills and the latest technologies, constantly striving to enhance his expertise and gain fresh experiences. Whether it's working on small individual projects or collaborating with teams on larger ventures, Parmenide puts in great effort to ensure customer satisfaction. His commitment to excellence led him to achieve a Bsc(honors) in Computer Science from the University of Rwanda.

                            <br /><br />
                            With his extensive experience as a full-stack software developer, he has successfully worked on a variety of design and development software projects, showcasing his versatility and proficiency in the field.
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
                            <a href="https://github.com/Nide17">
                                <img src={github} alt="Nide17" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link" className="mx-2">
                            <a href="https://www.parmenide.me/">
                                <img src={web} alt="parmenide.me" width="20" height="20" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            <hr />

            <div className="row mx-sm-4 my-4 my-sm-5">
                <div className="memberText col-12 col-sm-8 px-0 px-sm-3">
                    <h4 className="py-3 font-weight-bolder w-100 text-info">Denyse MUKUNDUHIRWE</h4>
                    <h6 className="font-weight-bolder">Co-founder, Content Creator, and Public Relations Manager</h6>
                    <div className="mt-lg-2">
                        <small className='text-justify'>
                            Denyse is pursuing Bachelors with honor in general nursing at the University of Rwanda while passionately exploring the intersection of healthcare and technology. She's an active Resolution Fellowship member, gaining expertise in project writing and fundraising. She also has background in computer science, having completed training in hardware and software maintenance. Her talents extend to public speaking and writing, recognized by Debate Mate from UK as one of its trainee. She is dedicated to problem-solving and is currently involved in ASRHA projects focusing on adolescent sexual and reproductive health awareness.
                            <br /><br />
                            Moreover, Denyse is good at team work, time management and project management. her journey showcases her unwavering dedication to creating positive change in healthcare, technology, and community engagement.
                        </small>
                    </div>
                    <div className="social w-100 d-flex justify-content-around mx-0 px-md-1 py-md-1">
                        <strong>
                            <img src={whatsapp} alt="0787743631" width="20" height="20" />&nbsp;&nbsp;<span style={{ verticalAlign: "sub" }}>0787743631</span>
                        </strong>
                        <Button size="sm" color="link" className="ml-0 pl-0 mr-2">
                            <a href="https://www.linkedin.com/in/denyse-mukunduhirwe-925762208/">
                                <img src={linkedin} alt="niyomwungeri-parmenide-ishimwe-1a5394123" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link" className="mx-2">
                            <a href="https://www.instagram.com/dobrev_denys/">
                                <img src={instagram} alt="Denyse" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link" className="mx-2">
                            <a href="https://twitter.com/Denyse2M">
                                <img src={twitter} alt="Denyse" width="20" height="20" />
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="col-12 col-sm-4 px-0 px-sm-3 d-flex flex-column align-items-center justify-content-center">
                    <div className="memberImg">
                        <img className="w-100 mt-2 mt-lg-0 fadeIn" src={denyse && denyse} alt="quiz" />
                    </div>
                </div>
            </div>
            <hr />

            <div className="row mx-sm-4 my-4 my-sm-5">

                <div className="col-12 col-sm-4 px-0 px-sm-3 d-flex flex-column align-items-center justify-content-center">
                    <div className="memberImg">
                        <img className="w-100 mt-2 mt-lg-0 fadeIn" src={annick && annick} alt="quiz" />
                    </div>
                </div>

                <div className="memberText col-12 col-sm-8 px-0 px-sm-3">
                    <h4 className="py-3 font-weight-bolder w-100 text-info">Sonie Annick AKALIZA</h4>
                    <h6 className="font-weight-bolder"> Co-founder, Content Creator, and Planning & Production Manager </h6>
                    <div className="mt-lg-2">
                        <small className='text-justify'>
                            Annick is currently pursuing a nursing degree from the University of Rwanda, College of medicine and health sciences. She has a certificate in social psychology, which compliments her nursing studies, providing a unique perspective on human behavior and wellbeing. She has contributed to various health initiatives, offering her skills as a secretary. These experiences have improved her abilities by emphasizing the importance of meticulous organization, effective communication and attention to detail.
                            <br /><br />
                            Looking ahead, Annick is excited to use her unique abilities to drive innovation into simplifying learning experience, and creating immersive and inclusive learning through online resources.
                        </small>
                    </div>

                    <div className="social w-100 d-flex justify-content-around mx-0 px-md-1 py-md-1">
                        <strong>
                            <img src={whatsapp} alt="" width="20" height="20" />&nbsp;&nbsp;<span style={{ verticalAlign: "sub" }}>0787663943</span>
                        </strong>
                        <Button size="sm" color="link">
                            <a href="https://www.linkedin.com/in/sonie-annick-akaliza-720a41254/">
                                <img src={linkedin} alt="Annick" width="20" height="20" />
                            </a>
                        </Button>
                        <Button size="sm" color="link">
                            <a href="https://www.instagram.com/sonie_annick/">
                                <img src={instagram} alt="Annick" width="20" height="20" />
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