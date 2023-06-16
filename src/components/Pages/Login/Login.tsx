import React, {useState} from 'react';
import {Row, Col, Button, message, notification, Form, Input, Divider} from 'antd';
import {CloseCircleOutlined, CheckCircleOutlined, UserOutlined, LockOutlined} from '@ant-design/icons';
import {useStoreWithInitializer} from "../../../state/storeHooks";
import {dispatchOnCall, store} from "../../../state/store";
import {initializeLogin, LoginState, updateErrors, updateField} from "./Login.slice";
import {login} from "../../../services/data";
import {loadUserIntoApp} from "../../../types/user";


export function Login() {
    const [apiNotification, contextHolder] = notification.useNotification();
    const [messageApi, messcontextHolder] = message.useMessage();

    const {errors, loginIn, user} = useStoreWithInitializer(({login}) => login, dispatchOnCall(initializeLogin()));

    // finish failed

    const onFinishFailed = () => {
        messageApi.open({
            type: 'error',
            content: 'Username or Password is empty',
        });
    };


    // state username and password


    return (
        <div>
            {contextHolder}
            {messcontextHolder}
            <Row justify="center">
                <Col span={8}>
                    <Divider orientation="left">Login</Divider>

                    <Form
                        name="basic"
                        initialValues={{remember: false}}
                        onFinish={signIn}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{required: true, message: 'Username is empty!'}]}

                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} onChange={e => onUpdateField('username', e.target.value)}/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{required: true, message: 'Password is empty!'}]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} onChange={e => onUpdateField('password', e.target.value)}/>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )

    async function signIn(ev: React.FormEvent) {
        if (store.getState().login.loginIn) return;

        const {username, password} = store.getState().login.user;

        const result = await login(username, password);

        //console.log(result);
        result.match({
                ok: (user) => {
                    //console.log(user);

                    apiNotification.open({
                        message: 'Login',
                        description: 'Login Success',
                        duration: 2,
                        icon: <CheckCircleOutlined style={{color: '#63d465'}}/>,
                        onClose: () => {
                            setTimeout(() => {
                                window.location.hash = '#';
                                loadUserIntoApp(user);
                            }, 500)
                        }
                    });


                },
                err: (err) => {
                    //console.log(err);
                    apiNotification.open({
                        message: 'Login',
                        description: 'Your username or password is incorrect',
                        duration: 2,
                        icon: <CloseCircleOutlined style={{color: '#ff4d4f'}}/>,
                    });
                    store.dispatch(updateErrors(err));
                }
            },
        );
    }
};

function onUpdateField(name: string, value: string) {
    store.dispatch(updateField({name: name as keyof LoginState['user'], value}));
}

