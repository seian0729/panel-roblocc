import { Col, Row, Divider, Empty,Table } from 'antd';
import React from "react";


function loginCompoment()
{

    const columns = [
        {
            title: 'RUsername',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Fighting Style',
            dataIndex: 'fightingStyle',
            key: 'fightingStyle',
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            width: '5%',
            sorter: (a: { level: number; }, b: { level: number; }) => a.level - b.level,
        },
        {
            title: 'DF',
            dataIndex: 'df',
            key: 'df',
        }
        ];

    const data = [
        {
            key: '1',
            username: 'John Brown',
            fightingStyle: 'MMA',
            level: 32,
            df: "Chưa có",
        },
        {
            key: '2',
            username: 'Jim Green',
            fightingStyle: 'MMA',
            level: 42,
            df: "Chưa có",
        }];

    return (
        <>
            <Row>
                <Col span={24}>
                    <Divider orientation="left">Roblocc Panel - Blox Fruit</Divider>
                    <Table columns={columns} dataSource={data} />
                </Col>
            </Row>

        </>
    )

}

export default  loginCompoment