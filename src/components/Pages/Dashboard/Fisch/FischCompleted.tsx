import React, {useEffect, useState} from "react";
import {
    deleteData,
    bulkDeleteData,
    markCompleted,
    bulkMarkCompleted, getDataCompleted,
} from "../../../../services/data";
import {
    listRodShow,
    getIndexRod,
    getColorRod
} from "../../../../services/fisch"
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
    MenuProps,
    message,
    Popconfirm,
    Row,
    Space,
    Statistic,
    Table,
    Tag,
    Flex,
    Form,
    Upload,
    Modal,
    type UploadProps
} from "antd";
import {
    CheckOutlined,
    CopyOutlined,
    DeleteOutlined,
    DownOutlined, ExclamationCircleFilled, InboxOutlined,
    LineChartOutlined,
    QuestionCircleOutlined,
    UserOutlined
} from "@ant-design/icons";

import {Export} from "../Export/export";
import showCountRods from "./data-overview/showCountRods";


const { Dragger } = Upload;

const Fisch_Completed: React.FC = () => {
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

    const whitelistAccounts = ["Hanei","k7ndz","huy8841"];

    const [loadingCopyAccounntHaveCookie, setLoadingCopyAccounntHaveCookie] = useState(false)
    const [loadingDeleteAccounntHaveCookie, setLoadingDeleteAccounntHaveCookie] = useState(false);


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

    const copyFullData = () => {
        setLoadingCopy(true);
        setTimeout(() => {
            let data = dataApi.filter((item: DataType) => selectedRowKeys.includes(item.UsernameRoblocc))
            let dataCopy = data.map((item: DataType) => {
                let Description = JSON.parse(item.Description)
                let Rods = Description['Rods']
                var RodSTR = ''
                Rods.map((item: any, index: number) => {
                    RodSTR += item + ' - '
                })
                return `${item.UsernameRoblocc}/${item.Password}/${item.Cookie}/${Description['PlayerInfo']['Level']}/${Description['PlayerInfo']['Coins']}/${RodSTR.substring(0, RodSTR.length - 2)}/${Description['Inventory']['Enchant Relic']}`
            })
            navigator.clipboard.writeText(dataCopy.join('\n'));
            messageApi.success(`Copied ${selectedRowKeys.length} account !`);
            setSelectedRowKeys([]);
            setLoadingCopy(false);
        }, 1000);
    }

    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        // ajax request after empty completing
        getDataCompleted(5750914919).then((res) => {
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
        getDataCompleted(5750914919).then((res) => {
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
    const getAmountAccountHaveCookie = () => {
        let tempCount = 0
        dataApi.forEach((item: DataType) => {
            if (item.Cookie != null){
                tempCount++
            }
        })
        return tempCount
    }

    const copyDataHaveCookieAccount = () => {
        setLoadingCopyAccounntHaveCookie(true)
        setTimeout(() => {
            let text = ""
            let dataCopy = dataApi.map((item: DataType) => {
                if (item.Cookie != null){
                    let Description = JSON.parse(item.Description)
                    let Rods = Description['Rods']
                    var RodSTR = ''
                    Rods.map((item: any, index: number) => {
                        RodSTR += item + ' - '
                    })
                    text +=`${item.UsernameRoblocc}/${item.Password}/${item.Cookie}/${Description['PlayerInfo']['Level']}/${Description['PlayerInfo']['Coins']}/${RodSTR.substring(0, RodSTR.length - 2)}/${Description['Inventory']['Enchant Relic']}\n`
                }
            })
            navigator.clipboard.writeText(text);
            messageApi.success(`Copied ${getAmountAccountHaveCookie()} account into clipboard <3`);
            setLoadingCopyAccounntHaveCookie(false);
        }, 1000);
    }

    const deleteHaveCookieAccount = () => {
        let tempListAccount: string[] = []
        dataApi.forEach((item: DataType) => {
            // if item in has cookie
            if (item.Cookie != null) {
                tempListAccount.push(item.UsernameRoblocc)
            }
        })
        setLoadingDeleteAccounntHaveCookie(true);
        bulkDeleteData(tempListAccount).then((res) => {
            setTimeout(() => {
                messageApi.success(`Deleted: ${getAmountAccountHaveCookie()} account !`);
                setLoadingDeleteAccounntHaveCookie(false);
                refreshData()
            },500)
        })
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

    const props: UploadProps = {
        name: 'file',
        listType: 'text',
        action: 'https://sv1.chimovo.com/v1/data/bulkUpdatePasswordAndCookie?GameId=5750914919',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        accept:".txt",
        onChange({file}) {
            if (file.status !== 'uploading') {
                if (file.status === 'done') {
                    messageApi.success('The file has been upload successfully!')
                    messageApi.success(file.response.message)
                    refreshData()
                }
                if (file.status === 'error') {
                    // console.log(file.response)
                    file.response = file.response.message
                    messageApi.error(`Failed to upload ${file.name}! - ${file.response}`)
                    refreshData()
                }
            }
        },
    }

    const filtersNote: any [] = [];
    const filtersNoteT: any [] = [];

    const getTotalTrident = () => {
        var countTrident = 0
        dataApi.forEach((item: DataType) => {
            let Description = JSON.parse(item.Description)
            const rods = Description['Rods']
            rods.map((item: any, index: number) => {
                if (item.search('Trident') > -1){
                    countTrident++;
                }
            })
        })
        return countTrident
    }

    const getTotalRoD = () => {
        var countRoD = 0
        dataApi.forEach((item: DataType) => {
            let Description = JSON.parse(item.Description)
            const rods = Description['Rods']
            rods.map((item: any, index: number) => {
                if (item.search('Rod Of The Depths') > -1){
                    countRoD++;
                }
            })
        })
        return countRoD
    }

    const getTotalNoLife = () => {
        var countNoLifeRod = 0
        dataApi.forEach((item: DataType) => {
            let Description = JSON.parse(item.Description)
            const rods = Description['Rods']
            rods.map((item: any, index: number) => {
                if (item.search('No-Life Rod') > -1){
                    countNoLifeRod++;
                }
            })
        })
        return countNoLifeRod
    }

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
                copyFullData()
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
            title: 'Level',
            dataIndex: 'data-level',
            key: "data-level",
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return <Tag color={"yellow"}>
                    {new Intl.NumberFormat().format(Description['PlayerInfo']['Level'])}
                </Tag>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description)['PlayerInfo']['Level'] - JSON.parse(b.Description)['PlayerInfo']['Level'],
        },
        {
            title: 'Coins',
            dataIndex: 'data-coin',
            key: "data-coin",
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                return <Tag color={"orange"}>
                    {new Intl.NumberFormat().format(Description['PlayerInfo']['Coins'])}
                </Tag>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description)['PlayerInfo']['Coins'] - JSON.parse(b.Description)['PlayerInfo']['Coins'],
        },
        {
            title: 'Rods',
            dataIndex: 'data-rod',
            key: "data-rod",
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                const Rods = Description['Rods'];
                var listRender: any[] = [];
                var tempListRender: any [] = [];

                Rods.map((item: any, index: number) => {
                    if (listRodShow.indexOf(item) !== -1){
                        //listRender.push(item)
                        tempListRender.push({
                            rodIndex: getIndexRod(item),
                            rodName: item
                        })
                    }
                })

                tempListRender.sort((a, b) => a.rodIndex - b.rodIndex)

                tempListRender.map((item) => {
                    listRender.push(item.rodName)
                })

                return <>
                    {
                        listRender.length > 0 ?
                            listRender.map((item, index) =>{
                                return <Tag key={item} color={getColorRod(item)} style={{margin: 4}}>
                                    {`${item}`}
                                </Tag>
                            }): <Tag>N/A</Tag>
                    }
                </>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description)['Rods'].length - JSON.parse(b.Description)['Rods'].length
        },
        {
            title: "Enchant Relic",
            dataIndex: 'data-enchant-relic',
            key: 'data-enchant-relic',
            width: '7%',
            render: (_, record) => {
                let Description = JSON.parse(record.Description)
                let Inventory = Description['Inventory']
                return <>{
                    Inventory['Enchant Relic'] ?
                    <Tag color={"purple"}>
                        {Inventory['Enchant Relic']}
                    </Tag> : "-"
                } </>
            },
            sorter: (a, b) => JSON.parse(a.Description)['Inventory']['Enchant Relic'] - JSON.parse(b.Description)['Inventory']['Enchant Relic']
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

    const dataDefault = [
        ['Username', 'Password', 'Cookie', 'Data', 'Rods', 'Relic'],
    ]

    const dataBeforeSORT: any[][] = [

    ]

    dataApi.forEach((item: DataType) => {
        let Description = JSON.parse(item.Description)
        let rods = Description['Rods']
        let RodSTR = ""
        rods.map((item: any, index: number) => {
            RodSTR += item + ' - '
        })
        dataBeforeSORT.push([
            item.UsernameRoblocc,
            item.Password,
            item.Cookie,
            `Level: ${Description['PlayerInfo']['Level']} - Coins: ${Description['PlayerInfo']['Coins']}`,
            RodSTR.substring(0, RodSTR.length - 2),
            Description['Inventory']['Enchant Relic']
        ])
    })

    dataBeforeSORT.sort((a, b) => b[3].length - a[3].length)

    dataDefault.push(...dataBeforeSORT)

    // TODO: Export Data

    return (<div>
        {contextHolder}
        {modalContextHolder}
        <Row justify={'start'}>
            <Divider orientation="left">Roblocc Panel - Fisch [COMPLETED ACCOUNT]</Divider>
            <Col span={24} style={{padding: 6}}>
                <Card bordered={false} title={"Account Overview"} size={"small"}>
                    <Row gutter={[12,12]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Card size="small" title="Account Control" extra={
                                <Export data={dataDefault} gameName={'Fisch'} />
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

                                <div style={{marginTop: 12}}>
                                    <Form>
                                        <Form.Item>
                                            <Dragger {...props}>
                                                <p className="ant-upload-drag-icon">
                                                    <InboxOutlined/>
                                                </p>
                                                <p className="ant-upload-text">Click or drag file to this area to upload
                                                    account into panel</p>
                                                <p className="ant-upload-hint">
                                                    {"Supported only .txt file and formatted file accounts => username/password/cookie"}
                                                </p>
                                            </Dragger>

                                        </Form.Item>
                                    </Form>

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

                            {
                                whitelistAccounts.find((element) => element == username) != undefined ?
                                    <div style={{marginTop: 12}}>
                                        <Card size={'small'} title={"Special Account Control"} extra={<Tag color={getAmountAccountHaveCookie() > 0 ? 'green' : 'red'}> {getAmountAccountHaveCookie()} account </Tag>}>
                                            <Space>
                                                <Button type="primary"
                                                        onClick={copyDataHaveCookieAccount}
                                                        disabled={getAmountAccountHaveCookie() === 0}
                                                        loading={loadingCopyAccounntHaveCookie}>
                                                    Copy Data Account
                                                </Button>

                                                <Popconfirm
                                                    placement="bottom"
                                                    title={'Are you sure to delete?'}
                                                    description={`${getAmountAccountHaveCookie()} account`}
                                                    onConfirm={deleteHaveCookieAccount}
                                                    okText="Yes"
                                                    cancelText="No"
                                                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                                >
                                                    <Button type="primary"
                                                            loading={loadingDeleteAccounntHaveCookie}
                                                            disabled={getAmountAccountHaveCookie() === 0}
                                                            danger>
                                                        Delete Account
                                                    </Button>
                                                </Popconfirm>
                                            </Space>
                                        </Card>
                                    </div>
                                    :
                                    <></>
                            }

                        </Col>
                    </Row>
                </Card>
            </Col>

            <Col span={24} style={{padding: 6}}>
                <Card bordered={false} title={"Data Overview"} size={"small"}>
                    {showCountRods(dataApi)}
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

export default Fisch_Completed