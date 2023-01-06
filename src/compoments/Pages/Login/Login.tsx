import React, {useState} from 'react';
import {Row, Col, Button, Checkbox, Form, Input, Divider} from 'antd';
import {useStoreWithInitializer} from "../../../state/storeHooks";
import {dispatchOnCall, store} from "../../../state/store";
import {initializeLogin, LoginState, updateErrors, updateField} from "./Login.slice";
import {login} from "../../../services/data";
import {loadUserIntoApp} from "../../../types/user";

export function Login() {

    const { errors, loginIn, user } = useStoreWithInitializer(({ login }) => login, dispatchOnCall(initializeLogin()));
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };




    // state username and password





    return (
        <div>
            <Row justify="center">
                <Col span={8}>
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

                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Lưu mật khẩu</Checkbox>
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
};
function onUpdateField(name: string, value: string) {
    store.dispatch(updateField({ name: name as keyof LoginState['user'], value }));
}

async function signIn(ev: React.FormEvent) {
    if (store.getState().login.loginIn) return;

    const { username, password } = store.getState().login.user;

    const result = await login(username, password);

    console.log(result);
    result.match({
        ok: (user) => {
            window.location.hash = '#/';
            loadUserIntoApp(user);
        },
        err: (err) => {
            store.dispatch(updateErrors(err));
        }
    },
    );
}
