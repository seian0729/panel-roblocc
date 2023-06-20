import React, {useEffect, useState} from "react";
import {
    Button,
    Divider,
    message,
    Row,
    Col,
    Space,
    Table,
    Badge,
    Card,
    Skeleton,
    Checkbox,
    Popconfirm,
    Form,
    Statistic,
    Tag,
    FloatButton,
    Input,
    InputNumber,
    Tabs
} from 'antd'
import type { TabsProps } from 'antd';
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {
    deleteData,
    getData,
    sendDiamond,
    getOrder, getRate
} from "../../../../services/data";
import moment from "moment/moment";
import {ColumnsType} from "antd/es/table";
import {
    BankOutlined,
    BarChartOutlined,
    PayCircleOutlined,
    QuestionCircleOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useStore} from "../../../../state/storeHooks";
import {Interface} from "readline";


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

const PetX: React.FC = () => {

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

    const [pageOrder, setPageOrder] = useState(1);
    const [pageOrderSize, setPageOrderSize] = useState(10);

    //Hidename
    const [hidename, setHidename] = useState(false)

    const onChangeHidename = (e: CheckboxChangeEvent) => {
        setHidename(e.target.checked)
    };
    //Hide Diamond
    const [hideDiamond, setHideDiamond] = useState(false)
    const onChangeHideDiamond = (e: CheckboxChangeEvent) => {
        setHideDiamond(e.target.checked)
    };
    //Rate
    const [rate, setRate] = useState(0);

    function calCash(diamond: number) {
        const cash = diamond / (rate * 1000000000) * 10000
        return Math.round(cash)
    }

    //Refresh data
    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        // ajax request after empty completing
        setTimeout(() => {
            getData(2316994223).then((res) => {
                setDataApi(res.data);
            })
            getOrder().then((res) => {
                setOrderData(res.data);
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

    const getTotalDiamonds = () => {
        var diaTemp = 0
        dataApi.forEach((item: DataType) => {
            //console.log(JSON.parse(item.Description)['Total Diamond'])
            diaTemp += JSON.parse(item.Description)['Total Diamond']
        })
        return diaTemp
    }

    // Selected

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        disable: true,
        selectedRowKeys,
        onChange: onSelectChange,

    };

    // Seller nhí

    const {user} = useStore(({app}) => app);
    const {id} = user.unwrap();

    const [amountDia, setAmountDia] = useState(0);
    const [userReceive, setUserReceive] = useState('');

    // order data

    const [orderData, setOrderData] = useState([])



    const onSellerNhiFail = () => {
        messageApi.error({
            content: 'Username or Diamonds is empty',
        });
    };

    const sellernhi = () => {
        const key = 'res-seller'
        messageApi.open({
            key,
            type: 'loading',
            content: 'Sent the order to server...'
        })

        sendDiamond(Number(id), userReceive, amountDia).then((res) => {
            // console.log(res)
            setTimeout(() => {
                messageApi.open({
                    key,
                    type: 'success',
                    content: res.message
                })
            }, 1500);
        })

    }

    const hasSelected = selectedRowKeys.length > 0;
    interface DataType {
        Id: number
        UID: number;
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
            title: 'Total Diamonds',
            dataIndex: "Diamond",
            width: '15%',
            sorter: (a: any, b: any) => JSON.parse(a.Description)['Total Diamond'] - JSON.parse(b.Description)['Total Diamond'],
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return (
                    <Tag color='processing' style={{margin: 4}}>
                        {!hideDiamond ?  formatNumber(Description['Total Diamond'],3) : "NaN"}
                    </Tag>
                );
            }
        },
        {
            title: 'Diamonds Gained',
            dataIndex: "diamondsGained",
            width: '10%',
            sorter: (a: any, b: any) => Number(JSON.parse(a.Description)['Diamond Gained']) - Number(JSON.parse(b.Description)['Diamond Gained']),
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return (

                        <Tag color={moment().unix() - moment(record.updatedAt).unix() >= 90 ? 'error' : 'cyan'}>
                            {moment().unix() - moment(record.updatedAt).unix() >= 90 ? 'Inactive' : (!hideDiamond ? formatNumber(Number(Description['Diamond Gained']),3) : "NaN")}
                        </Tag>
                );
            }
        },
        {
            title: 'Time Elapsed',
            dataIndex: "timeElapsed",
            width: '10%',
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return (
                    <div>
                        <Tag color={moment().unix() - moment(record.updatedAt).unix() >= 90 ? 'error' : 'blue'}>
                            {moment().unix() - moment(record.updatedAt).unix() >= 90 ? 'Inactive' : Description['Time Elapsed']}
                        </Tag>
                    </div>
                );
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
                    return moment().unix() - moment(record.updatedAt).unix() < 90
                } else if (value === 'Inactive') {
                    return moment().unix() - moment(record.updatedAt).unix() >= 90
                } else {
                    return false
                }

            },
            render: (_, record) => {
                return (
                    <>
                        <Badge status={moment().unix() - moment(record.updatedAt).unix() >= 90 ? 'error' : 'success'}
                               text={moment().unix() - moment(record.updatedAt).unix() >= 90 ? 'Inactive' : 'Active'}/>
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

    interface OrderType {
        Id: number
        UserReceive: string
        Diamonds: number
        createdAt: string
        updatedAt: string
        Status: any
    }

    const columnsOrder: ColumnsType<OrderType> = [
        {
            title: "#",
            dataIndex: "Id",
            width: '1%',
            render: (_, record) => {
              return (
                  record.Id
              )
            }
        },
        {
            title: "Roblocc Username",
            dataIndex: "UserReceive",
            width: '20%',
            render: (_, record) => {
                return (
                <>
                    {!hidename ? record.UserReceive : (record.UserReceive.substring(0, record.UserReceive.length / 100 * 30) + "*".repeat(record.UserReceive.length - record.UserReceive.length / 100 * 30))}
                </>
                )
            },
            sorter: (a, b) => {
                return a.UserReceive.localeCompare(b.UserReceive)
            },
        },
        {
            title: "Diamonds",
            dataIndex: "Diamonds",
            width: '5%',
            render: (_, record) => {
                return (
                    <Tag color='processing' style={{margin: 4}}>
                        {formatNumber(record.Diamonds,0)}
                    </Tag>
                )
            },
            sorter: (a: any, b: any) => Number(a.Diamonds) - Number(b.Diamonds),
        },
        {
            title: "Order Date",
            dataIndex: "createdAt",
            width: '7%',
            render: (_, record) => {
                return (
                    <Tag color='cyan' style={{margin: 4}}>
                        {moment(record.createdAt).format('MMMM Do YYYY - h:mm:ss a')}
                    </Tag>
                )
            }
        },
        {
            title: "Doing Date",
            dataIndex: "updatedAt",
            width: '7%',
            render: (_, record) => {
                return (
                    <Tag color='cyan' style={{margin: 4}}>
                        {moment(record.updatedAt).format('MMMM Do YYYY - h:mm:ss a')}
                    </Tag>
                )
            }
        },
        {
            title: "Status",
            dataIndex: "Status",
            width: '5%',
            render: (_, record) => {
                const status = JSON.parse(record.Status)
                // console.log(status.messages)
                const colors = [
                    'processing',
                    'success',
                    'error'
                ]
                // console.log(colors)
                return (
                    <Tag color={colors[Number(status.Status)]} style={{margin: 4}}>
                        {status.messages}
                    </Tag>
                )
            }
        },

    ]

    useEffect(() => {

        getData(2316994223).then((res) => {
            //console.log(res)
            setDataApi(res.data);
            setLoadingTable(false)
            sLoadingSkeTable(false)
        })



    }, [])

    useEffect(() => {

        getOrder().then((res) => {
            //console.log(res)
            setOrderData(res.data);
            setLoadingTable(false)
            sLoadingSkeTable(false)
        })

    }, [])

    useEffect(() => {

        getRate().then((res) => {
            setRate(res.rate)
        })


    }, [])


    return (<div>
        {contextHolder}
        <Row justify={'start'}>
            <Divider orientation="left">Roblocc Panel - Pet Simulator X</Divider>

            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{padding: 12}}>
                <Tabs defaultActiveKey = {'Account'} animated = {{inkBar: true, tabPane: true}}>
                    <Tabs.TabPane tab="Account" key="account">
                        <Card title="Account">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                    <Row gutter={[12,12]}>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                            <Card style={{marginBottom: 16}} title="Control">
                                                <Space wrap>
                                                    <Button type="primary" onClick={refreshData} loading={loadingReload}>Refresh</Button>
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
                                                        <Button type="primary" disabled={!hasSelected} loading={loadingDelete} danger>
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
                                            <Card title="Optional">
                                                <Form layout="inline">
                                                    <Form.Item label="Hide Name">
                                                        <Checkbox onChange={onChangeHidename}/>
                                                    </Form.Item>

                                                    <Form.Item label="Hide Diamond">
                                                        <Checkbox onChange={onChangeHideDiamond}/>
                                                    </Form.Item>
                                                </Form>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                    <Card title="Account Status">
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                <Card hoverable={true}>
                                                    <Statistic
                                                        title="Active"
                                                        value={getOnline()}
                                                        valueStyle={{color: '#6abe39'}}
                                                        prefix={<UserOutlined/>}
                                                        suffix="Account(s)"
                                                    />
                                                </Card>
                                            </Col>
                                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                <Card hoverable={true}>
                                                    <Statistic
                                                        title="Inactive"
                                                        value={getOffline()}
                                                        valueStyle={{color: '#e84749'}}
                                                        prefix={<UserOutlined/>}
                                                        suffix="Account(s)"
                                                    />
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Diamond" key="diamond">
                        <Card title="Diamonds">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                    <Card title="Seller nhí">
                                        <Form
                                            onFinish={sellernhi}
                                            onFinishFailed={onSellerNhiFail}
                                        >
                                            <Form.Item
                                                label="Username Receive"
                                                name="username"
                                                rules={[{required: true, message: 'Username is empty!'}]}

                                            >
                                                <Input prefix={<UserOutlined className="site-form-item-icon" />} onChange={e => setUserReceive(e.target.value)}/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Diamonds"
                                                name="dia"
                                                rules={[{required: true, message: 'Diamonds is empty!'}]}

                                            >
                                                <InputNumber style={{ width: '100%' }} prefix={<BankOutlined className="site-form-item-icon" />} onChange={value => setAmountDia(Number(value))}/>
                                            </Form.Item>

                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" style={{float:"left"}}>
                                                    Seller nhí
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                    <Card title="Statistic">
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                                <Card hoverable={true}>
                                                    <Statistic
                                                        title="Total Diamonds"
                                                        value={formatNumber(getTotalDiamonds(),3)}
                                                        valueStyle={{color: '#5487ff'}}
                                                        prefix={<BankOutlined/>}
                                                    />
                                                </Card>
                                            </Col>

                                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                                <Card hoverable={true}>
                                                    <Statistic
                                                        title="Rate"
                                                        value={rate}
                                                        valueStyle={{color: '#8ea0ff'}}
                                                        prefix={<BarChartOutlined/>}
                                                    />
                                                </Card>
                                            </Col>

                                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                                <Card hoverable={true}>
                                                    <Statistic
                                                        title="Total Earnings"
                                                        value={formatNumber(calCash(getTotalDiamonds()),3)}
                                                        valueStyle={{color: '#54ff8a'}}
                                                        prefix={<PayCircleOutlined/>}
                                                    />
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Tabs.TabPane>
                </Tabs>
            </Col>


        </Row>
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{paddingTop: 32}}>
                <Tabs defaultActiveKey = {'data'} animated = {{inkBar: true, tabPane: true}}>
                    <Tabs.TabPane tab="Data" key="data">
                        <Skeleton
                            loading={loadingSkeTable}
                            active={loadingSkeTable}
                            paragraph={{
                                rows: 10
                            }}
                        >
                            <Table
                                rowSelection={rowSelection}
                                columns={columnsData}
                                dataSource={dataApi}
                                rowKey={(record) => record.UsernameRoblocc}
                                loading={loadingTable}
                                size={"small"}
                                tableLayout={"fixed"}
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
                            <FloatButton.BackTop/>
                        </Skeleton>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Sent History" key="order-history">
                        <Skeleton
                            loading={loadingSkeTable}
                            active={loadingSkeTable}
                            paragraph={{
                                rows: 10
                            }}
                        >
                            <Table
                                columns={columnsOrder}
                                dataSource={orderData}
                                rowKey={(record) => record.Id}
                                loading={loadingTable}
                                size={"small"}
                                tableLayout={"fixed"}
                                pagination={{
                                    total: orderData.length,
                                    pageSizeOptions: [10, 100, 200, 500, 1000, 2000, 5000],
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
                                    position: ['topCenter'],
                                    current: pageOrder,
                                    pageSize: pageOrderSize,
                                    defaultPageSize: 10,
                                    showSizeChanger: true,
                                    onChange: (page, pageSize) => {
                                        setPageOrder(page);
                                        setPageOrderSize(pageSize);
                                    },
                                }}
                            />
                            <FloatButton.BackTop/>
                        </Skeleton>
                    </Tabs.TabPane>
                </Tabs>
            </Col>
        </Row>
    </div>);
}

export default PetX