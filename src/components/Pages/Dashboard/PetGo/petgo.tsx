import React, {useEffect, useState} from "react";

import {bulkDeleteData, deleteData, getData} from "../../../../services/data";
import moment from "moment/moment";
import {ColumnsType} from "antd/es/table";
import {useStore} from "../../../../state/storeHooks";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Divider, Drawer, Dropdown, Form,
    MenuProps,
    message,
    Popconfirm,
    Row,
    Space,
    Statistic,
    Table,
    Tag
} from "antd";
import {
    CopyOutlined,
    DeleteOutlined,
    DownOutlined, InboxOutlined,
    LineChartOutlined,
    QuestionCircleOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Export} from "../Export/export";

const PetGo: React.FC = () => {
    //message
    const [messageApi, contextHolder] = message.useMessage();

    //selected
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // main loading
    const [loadingTable, setLoadingTable] = useState(true);

    //loading
    const [loadingReload, setLoadingReload] = useState(false);
    const [loadingCopy, setLoadingCopy] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    //data
    const [dataApi, setDataApi] = useState([]);


    //Hidename
    const [hidename, setHidename] = useState(false)

    const [openNoteDrawer, setOpenNoteDrawer] = useState(false);

    const {user} = useStore(({app}) => app);

    const {limitacc} = user.unwrap();

    const onChangeHidename = (e: CheckboxChangeEvent) => {
        setHidename(e.target.checked)
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        disable: true,
        selectedRowKeys,
        onChange: onSelectChange,

    };

    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        // ajax request after empty completing
        getData(6401952734).then((res) => {
            setDataApi(res.data);
        }).then(() =>{
            messageApi.success('Refresh Success <3');
        }).catch((error) => {
            messageApi.error('Got error while getting data');
        }).finally(() => {
            setSelectedRowKeys([]);
            setLoadingReload(false);
            setLoadingTable(false)
        })
    }

    const bulkDeleteAccount = () => {
        setLoadingDelete(true);
        setTimeout(() => {
            bulkDeleteData(selectedRowKeys as string[]).then((res) => {
                //console.log(res);
            }).then(() => {
                messageApi.success(`Deleted: ${selectedRowKeys.length} account !`);
            }).catch((error) => {
                messageApi.error('Got error while deleting account');
            }).finally(() => {
                setSelectedRowKeys([]);
                setLoadingDelete(false);
                refreshData()
            })

        }, 1000);
    };

    useEffect(() => {
        getData(6401952734).then((res) => {
            setDataApi(res.data);
        }).then(() =>{
            messageApi.success('Refresh Success <3');
        }).catch((error) => {
            messageApi.error('Got error while getting data');
        }).finally(() => {
            setSelectedRowKeys([]);
            setLoadingReload(false);
            setLoadingTable(false)
        })
    },[])

    const AutoRefreshData = () => {
        refreshData()
        messageApi.success(`Next refresh ${moment(Date.now() + 60000).fromNow() }`,10);
        messageApi.info(`Last Updated - ${moment(Date.now()).calendar()}`,15)
    }

    useEffect(() =>{
        const intervalId = setInterval(AutoRefreshData, 60000);
        return () => clearInterval(intervalId);
    })

    //Delete account

    const deleteAccount = () => {
        setLoadingDelete(true);
        setTimeout(() => {
            bulkDeleteData(selectedRowKeys as string[]).then((res) => {
                //console.log(res);
            })
            messageApi.success(`Deleted: ${selectedRowKeys.length} account !`);
            setSelectedRowKeys([]);
            setLoadingDelete(false);
            refreshData()
        }, 1000);
    };

    // Get Online - Offline

    interface DrawerProps {
        note: string,
        online: number
    }

    const getOnlineForNote = () => {
        // [ {note: 'note1', online: 0}, {note: 'note2', online: 0} ]
        let temp: DrawerProps[] = []
        // get all note
        dataApi.forEach((item: DataType) => {
            const note = item.Note
            if (!temp.find((item: DrawerProps) => item.note === note)) {
                temp.push({note: note, online: 0})
            }
        })
        // get online for each note
        dataApi.forEach((item: DataType) => {
            const note = item.Note
            const update = moment(item.updatedAt).unix()
            if (moment().unix() - update <= 120) {
                temp.find((item: DrawerProps) => item.note === note)!.online++
            }
        })
        //console.log(temp)
        return temp
    }


    const getOnline = () => {
        var temp = 0
        dataApi.forEach((item: DataType) => {
            const update = moment(item.updatedAt).unix()
            if (moment().unix() - update <= 300) {
                temp++
            }
        })
        return temp
    }

    const getOffline = () => {
        var temp = 0
        dataApi.forEach((item: DataType) => {
            const update = moment(item.updatedAt).unix()
            if (moment().unix() - update > 300) {
                temp++
            }
        })
        return temp
    }

    const hasSelected = selectedRowKeys.length > 0;

    interface DataType {
        UsernameRoblocc: string;
        Password: string;
        Cookie: string;
        Description: string;
        Note: string
        updatedAt: string;
        accountStatus: string;
    }

    function formatNumber(num: number, precision: number) {
        const map = [
            {suffix: 'T', threshold: 1e12},
            {suffix: 'B', threshold: 1e9},
            {suffix: 'M', threshold: 1e6},
            {suffix: 'K', threshold: 1e3},
            {suffix: '', threshold: 1},
        ];

        const found = map.find((x) => Math.abs(num) >= x.threshold);
        if (found) {
            const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
            return formatted;
        }

        return num;
    }

    const columnsData: ColumnsType<DataType> = [
        {
            title: 'Roblox Username',
            dataIndex: 'UsernameRoblocc',
            width: '10%',
            render: (_, record) => {
                let UsernameRoblocc = record.UsernameRoblocc
                // console.log(UsernameRoblocc.length/100*30, UsernameRoblocc.length)
                return (
                    <div>
                        {!hidename ? UsernameRoblocc : (UsernameRoblocc.substring(0, UsernameRoblocc.length / 100 * 30) + "*".repeat(UsernameRoblocc.length - UsernameRoblocc.length / 100 * 30))}
                    </div>
                )
            },
            sorter: (a, b) => {
                return a.UsernameRoblocc.localeCompare(b.UsernameRoblocc)
            },
        },
        {
            title: 'Level',
            dataIndex: 'data-level',
            key: "data-level",
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return <Tag color={"orange"}>
                    {new Intl.NumberFormat().format(Description['Level'])}
                </Tag>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description)['Level'] - JSON.parse(b.Description)['Level'],
        },
        {
            title: 'Coins',
            dataIndex: 'data-coins',
            key: "data-coins",
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return <Tag color={"yellow"}>
                    {formatNumber(Description['Currency']['Coins'], 2)}
                </Tag>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description)['Currency']['Coins'] - JSON.parse(b.Description)['Currency']['Coins'],
        },
        {
            title: 'Total Rolls',
            dataIndex: 'data-total-rolls',
            key: "data-total-rolls",
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return <Tag color={"green"}>
                    {new Intl.NumberFormat().format(Description['TotalRolls'])}
                </Tag>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description)['TotalRolls'] - JSON.parse(b.Description)['TotalRolls'],
        },
        {
            title: 'Highest Pet',
            dataIndex: 'data-highest-pet',
            key: "data-highest-pet",
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                let HighestDifficultyPet = Description['Pets']['HighestDifficultyPet']
                return <Tag color={"blue"}>
                    {`${HighestDifficultyPet['petName']} - ${formatNumber(HighestDifficultyPet['difficulty'],2)}` || 'N/A'}
                </Tag>
            },
        },
        {
            title: 'Huge',
            dataIndex: 'data-huge-pet',
            key: "data-huge-pet",
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                let HugePet = Description['Pets']['HugePet']

                return <>
                    {
                        HugePet.length > 0 ?
                            HugePet.map((item: any, index: number) => {
                                return <Tag key={index} color={"red"}>
                                    {`${item['petName']} | ${formatNumber(item['difficulty'],0)}`}
                                </Tag>
                            }) : <Tag>N/A</Tag>
                    }
                </>
            },
        },
        {
            title: '50M+',
            dataIndex: 'data-pet-above-50m',
            key: "data-pet-above-50m",
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                let PetAbove50M = Description['Pets']['PetAbove50M']
                return <>
                    {
                        PetAbove50M.length > 0 ?
                            PetAbove50M.map((item: any, index: number) => {
                                return <Tag key={index} color={"oranges"}>
                                    {`${item['petName']} | ${formatNumber(item['difficulty'],3)}`}
                                </Tag>
                            }) : <Tag>N/A</Tag>
                    }
                </>
            },
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: (a, b) => {
                return moment(a.updatedAt).unix() - moment(b.updatedAt).unix()
            },
            render: (_, record) => {
                return moment(record.updatedAt).fromNow()
            },
        },
        {
            title: 'Status',
            dataIndex: 'accountStatus',
            key: 'accountStatus',
            render: (_, record) => {
                let updatedAt = moment(record.updatedAt).unix()
                if (moment().unix() - updatedAt <= 300) {
                    return <Badge status="success" text="Online"/>
                } else {
                    return <Badge status="error" text="Offline"/>
                }
            },
            filters: [
                {
                    text: 'Online',
                    value: 'Online',
                },
                {
                    text: 'Offline',
                    value: 'Offline',
                },
            ],
            onFilter: (value: any, record) => {
                if (value === 'Active') {
                    return moment().unix() - moment(record.updatedAt).unix() < 900
                } else if (value === 'Inactive') {
                    return moment().unix() - moment(record.updatedAt).unix() >= 900
                } else {
                    return false
                }

            },
        },
        {
            title: 'Note',
            dataIndex: 'Note',
            key: 'Note',
            render: (_, record) => {
                return record.Note
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const items: MenuProps['items'] = [
                    {
                        label: `Username: ${record.UsernameRoblocc}`,
                        key: '0',
                        disabled: true
                    },
                    {
                        type: 'divider',
                    },
                    {
                        label: <a onClick={() => {
                            //console.log(`Copied: ${record.UsernameRoblocc}/${record.Password}`)
                            deleteData(record.UsernameRoblocc).then((res) => {
                                messageApi.success(`Deleted account: ${record.UsernameRoblocc} !`);
                                refreshData()
                            })
                        }}><DeleteOutlined/> Delete Account</a>,
                        key: '1',
                        danger: true
                    },
                ];
                return (<Dropdown menu={{items}} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Action
                            <DownOutlined/>
                        </Space>
                    </a>
                </Dropdown>)
            }
        }
    ]

    return (<div>
        {contextHolder}
        <Row justify={'start'}>
            <Divider orientation="left">Roblocc Panel - Anime Valorant</Divider>
            <Col span={24} style={{padding: 6}}>
                <Card bordered={false} title={"Account Overview"} size={"small"}>
                    <Row gutter={[12,12]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Card size="small" title="Account Control">
                                <div style={{marginBottom: 16}}>
                                    <Space wrap>
                                        <Button
                                            type="primary"
                                            onClick={refreshData}
                                            loading={loadingReload
                                            }>
                                            Refresh
                                        </Button>

                                        <Button type="primary" onClick={() => {
                                            setOpenNoteDrawer(true)
                                        }}>Note Active</Button>

                                        <Popconfirm
                                            placement="bottom"
                                            title={'Are you sure to delete?'}
                                            description={`${selectedRowKeys.length} account`}
                                            onConfirm={bulkDeleteAccount}
                                            okText="Yes"
                                            cancelText="No"
                                            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                            disabled={!hasSelected}
                                        >
                                            <Button
                                                type="primary"
                                                disabled={!hasSelected}
                                                loading={loadingDelete}
                                                danger>
                                                Delete Account
                                            </Button>
                                        </Popconfirm>
                                    </Space>
                                </div>

                                <div style={{marginTop: 12}}>
                                    <Checkbox
                                        onChange={onChangeHidename}>
                                        Hide name (optional)
                                    </Checkbox>
                                </div>

                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Card size="small" title="Accounts Status">
                                <Row gutter={[12, 12]}>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                                        <Card size="small" hoverable={true}>
                                            <Statistic
                                                title="Active"
                                                value={getOnline()}
                                                valueStyle={{color: '#6abe39'}}
                                                prefix={<UserOutlined/>}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                                        <Card size="small" hoverable={true}>
                                            <Statistic
                                                title="Inactive"
                                                value={getOffline()}
                                                valueStyle={{color: '#e84749'}}
                                                prefix={<UserOutlined/>}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                                        <Card size="small" hoverable={true}>
                                            <Statistic
                                                title="Total"
                                                value={getOffline() + getOnline()}
                                                valueStyle={{color: '#535dff'}}
                                                prefix={<UserOutlined/>}
                                                suffix={`/ ${limitacc}`}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>

                        </Col>
                    </Row>
                </Card>
            </Col>

            {/*<Col span={24} style={{padding: 6}}>*/}
            {/*    <Card bordered={false} title={"Data Overview"} size={"small"}>*/}
            {/*        <Row gutter={[12,12]}>*/}
            {/*            <Col xs={24} sm={24} md={24} lg={12} xl={12}>*/}
            {/*                <Card>*/}
            {/*                    <Statistic*/}
            {/*                        title="Total Gems (All account)"*/}
            {/*                        value={0}*/}
            {/*                        prefix={<LineChartOutlined />}*/}
            {/*                        valueStyle={{color: '#5487ff'}}*/}
            {/*                    />*/}
            {/*                </Card>*/}
            {/*            </Col>*/}
            {/*            <Col xs={24} sm={24} md={24} lg={12} xl={12}>*/}
            {/*                <Card>*/}
            {/*                    <Statistic*/}
            {/*                        title="Total Reroll (All account)"*/}
            {/*                        value={0}*/}
            {/*                        prefix={<LineChartOutlined />}*/}
            {/*                        valueStyle={{color: '#beb1ff'}}*/}
            {/*                    />*/}
            {/*                </Card>*/}
            {/*            </Col>*/}
            {/*        </Row>*/}
            {/*    </Card>*/}

            {/*</Col>*/}
        </Row>
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{paddingTop: 32}}>
                <Table
                    rowSelection={rowSelection}
                    columns={columnsData}
                    dataSource={dataApi}
                    rowKey={(record) => record.UsernameRoblocc}
                    loading={loadingTable}
                    size={"small"}
                    scroll={{x: true}}
                    bordered
                    pagination={{
                        total: dataApi.length,
                        pageSizeOptions: [25, 100, 200, 500, 1000, 2000, 5000],
                        position: ['topRight'],
                        defaultPageSize: 25,
                        showSizeChanger: true,
                    }}
                    sticky={{ offsetHeader: 0 }}
                />
            </Col>
        </Row>

        <Drawer
            title="Active per Note"
            placement="right"
            closable={true}
            onClose={() => {
                setOpenNoteDrawer(false)
            }}
            open={openNoteDrawer}
            getContainer={false}>
            <Table
                dataSource={getOnlineForNote()}
                columns={[
                    {
                        title: 'Note',
                        dataIndex: 'note',
                    },
                    {
                        title: 'Online',
                        dataIndex: 'online',
                    }
                ]}
                rowKey={(record) => record.note}
            ></Table>
        </Drawer>

    </div>);

}

export default PetGo;