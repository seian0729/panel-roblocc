import React, {useEffect, useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    TableOutlined,
    DashboardOutlined, CloseCircleOutlined, HistoryOutlined, HomeOutlined, FileOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    theme,
    Typography,
    message,
    notification,
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
type MenuItem = Required<MenuProps>['items'][number];


const {Header, Sider, Content} = Layout;
const {Text} = Typography;
let tempCountNoti = 0

const DashboardLayout: React.FC = () => {

    const [apiNotification, contextHolder] = notification.useNotification();

    const [currentKey, setCurrentKey] = useState()

    let params = useParams()

    const {user} = useStore(({app}) => app);

    let { dateExpired, username } = user.unwrap()

    const whitelistAccounts = ["Hanei","k7ndz","huy8841"];

    const whitelistAccountsPet = ["Hanei","Vanhxyz","tunakhanhv3","luciusdepzai","tvk1308","k7ndz"];

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[],
        type?: 'group',
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
            type,
        } as MenuItem;
    }

    /*
    const dashboardItems: MenuProps['items'] = [
        {
            label: (
                <Link to="../../dashboard">
                    <span>DashboardLayout</span>
                </Link>
            ),
            key: '',
        },
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
            key: 'petx',
        },
    ]
    */

    const dashboardItems = [
        getItem((<Link to="../../dashboard">
            <span>Dashboard</span>
        </Link>), ''),
        getItem((<Link to="../../dashboard/bloxfruit">
            <span>Blox Fruits</span>
        </Link>), 'bloxfruit'),
        getItem((<Link to="../../dashboard/petx">
            <span>Pet Simulator X</span>
        </Link>), 'petx'),
    ]


    // console user in user
    const items: MenuProps['items'] = [
        user.match({
            none: () => {
                return getItem((<Link to="/login">
                        <span>Login</span>
                    </Link>),
                    "login",
                    <UserOutlined/>)
            },
            some: () => {
                return getItem((<span>Dashboard</span>),
                    "dashboard",
                    <TableOutlined/>,
                    dashboardItems)

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
        /*
        items.push({
            label: (
                <Link to="../../dashboard/profile">
                    <span>Profile</span>
                </Link>
            ),
            key: 'profile',
            icon: <UserOutlined/>,
        });

        items.push({
            label: (
                <Link to="../../dashboard/transactions">
                    <span>Transactions</span>
                </Link>
            ),
            key: 'transactions',
            icon: <HistoryOutlined/>,
        });

         */

        // Admin
        if (user.unwrap().role === 'Admin') {
            /*
            items.push({
                label: (
                    "Admin"
                ),
                key: 'admin',
                icon: <DashboardOutlined/>,
                disabled: true
            });
             */
            /*
            items.push(getItem("Admin",
                "admin",
                <DashboardOutlined/>,

            ))
             */
        }
        // đăng xuất
        /*
        items.push({
            label: (
                <span onClick={logout}>Logout</span>
            ),
            key: 'logout',
            icon: <LogoutOutlined/>,
        });

         */


        /*
        if (whitelistAccounts.find((element) => element == username) != undefined){
            dashboardItems.push({
                label: (
                    <Link to="../../dashboard/bladeball">
                        <span>Blade Ball</span>
                    </Link>
                ),
                key: 'bladeball',
            },)
        }
         */

        const pet99Child = [
            getItem((
                <Link to={"pet99/tracking"}>
                    Tracking
                </Link>
            ),"pet99/tracking"),
            getItem((
                <Link to={"pet99/mail"}>
                    Mail Box
                </Link>
            ),"pet99/mail"),
        ]

        if (whitelistAccountsPet.find((element) => element == username) != undefined){
            dashboardItems.push(getItem(
                'Pet Simulator 99',
                'pet99',
                null,
                pet99Child,
                'group')
            )
        }

    }

    dashboardItems.push(getItem(
        'User',
        'profile',
        null,
        [
            getItem((
                <Link to="user/profile">
                    <span>Profile</span>
                </Link>
            ),"user/profile", <UserOutlined/>),
            getItem((
                <Link to="user/script">
                    <span>Script</span>
                </Link>
            ),"user/script", <FileOutlined />),
            getItem((
                <Link to="user/transactions">
                    <span>Transactions</span>
                </Link>
            ),"user/transactions", <HistoryOutlined/>),
            getItem((<span onClick={logout}>Logout</span>), "logout", <LogoutOutlined/>)
        ],
        'group')
    )



    let myPath = useLocation().pathname.replace('/', '');

    const [current, setCurrent] = useState(myPath);
    if(current.includes('dashboard')) {
        setCurrent(current.substring(10, current.length))
    }

    //console.log(current)

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
        else if (moment().unix() - dateExpired > 0) {
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
                    defaultOpenKeys={['dashboard']}
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
                    <Outlet/>
                </Content>
                <Layout.Footer style={{textAlign: 'center'}}>Roblox Panel by PaulVoid and Hanei</Layout.Footer>

            </Layout>
        </Layout>
        </>
    );

};

export default DashboardLayout;

