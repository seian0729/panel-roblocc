import React, {useEffect, useState} from "react";
import moment from "moment";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col, Collapse,
    Divider,
    Dropdown,
    Input,
    MenuProps,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    SelectProps,
    Space,
    Statistic,
    Table,
    Tag,
    Typography
} from "antd";
import {
    CaretRightOutlined,
    CopyOutlined,
    DeleteOutlined,
    DownOutlined,
    QuestionCircleOutlined,
    ReloadOutlined,
    SearchOutlined,
    UserOutlined
} from "@ant-design/icons";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import type {ColumnsType} from 'antd/es/table';
import {bulkDeleteData, deleteData, getData} from "../../../../services/data";
import {CollapseProps} from "antd/lib";

const StealABranrot: React.FC = () => {

    const { Text } = Typography;


    const [messageApi, contextHolder] = message.useMessage();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // main loading
    const [loadingTable, setLoadingTable] = useState(true);

    // loading
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingReload, setLoadingReload] = useState(false);
    const [loadingBulkDelete, setLoadingBulkDelete] = useState(false);

    // data api
    const [dataApi, setDataApi] = useState([]);

    // modal

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [optionsSecret, setOptionsSecret] = useState<SelectProps['options']>([])
    const [filterdSecret, setFilteredSecret] = useState([''])

    const [hidename, setHidename] = useState(false)

    const secrets = [
        'Graipuss Medussi',
        'La Vacca Saturno Saturnita',
        'Los Tralaleritos',
        'La Grande Combinasion',
        'Garama and Madundung',
        'Chimpanzini Spiderini'
    ]

    const mutations = [
        'Candy',
        'Gold',
        'Diamond',
        'Rainbow',
    ]

    function getSecretList(secrets: string[], mutations: string[]): string[] {
        const combinedResults: string[] = [];
        for (const secret of secrets) {
            for (const mutation of mutations) {
                combinedResults.push(`[${mutation}] ${secret}`);
            }
        }

        return combinedResults;
    }

    function groupSecretsByKey(secrets: string[], mutations: string[]): { [key: string]: string[] } {
        const groupedResults: { [key: string]: string[] } = {};

        groupedResults['Normal'] = [...secrets].sort();

        for (const mutation of mutations) {
            if (!groupedResults[mutation]) {
                groupedResults[mutation] = [];
            }
            for (const secret of secrets) {
                groupedResults[mutation].push(`[${mutation}] ${secret}`);
            }
            groupedResults[mutation].sort();
        }

        return groupedResults;
    }

    const secretRenderList = getSecretList(secrets, mutations)

    const groupSecretRenderList = groupSecretsByKey(secrets, mutations)

    const getLengthSecPet = () =>{
        if (24/secretRenderList.length < 6){
            return 8
        }
        return 24/secretRenderList.length
    }

    const onChangeHidename = (e: CheckboxChangeEvent) => {
        setHidename(e.target.checked)
    };

    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        getData(7709344486).then((res) => {
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
            title: 'Pet',
            dataIndex: 'Pet',
            width: '70%',
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                <div style={{padding: 8}}>
                    <Input
                        placeholder="Pet name... (include trait, mutation)"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        style={{marginBottom: 8}}
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
            onFilter: (value: any, record) => {
                const Pets = JSON.parse(record.Description)['Pets']
                return Pets?.find((valuePet: string) => {
                    return (
                        typeof value === 'string' &&
                        valuePet.toLowerCase().includes(value.toLowerCase())
                    )
                })
            },
            sorter: (a, b) => {
                const petA = JSON.parse(a.Description)['Pets']
                const petB = JSON.parse(b.Description)['Pets']
                return petA?.length - petB?.length
            },
            render: (_, record) => {
                const Pets = JSON.parse(record.Description)['Pets']

                const getTagColor = (petName: string) => {
                    const mutation = petName.match(/\[(.*?)\]/)?.[1]
                        if (mutation){
                            switch (mutation) {
                                case 'Rainbow':
                                    return 'error'
                                case 'Diamond':
                                    return 'blue'
                                case 'Gold':
                                    return 'gold'
                            }
                        }
                        return 'default'
                }


                if (Pets) {
                    return (
                        Pets.map((pet: string, index: number) => {
                            return <Tag key={`${pet}-${index}`} color={getTagColor(pet)} style={{margin: 4}}>
                                { pet }
                            </Tag>
                        })
                    )
                }
                return '-'
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
            ,
        }
    ]

    const showCopyModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        copyTotalSecret()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const getTotalSecretPets = () => {
        let totalPets = 0
        dataApi.forEach((item: DataType) => {
            const Pets = JSON.parse(item.Description)['Pets']
            totalPets += Pets && Pets.length || 0
        })
        return totalPets
    }

    const getTotalSecretPetByName = (petName: string) => {
        let pets = 0
        dataApi.forEach((item: DataType) => {
            const Pets = JSON.parse(item.Description)['Pets']
            if (Pets && Pets.length > 0){
                Pets.forEach((item: string) => {
                    if (item.includes('- ')){
                        item = item.split('- ')[1]
                    }
                    if (item == petName){
                        pets++
                    }
                })
            }
        })
        return pets == 0 ? '-' : pets
    }

    const copyTotalSecret = () =>{
        let str = ''
        dataApi.forEach((item: DataType) => {
            const Pets = JSON.parse(item.Description)['Pets']
            type petDataType = {
                [key: string]: any
            }
            let pets: petDataType = {}
            if (Pets && Pets.length > 0){
                Pets.forEach((item_: string) => {
                    if (filterdSecret.includes(item_)){
                        if(!pets[item_ + item.UsernameRoblocc]){
                            pets[item_ + item.UsernameRoblocc] = {
                                name: item_,
                                amount: 1
                            }
                        }
                        else pets[item_ + item.UsernameRoblocc]['amount']++
                    }
                })
                let petstr = ''
                Object.keys(pets).forEach(key => {
                    petstr += `${pets[key]['amount']}x ${pets[key]['name']}, `
                });
                str += `${item.UsernameRoblocc}: ${petstr.substring(0, petstr.length - 2)} \n`
            }
        })
        navigator.clipboard.writeText(str);
        messageApi.success(`Copied secret pets into clipboard <3`);
    }

    const copySelectedAccount = () => {
        let str = ''
        dataApi.forEach((item: DataType) => {
            if (selectedRowKeys.includes(item.UsernameRoblocc)) {
                str += `${item.UsernameRoblocc} \n`
            }
        })
        navigator.clipboard.writeText(str.substring(0, str.length - 2));
        messageApi.success(`Copied ${selectedRowKeys.length} Username into clipboard <3`);
    }

    const handleChangeFiltered = (value: string[]) => {
        setFilteredSecret(value)
    };

    useEffect(() => {
        refreshData()
        document.title = 'Chimovo - Giả lập 2 ngón'
    }, []);

    useEffect(() => {
        let totalPetName:any [] = []
        dataApi.forEach((item: DataType) => {
            const Pets = JSON.parse(item.Description)['Pets']
            if (Pets && Pets.length > 0){
                Pets.forEach((item: string) => {
                    if (!totalPetName.includes(item)){
                        totalPetName.push(item)
                    }
                })
            }
        })
        const options: SelectProps['options'] = [];
        totalPetName.forEach((item: string) =>{
            options.push({
                label: item,
                value: item
            })
        })
        setOptionsSecret(options)
    }, [dataApi])

    let petCollapseItem = [
        {
            key: 'normal',
            label: 'Normal',
            children: <>
                <Row gutter={[12,12]}>
                    {
                        groupSecretRenderList['Normal'].map((petName: string) => {
                            return (<Col span={24} xs={12} sm={12} xl={getLengthSecPet()} key={petName}>
                                <Card size={"small"}>
                                    <Statistic
                                        title={petName}
                                        value={getTotalSecretPetByName(petName)}
                                    />
                                </Card>
                            </Col>)
                        })
                    }
                </Row>
            </>
        },
    ]

    mutations.map((mutation: string) => {
        petCollapseItem.push({
            key: mutation,
            label: mutation,
            children: <>
                <Row gutter={[12,12]}>
                    {
                        groupSecretRenderList[mutation].map((petName: string) => {
                            return (<Col span={24} xs={12} sm={12} xl={getLengthSecPet()} key={petName}>
                                <Card size={"small"}>
                                    <Statistic
                                        title={petName}
                                        value={getTotalSecretPetByName(petName)}
                                    />
                                </Card>
                            </Col>)
                        })
                    }
                </Row>
            </>
        },)

    })


    return (
        <>
            {contextHolder}
            <Divider orientation="left">Roblocc Panel - Giả lập 2 ngón</Divider>
            <Row gutter={[12,12]}>
                <Col span={24}>
                    <Card
                        title="Total Account Data"
                        size='small'
                    >
                        <Card size={"small"} variant="borderless" title={"Data"}>
                            <Row gutter={[12,12]}>
                                <Col span={24} sm={12} md={8} xl={4}>
                                    <Card size="small">
                                        <Statistic title="Total Secret Pet" value={getTotalSecretPets()} />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                        <Card size={"small"} variant="borderless" title={"Pets"}>
                            <Collapse
                                items={petCollapseItem}
                                bordered={false}
                                size={"small"}
                                defaultActiveKey={'normal'}
                                style={{background: "transparent"}}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                            />
                        </Card>
                    </Card>
                </Col>

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
                                <Button
                                    size='small'
                                    icon={<CopyOutlined />}
                                    onClick={copySelectedAccount}
                                    disabled={selectedRowKeys.length == 0}
                                    type="primary"
                                >
                                    {`Copy ${selectedRowKeys.length == 0 && 'selected' || selectedRowKeys.length} username account`}
                                </Button>
                                <Button
                                    color="red"
                                    variant="filled"
                                    size="small"
                                    type="primary"
                                    icon={<CopyOutlined />}
                                    onClick={showCopyModal}
                                    >
                                    {`Copy Username (Secret)`}
                                </Button>
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
                                            `Delete ${selectedRowKeys.length == 0 && 'selected' || selectedRowKeys.length} account`
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

            <Modal
                title="Copy Secret Pet"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText= {'Copy'}
            >
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select pet"
                    onChange={handleChangeFiltered}
                    options={optionsSecret}
                />
            </Modal>
        </>
    )
}

export default StealABranrot