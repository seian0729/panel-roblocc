import React from 'react';
import {
    Row,
    Col,
    Divider,
    Form,
    Button,
    Input
} from "antd";

const addUser: React.FC = () => {
    return(
        <div>
            <Row justify={'start'}>
                <Col span={12} offset={6}>
                <Divider orientation="left">Thêm người dùng</Divider>
                <Form
                    name="basic"
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{required: true, message: 'Username không được bỏ trống!'}]}
                    >
                        <Input placeholder="Username"/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="Password"
                        rules={[{required: true, message: 'Password không được bỏ trống!'}]}
                    >
                        <Input.Password placeholder="Password"/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit"  >
                            Thêm người dùng
                        </Button>
                    </Form.Item>
                </Form>
                </Col>
            </Row>
        </div>
    )
}

export default addUser;