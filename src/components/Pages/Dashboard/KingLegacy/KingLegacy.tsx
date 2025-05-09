import React, {useEffect, useState} from "react";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Divider, Drawer,
    Dropdown, Flex,
    Form, Input,
    MenuProps,
    message,
    Modal, Popconfirm,
    Row,
    Space, Statistic, Table,
    Tag
} from "antd";
import {useStore} from "../../../../state/storeHooks";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {bulkDeleteData, bulkMarkCompleted, deleteData, getData, markCompleted} from "../../../../services/data";
import moment from "moment";
import {
    CheckOutlined,
    CopyOutlined,
    DeleteOutlined,
    DownOutlined,
    ExclamationCircleFilled,
    InboxOutlined, LineChartOutlined, QuestionCircleOutlined, SearchOutlined, UserOutlined
} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {Export} from "../Export/export";

const KL: React.FC = () => {
    //message
    const [messageApi, contextHolder] = message.useMessage();
    const [modalApi, modalContextHolder] = Modal.useModal();

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

    const {username, limitacc} = user.unwrap();

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
        getData(1451439645).then((res) => {
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
        getData(1451439645).then((res) => {
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
        document.title = 'Chimovo - Vua Di Sản'
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
    const getAmountAccountHaveCookie = () => {
        let tempCount = 0
        dataApi.forEach((item: DataType) => {
            if (item.Cookie != null){
                tempCount++
            }
        })
        return tempCount
    }

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

    const filtersNote: any [] = [];
    const filtersNoteT: any [] = [];

    const showConfirm = () => {
        modalApi.confirm({
            title: `Do you want to DELETE ${selectedRowKeys.length} ACCOUNT`,
            icon: <ExclamationCircleFilled />,
            content: 'Data will be deleted permanently from database and CANT BE RESTORE',
            centered: true,
            okText: "Sure",
            cancelText: "Nah",
            onOk() {
                bulkDeleteAccount()
            },
        });
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Action',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            label: <a onClick={() => {
                // copyFullData()
            }}><CopyOutlined /> Copy selected data</a>,
            key: '2',
        },
        {
            label: <a onClick={() => {
                //console.log(`Copied: ${record.UsernameRoblocc}/${record.Password}`)
                bulkMarkCompleted(selectedRowKeys as string[]).then((res) => {
                    console.log(res)
                    messageApi.success(`Mark Completed: ${selectedRowKeys.length} account`);
                    refreshData()
                })
            }}><CheckOutlined/> Mark Completed Account</a>,
            key: '3',
        },
        {
            label: <a onClick={() => {
                showConfirm()
            }}><DeleteOutlined /> Delete selected data</a>,
            danger: true,
            key: '4',
        },
    ];

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
            title: 'Data',
            dataIndex: 'Data',
            width: '30%',
            children: [
                {
                    title: 'Level',
                    dataIndex: 'data-level',
                    key: "data-level",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return <Tag color={"yellow"}>
                            {new Intl.NumberFormat().format(Description['Basic Data']['Level'])}
                        </Tag>
                    },
                    sorter: (a: any, b: any) => JSON.parse(a.Description)['Basic Data']['Level'] - JSON.parse(b.Description)['Basic Data']['Level'],
                },
                {
                    title: 'Beli',
                    dataIndex: 'data-beli',
                    key: "data-beli",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return <Tag color={"green"}>
                            {new Intl.NumberFormat().format(Description['Basic Data']['Beli'])}
                        </Tag>
                    },
                    sorter: (a: any, b: any) => JSON.parse(a.Description)['Basic Data']['Beli'] - JSON.parse(b.Description)['Basic Data']['Beli'],
                },
                {
                    title: 'Gem',
                    dataIndex: 'data-gems',
                    key: "data-gems",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return <Tag color={"purple"}>
                            {new Intl.NumberFormat().format(Description['Basic Data']['Gems'])}
                        </Tag>
                    },
                    sorter: (a: any, b: any) => JSON.parse(a.Description)['Basic Data']['Gems'] - JSON.parse(b.Description)['Basic Data']['Gems'],
                },
                {
                    title: 'Fighting Style',
                    dataIndex: 'data-fs',
                    key: "data-fs",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return <>
                            {
                                Description['Fighting Style'].includes("Cyborg") ? <Tag color={"blue"}>
                                    Cyborg
                                </Tag> : <Tag> {Description['Fighting Style'].length}  </Tag>
                            }
                            </>
                    },
                    sorter: (a: any, b: any) => JSON.parse(a.Description)['Fighting Style'].length - JSON.parse(b.Description)['Fighting Style'].length,
                },
                {
                    title: 'DF',
                    dataIndex: 'df',
                    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                        <div style={{padding: 8}}>
                            <Input
                                placeholder="Search DF"
                                value={selectedKeys[0]}
                                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => confirm()}
                                style={{width: 188, marginBottom: 8, display: 'block'}}
                            />
                            <Button
                                type="primary"
                                onClick={() => confirm()}
                                style={{width: 90, marginRight: 8}}
                            >
                                Search
                            </Button>
                            <Button
                                onClick={() => clearFilters?.()}
                                style={{width: 90}}
                            >
                                Reset
                            </Button>
                        </div>
                    ),
                    filterIcon: (filtered: boolean) => (
                        <SearchOutlined style={{color: filtered ? '#729ddc' : undefined}}/>
                    ),
                    onFilter: (value, record) => {
                        let description = JSON.parse(record.Description);
                        return (
                            typeof description['Basic Data']['Fruit'] === 'string' &&
                            typeof value === 'string' &&
                            description['Basic Data']['Fruit'].toLowerCase().includes(value.toLowerCase())
                        );
                    },
                    render: (_, record) => {
                        let description = JSON.parse(record.Description);
                        return <Tag color={"geekblue"}>
                            {
                                description['Basic Data']['Fruit'] == '' ? "-" :description['Basic Data']['Fruit']
                            }
                        </Tag>

                    },
                },
            ],
        },
        {
            title: 'Inventory',
            dataIndex: 'inventory',
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return <>
                    {
                        Description['Inventory'].map((key: any) =>{
                            return <Tag style={{margin: 2}}>
                                {key}
                            </Tag>
                        })
                    }
                </>
            }
        },
        {
            title: 'Accessories',
            dataIndex: 'accessories',
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return <>
                    {
                        Description['Accessories'].map((key: any) =>{
                            return <Tag style={{margin: 2}}>
                                {key}
                            </Tag>
                        })
                    }
                </>
            }
        },
        {
            title: 'Last Update',
            dataIndex: 'lastUpdate',
            width: '10%',
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
                        label: <a onClick={() => {
                            //console.log(`Copied: ${record.UsernameRoblocc}/${record.Password}`)
                            navigator.clipboard.writeText(`${record.UsernameRoblocc}/${record.Password}`);
                            messageApi.success(`Copied ${record.UsernameRoblocc}`)
                        }}><CopyOutlined /> Copy username/password</a>,
                        key: '1',
                    },
                    {
                        label: <a onClick={() => {
                            const data = JSON.parse(record.Description)
                            let Rods = data['Rods']
                            var RodSTR = ''
                            Rods.map((item: any, index: number) => {
                                RodSTR += item + ' - '
                            })
                            navigator.clipboard.writeText(`${record.UsernameRoblocc}/${record.Password}/${record.Cookie}/${data['PlayerInfo']['Level']}/${data['PlayerInfo']['Coins']}/${RodSTR.substring(0, RodSTR.length - 2)}/${data['Inventory']['Enchant Relic']}`
                            );
                            messageApi.success(`Copied ${record.UsernameRoblocc}`)
                        }}><CopyOutlined /> Copy full data</a>,
                        key: '2',
                    },
                    {
                        label: <a onClick={() => {
                            //console.log(`Copied: ${record.UsernameRoblocc}/${record.Password}`)
                            markCompleted(record.UsernameRoblocc).then((res) => {
                                console.log(res)
                                messageApi.success(`Account: ${record.UsernameRoblocc} is completed`);
                                refreshData()
                            })
                        }}><CheckOutlined/> Mark Completed Account</a>,
                        key: '3',
                    },
                    {
                        label: <a onClick={() => {
                            //console.log(`Copied: ${record.UsernameRoblocc}/${record.Password}`)
                            deleteData(record.UsernameRoblocc).then((res) => {
                                messageApi.success(`Deleted account: ${record.UsernameRoblocc} !`);
                                refreshData()
                            })
                        }}><DeleteOutlined/> Delete Account</a>,
                        key: '4',
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
        {modalContextHolder}
        <Row justify={'start'}>
            <Divider orientation="left">Roblocc Panel - Fisch</Divider>
            <Col span={24} style={{padding: 6}}>
                <Card variant="borderless" title={"Account Overview"} size={"small"}>
                    <Row gutter={[12,12]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Card size="small" title="Account Control" extra={
                                // <Export data={dataDefault} gameName={'KingLegacy'} />
                                "cac"
                            }>
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
                                    </Space>
                                </div>

                                <div style={{marginTop: 12}}>
                                    <Checkbox
                                        onChange={onChangeHidename}>
                                        Hide name (optional)
                                    </Checkbox>
                                </div>

                                {/*<div style={{marginTop: 12}}>*/}
                                {/*    <Form>*/}
                                {/*        <Form.Item>*/}
                                {/*            <Dragger {...props}>*/}
                                {/*                <p className="ant-upload-drag-icon">*/}
                                {/*                    <InboxOutlined/>*/}
                                {/*                </p>*/}
                                {/*                <p className="ant-upload-text">Click or drag file to this area to upload*/}
                                {/*                    account into panel</p>*/}
                                {/*                <p className="ant-upload-hint">*/}
                                {/*                    {"Supported only .txt file and formatted file accounts => username/password/cookie"}*/}
                                {/*                </p>*/}
                                {/*            </Dragger>*/}

                                {/*        </Form.Item>*/}
                                {/*    </Form>*/}

                                {/*</div>*/}

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
        </Row>
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{paddingTop: 32}}>
                <Flex gap="small" justify={"flex-end"}>
                    <Dropdown menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Button>
                                Action
                                <DownOutlined />
                            </Button>
                        </a>
                    </Dropdown>
                </Flex>
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

export default KL
