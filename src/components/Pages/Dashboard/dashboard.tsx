import React, {useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    TableOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import {Layout, Menu, theme, Typography, message, Card, Row, Col, Button} from 'antd';
import type {MenuProps} from 'antd';
import {Link, useLocation, useParams} from 'react-router-dom';
import {logoutFromApp} from "../../../types/user";
import {useStore} from "../../../state/storeHooks";
import './dashboard.css'

//pages
import View from "./BF/bf"
import PetX from "./PetX/petx";
import Page404 from "../404/404";
import Profile from "../Profile/profile";

//img
import psxImg from '../../../img/psx.png';
import bloxImg from '../../../img/bloxshut.png';

const {Header, Sider, Content} = Layout;
const {Text} = Typography;


const Dashboard: React.FC = () => {


    let params = useParams()

    const {user} = useStore(({app}) => app);

    // console user in user
    const items: MenuProps['items'] = [
        user.match({
            none: () => {
                return {
                    label: (
                        <Link to="/login">
                            <span>Login</span>
                        </Link>
                    ),
                    key: 'login',
                    icon: <UserOutlined/>,
                };
            },
            some: () => {
                return {
                    label: (
                        <span>Dashboard</span>
                    ),
                    key: 'dashboard',
                    icon: <TableOutlined/>,
                    children: [
                        {
                            label: (
                                <Link to="../../dashboard/bloxfruit">
                                    <span>Blox Fruits</span>
                                </Link>
                            ),
                            key: 'bloxfruit',
                        },
                        {
                            label: (
                                <Link to="../../dashboard/petx">
                                    <span>Pet Simulator X</span>
                                </Link>
                            ),
                            key: 'petsimx',
                        },
                    ]
                };

            }
        })

    ];

    // logout button
    function logout() {
        message.success('Logout Success')
        setTimeout(() => {
            logoutFromApp()
        }, 3000);
    }

    if (user.isSome()) {
        let {username} = user.unwrap();
        items.push({
            label: (
                <Link to="../../dashboard/profile">
                    <span>{username}</span>
                </Link>
            ),
            key: 'profile',
            icon: <UserOutlined/>,
        });
        // admin
        if (user.unwrap().role === 'Admin') {
            items.push({
                label: (
                    "Admin"
                ),
                key: 'admin',
                icon: <DashboardOutlined/>,
                disabled: true
            });
        }
        // đăng xuất
        items.push({
            label: (
                <span onClick={logout}>Logout</span>
            ),
            key: 'logout',
            icon: <LogoutOutlined/>,
        });

    }


    let myPath = useLocation().pathname.replace('/', '');

    const [current, setCurrent] = useState(myPath);

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}
                   style={{background: "rgb(24, 24, 24)", color: "white"}}>
                <div style={{textAlign: "center", padding: 12}}>
                    <Text strong={true} style={{padding: 6}}>CHIMOVO</Text>
                </div>

                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={onClick} selectedKeys={[current]}
                    items={items}

                />
            </Sider>
            <Layout className="site-layout">
                <Header style={{padding: 0, background: colorBgContainer}}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                </Header>
                <Content
                    style={{
                        margin: '6px 6px',
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: 8
                    }}
                >
                    {
                        params.dashboardName === undefined ?
                            <div style={{color: "white"}}>
                                <Row gutter={[16, 16]}>
                                    <Col>
                                        <Card title="Blox Fruit"
                                              hoverable
                                              cover={<img style={{width: "100%"}} alt="example" src={bloxImg}/>}
                                        >
                                            <Link to={"bloxfruit"}>
                                                <Button style={{width: "100%"}} type={"default"}> Blox Fruit </Button>
                                            </Link>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card title="Pet Simulator X"
                                              hoverable
                                              cover={<img alt="example" src={psxImg}/>}
                                        >
                                            <Link to={"petx"}>
                                                <Button style={{width: "100%"}} type={"default"}> Pet Simulator
                                                    X </Button>
                                            </Link>
                                        </Card>
                                    </Col>
                                </Row>
                            </div> :
                            params.dashboardName === 'bloxfruit' ? <View/> :
                                params.dashboardName === 'petx' ? <PetX/> :
                                    params.dashboardName === 'profile' ? <Profile/> : <Page404/>
                    }
                </Content>
                <Layout.Footer style={{textAlign: 'center'}}>Roblox Panel by PaulVoid and Hanei</Layout.Footer>

            </Layout>
        </Layout>
    );
};

export default Dashboard;

