import React, {useEffect, useState} from "react";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Divider, Drawer, Dropdown,
    FloatButton,
    Form, MenuProps, message,
    Popconfirm,
    Row,
    Space,
    Statistic, Table,
    Tag,
} from "antd";
import {
    DeleteOutlined,
    DownOutlined,
    QuestionCircleOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useStore} from "../../../../state/storeHooks";
import moment from 'moment';
import {ColumnsType} from "antd/es/table";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {bulkDeleteData, deleteData, getData, getOrder} from "../../../../services/data";
import formatDuration from "format-duration";

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
const Pet99: React.FC = () => {

    const {user} = useStore(({app}) => app);

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loadingTable, setLoadingTable] = useState(true);

    //loading
    const [loadingReload, setLoadingReload] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    //data
    const [dataApi, setDataApi] = useState([]);

    //Hidename
    const [hidename, setHidename] = useState(false)

    //

    const [openNoteDrawer, setOpenNoteDrawer] = useState(false);

    interface DataType {
        Id: number
        UID: number;
        UsernameRoblocc: string;
        Description: string;
        updatedAt: string;
        Note: string;
    }

    const filtersNote: any [] = [];
    const filtersNoteT: any [] = [];

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
            title: "Data",
            dataIndex: "data",
            children: [
                {
                    title: 'Inventory',
                    dataIndex: 'Inventory',
                    key: "inventory",
                    width: '30%',
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return (
                            <>
                                {
                                    Description['Inventory'].map((key: any) => {
                                        return (
                                            <Tag color="purple" key={record.UsernameRoblocc+key['Name']} style={{margin: 4}}>
                                                {`${key['Name']} [x${(key['Count'] ? key['Count'] : 0)}]`}
                                            </Tag>
                                        );
                                    })

                                }
                            </>
                        )
                    },
                },
                {
                    title: 'Huge',
                    dataIndex: 'Huge',
                    width: '15%',
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        const colorHuge = ['default','gold','red']
                        const subName = ['','[GOLDEN]','[RAINBOW]']
                        return (
                            <>
                                {
                                    Description['Huge'] == undefined ? <> - </> :
                                        Description['Huge'].map((key: any) => {
                                            return (
                                                <Tag color={colorHuge[key['pt']]} key={record.UsernameRoblocc+key['Name']} style={{margin: 4}}>
                                                    {key['Name'] + " " +  (key['pt'] != undefined ? subName[key['pt']] : "")}
                                                </Tag>
                                            );
                                        })

                                }
                            </>
                        )
                    },
                }
            ]
        },
        {
            title: "Diamond",
            dataIndex: 'Diamond',
            width: '25%',
            children: [
                {
                    title: 'Total',
                    dataIndex: 'Diamond',
                    key: 'total-diamond',
                    width: "5%",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        return (
                            <Tag color={"cyan"}>
                                {new Intl.NumberFormat().format(Description['Farming']['Diamonds'])}
                            </Tag>
                        )
                    },
                    sorter: (a: any, b: any) => JSON.parse(a.Description)['Farming']['Diamonds'] - JSON.parse(b.Description)['Farming']['Diamonds'],
                },
                {
                    title: 'Gained',
                    dataIndex: 'DiamondGained',
                    key: 'diamond-gained',
                    width: "5%",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        if (moment().unix() - Description['Farming']['UTC'] <= 120){
                            return (
                                <Tag color={"blue"}>
                                    {new Intl.NumberFormat().format(Description['Farming']['Diamonds'] - Description['Farming']['oldDiamond'])}
                                </Tag>
                            )
                        }
                        else return "-"
                    },
                    sorter: (a: any, b: any) => (JSON.parse(a.Description)['Farming']['Diamonds'] - JSON.parse(a.Description)['Farming']['oldDiamond']) -
                        (JSON.parse(b.Description)['Farming']['Diamonds'] - JSON.parse(b.Description)['Farming']['oldDiamond']),
                },
                {
                    title: 'Per Min',
                    dataIndex: 'DiamondPMin',
                    key: 'diamond-per-min',
                    width: "5%",
                    render: (_, record) => {
                        let Description = JSON.parse(record.Description)
                        if (moment().unix() - Description['Farming']['UTC'] <= 120){
                            return (
                                <Tag color={"blue"}>
                                    {Math.floor((Description['Farming']['Diamonds'] - Description['Farming']['oldDiamond']) / Math.floor((Description['Farming']['UTC'] - Description['Farming']['oldUTC'])/60))}
                                </Tag>
                            )
                        }
                        else return "-"


                    },
                    sorter: (a: any, b: any) => (
                            (JSON.parse(a.Description)['Farming']['Diamonds'] - JSON.parse(a.Description)['Farming']['oldDiamond']) /
                            Math.floor(JSON.parse(a.Description)['Farming']['UTC'] - JSON.parse(a.Description)['Farming']['oldUTC']) ) -
                        (JSON.parse(b.Description)['Farming']['Diamonds'] - JSON.parse(b.Description)['Farming']['oldDiamond']) /
                        Math.floor(JSON.parse(b.Description)['Farming']['UTC'] - JSON.parse(b.Description)['Farming']['oldUTC']),
                }
            ]
        },
        {
            title: 'Elapsed',
            dataIndex: 'timeElapsed',
            width: '10%',
            render: (_, record) => {

                let Description = JSON.parse(record.Description)
                if (moment().unix() - Description['Farming']['UTC'] <= 120){
                    return (
                        <Tag color={"green"}>
                            {
                                formatDuration(1000 * (Description['Farming']['UTC'] - Description['Farming']['oldUTC']))
                            }
                        </Tag>
                    )
                }
                else return "-"

            },
            sorter: (a: any, b: any) => JSON.parse(a.Description)['Farming']['UTC'] - JSON.parse(b.Description)['Farming']['UTC'],
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
                    return moment().unix() - moment(record.updatedAt).unix() < 120
                } else if (value === 'Inactive') {
                    return moment().unix() - moment(record.updatedAt).unix() >= 120
                } else {
                    return false
                }

            },
            render: (_, record) => {
                return (
                    <Tag>
                        <Badge
                            status={moment().unix() - moment(record.updatedAt).unix() >= 120 ? 'error' : 'success'}
                            text={moment().unix() - moment(record.updatedAt).unix() >= 120 ? 'Inactive' : 'Active'}/>
                    </Tag>
                )
            },
        },
        {
            title: 'Note',
            dataIndex: 'Note',
            width: '10%',
            render: (_, record) => {
                {
                    filtersNoteT.push({
                        text: record.Note,
                        value: record.Note,
                    })

                    for (var index = 0; index < filtersNoteT.length; index++) {
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
            width: '30%',
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

    const onChangeHidename = (e: CheckboxChangeEvent) => {
        setHidename(e.target.checked)
    };


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        // ajax request after empty completing
        getData(3317771874).then((res) => {
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
        getData(3317771874).then((res) => {
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

    const hasSelected = selectedRowKeys.length > 0;

    const rowSelection = {
        disable: true,
        selectedRowKeys,
        onChange: onSelectChange,

    };

   //console.log(selectedRowKeys)

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
            if (moment().unix() - update <= 900) {
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
            if (moment().unix() - update <= 900) {
                temp++
            }
        })
        return temp
    }

    const getOffline = () => {
        var temp = 0
        dataApi.forEach((item: DataType) => {
            const update = moment(item.updatedAt).unix()
            if (moment().unix() - update > 900) {
                temp++
            }
        })
        return temp
    }


    return (<div>
        {contextHolder}
        <Row justify={'start'}>
            <Divider orientation="left">Roblocc Panel - Pet Simulator 99</Divider>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
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
                        <Form>
                            <Form.Item label="Hide Name (optional)*">
                                <Checkbox
                                    onChange={onChangeHidename}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </Card>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                <Card size="small" title="Accounts Status">
                    <Row gutter={[16, 16]}>
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
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{paddingTop: 32}}>
                <Table
                    columns={columnsData}
                    dataSource={dataApi}
                    rowSelection={rowSelection}
                    rowKey={(record) => record.UsernameRoblocc}
                    loading={loadingTable}
                    size={"small"}
                    scroll={{x: true}}
                    pagination={{
                        total: dataApi.length,
                        pageSizeOptions: [25, 100, 200, 500, 1000, 2000, 5000],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} accounts`,
                        position: ['topCenter'],
                        defaultPageSize: 25,
                        showSizeChanger: true,
                    }}
                    bordered
                    summary={(dataApi) => {

                        let totalDiamond = 0;
                        let diamondGained = 0;
                        let diamondPerMin = 0
                        let timeElapsed = 0;

                        let countAccount = 0;
                        let countAccountInActive = 0

                        let tempInventory: any [] = [];
                        dataApi.forEach((record) => {

                            let Farming = JSON.parse(record.Description)['Farming']

                            if (moment().unix() - moment(record.updatedAt).unix() <= 120){
                                totalDiamond += Farming['Diamonds']

                                diamondGained += Farming['Diamonds'] - Farming['oldDiamond']

                                diamondPerMin += (Farming['Diamonds'] - Farming['oldDiamond']) / Math.floor((Farming['UTC'] - Farming['oldUTC'])/60)

                                timeElapsed += Farming['UTC'] - Farming['oldUTC']

                                countAccount++;
                            }
                            else countAccountInActive++;

                            let Inventory = JSON.parse(record.Description)['Inventory']
                            Inventory.map((key: any) => {
                                const itemName = key['Name'];
                                if (!tempInventory.find((key) => key['Name'] === itemName)){
                                    tempInventory.push({Name: key['Name'], Count: 0})
                                }
                            })


                        })

                        dataApi.forEach(({Description}) => {
                            let Inventory = JSON.parse(Description)['Inventory']
                            Inventory.map((key: any) => {
                                const itemName = key['Name'];
                                const itemCount = key['Count'];
                                tempInventory.find((keyFind) => keyFind['Name'] === itemName)!.Count += itemCount
                            })
                        })

                        return(
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}> - </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                        <>
                                            {
                                                tempInventory.map((key: any) => {
                                                    return (
                                                        <Tag color="red" key={key["Name"]+"total"} style={{margin: 4}}>
                                                            {`${key['Name']} [x${(key['Count'] ? new Intl.NumberFormat().format(key['Count']) : 0)}]`}
                                                        </Tag>
                                                    );
                                                })
                                            }
                                        </>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}>
                                        <Tag color={"red"}>
                                            {new Intl.NumberFormat().format(totalDiamond)}
                                        </Tag>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}>
                                        <Tag color={"red"}>
                                            {new Intl.NumberFormat().format(diamondGained)}
                                        </Tag>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6}>
                                        <Tag color={"red"}>
                                            {new Intl.NumberFormat().format(Math.floor(diamondPerMin))}
                                        </Tag>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7}>
                                        <Tag color={"red"}>
                                            {formatDuration(1000 * (timeElapsed / countAccount))}
                                        </Tag>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={8}>
                                        <Tag>
                                            <Badge
                                                status={'success'}
                                                text={countAccount.toString()}
                                            />
                                        </Tag>
                                        <Tag>
                                            <Badge
                                                status={'error'}
                                                text={countAccountInActive.toString()}
                                            />
                                        </Tag>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={9}>-</Table.Summary.Cell>
                                    <Table.Summary.Cell index={10}>-</Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>)
                        }}
                />
                <FloatButton.BackTop/>
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

export default Pet99