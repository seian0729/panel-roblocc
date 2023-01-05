import React, { useState } from 'react';
import { Col, Row, ConfigProvider } from 'antd';
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom';

import Header from "../Header/header";
import './App.css';

import Home from "../Pages/Home/home";
import Login from "../Pages/Login/Login";
import View from "../Pages/View/view";
import {useStoreWithInitializer} from "../../state/storeHooks";
import { endLoad, loadUser } from './App.slice';
import { store } from '../../state/store';
import axios from "axios";

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

    } catch {
        store.dispatch(endLoad());
    }
}

export default App;
