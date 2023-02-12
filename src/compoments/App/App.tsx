import React from 'react';
import {Layout, Row, Spin, theme} from 'antd';
import {Navigate, Route, RouteProps, Routes,Outlet} from 'react-router-dom';

import Header from "../Header/header";
import './App.css';

import {useStore, useStoreWithInitializer} from "../../state/storeHooks";
import {endLoad, loadUser} from './App.slice';
import {store} from '../../state/store';
import axios from "axios";
import {getUser} from "../../services/data";
import {userDecoder} from "../../types/user";
import {ConfigProvider} from "antd";

//Pages

import {Login} from "../Pages/Login/Login";
import View from "../Pages/View/view";
import Profile from "../Pages/Profile/Profile";
import Page404 from "../Pages/404/404"

//Dashboard
import Dashboard from "../Pages/Dashboard/dashboard"
import Users from "../Pages/Dashboard/users/users"
import AddUser from "../Pages/Dashboard/users/addUser";
import EditUser from "../Pages/Dashboard/users/editUser";

function App() {
    const {loading, user} = useStoreWithInitializer(({app}) => app, load);

    const userIsLogged = user.isSome();

    if (loading) {
        return (
                <Row justify="center" align={"middle"}>

                        <Spin size="large"/>

                </Row>

        )
    }

    return (

        <ConfigProvider theme={{
            "token": {
                "colorPrimary": "#e16428",
                "colorBgBase": "#040404",
                "colorTextBase": "#f6e9e9",
                "wireframe": true,
              },
            algorithm: theme.darkAlgorithm,
        }}>
            <Layout style={{height:"100vh"}}>

                <Layout.Header style={{background:"#181818"}}>
                    <Header/>
                </Layout.Header>

                <Layout.Content >

                <Routes >
                    <Route element={<UserOnlyRoute userIsLogged={userIsLogged}/>}>
                        <Route path="/" element={<View/>}/>
                    </Route>
                    <Route element={<GuestOnlyRoute userIsLogged={userIsLogged}/>}>
                        <Route path="/login" element={<Login/>}/>
                    </Route>
                    <Route element={<UserOnlyRoute userIsLogged={userIsLogged}/>}>
                        <Route path="/profile" element={<Profile />}/>
                    </Route>
                    <Route element={<UserOnlyRoute userIsLogged={userIsLogged}/>}>
                        <Route path="dashboard">
                            <Route index element={<Dashboard />}/>
                            <Route path="users" element={<Users />} />
                            <Route path="add-user" element={<AddUser />} />
                            <Route path="edit-user">
                                <Route index element={<EditUser />}/>
                                <Route path=":id" element={<EditUser />}/>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<Page404 />}/>
                </Routes>
                </Layout.Content>

                <Layout.Footer style={{textAlign: 'center'}}>Rô Bờ lóc by PaulVoid and Ailaichum</Layout.Footer>


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
    return <Outlet />
}
function GuestOnlyRoute({
    userIsLogged
}: { userIsLogged: boolean } & RouteProps) {
    if (userIsLogged) {
        return <Navigate to="/"/>;
    }
    return <Outlet />
}

export default App;
