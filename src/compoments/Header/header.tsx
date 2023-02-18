import {
    UserOutlined,
    LogoutOutlined,
    TableOutlined,
    ProfileOutlined, DashboardOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, message } from 'antd';
import React, {useState} from "react";
import {Link, Route, Routes, useLocation } from 'react-router-dom';
import {logoutFromApp} from "../../types/user";

//pages

import {Login} from "../Pages/Login/Login";
import {useStore} from "../../state/storeHooks";

const menu: MenuProps = {
    defaultSelectedKeys: ['1'],
    defaultOpenKeys: ['sub1'],
    mode: 'inline',
    theme: 'dark',
};



const Header: React.FC = () => {
    const { user } = useStore(({ app }) => app);
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
                    icon: <UserOutlined />,
                };
            },
            some: (user) => {
                return {
                    label: (
                        <Link to="/">
                            <span>Data</span>
                        </Link>
                    ),
                    key: '',
                    icon: <TableOutlined />,
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
        let { username } = user.unwrap();
        items.push({
            label: (
                <Link to="/profile">
                    <span>{username == 'TungStrong' ? 'TungBede' : username}</span>
                </Link>
            ),
            key: 'settings',
            icon: <ProfileOutlined /> ,
        });
        // admin
        if (user.unwrap().role === 'Admin') {
            items.push({
                label: (
                    <Link to="/dashboard">
                        <span>Dashboard</span>
                    </Link>
                ),
                key: 'dashboard',
                icon: <DashboardOutlined /> ,
            });
        }
        // đăng xuất
        items.push({
            label: (
                <span onClick={logout}>Logout</span>
            ),
            key: 'logout',
            icon: <LogoutOutlined />,
        });

    }


    let myPath = useLocation().pathname.replace('/','');

    const [current, setCurrent] = useState(myPath);

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return <Menu onClick={ onClick } selectedKeys={[current]} mode="horizontal" items={items} />;


};

export default Header;

