import { Col, Row, Divider, Button, message, Table, Tag, Space, Tooltip  } from 'antd';
import React, {useEffect, useState} from "react";
import type { ColumnsType  } from 'antd/es/table';
import {getData} from "../../../services/data";
import {array, string} from "decoders";
import {count, countBy, forEach} from "ramda";
import type { FilterConfirmProps } from 'antd/es/table/interface';

function DataCompoment()
{

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // loading
    const [loading, setLoading] = useState(false);
    const [loadingR, setLoadingR] = useState(false);
    const [loadingC, setLoadingC] = useState(false);

    // data
    const [dataApi, setDataApi] = useState([]);

    // page pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const deleteAccount = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            messageApi.success(`Đã xóa thành công: ${selectedRowKeys.length} tài khoản !`);
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const refreshData = () =>{
        setLoadingR(true);
        // ajax request after empty completing
        setTimeout(() => {
            messageApi.success('Đã làm mới lại tất cả dữ liệu <3');
            setSelectedRowKeys([]);
            setLoadingR(false);
        }, 1000);
    }

    const copyData = () => {
        setLoadingC(true);
        // ajax request after empty completing
        setTimeout(() => {
            messageApi.success(`Đã sao chép ${selectedRowKeys.length} dữ liệu vào khay nhớ tạm <3`);
            setSelectedRowKeys([]);
            setLoadingC(false);
        },1000)
    }

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        disable: true,
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    interface DataType {
        UID: number;
        UsernameRoblocc: string;
        level: number;
        df: string;
        awakened: string[];
        special: string[];
        fightingStyle: string[];
        Note: string;
        Description: string;
    }

    let fstext = '';
    let fscolor = '';

    const filtersNote: any [] = [];
    const filtersNoteT: any [] = [];


    // @ts-ignore
    const columns: ColumnsType<DataType> = [
        {
            title: 'RUsername',
            dataIndex: 'UsernameRoblocc',
            width: '10%',
        },
        {
            title: 'Data',
            width: '15%',
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                let dataList = description.Data
                return(<>
                        <Tag color='orange'>
                            Level: {new Intl.NumberFormat().format(dataList.Level)}
                        </Tag>
                        <Tag color='purple'>
                            Fragments: {new Intl.NumberFormat().format(dataList.Fragments)}
                        </Tag>
                        <Tag color='green'>
                            Beli: {new Intl.NumberFormat().format(dataList.Beli)}
                        </Tag>
                    </>)
            }
        },

        {
            title: 'Fighting Style',
            dataIndex: 'fightingStyle',
            width: '10%',
            /*
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
             */
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
                            else {
                                fstext = 'Starter / Superhuman / < 2 Melee';
                                fscolor = 'red';
                            }

                        })}
                        <Tag color={fscolor}>{fstext}</Tag>
                    </>
             )
            },
            onFilter: (value: any, record: { special: string[]; }) => record.special.includes(value),
            sorter: (a: { special: string[]; }, b: { special: string[]; }) => a.special.length - b.special.length,

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
            width: '10%',
            /*
            sorter: (a: { awakened: string[]; }, b: { awakened: string[]; }) => a.awakened.length - b.awakened.length,
             */
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
        {
            title: 'Special',
            dataIndex: 'special',
            render: (_, record   ) => {
                let description = JSON.parse(record.Description);
                let bfData = description['Inventory']['Blox Fruit']
                let sData = description['Inventory']['Sword']
                let GData = description['Inventory']['Gun']
                let cac = '';


                return (
                    <>

                        {bfData.map((key : any) => {
                            if (key == 'Dough' || key == 'Leopard'){
                                cac += key+' / '
                            }
                        })}

                        {sData.map((key : any) => {
                            if (key == 'Cursed Dual Katana'){
                                cac += key+' / '
                            }
                        })}

                        {GData.map((key : any) => {
                            if (key == 'Soul Guitar'){
                                cac += key+' / '
                            }

                        })}

                        <Tag color={'red'}>
                            {cac.substring(0,cac.length-2)}
                        </Tag>


                    </>

                )
            },
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
            onFilter: (value: any, record) => {
                console.log(value);
                let description = JSON.parse(record.Description);
                let bfData = description['Inventory']['Blox Fruit']
                let sData = description['Inventory']['Sword']
                let GData = description['Inventory']['Gun']

                const specialList: any[] = [];

                bfData.map((key : any) => {
                    if (key == 'Dough' || key == 'Leopard'){
                        specialList.push(key)
                    }
                })

                sData.map((key : any) => {
                    if (key == 'Cursed Dual Katana'){
                        specialList.push(key)
                    }
                })

                GData.map((key : any) => {
                    if (key == 'Soul Guitar'){
                        specialList.push(key)
                    }
                })

                return specialList.includes(value)

            }

        },
        {
            title: 'Note',
            dataIndex: 'Note',
            width: '15%',
            render: (_, record   ) => {
                {
                    filtersNoteT.push({
                        text: record.Note,
                        value: record.Note,
                    })

                    for ( var index=0; index< filtersNoteT.length; index++ ) {
                        if (!filtersNote.find(a => a.text === filtersNoteT[index].text)){
                            filtersNote.push(filtersNoteT[index])
                        }
                    }
                }

                return(
                    <>
                        {record.Note}
                    </>
                )
            },

            filters: filtersNote,
            onFilter: (value: any, record: { Note: string; }) => record.Note.indexOf(value) === 0,
            filterSearch: true,
        }
        ];

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
                        <Tooltip placement="topLeft" title={'Tính năng chưa xài được :keka:'}>
                            <Button type="primary" onClick={copyData} loading={loadingC}>Sao chép dữ liệu</Button>
                        </Tooltip>
                        <Tooltip placement="top" title={'Tính năng chưa xài được :keka:'}>
                        <Button type="primary" onClick={refreshData} loading={loadingR}>Làm mới</Button>
                        </Tooltip>
                        <Tooltip placement="top" title={'Tính năng chưa xài được :keka:'}>
                        <Button type="primary" onClick={deleteAccount} disabled={!hasSelected} loading={loading} danger>
                            Xóa tài khoản đã chọn
                        </Button>
                        </Tooltip>
                        <span>
                          {hasSelected ? `Đã chọn ${selectedRowKeys.length} tài khoản` : ''}
                    </span>
                    </Space>
                </div>
                <Col span={24}>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataApi}
                        rowKey={(record) => record.UsernameRoblocc}
                        pagination={{
                            total: dataApi.length,
                            pageSizeOptions:[
                                10,
                                20,
                                50,
                                100,
                                200,
                                500,
                                1000
                            ],
                            showTotal: (total,range) => `${range[0]}-${range[1]} of ${total} items`,
                            current: page,
                            pageSize: pageSize,
                            onChange: (page,pageSize) => {
                                setPage(page);
                                setPageSize(pageSize);
                            }
                        }}
                    />
                </Col>
            </Row>
        </div>
    )

}

export default  DataCompoment