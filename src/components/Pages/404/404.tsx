import React from 'react';
import {Button, Result} from 'antd';
import {useNavigate} from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" size="large" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            }
        />
    );
};

export default NotFoundPage;
