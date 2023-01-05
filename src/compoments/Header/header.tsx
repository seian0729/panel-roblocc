import { AppstoreOutlined, UserOutlined, HomeOutlined, TableOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React, {useState} from "react";
import {Link, Route, Routes, useLocation } from 'react-router-dom';

//pages

import Login from "../Pages/Login/Login";

const menu: MenuProps = {
    defaultSelectedKeys: ['1'],
    defaultOpenKeys: ['sub1'],
    mode: 'inline',
    theme: 'dark',
};

const items: MenuProps['items'] = [
    {
        label: (
            <Link to="">
                <span>Trang chủ</span>
            </Link>
        ),
        key: '',
        icon: <HomeOutlined />,
    },
    {
        label: (
            <Link to="/account">
                <span>Tài khoản</span>
            </Link>
        ),
        key: 'account',
        icon: <UserOutlined />,
    },
    {
        label: (
            <Link to="/data">
                <span>Dữ Liệu</span>
            </Link>
        ),
        key: 'data',
        icon: <TableOutlined />,
    },
];

const Header: React.FC = () => {

    let myPath = useLocation().pathname.replace('/','');

    const [current, setCurrent] = useState(myPath);

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return <Menu onClick={ onClick } selectedKeys={[current]} mode="horizontal" items={items} />;


};

export default Header;

