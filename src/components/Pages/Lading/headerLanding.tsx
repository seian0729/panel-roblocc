import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Typography, Col, Layout, Menu, Row, theme, Button, message} from 'antd';
import {
    LogoutOutlined,
} from '@ant-design/icons';
import type {MenuProps} from 'antd';

import {logoutFromApp} from "../../../types/user";
import {useStore} from "../../../state/storeHooks";


const {Header} = Layout;
/*
        {
            label: (
                <Button>Get Started</Button>
            ),
            key: 'register',

        },
    {
        label: (
            <Button type="primary">Login</Button>
        ),
        key: 'login',
    }
 */


const HeaderLanding: React.FC = () => {
    const {} = theme.useToken();

    const {user} = useStore(({app}) => app);

    const items: MenuProps['items'] = [
        user.match({
            none: () => {
                return {
                    label: (
                        <Link to={"login"}>
                            <Button> Get Started </Button>
                        </Link>
                    ),
                    key: '',
                }
            },
            some: (user) => {
                return {
                    label: (
                        <Button>{user.username}</Button>
                    ),
                    key: 'profilelabel',
                    children: [
                        {
                            label: (
                                <Link to="dashboard/profile">
                                    <span>Profile</span>
                                </Link>
                            ),
                            key: 'profile',
                        },
                        {
                            label: (
                                <span onClick={logout}>Logout</span>
                            ),
                            key: 'logout',
                            icon: <LogoutOutlined/>,
                            style: {color: "#ff4d4d"}

                        },
                    ],
                }

            }
        }),

    ];

    if (!user.isSome()) {
        items.push({
            label: (
                <Link to={"login"}>
                    <Button type={"primary"}> Log In </Button>
                </Link>
            ),
            key: 'login',
        });
    } else {
        items.push({
                label: (
                    <a href={"dashboard"}>
                        <Button type={"primary"}>Dashboard</Button>
                    </a>
                ),
                key: 'dashboard',
            }
        );
    }

    let myPath = useLocation().pathname.replace('/', '');

    const [current, setCurrent] = useState(myPath);
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    function logout() {
        console.log('cc')
        message.success('Logout Success')
        setTimeout(() => {
            logoutFromApp()
        }, 3000);
    }

    return (
        <Header style={{background: "#181818"}}>
            <Row justify={"center"}>
                <Col xs={20} sm={20} md={12} lg={18} xl={18} xxl={20}>
                    <Link to="">
                        <Typography.Text strong={true}>
                            CHIMOVO
                        </Typography.Text>
                    </Link>
                </Col>
                <Col xs={4} sm={4} md={12} lg={6} xl={6} xxl={4}>
                    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
                </Col>
            </Row>
        </Header>
    );
};

export default HeaderLanding;