import React, {useEffect, useState} from "react";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Divider, Dropdown, MenuProps,
    message,
    Popconfirm,
    Row,
    Space,
    Table,
    Tag,
    Typography
} from "antd";
import {
    CopyOutlined,
    DeleteOutlined,
    DownOutlined,
    QuestionCircleOutlined,
    ReloadOutlined,
    UserOutlined
} from "@ant-design/icons";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {bulkDeleteData, deleteData, getData} from "../../../../services/data";
import moment from "moment/moment";
import type {ColumnsType} from "antd/es/table";



const PlantsVsBrainrots: React.FC = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [loadingTable, setLoadingTable] = useState(true);

    // loading
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingReload, setLoadingReload] = useState(false);
    const [loadingBulkDelete, setLoadingBulkDelete] = useState(false);

    const [hidename, setHidename] = useState(false)

    // data api
    const [dataApi, setDataApi] = useState([]);

    const { Text } = Typography;

    const onChangeHidename = (e: CheckboxChangeEvent) => {
        setHidename(e.target.checked)
    };

    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        getData(8316902627).then((res) => {
            setDataApi(res.data);
        }).finally(() =>{
            messageApi.success('Refresh Success <3');
            setSelectedRowKeys([]);
            setLoadingReload(false);
            setLoadingTable(false)
        })
    }

    const bulkDeleteSelectedAccount = () => {
        setLoadingDelete(true);
        bulkDeleteData(selectedRowKeys as string[]).then(() => {
            messageApi.success(`Deleted: ${selectedRowKeys.length} account !`);
            setSelectedRowKeys([]);
            setTimeout(() => {
                setLoadingDelete(false);
                refreshData()
            }, 500)
        })
    };

    const bulkDeleteAccount = () => {
        let tempListAccount: string[] = []
        dataApi.forEach((item: DataType) =>{
            tempListAccount.push(item.UsernameRoblocc)
        })
        setLoadingBulkDelete(true);
        bulkDeleteData(tempListAccount).then(() => {
            messageApi.success(`Deleted: ${tempListAccount.length} account !`);
            setSelectedRowKeys([]);
        }).catch((err) =>{
            messageApi.error('Something went wrong, contact Seian')
        }).finally(() =>{
            setTimeout(() => {
                setLoadingBulkDelete(false);
                refreshData()
            }, 500)
        })
    }
    const getOnline = () => {
        let temp = 0
        dataApi.forEach((item: DataType) => {
            const update = moment(item.updatedAt).unix()
            if (moment().unix() - update <= 120) {
                temp++
            }
        })
        return temp
    }

    const getOffline = () => {
        let temp = 0
        dataApi.forEach((item: DataType) => {
            const update = moment(item.updatedAt).unix()
            if (moment().unix() - update > 120) {
                temp++
            }
        })
        return temp
    }

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
        Note: string;
        Description: string;
        updatedAt: string;
        accountStatus: string;
        Password: string;
        Cookie: string;
    }

    interface PlantsType {
        Name: string;
        Rarity: string;
        Amount: number;
    }

    interface BrainrotsType {
        Name: string;
        Rarity: string;
        Weight: number;
        Color: string;
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Account',
            dataIndex: 'UsernameRoblocc',
            width: '15%',
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
                let UsernameRoblocc = record.UsernameRoblocc
                // console.log(UsernameRoblocc.length/100*30, UsernameRoblocc.length)
                return (
                    <Space direction="vertical">
                        <Badge status={moment().unix() - moment(record.updatedAt).unix() >= 300 ? 'error' : 'success'} text={
                            !hidename ? UsernameRoblocc :
                                (UsernameRoblocc.substring(0, UsernameRoblocc.length / 100 * 30) + "*".repeat(UsernameRoblocc.length - UsernameRoblocc.length / 100 * 30))}
                        >
                        </Badge>

                        <Text type="secondary">
                            <Text type="secondary" strong>
                                {record.Note + ' - '}
                            </Text>
                            {moment(record.updatedAt).fromNow()}
                        </Text>

                    </Space>
                )
            },
            sorter: (a, b) => {
                return moment(a.updatedAt).unix() - moment(b.updatedAt).unix()
            },
        },
        {
            title: 'Plants',
            key: 'plants',
            render: (_, record) => {
                const plants = JSON.parse(record.Description)['Plants']

                return <div>
                    {
                        plants.length > 0 ?
                        plants.map((plants: PlantsType) => {
                            return <Tag color={plants.Rarity === 'Secret' ? 'red' : plants.Rarity === 'Godly' ? 'warning' : 'default' } style={{margin: 4}}>
                                { `${plants.Amount}x ${plants.Name}` }
                            </Tag>
                        }) : '-'
                    }
                </div>
            }
        },
        {
            title: 'Brainrot',
            key: 'Brainrot',
            render: (_, record) => {
                const brainrots = JSON.parse(record.Description)['Brainrot']
                return <div>
                    {
                        brainrots.length > 0 ?
                        brainrots.map((brainrot: BrainrotsType) => {
                            return <Tag color={brainrot.Rarity === 'Secret' ? 'red' : brainrot.Rarity === 'Godly' ? 'warning' : 'default' } style={{margin: 4}}>
                                { `[${brainrot.Color}] - ${brainrot.Name} - ${brainrot.Weight}` }
                            </Tag>
                        }) : '-'
                    }
                </div>
            }
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


    useEffect(() => {
        refreshData()
        document.title = 'Chimovo - Đặt cây vs Thối não'
    }, []);

    return <>
        {contextHolder}
        <Divider orientation="left">Roblocc Panel - Đặt cây vs Thối não</Divider>
        <Row>
            <Col span={24}>
                <Card size="small"
                      title={
                          <Space>
                              <>
                                  <UserOutlined />
                                  {`${new Intl.NumberFormat().format(getOnline() + getOffline())} Account`}
                              </>
                              <Tag color={'green'}>
                                  {new Intl.NumberFormat().format(getOnline())}
                              </Tag>
                          </Space>
                      }
                      extra={
                          <Button
                              type="primary"
                              onClick={refreshData}
                              size={"small"}
                              loading={loadingReload}
                              icon={<ReloadOutlined />}
                          >
                              Refresh
                          </Button>

                      }>
                    <Row justify={'end'} style={{marginBottom: 12}}>
                        <Space wrap>
                            <Popconfirm
                                placement="bottom"
                                title={'Are you sure to delete?'}
                                description={`${dataApi.length} account(s) will be deleted permanently from database, can't rollback`}
                                onConfirm={bulkDeleteAccount}
                                okText="Yes"
                                cancelText="No"
                                icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                            >
                                <Button
                                    type="primary"
                                    loading={loadingBulkDelete}
                                    disabled={dataApi.length < 1}
                                    danger
                                    size={"small"}
                                    icon={<DeleteOutlined />}
                                >
                                    DELETE ALL ACCOUNT
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                placement="bottom"
                                title={'Are you sure to delete?'}
                                description={`${selectedRowKeys.length} account(s) will be deleted permanently from database, can't rollback`}
                                onConfirm={bulkDeleteSelectedAccount}
                                okText="Yes"
                                cancelText="No"
                                icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                disabled={!hasSelected}
                            >
                                <Button
                                    type="primary"
                                    disabled={!hasSelected}
                                    loading={loadingDelete}
                                    danger
                                    size={"small"}
                                    icon={<DeleteOutlined />}
                                >
                                    {
                                        `Delete ${selectedRowKeys.length === 0 && 'selected' || selectedRowKeys.length} account`
                                    }
                                </Button>
                            </Popconfirm>
                            <Checkbox onChange={onChangeHidename}>
                                Hide Name (optional)*
                            </Checkbox>
                        </Space>
                    </Row>

                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataApi}
                        rowKey={(record) => record.UsernameRoblocc}
                        loading={loadingTable}
                        size={"small"}
                        scroll={{x: true}}
                        bordered
                        pagination={{
                            total: dataApi.length,
                            pageSizeOptions: [10, 50, 100, 200, 500],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} accounts`,
                            position: ['topCenter'],
                            defaultPageSize: 10,
                            showSizeChanger: true,
                        }}
                    />
                </Card>
            </Col>
        </Row>
        </>
}

export default PlantsVsBrainrots