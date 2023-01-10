import { Col, Row, Divider, Button, Empty, message, Table, Tag } from 'antd';
import React, { useState } from "react";
import type { ColumnsType } from 'antd/es/table';
import {array, string} from "decoders";
import {count, countBy, forEach} from "ramda";


function DataCompoment()
{

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [loading, setLoading] = useState(false);

    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            messageApi.success(`Đã xóa thành công: ${selectedRowKeys.length} tài khoản !`);
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    interface DataType {
        key: React.Key;
        username: string;
        level: number;
        df: string;
        awaken: string[];
        special: string[];
        fightingStyle: string[];
        note: string;
    }

    let fstext = '';
    let fscolor = '';

    const columns: ColumnsType<DataType> = [
        {
            title: 'RUsername',
            dataIndex: 'username',
            width: 200,
        },
        {
            title: 'Fighting Style',
            dataIndex: 'fightingStyle',
            width: 200,
            filters: [
                {
                    text: 'Superhuman',
                    value: 'Superhuman',
                },
                {
                    text: 'Death Step',
                    value: 'DeathStep',
                },
                {
                    text: 'Sharkman Karate',
                    value: 'SharkmanKarate',

                },
                {
                    text: 'Electric Claw',
                    value: 'ElectricClaw',
                },
                {
                    text: 'Dragon Talon',
                    value: 'DragonTalon',
                },
                {
                    text: 'Godhuman',
                    value: 'Godhuman',

                },
                ],
            onFilter: (value: any, record: { fightingStyle: string[]; }) => record.fightingStyle.includes(value),
            sorter: (a: { fightingStyle: string[]; }, b: { fightingStyle: string[]; }) => a.fightingStyle.length - b.fightingStyle.length,
            render: (_, { fightingStyle }  ) => (
                <>
                    {fightingStyle.map((fs) => {
                        if (fightingStyle.length == 6) {
                            fstext = 'Godhuman';
                            fscolor = 'blue';
                        }
                        else if (fightingStyle.length > 2){
                            fstext = '3-5 Melee';
                            fscolor = 'volcano';
                        }

                    })}
                    <Tag color={fscolor}>{fstext}</Tag>
                </>
            ),

        },
        {
            title: 'Level',
            dataIndex: 'level',
            width: '5%',
            sorter: (a: { level: number; }, b: { level: number; }) => a.level - b.level,
        },
        {
            title: 'DF',
            dataIndex: 'df',
            width: '5%',
        },
        {
            title: 'Awakened Abilities ',
            dataIndex: 'awaken',
            width: '7%',
            sorter: (a: { awaken: string[]; }, b: { awaken: string[]; }) => a.awaken.length - b.awaken.length,
            render: (_, { awaken }  ) => (
                <>
                    {awaken.map((key) => {
                        return (
                            <Tag color="green" key={key}>
                                {key}
                            </Tag>
                        );
                    })}
                </>
            )

        },
        {
            title: 'Special',
            dataIndex: 'special',
            filters: [
                {
                    text: 'Dough',
                    value: 'Dough',
                },
                {
                    text: 'Leopard',
                    value: 'Leopard',
                },
                {
                    text: 'Cursed Dual Katana',
                    value: 'Cursed Dual Katana',
                },
                {
                    text: 'Soul Guitar',
                    value: 'Soul Guitar',
                }
            ],
            onFilter: (value: any, record: { special: string[]; }) => record.special.includes(value),
            sorter: (a: { special: string[]; }, b: { special: string[]; }) => a.special.length - b.special.length,
            render: (_, { special }  ) => (
                <>
                    {special.map((key) => {
                        return (
                            <Tag color="red" style={{marginBottom:5, marginTop:5}}>
                                {key}
                            </Tag>
                        );
                    })}
                </>
            )
        },
        {
            title: 'Note',
            dataIndex: 'note',
            width: '10%',
            filters: [
                // Render note từ database B)
                {
                    text: 'cac',
                    value: 'cac',
                } // Example
            ],
            onFilter: (value: any, record: { note: string; }) => record.note.includes(value),
        }
        ];

    const data = [
        {
            key: 1,
            username: 'John Brown',
            fightingStyle: ['Superhuman','DeathStep','SharkmanKarate','ElectricClaw','DragonTalon'],
            level: 32,
            df: "Chưa có",
            awaken: ['Z','X'],
            special: [],
            note: 'Chưa có',
        },
        {
            key: 2,
            username: 'John Brown',
            fightingStyle: ['Superhuman','DeathStep','SharkmanKarate','ElectricClaw','DragonTalon','Godhuman'],
            level: 2450,
            df: "Chưa có",
            awaken:  ['Z','X','C','V'],
            special: ['Dough','Leopard','Cursed Dual Katana'],
            note: 'cac',
        },
    ]

    return (
        <div>
            {contextHolder}
            <Row>
                <Col span={24}>
                    <Divider orientation="left">Roblocc Panel - Blox Fruit</Divider>
                    <div style={{ marginBottom: 16 }}>
                        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading} danger>
                            Xóa tài khoản đã chọn
                        </Button>
                        <span style={{ marginLeft: 8 }}>
                          {hasSelected ? `Đã chọn ${selectedRowKeys.length} tài khoản` : ''}
                        </span>
                    </div>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
                </Col>
            </Row>

        </div>
    )

}

export default  DataCompoment