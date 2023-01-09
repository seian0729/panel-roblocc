import { Col, Row, Divider, Empty,Table, Tag } from 'antd';
import React, { useState } from "react";
import type { ColumnsType } from 'antd/es/table';
import {array} from "decoders";
import {count, countBy, forEach} from "ramda";


function DataCompoment()
{
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
            key: 'username',
            width: 200,
        },
        {
            title: 'Fighting Style',
            dataIndex: 'fightingStyle',
            key: 'fightingStyle',
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
            key: 'level',
            width: '5%',
            sorter: (a: { level: number; }, b: { level: number; }) => a.level - b.level,
        },
        {
            title: 'DF',
            dataIndex: 'df',
            key: 'df',
            width: '5%',
        },
        {
            title: 'Awakened Abilities ',
            dataIndex: 'awaken',
            key: 'awaken',
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
            key: 'special',
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
            key: 'note',
            width: '10%',
        }
        ];

    const data = [
        {
            key: '1',
            username: 'John Brown',
            fightingStyle: ['superhuman','death step','sharkman karate','electric claw','dragontalon'],
            level: 32,
            df: "Chưa có",
            awaken: ['Z','X'],
            special: [],
            note: 'Chưa có',
        },
        {
            key: '2',
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
            <Row>
                <Col span={24}>
                    <Divider orientation="left">Roblocc Panel - Blox Fruit</Divider>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
                </Col>
            </Row>

        </>
    )

}

export default  DataCompoment