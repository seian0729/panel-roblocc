
import React, {useEffect, useState} from "react";
import moment from "moment";
import { Badge, Button, Card, Checkbox, Col, Divider, Dropdown, MenuProps, message, Modal, Popconfirm, Row, Select, SelectProps, Space, Statistic, Table, Tag, Typography } from "antd";
import { CopyOutlined, DeleteOutlined, DownOutlined, FileSearchOutlined, QuestionCircleOutlined, ReloadOutlined, UserOutlined } from "@ant-design/icons";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import type {ColumnsType} from 'antd/es/table';
import {bulkDeleteData, deleteData, getData} from "../../../../services/data";

const StealABranrot: React.FC = () => {

    const { Text } = Typography;


    const [messageApi, contextHolder] = message.useMessage();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // main loading
    const [loadingTable, setLoadingTable] = useState(true);

    // loading
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingReload, setLoadingReload] = useState(false);
    const [loadingCopy, setLoadingCopy] = useState(false);

    // data api
    const [dataApi, setDataApi] = useState([]);

    // modal

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [optionsSecret, setOptionsSecret] = useState<SelectProps['options']>([])
    const [filterdSecret, setFilteredSecret] = useState([''])

    const [hidename, setHidename] = useState(false)

    const secretRenderList = [
        'Graipuss Medussi',
        'La Vacca Saturno Saturnita',
        'Los Tralaleritos'
    ]

    const getLengthSecPet = () =>{
        if (24/secretRenderList.length < 4){
            return 4
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

    const bulkDeleteAccount = () => {
        setLoadingDelete(true);
        setTimeout(() => {
            bulkDeleteData(selectedRowKeys as string[]).then(() => {
                //console.log(res);
            })
            messageApi.success(`Deleted: ${selectedRowKeys.length} account !`);
            setSelectedRowKeys([]);
            setLoadingDelete(false);
            refreshData()
        }, 1000);
    };
    
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
                return a.UsernameRoblocc.localeCompare(b.UsernameRoblocc)
            },
        },
        {
            title: 'Pet',
            dataIndex: 'Pet',
            width: '70%',
            render: (_, record) => {
                const Pets = JSON.parse(record.Description)['Pets']

                 return (
                    <Tag 
                        color="error" 
                    >
                        {`${Pets.length} Secret`}
                    </Tag>
                )
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
            totalPets += Pets.length || 0
        })
        return totalPets
    }

    const getTotalSecretPetByName = (petName: string) => {
        let pets = 0
        dataApi.forEach((item: DataType) => {
            const Pets = JSON.parse(item.Description)['Pets']
            if (Pets.length > 0){
                Pets.forEach((item: string) => {
                    if (item == petName){
                        pets++
                    }
                })
            }
        })
        return pets
    }

    const copyTotalSecret = () =>{
        let str = ''
        dataApi.forEach((item: DataType) => {
            const Pets = JSON.parse(item.Description)['Pets']
            type petDataType = {
                [key: string]: any
            }
            let pets: petDataType = {}
            if (Pets.length > 0){
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
            }
            let petstr = ''
            Object.keys(pets).forEach(key => {
                petstr += `${pets[key]['amount']}x ${pets[key]['name']} `
            });
            str += `${item.UsernameRoblocc}: ${petstr} \n`
        })
        navigator.clipboard.writeText(str);
        messageApi.success(`Copied secret pets into clipboard <3`);
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
            if (Pets.length > 0){
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
                         <Card size={"small"} variant="borderless" title={"Pets"} key={'pet'}>
                            <Row gutter={[12,12]}>
                                {
                                    secretRenderList.map((petName: string) => {
                                        return (<Col span={24} xs={12} sm={12} md={getLengthSecPet()} key={petName}>
                                            <Card size={"small"} >
                                                <Statistic title={petName} value={getTotalSecretPetByName(petName)}/>
                                            </Card>
                                        </Col>)
                                    })
                                }
                            </Row>
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
                                        danger 
                                        size={"small"}
                                        icon={<DeleteOutlined />}
                                    >
                                        {
                                            selectedRowKeys.length > 0 
                                            &&  `Delete ${selectedRowKeys.length} Account` 
                                            || 'Delete Account'

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