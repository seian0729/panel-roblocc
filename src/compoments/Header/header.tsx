import { AppstoreOutlined, UserOutlined, HomeOutlined,LogoutOutlined, TableOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
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
        user.match({
            none: () => {
                return {
                    label: (
                        <Link to="/login">
                            <span>Đăng nhập</span>
                        </Link>
                    ),
                    key: 'login',
                    icon: <UserOutlined />,
                };
            },
            some: (user) => {
                return {
                    label: (
                        <Link to="/data">
                            <span>Dữ liệu</span>
                        </Link>
                    ),
                    key: 'data',
                    icon: <TableOutlined />,
                };

            }
        })

    ];
    // logout button
    function logout() {
        logoutFromApp();
    }

    if (user.isSome()) {
        items.push({
            label: (
                <Link to="/settings">
                    <span>Cài đặt</span>
                </Link>
            ),
            key: 'settings',
            icon: <SettingOutlined />,
        });
        // đăng xuất
        items.push({
            label: (

                    <span onClick={logout}>Đăng xuất</span>

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

