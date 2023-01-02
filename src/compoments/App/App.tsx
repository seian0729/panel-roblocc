import React, { useState } from 'react';
import { Col, Row, Menu } from 'antd';
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom';

import Header from "../Header/header";
import './App.css';

import Home from "../Pages/Home/home";
import Login from "../Pages/Login/login";
import View from "../Pages/View/view";

function App() {
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

export default App;
