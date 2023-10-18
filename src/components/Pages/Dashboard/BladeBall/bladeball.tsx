import React, {useEffect, useState} from "react";
import type {TabsProps} from 'antd';
import {deleteData, getData, getOrder} from "../../../../services/data";
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
    Divider,
    Form,
    message,
    Popconfirm,
    Row,
    Space,
    Statistic,
    Table,
    Tabs, Tag
} from "antd";
import {QuestionCircleOutlined, UserOutlined} from "@ant-design/icons";
const Bladeball: React.FC = () => {
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

    //data
    const [dataApi, setDataApi] = useState([]);

    // page pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    //Hidename
    const [hidename, setHidename] = useState(false)

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
        setTimeout(() => {
            getData(4777817887).then((res) => {
                setDataApi(res.data);
            })
            messageApi.success('Refresh Success <3');
            setSelectedRowKeys([]);
            setLoadingReload(false);
            setLoadingTable(false)
        }, 1000);
    }

    //Delete account

    const deleteAccount = () => {
        setLoadingDelete(true);
        setTimeout(() => {
            deleteData(selectedRowKeys as string[]).then((res) => {
                //console.log(res);
            })
            messageApi.success(`Deleted: ${selectedRowKeys.length} account !`);
            setSelectedRowKeys([]);
            setLoadingDelete(false);
            refreshData()
        }, 1000);
    };

    // Get Online - Offline

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
            title: "Coins",
            dataIndex: 'Coins',
            width: '20%',
            sorter: (a,b) => (JSON.parse(a.Description)['Coins'] - JSON.parse(b.Description)['Coins']),
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                return <Tag color={"orange"} key={'coins'} style={{margin: 4}}>
                    {new Intl.NumberFormat().format(description['Coins'])}
                </Tag>
            }
        },
        {
            title: "Kills/Wins",
            dataIndex: 'Data',
            width: '20%',
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                let dataKW = description.Data
                return(
                    <>
                        <Tag color='red' style={{margin: 4}}>
                            Kills: {dataKW.Kills}
                        </Tag>
                        <Tag color='blue' style={{margin: 4}}>
                            Wins: {dataKW.Wins}
                        </Tag>
                    </>

                )
            }
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
        }
    ]

    useEffect(() => {
        getData(4777817887).then((res) => {
            //console.log(res)
            setDataApi(res.data);
            setLoadingTable(false)
            sLoadingSkeTable(false)
        })
    }, [])

    return (<div>
        {contextHolder}
        <Row justify={'start'}>
            <Divider orientation="left">Roblocc Panel - Pet Simulator X</Divider>

            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{padding: 12}}>
                <Card size="small" title="Account">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Row gutter={[12, 12]}>
                                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                    <Card size="small" style={{marginBottom: 16}} title="Control">
                                        <Space wrap>
                                            <Button type="primary" onClick={refreshData}
                                                    loading={loadingReload}>Refresh</Button>
                                            <Popconfirm
                                                placement="bottom"
                                                title={'Are you sure to delete?'}
                                                description={`${selectedRowKeys.length} account`}
                                                onConfirm={deleteAccount}
                                                okText="Yes"
                                                cancelText="No"
                                                icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                                disabled={!hasSelected}
                                            >
                                                <Button type="primary" disabled={!hasSelected} loading={loadingDelete}
                                                        danger>
                                                    Delete Account
                                                </Button>
                                            </Popconfirm>
                                            <span style={{color: "#f6e9e9"}}>
                                              {hasSelected ? `Selected ${selectedRowKeys.length} account` : ''}
                                            </span>
                                        </Space>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                    <Card size="small" title="Optional">
                                        <Form layout="inline">
                                            <Form.Item label="Hide Name">
                                                <Checkbox onChange={onChangeHidename}/>
                                            </Form.Item>

                                        </Form>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Card size="small" title="Account Status">
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                        <Card size="small" hoverable={true}>
                                            <Statistic
                                                title="Active Accounts"
                                                value={getOnline()}
                                                valueStyle={{color: '#6abe39'}}
                                                prefix={<UserOutlined/>}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                        <Card size="small" hoverable={true}>
                                            <Statistic
                                                title="Inactive Accounts"
                                                value={getOffline()}
                                                valueStyle={{color: '#e84749'}}
                                                prefix={<UserOutlined/>}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
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
                </Card>,
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
                    pagination={{
                        total: dataApi.length,
                        pageSizeOptions: [10, 100, 200, 500, 1000, 2000, 5000],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} accounts`,
                        position: ['topCenter'],
                        current: page,
                        pageSize: pageSize,
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                />
            </Col>
        </Row>
    </div>);
}

export default Bladeball
