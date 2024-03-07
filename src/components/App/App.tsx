import React from 'react';
import {Alert, ConfigProvider, Layout, MenuProps, message, Row, Spin, theme} from 'antd';
import {Link, Navigate, Outlet, Route, RouteProps, Routes} from 'react-router-dom';

import './App.css';

import {useStoreWithInitializer} from "../../state/storeHooks";
import {endLoad, loadUser} from './App.slice';
import {store} from '../../state/store';
import axios from "axios";
import {getUser} from "../../services/data";
import {logoutFromApp} from "../../types/user";
import 'moment-timezone';

//Pages
import {Login} from "../Pages/Login/Login";
import Page404 from "../Pages/404/404"
import Maintenance from "../Pages/Maintenance/Maintenance";

//DashboardLayout
import DashboardLayout from "../Pages/Dashboard/dashboardLayout"
import DashboardIndex from "../Pages/Dashboard/dashboardIndex";
import BloxFruit from "../Pages/Dashboard/BloxFruit/BloxFruit";
import PetX from "../Pages/Dashboard/PetX/petx";
import Profile from "../Pages/Dashboard/Profile/profile";
import Pet99 from "../Pages/Dashboard/Pet99/Pet99"
import Pet99Mail from "../Pages/Dashboard/Pet99/Pet99-mail";
import ProfileScript from "../Pages/Dashboard/Profile/profile-script";

//Admin
import Admin from "../Pages/Admin/admin"
//Transactions
import Transactions from "../Pages/Dashboard/Transactions/Transactions";
//LandingPage
import Landing from "../Pages/Lading/landing";
import LandingHeader from "../Pages/Lading/headerLanding";
import {DashboardOutlined, LogoutOutlined, ProfileOutlined, TableOutlined, UserOutlined,} from "@ant-design/icons";
import Register from "../Pages/Register/register";
import moment from "moment/moment";


//Theme ne
const tokenTheme = {
    "colorPrimary": "#83b5ff",
    colorBgBase: "#040404",
    colorTextBase: "#f6e9e9",
    wireframe: true,
};

const algorithmTheme = theme.darkAlgorithm;

const themeConfig = {
    token: tokenTheme,
    algorithm: algorithmTheme,
};


function App() {
    const {loading, user} = useStoreWithInitializer(({app}) => app, load);

    const userIsLogged = user.isSome();

    const isAdmin = user.match({
        none: () => false,
        some: (user) => user.role === 'Admin'
    });

    if (loading) {
        return (
            <Row justify="center" style={{display: "flex", alignItems: "center", justifyContent:"center", minHeight:"calc(100vh - 100px)"}}>
                <Spin size={"large"}>
                </Spin>
            </Row>
        )
    }

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
            some: (user) => {
                return {
                    label: (
                        <Link to="/dashboard">
                            <span>Dashboard</span>
                        </Link>
                    ),
                    key: 'dashboard',
                    icon: <TableOutlined/>,
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
        items.push({
            label: (
                <Link to="/profile">
                    <span>{user.unwrap().username}</span>
                </Link>
            ),
            key: 'profile',
            icon: <ProfileOutlined/>,
        });
        // admin
        if (user.unwrap().role === 'Admin') {
            items.push({
                label: (
                    <Link to="/admin">
                        <span>Admin</span>
                    </Link>
                ),
                key: 'admin',
                icon: <DashboardOutlined/>,
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

    let username = ""

    if (user.isSome()) {
        username = user.unwrap().username
    }

    const whitelistPet99 = [
        "Hanei","Vanhxyz","tunakhanhv3","luciusdepzai","tvk1308","k7ndz", "huy8841","leminh","hau1", "Manke"
    ]


    return (
        <ConfigProvider theme={themeConfig}>
            <Layout style={{minHeight: "100vh"}}>

                <Alert type={"error"} message={"MAI WEB CÒN SẬP NỮA THÌ T ĐÓNG WEB LUÔN, CHÔN VI-EN [TỐI MAI HOẶC MỐT NẾU WEB CÓ TÌNH TRẠNG CHẬP CHỜN SẬP LÊN SẬP XUỐNG THÌ T SẼ NÂNG CẤP SERVER, THỜI GIAN BẢO TRÌ BÁO SAU]"} showIcon banner/>

                {
                    userIsLogged && window.location.pathname != '/' ?
                        "" : <LandingHeader/>

                }


                <Layout.Content>

                    <Routes>
                        <Route path="/" element={<Landing/>}/>
                        <Route element={<UserOnlyRoute userIsLogged={userIsLogged}/>}>

                            <Route path="dashboard" element={<DashboardLayout/>}>
                                <Route index element={<DashboardIndex/>}/>
                                <Route path={"bloxfruit"} element={<BloxFruit/>}/>
                                <Route path={"petx"} element={<PetX/>}/>
                                <Route path={"pet99"} element={<UserPet99OnlyRoute userIsWhitelisted={whitelistPet99.find((element) => element == username) != undefined}/>}>
                                    <Route index element={<Page404/>}/>
                                    <Route path="tracking" element={<Maintenance/>}/>
                                    <Route path="mail" element={<Maintenance/>} />
                                </Route>
                                <Route path={"user"}>
                                    <Route index element={<Page404/>}/>
                                    <Route path={"profile"} element={<Profile/>}/>
                                    <Route path={"script"} element={<ProfileScript/>}/>
                                    <Route path={"transactions"} element={<Transactions/>}/>
                                </Route>
                                <Route path={"*"} element={<Page404/>}/>
                            </Route>

                        </Route>
                        <Route element={<GuestOnlyRoute userIsLogged={userIsLogged}/>}>
                            <Route path="/login" element={<Login/>}/>
                        </Route>
                        <Route element={<GuestOnlyRoute userIsLogged={userIsLogged}/>}>
                            <Route path="/register" element={<Register/>}/>
                        </Route>
                        <Route element={<AdminOnlyRoute userIsLogged={userIsLogged} isAdmin={isAdmin}/>}>
                            <Route path="admin">
                                <Route index element={<Admin/>}/>
                                <Route path="*" element={<Page404/>}/>
                            </Route>
                        </Route>
                        <Route path="*" element={<Page404/>}/>
                    </Routes>

                </Layout.Content>
            </Layout>


        </ConfigProvider>
    );
}



async function load() {
    const token = localStorage.getItem('token');
    if (!store.getState().app.loading || !token) {
        store.dispatch(endLoad());
        return;
    }
    axios.defaults.headers.Authorization = `Bearer ${token}`;

    try {
        store.dispatch(loadUser(await getUser()));
    } catch {
        store.dispatch(endLoad());
    }
}

function UserOnlyRoute({
       userIsLogged
   }: { userIsLogged: boolean } & RouteProps) {
    if (!userIsLogged) {
        return <Navigate to="/login"/>;
    }
    return <Outlet/>
}

function UserPet99OnlyRoute({
       userIsWhitelisted
   }: { userIsWhitelisted: boolean } & RouteProps) {
    if (!userIsWhitelisted) {
        return <Page404/>
    }
    return <Outlet/>
}
function GuestOnlyRoute({
        userIsLogged
    }: { userIsLogged: boolean } & RouteProps) {
    if (userIsLogged) {
        return <Navigate to="/"/>;
    }
    return <Outlet/>
}

// admin only route
function AdminOnlyRoute({
        userIsLogged,
        isAdmin
    }: { userIsLogged: boolean, isAdmin: boolean } & RouteProps) {
    if (!userIsLogged || !isAdmin) {
        return <Navigate to="/"/>;

    }
    return <Outlet/>
}

export default App;