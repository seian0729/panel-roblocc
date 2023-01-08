import { Col, Row, Divider, Empty,Table, Tag } from 'antd';
import React from "react";
import type { ColumnsType } from 'antd/es/table';
import {array} from "decoders";
import {count, countBy, forEach} from "ramda";


function DataCompoment()
{

    interface DataType {
        key: string;
        username: string;
        level: number;
        df: string;
        awaken: string[];
        fightingStyle: string[];
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
            width: 200,
        },
        {
            title: 'Awaken',
            dataIndex: 'awaken',
            key: 'awaken',
            render: (_, { awaken }  ) => (
                <>
                    {awaken.map((key) => {
                        if (awaken.length >= 4) {
                            fstext = 'Fully Awaken';
                            fscolor = 'green';
                        } else {
                            fstext = 'Not Fully Awaken';
                            fscolor = 'red';
                        }
                    })}
                    <Tag color={fscolor}>{fstext}</Tag>
                </>
            )

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

        },
        {
            key: '2',
            username: 'John Brown',
            fightingStyle: ['superhuman','death step','sharkman karate','electric claw','dragontalon','godhuman'],
            level: 32,
            df: "Chưa có",
            awaken:  ['Z','X','C','V'],
        },
        ]

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

export default  DataCompoment