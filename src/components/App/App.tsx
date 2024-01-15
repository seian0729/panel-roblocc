import React from 'react';
import {Alert, ConfigProvider, Layout, MenuProps, message, Row, Spin, Tag, theme, Tooltip} from 'antd';
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

//Dashboard
import Dashboard from "../Pages/Dashboard/dashboard"

//Admin
import Admin from "../Pages/Admin/admin"
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
            <Row justify="center" align={"middle"}>

                <Spin size="large"/>

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

    const cookList = ['phuoc123123','hai123123']

    let username = ""

    if (user.isSome()) {
        username = user.unwrap().username
    }


    return (
        <ConfigProvider theme={themeConfig}>
            <Alert
                message={"I'll maintenance this website on 00:00 - 1/21/24 for update some features, it's take 3-5 hours or longer"}
                type="info"
                banner={true}/>
            <Layout style={{minHeight: "100vh"}}>

                {
                    userIsLogged === true && window.location.pathname != '/' ?
                        "" : <LandingHeader/>

                }


                <Layout.Content>

                    <Routes>
                        <Route path="/" element={<Landing/>}/>
                        <Route element={<UserOnlyRoute userIsLogged={userIsLogged}/>}>
                            <Route path="dashboard">
                                <Route index element={<Dashboard/>}/>
                                <Route path={":dashboardName"} element={<Dashboard/>}/>
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