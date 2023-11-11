import React, {useEffect, useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    TableOutlined,
    DashboardOutlined, CloseCircleOutlined, DotChartOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    theme,
    Typography,
    message,
    Card,
    Row,
    Col,
    Button,
    notification,
    Alert,
    Space,
    Tag,
    Tooltip
} from 'antd';
import type {MenuProps} from 'antd';
import {Link, Outlet, useLocation, useParams} from 'react-router-dom';
import {logoutFromApp} from "../../../types/user";
import {useStore} from "../../../state/storeHooks";
import './dashboard.css'
import moment from "moment";
import 'moment-timezone';

//pages
import View from "./BF/bf"
import PetX from "./PetX/petx";
import Page404 from "../404/404";
import Profile from "../Profile/profile";
import Bladeball from "./BladeBall/bladeball";

//img


const {Header, Sider, Content} = Layout;
const {Text} = Typography;
let tempCountNoti = 0

const Dashboard: React.FC = () => {

    const [apiNotification, contextHolder] = notification.useNotification();

    const [currentKey, setCurrentKey] = useState()

    let params = useParams()

    const {user} = useStore(({app}) => app);

    let { dateExpired, username } = user.unwrap()

    const whitelistAccounts = ["Hanei","k7ndz","huy8841"];

    //console.log(whitelistAccounts.find((element) => element == username))

    const dashboardItems: MenuProps['items'] = [
        {
            label: (
                <Link to="./">
                    <span>Dashboard</span>
                </Link>
            ),
            key: '',
        },
        {
            label: (
                <Link to="bloxfruit">
                    <span>Blox Fruits</span>
                </Link>
            ),
            key: 'bloxfruit',
        },
        {
            label: (
                <Link to="petx">
                    <span>Pet Simulator X</span>
                </Link>
            ),
            key: 'petx',
        },
    ]

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
                        <span>Account Panel</span>
                    ),
                    key: 'dashboard',
                    icon: <TableOutlined/>,
                    children: dashboardItems
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
        // Profile
        items.push({
            label: (
                <Link to="profile">
                    <span>Profile</span>
                </Link>
            ),
            key: 'profile',
            icon: <UserOutlined/>,
        });
        // Admin
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

        if (whitelistAccounts.find((element) => element == username) != undefined){
            dashboardItems.push({
                label: (
                    <Link to="bladeball">
                        <span>Blade Ball</span>
                    </Link>
                ),
                key: 'bladeball',
            },)
        }

    }


    let myPath = useLocation().pathname.replace('/', '');

    const [current, setCurrent] = useState(myPath);
    if(current.includes('dashboard')) {
        setCurrent(current.substring(10, current.length))
    }

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();


    useEffect(() => {
        if (moment().unix() - dateExpired > -604800 &&
            moment().unix() - dateExpired < 0
        ){
            if (tempCountNoti <= 1){
                setTimeout(() =>{
                    apiNotification.open({
                        message: 'Account',
                        description: <>
                            Your access is  expire
                                <Tooltip title={moment(dateExpired*1000).format('MMMM Do YYYY, h:mm:ss a')}>
                                    <Tag style={{marginLeft: 4}}>
                                        {moment(dateExpired*1000).fromNow()}
                                    </Tag>
                                </Tooltip>
                            </>,
                        duration: 10,
                        icon: <CloseCircleOutlined style={{color: '#ff4d4f'}}/>,
                    })
                },1000)
                tempCountNoti++;
            }
        }
        else if ( moment().unix() - dateExpired > 0) {
            logout()
        }
    })


    return (
        <>
            {contextHolder}
        <Layout style={{ minHeight: "100vh" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}
                   collapsedWidth="0"
                   style={{background: "rgb(24, 24, 24)", color: "white"}}>
                <div style={{textAlign: "center", padding: 12}}>
                    <Text strong={true} style={{padding: 6}}>CHIMOVO</Text>
                </div>

                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    onClick={onClick}
                    selectedKeys={[current]}
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
                        padding: 5,
                        background: colorBgContainer,
                    }}
                >
                    {
                        <Outlet />
                    }
                </Content>
                <Layout.Footer style={{textAlign: 'center'}}>Roblox Panel by PaulVoid and Hanei</Layout.Footer>

            </Layout>
        </Layout>
        </>
    );

};

export default Dashboard;

