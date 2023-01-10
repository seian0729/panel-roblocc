import { Col, Row, Divider, Button, Empty, message, Table, Tag, Space } from 'antd';
import React, {useEffect, useState} from "react";
import type { ColumnsType } from 'antd/es/table';
import {getData} from "../../../services/data";
import {array, string} from "decoders";
import {count, countBy, forEach} from "ramda";

function DataCompoment()
{

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [loading, setLoading] = useState(false);

    const [dataApi, setDataApi] = useState([]);


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
        UID: number;
        username: string;
        level: number;
        df: string;
        awakened: string[];
        special: string[];
        fightingStyle: string[];
        note: string;
        Description: string;
    }

    let fstext = '';
    let fscolor = '';

    const columns: ColumnsType<DataType> = [
        {
            title: 'RUsername',
            dataIndex: 'UsernameRoblocc',
            width: 200,
        },
        {
            title: 'Level',
            render: (_, record) => {
                let description = JSON.parse(record.Description);

                return (
                    <div>{description.Data.Level}</div>
                )
            }
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
            sorter: (a: { fightingStyle: string[]; }, b: { fightingStyle: string[]; }) => a.fightingStyle.length - b.fightingStyle.length,
            render: (_, record ) =>{
                let description = JSON.parse(record.Description);
                let fightingStyle = description['Fighting Style'];
                return (
                    <>
                        {fightingStyle.map(() => {
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
             )
            },

        },

        {
            title: 'DF',
            dataIndex: 'df',
            width: '5%',
            render: (_, record) => {
                let description = JSON.parse(record.Description);

                return (
                    <div>{description.Data.DevilFruit}</div>
                )

            }
        },
        {
            title: 'Awakened Abilities ',
            dataIndex: 'awakened',
            width: '7%',
            sorter: (a: { awakened: string[]; }, b: { awakened: string[]; }) => a.awakened.length - b.awakened.length,
            render: (_, record   ) => {
                let description = JSON.parse(record.Description);
                let awakened = description['Awakened Abilities'];
                return (
                    <>
                        {awakened.map((key : any) => {
                            return (
                                <Tag color="green" key={key}>
                                    {key}
                                </Tag>
                            );
                        })}
                    </>

                )
            }

        },
        /*
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
        }*/
        ];

    const data = [
        {
            key: 1,
            username: 'John Brown',
            fightingStyle: ['Superhuman','DeathStep','SharkmanKarate','ElectricClaw','DragonTalon'],
            level: 32,
            df: "Chưa có",
            awakened: ['Z','X'],
            special: [],
            note: 'Chưa có',
        },
        {
            key: 2,
            username: 'John Brown',
            fightingStyle: ['Superhuman','DeathStep','SharkmanKarate','ElectricClaw','DragonTalon','Godhuman'],
            level: 2450,
            df: "Chưa có",
            awakened:  ['Z','X','C','V'],
            special: ['Dough','Leopard','Cursed Dual Katana'],
            note: 'cac',
        },
    ]

    useEffect(() => {
        getData().then((res) => {
            setDataApi(res.data);

        })

    }, [])
    return (

        <div>
            {contextHolder}
            <Row justify={'start'}>
                <Divider orientation="left">Roblocc Panel - Blox Fruit</Divider>
                <div style={{ marginBottom: 16, marginLeft: 16 }}>
                    <Space wrap>
                        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading} danger>
                            Xóa tài khoản đã chọn
                        </Button>
                        <span>
                              {hasSelected ? `Đã chọn ${selectedRowKeys.length} tài khoản` : ''}
                        </span>
                    </Space>
                </div>
                <Col span={24}>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={dataApi} rowKey={(record) => record.UID} />
                </Col>
            </Row>

        </div>
    )

}

export default  DataCompoment