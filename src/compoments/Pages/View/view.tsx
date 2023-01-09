import { Col, Row, Divider, Button, Empty, message, Table, Tag } from 'antd';
import React, { useState } from "react";
import type { ColumnsType } from 'antd/es/table';
import {array} from "decoders";
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
            render: (_, { fightingStyle }  ) => (
                <>
                    {fightingStyle.map((fs) => {
                        if (fightingStyle.length == 6) {
                            fstext = 'God Human';
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
            render: (_, { special }  ) => (
                <>
                    {special.map((key) => {
                        return (
                            <Tag color="red">
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
        }
        ];

    const data = [
        {
            key: 1,
            username: 'John Brown',
            fightingStyle: ['superhuman','death step','sharkman karate','electric claw','dragontalon'],
            level: 32,
            df: "Chưa có",
            awaken: ['Z','X'],
            special: [],
            note: 'Chưa có',
        },
        {
            key: 2,
            username: 'John Brown',
            fightingStyle: ['superhuman','death step','sharkman karate','electric claw','dragontalon','godhuman'],
            level: 2450,
            df: "Chưa có",
            awaken:  ['Z','X','C','V'],
            special: ['Dough','Leopard','Cursed Dual Katana'],
            note: 'Chưa có',
        },
    ]

    return (
        <>
            {contextHolder}
            <Row justify="start">
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

        </>
    )

}

export default  DataCompoment