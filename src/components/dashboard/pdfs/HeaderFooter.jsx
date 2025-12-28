import { Text, View, Image, Link } from '@react-pdf/renderer';
import logo from '@/images/resourceImg.jpg';
import instagram from '@/images/instagram.jpg';
import facebook from '@/images/facebook.jpg';
import linkedin from '@/images/linkedin.jpg';
import twitter from '@/images/twitter.jpg';
import whatsapp from '@/images/whatsapp.jpg';

const HeaderFooter = ({ styles, fromFooter }) => {

    const iconStyle = {
        width: 24,
        height: 24,
        marginHorizontal: 4,
        borderRadius: 4,
        border: '1px solid #157a6e',
        objectFit: 'cover'
    };

    const contactTextStyle = {
        marginVertical: 4,
        fontSize: 10,
        lineHeight: 1.2
    };

    return (
        <View style={{
            backgroundColor: '#157a6e', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, position: fromFooter ? 'absolute' : 'relative',
            bottom: fromFooter ? 20 : undefined,
            left: fromFooter ? 20 : undefined,
            right: fromFooter ? 20 : undefined,
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: 10
            }}>
                {/* Logo */}
                <Image src={logo} style={styles.reviewHeaderImage} />

                {/* Social Icons */}
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <Link src="https://api.whatsapp.com/send?phone=250780579067"><Image src={whatsapp} style={iconStyle} /></Link>
                    <Link src="https://www.facebook.com/QuizblogRw/"><Image src={facebook} style={iconStyle} /></Link>
                    <Link src="https://www.linkedin.com/company/quiz-blog/"><Image src={linkedin} style={iconStyle} /></Link>
                    <Link src="https://www.instagram.com/quizblogrw/"><Image src={instagram} style={iconStyle} /></Link>
                    <Link src="https://twitter.com/QuizblogRw"><Image src={twitter} style={iconStyle} /></Link>
                </View>

                {/* Contact Info */}
                <View style={{ display: 'flex', flexDirection: 'column', minWidth: 120, marginVertical: 5 }}>
                    <Text style={contactTextStyle}>
                        <Text style={{ color: '#ffffff', fontWeight: 700 }}>Website: </Text>
                        <Link src="https://www.quizblog.rw" style={{ color: '#ffc107', textDecoration: 'none' }}>www.quizblog.rw</Link>
                    </Text>
                    <Text style={contactTextStyle}>
                        <Text style={{ color: '#ffffff', fontWeight: 700 }}>Email: </Text>
                        <Link src="mailto:quizblog.rw@gmail.com" style={{ color: '#ffc107', textDecoration: 'none' }}>quizblog.rw@gmail.com</Link>
                    </Text>
                    <Text style={contactTextStyle}>
                        <Text style={{ color: '#ffffff', fontWeight: 700 }}>Phone: </Text>
                        <Link src="#" style={{ color: '#ffc107', textDecoration: 'none' }}>0780579067</Link>
                    </Text>
                </View>
            </View>

            {/* Footer Text */}
            {fromFooter && (
                <View style={{ marginTop: 10 }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 9, fontWeight: 500 }}>
                        &copy; {new Date().getFullYear()} - Quiz-Blog. All Rights Reserved.
                    </Text>
                </View>
            )}
        </View>
    );
};

export default HeaderFooter;
