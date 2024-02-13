import React from 'react';
import {Button, Col, Result, Row} from 'antd';
import {useNavigate} from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Row justify="center" style={{display: "flex", alignItems: "center", justifyContent:"center", minHeight:"calc(100vh - 164px)"}}>
            <Col xs={20} sm={16} md={16} xl={8}>
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
            </Col>
        </Row>
    );
};

export default NotFoundPage;
