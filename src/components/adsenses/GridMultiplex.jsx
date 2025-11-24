import { Component } from 'react';

class GridMultiplex extends Component {
    constructor(props) {
        super(props);
        this.googleInit = null;
    }

    componentDidMount() {

        this.googleInit = setTimeout(() => {
            if (typeof window !== 'undefined')
                (window.adsbygoogle = window.adsbygoogle || []).push({});
        }, 400);
    }

    componentWillUnmount() {
        if (this.googleInit) clearTimeout(this.googleInit);
    }

    render() {
        if (process.env.NODE_ENV === 'development' || import.meta.env.MODE === 'test') return null;
        return (
            <ins
                className="adsbygoogle"
                style={{ display: 'block', maxWidth: '100%', margin: '0 auto', textAlign: 'center', overflowX: 'hidden', overflowY: 'hidden', overflow: 'hidden', overflowWrap: 'normal', whiteSpace: 'nowrap' }}
                data-ad-format="autorelaxed"
                data-ad-client="ca-pub-8918850949540829"
                data-ad-slot="9064066298"></ins>);
    }
}

export default GridMultiplex;
