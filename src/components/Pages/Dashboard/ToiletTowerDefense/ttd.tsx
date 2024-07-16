import React, {useEffect, useState} from "react";
import type {DrawerProps, TabsProps} from 'antd';
import {bulkDeleteData, deleteData, getData, getOrder} from "../../../../services/data";
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
    Divider, Drawer, Dropdown,
    Form, MenuProps,
    message,
    Popconfirm,
    Row,
    Space,
    Statistic,
    Table,
    Tabs, Tag
} from "antd";
import {
    BankOutlined,
    DeleteOutlined,
    DownOutlined,
    LineChartOutlined,
    QuestionCircleOutlined,
    UserOutlined
} from "@ant-design/icons";
const ToiletTowerDefense: React.FC = () => {
    //message
    const [messageApi, contextHolder] = message.useMessage();

    //selected
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // main loading
    const [loadingSkeTable, sLoadingSkeTable] = useState(true);
    const [loadingTable, setLoadingTable] = useState(true);

    //loading
    const [loadingReload, setLoadingReload] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingCopy, setLoadingCopy] = useState(false);

    //data
    const [dataApi, setDataApi] = useState([]);

    // page pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    //Hidename
    const [hidename, setHidename] = useState(false)

    const [openNoteDrawer, setOpenNoteDrawer] = useState(false);

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
        getData(4778845442).then((res) => {
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
        getData(4778845442).then((res) => {
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
            if (moment().unix() - update <= 90) {
                temp++
            }
        })
        return temp
    }

    const getOffline = () => {
        var temp = 0
        dataApi.forEach((item: DataType) => {
            const update = moment(item.updatedAt).unix()
            if (moment().unix() - update > 90) {
                temp++
            }
        })
        return temp
    }

    const getTotalGems = () => {
        let totalGems = 0;
        dataApi.forEach((item: DataType) => {
            let Currencies = JSON.parse(item.Description)['Currencies']
            totalGems += Currencies['Gems']
        })
        return totalGems
    }

    const getTotalEggs = () => {
        let totalEggs = 0;
        dataApi.forEach((item: DataType) => {
            let Currencies = JSON.parse(item.Description)['Currencies']
            totalEggs += Currencies['Eggs_Easter2024']
        })
        return totalEggs
    }

    const hasSelected = selectedRowKeys.length > 0;
    interface DataType {
        UsernameRoblocc: string;
        Description: string;
        Note: string
        updatedAt: string;
        accountStatus: string;
    }

    const filtersNote: any [] = [];
    const filtersNoteT: any [] = [];

    const columnsData: ColumnsType<DataType> = [
        {
            title: 'Roblox Username',
            dataIndex: 'UsernameRoblocc',
            width: '20%',
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
            title: "Data",
            dataIndex: "data",
            children: [
                {
                    title: 'Wins',
                    dataIndex: 'data-wins',
                    key: "data-wins",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return <Tag color={"green"}>
                            {new Intl.NumberFormat().format(Description['Currencies']['Wins'])}
                        </Tag>
                    },
                    sorter: (a: any, b: any) => JSON.parse(a.Description)['Currencies']['Wins'] - JSON.parse(b.Description)['Currencies']['Wins'],
                },
                {
                    title: 'Coins',
                    dataIndex: 'data-coins',
                    key: "data-coins",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return <Tag color={"yellow"}>
                            {new Intl.NumberFormat().format(Description['Currencies']['Coins'])}
                        </Tag>
                    },
                    sorter: (a: any, b: any) => JSON.parse(a.Description)['Currencies']['Coins'] - JSON.parse(b.Description)['Currencies']['Coins'],
                },
                {
                    title: 'Gems',
                    dataIndex: 'data-inventory',
                    key: "data-inventory",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return <Tag color={"blue"}>
                            {new Intl.NumberFormat().format(Description['Currencies']['Gems'])}
                        </Tag>
                    },
                    sorter: (a: any, b: any) => JSON.parse(a.Description)['Currencies']['Gems'] - JSON.parse(b.Description)['Currencies']['Gems'],
            }
            ]
        },
        {
            title: "Event Currencies",
            dataIndex: "data",
            children: [{
                title: 'Eggs',
                dataIndex: 'data-eggs',
                key: "data-eggs",
                render: (_, record) => {
                    let Description = JSON.parse(record.Description)
                    return <Tag color={"magenta"}>
                        {new Intl.NumberFormat().format(Description['Currencies']['Eggs_Easter2024'])}
                    </Tag>
                },
                sorter: (a: any, b: any) => JSON.parse(a.Description)['Currencies']['Eggs_Easter2024'] - JSON.parse(b.Description)['Currencies']['Eggs_Easter2024'],
            },
                {
                    title: 'Clovers',
                    dataIndex: 'data-clovers',
                    key: "data-clovers",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return <Tag color={"lime"}>
                            {new Intl.NumberFormat().format(Description['Currencies']['Clovers_StPatricks2024'])}
                        </Tag>
                    },
                    sorter: (a: any, b: any) => JSON.parse(a.Description)['Currencies']['Clovers_StPatricks2024'] - JSON.parse(b.Description)['Currencies']['Clovers_StPatricks2024'],
                },
            ]
        },
        {
            title: 'Last Update',
            dataIndex: 'lastUpdate',
            width: '15%',
            render: (_, record) => {
                return (
                    <>
                        {
                            moment(record.updatedAt).fromNow()
                        }
                    </>
                )
            },
            sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix()
        },
        {
            title: 'Status',
            dataIndex: 'accountStatus',
            width: '10%',
            filters: [
                {
                    text: 'Active',
                    value: 'Active',
                },
                {
                    text: 'Inactive',
                    value: 'Inactive',
                },
            ],
            onFilter: (value: any, record) => {
                if (value === 'Active') {
                    return moment().unix() - moment(record.updatedAt).unix() < 300
                } else if (value === 'Inactive') {
                    return moment().unix() - moment(record.updatedAt).unix() >= 300
                } else {
                    return false
                }

            },
            render: (_, record) => {
                return (
                    <>
                        <Badge status={moment().unix() - moment(record.updatedAt).unix() >= 300 ? 'error' : 'success'}
                               text={moment().unix() - moment(record.updatedAt).unix() >= 300 ? 'Inactive' : 'Active'}/>
                    </>
                )
            },
        },
        {
            title: 'Note',
            dataIndex: 'Note',
            width: '15%',
            render: (_, record) => {
                {
                    filtersNoteT.push({
                        text: record.Note,
                        value: record.Note,
                    })

                    for (let index = 0; index < filtersNoteT.length; index++) {
                        if (!filtersNote.find(a => a.text === filtersNoteT[index].text)) {
                            filtersNote.push(filtersNoteT[index])
                        }
                    }
                }

                return (
                    <>
                        {record.Note}
                    </>
                )
            },

            filters: filtersNote,
            onFilter: (value: any, record: { Note: string; }) => record.Note.valueOf() === value,
            filterSearch: true,
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
            ,
        }
    ]

    return (<div>
        {contextHolder}
        <Row justify={'start'}>
            <Divider orientation="left">Roblocc Panel - Toilet Tower Defense</Divider>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 6}}>
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
                                                title="Active Accounts"
                                                value={getOnline()}
                                                valueStyle={{color: '#6abe39'}}
                                                prefix={<UserOutlined/>}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                                        <Card size="small" hoverable={true}>
                                            <Statistic
                                                title="Inactive Accounts"
                                                value={getOffline()}
                                                valueStyle={{color: '#e84749'}}
                                                prefix={<UserOutlined/>}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                                        <Card size="small" hoverable={true}>
                                            <Statistic
                                                title="Total Accounts"
                                                value={getOffline() + getOnline()}
                                                valueStyle={{color: '#535dff'}}
                                                prefix={<UserOutlined/>}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>

                        </Col>

                    </Row>

                </Card>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 6}}>
                <Card bordered={false} title={"Currencies Overview"} size={"small"}>
                    <Row gutter={[12,12]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Card>
                                <Statistic
                                    title="Total Eggs (All account)"
                                    value={getTotalEggs()}
                                    prefix={<LineChartOutlined />}
                                    valueStyle={{color: '#eeb1ff'}}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Card>
                                <Statistic
                                    title="Total Gems (All account)"
                                    value={getTotalGems()}
                                    prefix={<LineChartOutlined />}
                                    valueStyle={{color: '#5487ff'}}
                                    suffix={`(${new Intl.NumberFormat().format(getTotalEggs()/4)})`}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Card>

            </Col>
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
                    bordered
                    pagination={{
                        total: dataApi.length,
                        pageSizeOptions: [25, 100, 200, 500, 1000, 2000, 5000],
                        position: ['topRight'],
                        defaultPageSize: 25,
                        showSizeChanger: true,
                    }}
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

export default ToiletTowerDefense
