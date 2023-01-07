import React, {useState} from 'react';
import {Row, Col, Button, message, notification , Form, Input, Divider} from 'antd';
import {CloseCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import {useStoreWithInitializer} from "../../../state/storeHooks";
import {dispatchOnCall, store} from "../../../state/store";
import {initializeLogin, LoginState, updateErrors, updateField} from "./Login.slice";
import {login} from "../../../services/data";
import {loadUserIntoApp} from "../../../types/user";


export function Login() {
    const [apiNotification, contextHolder] = notification.useNotification();
    const [messageApi, messcontextHolder] = message.useMessage();

    const { errors, loginIn, user } = useStoreWithInitializer(({ login }) => login, dispatchOnCall(initializeLogin()));

    // finish failed

    const onFinishFailed = () => {
        messageApi.open({
            type: 'error',
            content: 'Vui lòng nhập đầy đủ thông tin',
        });
    };


    // state username and password


    return (
        <div>
            {contextHolder}
            {messcontextHolder}
            <Row justify="center" >
                <Col span={8} >
                    <Divider orientation="left">Đăng nhập</Divider>

                    <Form
                        name="basic"
                        initialValues={{remember: false}}
                        onFinish={signIn}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Tên đăng nhập"
                            name="username"
                            rules={[{required: true, message: 'Vui lòng nhập tên đăng nhập!'}]}

                        >
                            <Input onChange={e => onUpdateField('username', e.target.value)}/>
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{required: true, message: 'Vui lòng nhập mật khẩu!'}]}
                        >
                            <Input.Password onChange={e => onUpdateField('password', e.target.value)}/>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit"  >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
    async function signIn(ev: React.FormEvent) {
        if (store.getState().login.loginIn) return;

        const { username, password } = store.getState().login.user;

        const result = await login(username, password);

        console.log(result);
        result.match({
                ok: (user) => {
                    console.log(user);

                    apiNotification.open({
                        message: 'Đăng nhập',
                        description: 'Đăng nhập thành công',
                        duration: 2,
                        icon: <CheckCircleOutlined style={{ color: '#63d465' }} />,
                        onClose: () => {
                            setTimeout(() => {
                                window.location.hash = '#/';
                                loadUserIntoApp(user);
                            },500)
                        }
                    });


                },
                err: (err) => {
                    store.dispatch(updateErrors(err));
                }
            },
        );
    }
};
function onUpdateField(name: string, value: string) {
    store.dispatch(updateField({ name: name as keyof LoginState['user'], value }));
}

