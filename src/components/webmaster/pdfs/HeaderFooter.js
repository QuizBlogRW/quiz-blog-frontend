import React from 'react'
import logo from '../../../images/resourceImg.jpg'

const HeaderFooter = ({ styles, fromFooter }) => {

    return (
        <div style={{ backgroundColor: "#157a6e", padding: "5px 10px" }}>
            <div style={styles.reviewHeader}>

                <img src={logo} style={styles.reviewHeaderImage} alt="Logo" />

                <ul className="social-network social-circle d-flex align-items-center">

                    <li><a href="https://api.whatsapp.com/send?phone=250780579067" className="icoWhatsapp" title="Whatsapp">
                        <i className="fa fa-whatsapp"></i>
                    </a></li>

                    <li><a href="https://www.facebook.com/QuizblogRw/" className="icoFacebook" title="Facebook">
                        <i className="fa fa-facebook"></i>
                    </a></li>

                    <li><a href="https://www.linkedin.com/company/quiz-blog/" className="icoLinkedin" title="Linkedin">
                        <i className="fa fa-linkedin"></i>
                    </a></li>

                    <li><a href="https://www.instagram.com/quizblogrw/" className="icoInstagram" title="Instagram">
                        <i className="fa fa-instagram"></i>
                    </a></li>

                    <li><a href="https://twitter.com/QuizblogRw" className="icoTwitter" title="Twitter">
                        <i className="fa fa-twitter"></i>
                    </a></li>
                </ul>

                <div style={styles.reviewHeaderContact}>
                    <p>
                        <strong style={{ color: "#ffffff" }}>
                            Website:</strong>
                        <a href="https://www.quizblog.rw" style={{ color: "#ffc107", textDecoration: "none" }}> https://www.quizblog.rw</a>
                    </p>
                    <p>
                        <strong style={{ color: "#ffffff" }}>
                            Email:</strong>
                        <a href="quizblog.rw@gmail.com" style={{ color: "#ffc107", textDecoration: "none" }}> quizblog.rw@gmail.com</a>
                    </p>
                    <p style={{ color: "#ffc107" }}>
                        <strong style={{ color: "#ffffff" }}>Phone:</strong> 0780579067
                    </p>
                </div>
            </div>
            {fromFooter &&
                <div className="d-block">
                    <hr />
                    <p className="text-center">
                        &copy; Copyright {new Date().getFullYear()} - Quiz-Blog.  All Rights Reserved.
                    </p>
                </div>}
        </div>
    )
}

export default HeaderFooter
