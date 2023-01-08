import { Col, Row, Divider, Empty } from 'antd';
import React from "react";

const loginCompoment: React.FC = () => (
    <>
        <Row>
            <Col span={24}>
                <Divider orientation="left">Roblocc Panel - Blox Fruit</Divider>
                <Empty description="Không có dữ liệu" />
            </Col>
        </Row>

    </>
);

export default  loginCompoment