import React, {useState} from 'react';
import {Row, 
    Col, 
    Button, 
    message, 
    notification, 
    Form, 
    Input, 
    Divider, 
    Tabs, 
    Modal
} from 'antd';
import type { TabsProps } from 'antd';
import {CloseCircleOutlined, CheckCircleOutlined, UserOutlined, LockOutlined} from '@ant-design/icons';
import {useStoreWithInitializer} from "../../../state/storeHooks";
import {dispatchOnCall, store} from "../../../state/store";
import {initializeLogin, LoginState, updateErrors, updateField} from "./Login.slice";
import {login, loginKey} from "../../../services/data";
import {loadUserIntoApp} from "../../../types/user";


export function Login() {
    const [apiNotification, contextHolder] = notification.useNotification();

    const [modal, modalContextHolder] = Modal.useModal();

    const [messageApi, messContextHolder] = message.useMessage();

    const [loadingLogin, setLoadingLogin] = useState(false);

    const {errors, loginIn, user} = useStoreWithInitializer(({login}) => login, dispatchOnCall(initializeLogin()));


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Username`,
            children:
                <Form
                name="sigin"
                initialValues={{remember: false}}
                onFinish={signIn}
                onFinishFailed={() =>
                    messageApi.open({
                        type: 'error',
                        content: 'Username or Password is empty',
                    })
                }
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
                    <Button type="primary" htmlType="submit"  loading={loadingLogin}>
                        Login
                    </Button>
                </Form.Item>
            </Form>,
        },
        {
            key: '2',
            label: `Key`,
            children:
                <Form
                    name="siginKey"
                    initialValues={{remember: false}}
                    onFinish={signInKey}
                    onFinishFailed={() =>
                        messageApi.open({
                            type: 'error',
                            content: 'Key is empty',
                        })
                    }
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Key"
                        name="password"
                        rules={[{required: true, message: 'Key is empty!'}]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} onChange={e => onUpdateField('key', e.target.value)}/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loadingLogin}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>,
        },
    ]

    return (
        <div>
            {contextHolder}
            {messContextHolder}
            {modalContextHolder}
            <Row justify="center" style={{display: "flex", alignItems: "center", justifyContent:"center", minHeight:"calc(100vh - 100px)"}}>
                <Col span={8}>
                    <Divider orientation="left">Login Page</Divider>
                    <Tabs defaultActiveKey="1" items={items} centered animated/>
                </Col>
            </Row>
        </div>
    )


    async function signIn(ev: React.FormEvent) {
        setLoadingLogin(true)
        if (store.getState().login.loginIn) return;

        const {username, password} = store.getState().login.user;

        const result = await login(username, password);

        //console.log(result);
        result.match({
                ok: (user) => {
                    //console.log(user);

                    /*
                    apiNotification.open({
                        message: 'Login',
                        description: 'Login Success',
                        duration: 2,
                        icon: <CheckCircleOutlined style={{color: '#63d465'}}/>,
                        onClose: () => {
                            setTimeout(() => {
                                window.location.href = 'dashboard'
                                loadUserIntoApp(user);
                            }, 500)
                        }
                    });
                    */

                    modal.success({
                        title: 'Login',
                        content: 'Login Success',
                    })
                    setTimeout(() => {
                        window.location.href = 'dashboard'
                        loadUserIntoApp(user);
                    }, 1000)

                },
                err: (err) => {
                    //console.log(err.message);
                    setLoadingLogin(false)
                    /*
                    apiNotification.open({
                        message: 'Login',
                        description: err.message,
                        duration: 2,
                        icon: <CloseCircleOutlined style={{color: '#ff4d4f'}}/>,
                    });
                    */

                    modal.error({
                        title: 'Login',
                        content: err.message,
                    })

                    store.dispatch(updateErrors(err));
                }
            },
        );
    }

    async function signInKey(ev: React.FormEvent){
        setLoadingLogin(true)
        if (store.getState().login.loginIn) return;

        const { key } = store.getState().login.user;

        const result = await loginKey(key);

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
                                window.location.href = 'dashboard'
                                loadUserIntoApp(user);
                            }, 500)
                        }
                    });
                },
                err: (err) => {
                    //console.log(err.message);
                    apiNotification.open({
                        message: 'Login',
                        description: err.message,
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

