import React, {useEffect, useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    TableOutlined,
    CloseCircleOutlined,
    HistoryOutlined,
    FileOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    theme,
    Typography,
    message,
    notification,
    Tag,
    Tooltip, 
    Modal,
    Row,
    Col,
    Button
} from 'antd';
import type {MenuProps} from 'antd';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {logoutFromApp} from "../../../types/user";
import {useStore} from "../../../state/storeHooks";
import './dashboard.css'
import moment from "moment";
import 'moment-timezone';
import {getUnpaidInvoice} from "../../../services/data";
type MenuItem = Required<MenuProps>['items'][number];


const {Header, Sider, Content} = Layout;
const {Text} = Typography;

const DashboardLayout: React.FC = () => {

    let navigate = useNavigate();

    const [modal, contextHolderModal] = Modal.useModal();

    const [apiNotification, contextHolder] = notification.useNotification();

    const {user} = useStore(({app}) => app);

    let { dateExpired, username } = user.unwrap()

    const [unpaidInvoice, setUnpaidInvoice] = useState([]);

    const {access} = user.unwrap();

    const decodeAccess = JSON.parse(access);

    const [countNoti, setCountNoti] = useState(0);

    const [isHover, setIsHover] = useState(false);

    const checkAccess = (accessVal: string) => {
        return decodeAccess.find((element: any) => element == accessVal) != undefined
    }

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
    ]

    if (checkAccess("bgsi")){
        dashboardItems.push(getItem(
            'Bubble Gum Sim Inf',
            'bgsi',
            null,
            [getItem((
                <Link to={"bubble-gum-simulator-infinity/tracking"}>
                    Tracking
                </Link>
            ),"bubble-gum-simulator-infinity/tracking")],
            'group')
        )
    }


    // console user in user
    const itemsMenu: MenuProps['items'] = [
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

    const itemsUser: MenuProps['items'] = [
        getItem((
            <Link to="user/script">
                <span>Script</span>
            </Link>
        ),"user/script", <FileOutlined />),
        getItem((
            <Button icon={<UserOutlined/>}>
                {username}
            </Button>
        ),"sida",null,[
            getItem((
                <Link to="user/profile">
                    <span>Profile</span>
                </Link>
            ),"user/profile", <UserOutlined/>),
            getItem((
                <Link to="user/transactions">
                    <span>Transactions</span>
                </Link>
            ),"user/transactions", <HistoryOutlined/>),
            getItem((<span onClick={logout}>Logout</span>), "logout", <LogoutOutlined/>)
        ]),
        
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

        dashboardItems.push(getItem(
            'Blox Fruit',
            'bloxfruit',
            null,
            [
                getItem((<Link to="../../dashboard/blox-fruit/tracking">
                    <span>Tracking</span>
                </Link>), 'blox-fruit/tracking'),
            ]
        ,
        'group'))

        if (checkAccess("pet99")){
            dashboardItems.push(getItem(
                'Pet Simulator 99',
                'pet99',
                null,
                pet99Child,
                'group')
            )
        }

        if (checkAccess("ttd")){
            dashboardItems.push(getItem(
                'Toilet Tower Defense',
                'ttd',
                null,
                [getItem((
                    <Link to={"toilet-tower-defense/tracking"}>
                        Tracking
                    </Link>
                ),"toilet-tower-defense/tracking")],
                'group')
            )
        }

        if (checkAccess("ad")){
            dashboardItems.push(getItem(
                'Anime Defender',
                'ad',
                null,
                [getItem((
                    <Link to={"anime-defender/tracking"}>
                        Tracking
                    </Link>
                ),"anime-defender/tracking")],
                'group')
            )
        }

        if (checkAccess("av")){
            dashboardItems.push(getItem(
                'Anime Valorant',
                'av',
                null,
                [getItem((
                    <Link to={"anime-valorant/tracking"}>
                        Tracking
                    </Link>
                ),"anime-valorant/tracking")],
                'group')
            )
        }

        if (checkAccess('pet-go')){
            dashboardItems.push(getItem(
                'Pet Go',
                'pet-go',
                null,
                [getItem((
                    <Link to={"pet-go/tracking"}>
                        Tracking
                    </Link>
                ),"pet-go/tracking"),],
                'group')
            )
        }

        if (checkAccess('fisch')){
            dashboardItems.push(getItem(
                'Fisch',
                'fisch',
                null,
                [getItem((
                    <Link to={"fisch/tracking"}>
                        Tracking
                    </Link>
                ),"fisch/tracking"),
                    getItem((
                        <Link to={"fisch/completed-account"}>
                            Completed
                        </Link>
                    ),"fisch/completed-account")
                ],
                'group')
            )
        }
        if (checkAccess('kl')){
            dashboardItems.push(getItem(
                'Vua di sản',
                'vua-di-san',
                null,
                [getItem((
                    <Link to={"vua-di-san/tracking"}>
                        Tracking
                    </Link>
                ),"vua-di-san/tracking")],
                'group')
            )
        }

    }

    dashboardItems.push(getItem((<Link to="../../dashboard/petx">
        <span>Pet Simulator X</span>
    </Link>), 'petx'))


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

    const handleMouseEnter = () => {
        setIsHover(true);
    };

    const handleMouseLeave = () => {
        setIsHover(false);
    };

    const siderStyle: React.CSSProperties = {
        overflow: isHover ? 'auto' : 'hidden',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        background: "rgb(24, 24, 24)", 
        color: "white",
    };


    useEffect(() => {
        if (moment().unix() - dateExpired > -604800 &&
            moment().unix() - dateExpired < 0
        ){
            setTimeout(() =>{
                apiNotification.open({
                    message: 'Account',
                    description: <>
                        Your access is expires
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
        }
        else if (moment().unix() - dateExpired > 0) {
            logout()
        }
    })

    useEffect(() => {
        getUnpaidInvoice().then((res) => {
            setUnpaidInvoice(res.data)
        })
    },[])

    {
        if (unpaidInvoice.length > 0 && countNoti == 0) {
            setCountNoti(1)
            modal.warning({
                title:'User have an unpaid invoice',
                content:"You have an unpaid invoice. Pay it now or i'll remove your access (after 3 days GL)",
                onOk: () => {
                    navigate('user/transactions', { replace: true });
                }
            })
        }
    }

    return (
        <>
            {contextHolderModal}
            {contextHolder}

            <Layout style={{ minHeight: "100vh" }}>
            <Sider trigger={null} collapsible collapsed={collapsed}
                   collapsedWidth="0"
                   style={siderStyle}
                   onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                   >
                <div style={{textAlign: "center", padding: 12}}>
                    <Text strong={true} style={{padding: 6}}>CHIMOVO</Text>
                </div>

                <Menu
                    mode="inline"
                    defaultOpenKeys={['dashboard']}
                    onClick={onClick}
                    selectedKeys={[current]}
                    items={itemsMenu}
                />
            </Sider>

            <Layout className="site-layout">
                <Header style={{paddingLeft:0, paddingRight: 12, background: colorBgContainer}}>
                    
                    <Row justify={"space-between"}>
                        <Col>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </Col>
                        <Col>
                            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={itemsUser} />
                        </Col>
                    </Row>
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

