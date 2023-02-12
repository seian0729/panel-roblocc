import React from 'react';
import {Link} from 'react-router-dom';

const PageNotFound: React.FC = () => {
    return(<div style={{color:"red", textAlign: 'center'}}>
        <h2 style={{fontSize: 'xx-large'}}>
            Page Not Found
        </h2>
        <Link to='/'> Quay về trang chủ </Link>
    </div>)
}

export default PageNotFound