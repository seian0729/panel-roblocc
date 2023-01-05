import React, { useState } from 'react';
import { Col, Row, ConfigProvider } from 'antd';
import {HashRouter, Link, Navigate , Route, RouteProps, Routes, useLocation} from 'react-router-dom';

import Header from "../Header/header";
import './App.css';

import Home from "../Pages/Home/home";
import Login from "../Pages/Login/Login";
import View from "../Pages/View/view";
import {useStoreWithInitializer} from "../../state/storeHooks";
import { endLoad, loadUser } from './App.slice';
import { store } from '../../state/store';
import axios from "axios";
import {getUser} from "../../services/data";

function App() {
    const { loading, user } = useStoreWithInitializer(({ app }) => app, load);

    return (
    <div className="App">
        <Row>
            <Col span={24}>
                <Header />
            </Col>
        </Row>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Login />} />
            <Route path="/data" element={<View />} />
            <Route path="*" element={<h1>404</h1>} />
        </Routes>

    </div>
  );
}

async function load() {
    const token = localStorage.getItem('token');
    if (!store.getState().app.loading || !token) {
        store.dispatch(endLoad());
        return;
    }
    axios.defaults.headers.Authorization = `Token ${token}`;


    try {
        store.dispatch(loadUser(await getUser()));
    } catch {
        store.dispatch(endLoad());
    }
}

function GuestOnlyRoute({
                            children,
                            userIsLogged,
                            ...rest
                        }: { children: JSX.Element | JSX.Element[]; userIsLogged: boolean } & RouteProps) {
    return (
        <Route {...rest}>
            {children}
            {userIsLogged && <Navigate  to='/' />}
        </Route>
    );
}

/* istanbul ignore next */
function UserOnlyRoute({
                           children,
                           userIsLogged,
                           ...rest
                       }: { children: JSX.Element | JSX.Element[]; userIsLogged: boolean } & RouteProps) {
    return (
        <Route {...rest}>
            {children}
            {!userIsLogged && <Navigate  to='/' />}
        </Route>
    );
}
export default App;
