import { Component } from 'react';

class SideResizable extends Component {

    componentDidMount() {
        setTimeout(function () { (window.adsbygoogle = window.adsbygoogle || []).push({}); }, 400);
    }

    render() {
        if (process.env.NODE_ENV === 'development' || import.meta.env.MODE === 'test') return null;
        return (
            <ins
                className="adsbygoogle"
                style={{ display: 'block', maxWidth: '100%', margin: '0 auto', textAlign: 'center', overflowX: 'hidden', overflowY: 'hidden', overflow: 'hidden', overflowWrap: 'normal', whiteSpace: 'nowrap' }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-8918850949540829"
                data-ad-slot="1555195647"></ins>);
    }
}

export default SideResizable;
