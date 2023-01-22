import React from 'react';
import {Col, Row, Spin} from 'antd';
import {Navigate, Route, RouteProps, Routes,Outlet} from 'react-router-dom';

import Header from "../Header/header";
import './App.css';

import {useStore, useStoreWithInitializer} from "../../state/storeHooks";
import {endLoad, loadUser} from './App.slice';
import {store} from '../../state/store';
import axios from "axios";
import {getUser} from "../../services/data";
import {userDecoder} from "../../types/user";

//Pages

import {Login} from "../Pages/Login/Login";
import View from "../Pages/View/view";
import Profile from "../Pages/Profile/Profile";

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
        <div className="App">
            <Row>
                <Col span={24}>
                    <Header/>
                </Col>
            </Row>
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

                <Route path="*" element={<h1>404</h1>}/>
            </Routes>

        </div>
    );
}

async function load() {
    const token = localStorage.getItem('token');
    console.log(token);
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
