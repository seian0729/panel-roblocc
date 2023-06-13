import React from 'react';
import {Button, Result} from 'antd';
import {Link} from 'react-router-dom';
// u gay
const Register: React.FC = () => {
    return (
        <Result
            status="info"
            title="SOON"
            subTitle="Sorry, the page you visited does not ready"
            extra={
                <Link to="/">
                    <Button type="primary" size="large">
                        Back to Home
                    </Button>
                </Link>
            }
        />
    );
};

export default Register;
