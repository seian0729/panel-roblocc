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
    FloatButton
} from 'antd'
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {deleteData, getData} from "../../../../services/data";
import moment from "moment/moment";
import {ColumnsType} from "antd/es/table";
import {
    BankOutlined,
    BarChartOutlined,
    PayCircleOutlined,
    QuestionCircleOutlined,
    UserOutlined
} from "@ant-design/icons";

const rate = 20

function calCash(diamond: number){
    const cash = diamond / (rate * 1000000000) * 10000
    return Math.round(cash)
}
function formatNumber(num: number, precision = 3) {
    const map = [
        { suffix: 'T', threshold: 1e12 },
        { suffix: 'B', threshold: 1e9 },
        { suffix: 'M', threshold: 1e6 },
        { suffix: 'K', threshold: 1e3 },
        { suffix: '', threshold: 1 },
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

    //Format

    const [formatDia, setFormatDia] = useState(false)

    const onChangeformatDia = (e: CheckboxChangeEvent) => {
        setFormatDia(e.target.checked)
    };

    //Refresh data
    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        // ajax request after empty completing
        setTimeout(() => {
            getData(2316994223).then((res) => {
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
    const hasSelected = selectedRowKeys.length > 0;

    interface DataType {
        UID: number;
        UsernameRoblocc: string;
        Description: string;
        Note: string
        updatedAt: string;
        accountStatus: string;
    }

    const filtersNote: any [] = [];
    const filtersNoteT: any [] = [];

    const columns: ColumnsType<DataType> = [
        {
            title: 'Roblox Username',
            dataIndex: 'UsernameRoblocc',
            width: '20%',
            render: (_, record) => {
                let UsernameRoblocc = record.UsernameRoblocc
                // console.log(UsernameRoblocc.length/100*30, UsernameRoblocc.length)
                return(
                    <div>
                        {!hidename ? UsernameRoblocc : (UsernameRoblocc.substring(0,UsernameRoblocc.length/100*30)+ "*".repeat(UsernameRoblocc.length - UsernameRoblocc.length/100*30)) }
                    </div>
                )
            },
            sorter: (a, b) => {
                return a.UsernameRoblocc.localeCompare(b.UsernameRoblocc)
            },
        },
        {
            title: 'Total Diamond',
            dataIndex: "Diamond",
            width: '15%',
            sorter: (a: any, b: any) => JSON.parse(a.Description)['Total Diamond'] - JSON.parse(b.Description)['Total Diamond'],
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return(
                    <Tag color='processing' style={{margin: 4}}>
                        {!hideDiamond ? (!formatDia ? new Intl.NumberFormat().format(Description['Total Diamond']) : formatNumber(Description['Total Diamond'])  ) : "NaN"}
                    </Tag>
                );
            }
        },
        {
            title: 'Diamonds Gained',
            dataIndex: "diamondsGained",
            width: '10%',
            sorter: (a: any, b: any) => Number(JSON.parse(a.Description)['Diamond Gained'].replaceAll(',','')) - Number(JSON.parse(b.Description)['Diamond Gained'].replaceAll(',','')),
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return(
                    <div>
                        <Tag color='cyan'>
                            {!hideDiamond ? (!formatDia ? Description['Diamond Gained'] : formatNumber(Number(Description['Diamond Gained'].replaceAll(',', '')))) : "NaN"}
                        </Tag>
                    </div>
                );
            }
        },
        {
            title: 'Time Elapsed',
            dataIndex: "timeElapsed",
            width: '10%',
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return(
                    <div>
                        <Tag color='blue'>
                            {Description['Time Elapsed']}
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
                        <Badge status={moment().unix() - moment(record.updatedAt).unix() >= 90 ? 'error' : 'success' }
                               text={moment().unix() - moment(record.updatedAt).unix() >= 90 ? 'Inactive' : 'Active'} />
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

        getData(2316994223).then((res) => {
            //console.log(res)
            setDataApi(res.data);
            setLoadingTable(false)
            sLoadingSkeTable(false)
        })

    }, [])


    return (<div>
        {contextHolder}
        <Row justify={'start'} >
            <Divider orientation="left">Roblocc Panel - Pet Simulator X</Divider>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                <Card title="Account Control">
                    <Card style={{marginBottom: 16}}>
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
                                    Delete Selected Account
                                </Button>
                            </Popconfirm>
                            <span style={{color: "#f6e9e9"}}>
                                  {hasSelected ? `Selected ${selectedRowKeys.length} account` : ''}
                                </span>
                        </Space>
                    </Card>
                    <Card title="Optional">
                        <div>
                            <Form>
                                <Form.Item label="Hide Name">
                                    <Checkbox  onChange={onChangeHidename} />
                                </Form.Item>
                            </Form>
                        </div>
                        <div>
                            <Form>
                                <Form.Item label="Hide Diamond">
                                    <Checkbox  onChange={onChangeHideDiamond} />
                                </Form.Item>
                            </Form>
                        </div>
                        <div>
                            <Form>
                                <Form.Item label="Format Diamond">
                                    <Checkbox  onChange={onChangeformatDia} />
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                <Card title="Account Status">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Card hoverable={true}>
                                <Statistic
                                    title="Active"
                                    value={getOnline()}
                                    valueStyle={{ color: '#6abe39' }}
                                    prefix={<UserOutlined />}
                                    suffix="Account(s)"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <Card hoverable={true}>
                                <Statistic
                                    title="Inactive"
                                    value={getOffline()}
                                    valueStyle={{ color: '#e84749' }}
                                    prefix={<UserOutlined />}
                                    suffix="Account(s)"
                                />
                            </Card>
                        </Col>
                    </Row>
                </Card>
                <Card title="Diamonds" style={{marginTop: 16}}>
                    <Row gutter={[16,16]}>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                            <Card hoverable={true}>
                                <Statistic
                                    title="Total Diamonds"
                                    value={(!formatDia ? getTotalDiamonds() : formatNumber(getTotalDiamonds()))}
                                    valueStyle={{ color: '#5487ff' }}
                                    prefix={<BankOutlined />}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                            <Card hoverable={true}>
                                <Statistic
                                    title="Rate"
                                    value={rate}
                                    valueStyle={{ color: '#8ea0ff' }}
                                    prefix={<BarChartOutlined />}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                            <Card hoverable={true}>
                                <Statistic
                                    title="Total Earnings"
                                    value={formatNumber(calCash(getTotalDiamonds()))}
                                    valueStyle={{ color: '#54ff8a' }}
                                    prefix={<PayCircleOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{paddingTop: 32}}>
                <Skeleton
                    loading={loadingSkeTable}
                    active={loadingSkeTable}
                    paragraph = {{
                        rows: 10
                    }}
                >
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataApi}
                        rowKey={(record) => record.UsernameRoblocc}
                        loading = {loadingTable}
                        pagination={{
                            total: dataApi.length,
                            pageSizeOptions: [10, 100, 200, 500, 1000, 2000, 5000],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
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
            </Col>
        </Row>
    </div>);
}

export default PetX