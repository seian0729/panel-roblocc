import {
    Col,
    Row,
    Divider,
    Button,
    message,
    Table,
    Tag,
    Space,
    Select,
    Form,
    Popconfirm
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import type { ColumnsType  } from 'antd/es/table';
import {deleteData, getData} from "../../../services/data";
/*
import {array, string} from "decoders";
import {count, countBy, forEach} from "ramda";
import type { FilterConfirmProps } from 'antd/es/table/interface';
 */
import moment from "moment";

const { Option } = Select
function DataCompoment()
{

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // loading
    const [loading, setLoading] = useState(false);
    const [loadingR, setLoadingR] = useState(false);
    const [loadingC, setLoadingC] = useState(false);

    // data
    const [dataApi, setDataApi] = useState([]);
    //dataSpecialFilter
    const [dataApiSpecialFilter, setDataApiSpecialFilter] = useState([]);
    const [specialFilter, setSpecialFilter] = useState([]);

    // page pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    //Sort - Data

    const [dataValue, setDataValue] = useState('Level')

    const handleData = (val: { value: any}) => {
        setDataValue(val.value)
    }

    const confirm = () => {
        message.info('Clicked on Yes.');
    };

    const refreshData = () =>{
        setLoadingR(true);
        // ajax request after empty completing
        setTimeout(() => {
            getData().then((res) => {
                setDataApi(res.data);
            })

            messageApi.success('Refresh Success <3');
            setSelectedRowKeys([]);
            setLoadingR(false);
        }, 1000);
    }

    const deleteAccount = () => {
        setLoading(true);
        setTimeout(() => {
            deleteData(selectedRowKeys as string[]).then((res) => {
                //console.log(res);
            })
            messageApi.success(`Deleted: ${selectedRowKeys.length} account !`);
            setSelectedRowKeys([]);
            setLoading(false);
            refreshData()
        }, 1000);
    };


    const copyData = () => {
        setLoadingC(true);
        // ajax request after empty completing
        setTimeout(() => {
            let text = '';
            selectedRowKeys.forEach((item) => {
                text += item + '\n'
            })
            navigator.clipboard.writeText(text);
            messageApi.success(`Copied ${selectedRowKeys.length} account into clipboard <3`);
            setSelectedRowKeys([]);
            setLoadingC(false);
        },1000)
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
        level: number;
        df: string;
        awakened: string[];
        special: string[];
        fightingStyle: string[];
        Note: string;
        Description: string;
        updatedAt: string;
        accountStatus: string;
    }

    // variable

    let fstext = '';
    let fscolor = '';

    let statusColor = '';
    let statusText = ''

    const filtersNote: any [] = [];
    const filtersNoteT: any [] = [];


    // @ts-ignore
    // @ts-ignore
    const columns: ColumnsType<DataType> = [
        {
            title: 'RUsername',
            dataIndex: 'UsernameRoblocc',
            width: '10%',
        },
        {
            title: 'Data',
            width: '15%',
            filters: [
                {
                    text: 'Level 2450',
                    value: '2450',

                },
                {
                    text: '1000-1500',
                    value: '1000-1500',
                },
                {
                    text: '1500-2449',
                    value: '1500-2450',
                }
            ],
            onFilter: (value: any, record) => {
                let description = JSON.parse(record.Description);
                let dataList = description.Data
                if(value === '2450'){
                    return dataList.Level === 2450
                }
                else if(value === '1000-1500'){
                    return dataList.Level >= 1000 && dataList.Level <= 1500
                }
                else if(value === '1500-2449'){
                    return dataList.Level >= 1500 && dataList.Level < 2450
                }

                else{
                    return false
                }

            },
            sorter: (a:any, b:any) => JSON.parse(a.Description).Data[dataValue] - JSON.parse(b.Description).Data[dataValue],
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                let dataList = description.Data
                return(<>
                        <Tag color='orange'>
                            Level: {new Intl.NumberFormat().format(dataList.Level)}
                        </Tag>
                        <Tag color='purple'>
                            Fragments: {new Intl.NumberFormat().format(dataList.Fragments)}
                        </Tag>
                        <Tag color='green'>
                            Beli: {new Intl.NumberFormat().format(dataList.Beli)}
                        </Tag>
                    </>)
            }

        },

        {
            title: 'Fighting Style',
            dataIndex: 'fightingStyle',
            width: '10%',
            filters: [
                {
                    text: '0-2 Melee',
                    value: '<2'
                },
                {
                    text: '3-5 Melee',
                    value: '3-5'
                },
                {
                    text: 'Godhuman',
                    value: 'God'
                }
            ],
            onFilter: (value: any, record) => {
                let description = JSON.parse(record.Description);
                let fsList = description['Fighting Style']

                if (value === 'God'){
                    return fsList.length === 6
                }
                else if (value === '3-5'){
                    return fsList.length < 6 && fsList.length > 2
                }
                else if (value === '<2'){
                    return fsList.length < 2
                }
                else{
                    return false
                }

            },
            render: (_, record ) =>{
                let description = JSON.parse(record.Description);
                let fightingStyle = description['Fighting Style'];
                return (
                    <>
                        {fightingStyle.map(() => {
                            if (fightingStyle.length === 6) {
                                fstext = 'Godhuman';
                                fscolor = 'blue';
                            }
                            else if (fightingStyle.length > 2){
                                fstext = '3-5 Melee';
                                fscolor = 'volcano';
                            }
                            else {
                                fstext = '0-2 Melee';
                                fscolor = 'red';
                            }

                        })}
                        <Tag color={fscolor}>{fstext}</Tag>
                    </>
             )
            },
        },

        {
            title: 'DF',
            dataIndex: 'df',
            width: '5%',
            render: (_, record) => {
                let description = JSON.parse(record.Description);

                return (
                    <div>{description.Data.DevilFruit}</div>
                )

            }
        },
        {
            title: 'Awakened Abilities ',
            dataIndex: 'awakened',
            width: '10%',
            /*
            sorter: (a: { awakened: string[]; }, b: { awakened: string[]; }) => a.awakened.length - b.awakened.length,
             */
            render: (_, record   ) => {
                let description = JSON.parse(record.Description);
                let awakened = description['Awakened Abilities'];
                return (
                    <>
                        {awakened.map((key : any) => {
                            return (
                                <Tag color="green" key={key}>
                                    {key}
                                </Tag>
                            );
                        })}
                    </>

                )
            }

        },
        {
            title: 'Special',
            dataIndex: 'special',
            render: (_, record   ) => {
                let description = JSON.parse(record.Description);
                let bfData = description['Inventory']['Blox Fruit']
                let sData = description['Inventory']['Sword']
                let GData = description['Inventory']['Gun']
                let cac = '';

                return (
                    <>

                        {bfData.map((key : any) => {
                            if (key === 'Dough' || key === 'Leopard'){
                                cac += key+' / '
                            }
                        })}

                        {sData.map((key : any) => {
                            if (key === 'Cursed Dual Katana'){
                                cac += key+' / '
                            }
                        })}

                        {GData.map((key : any) => {
                            if (key === 'Soul Guitar'){
                                cac += key+' / '
                            }

                        })}

                        <Tag color={'red'}>
                            {cac.substring(0,cac.length-2)}
                        </Tag>


                    </>

                )
            }

        },
        {
          title: 'Date Update (maybe bug)',
          dataIndex: 'updateDate',
            width: '15%',
            render: (_, record   ) => {
                return(
                    <>
                        {
                            new Date(record.updatedAt).toLocaleString()
                        }
                    </>
                )
            },
            sorter: (a, b) => moment(a.updatedAt).unix() - moment(b.updatedAt).unix()
        },
        {
          title: 'Status (maybe bug)',
          dataIndex: 'accountStatus',
          width: '10%',
            filters: [
                {
                    text: 'Online',
                    value: 'Online',
                },
                {
                    text: 'Offline',
                    value: 'Offline',
                },
            ],
            onFilter: (value: any, record) => {
                if (value === 'Online'){
                    return moment().unix() - moment(record.updatedAt).unix() < 500
                }
                else if (value === 'Offline'){
                    return moment().unix() - moment(record.updatedAt).unix() >= 500
                }
                else {
                    return  false
                }

            },
            render: (_, record   ) => {
              if (moment().unix() - moment(record.updatedAt).unix() >= 500){
                  statusColor = 'red';
                  statusText = 'Offline';
              }
              else {
                  statusColor = 'green';
                  statusText = 'Online'
              }
                return(
                    <>
                        <Tag color={statusColor} key={statusText}>
                            {statusText}
                        </Tag>
                    </>
                )
            },
        },
        {
            title: 'Note',
            dataIndex: 'Note',
            width: '10%',
            render: (_, record   ) => {
                {
                    filtersNoteT.push({
                        text: record.Note,
                        value: record.Note,
                    })

                    for ( var index=0; index< filtersNoteT.length; index++ ) {
                        if (!filtersNote.find(a => a.text === filtersNoteT[index].text)){
                            filtersNote.push(filtersNoteT[index])
                        }
                    }
                }

                return(
                    <>
                        {record.Note}
                    </>
                )
            },

            filters: filtersNote,
            onFilter: (value: any, record: { Note: string; }) => record.Note.valueOf() === value,
            filterSearch: true,
        }
        ];

    // copy all value in the array

    useEffect(() => {
        getData().then((res) => {
            setDataApi(res.data);
        })

    }, [])
    useEffect(() => {
        setDataApiSpecialFilter(dataApi)
    }, [dataApi])
    function multipleInArray(arr: string | any[], values: any[]) {
        return values.every(value => {
            return arr.includes(value);
        });
    }
    let filterSpecial = () => {
        let dataApiSpecialFilterTemp = dataApiSpecialFilter;
        dataApiSpecialFilterTemp = dataApiSpecialFilterTemp.filter((item: any) => {
            let description = JSON.parse(item.Description);
            let bfData = description['Inventory']['Blox Fruit']
            let sData = description['Inventory']['Sword']
            let GData = description['Inventory']['Gun']

            const specialList: any[] = [];


            bfData.map((key : any) => {
                if (key === 'Dough' || key === 'Leopard'){
                    specialList.push(key)
                }
            })

            sData.map((key : any) => {
                if (key === 'Cursed Dual Katana'){
                    specialList.push(key)
                }
            })

            GData.map((key : any) => {
                if (key === 'Soul Guitar'){
                    specialList.push(key)
                }
            })
            //console.log(specialFilter)
            // kiểm specialFilter có trong specialList không
            return multipleInArray(specialList, specialFilter);

        })

        setDataApiSpecialFilter(dataApiSpecialFilterTemp)

    }

    useEffect(() => {
        filterSpecial()
    }, [specialFilter])
    let handleSpecialFilter = (value: any) => {
        setDataApiSpecialFilter(dataApi)
        setSpecialFilter(value)
    }

    return (
        <div>
            {contextHolder}
            <Row justify={'start'}>
                <Divider orientation="left">Roblocc Panel - Blox Fruit</Divider>
                <Col span={24}>
                <div style={{ marginBottom: 16, marginLeft: 16 }}>
                    <Space wrap>
                        <Button type="primary" onClick={copyData} disabled={!hasSelected} loading={loadingC}>Copy Data</Button>
                        <Button type="primary" onClick={refreshData} loading={loadingR}>Refresh</Button>
                        <Popconfirm
                            placement="bottom"
                            title={'Are you sure to delete?'}
                            description={`${selectedRowKeys.length} account`}
                            onConfirm={deleteAccount}
                            okText="Yes"
                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                        <Button type="primary" disabled={!hasSelected} loading={loading} danger>
                            Delete Selected Account
                        </Button>
                        </Popconfirm>
                        <span>
                          {hasSelected ? `Selected ${selectedRowKeys.length} account` : ''}
                        </span>

                    </Space>
                </div>
                </Col>

                <Col span={24}>
                <div style={{ marginBottom: 16, marginLeft: 16 }}>
                    <Form>
                        <Form.Item label="Special">
                    <Select
                        mode="multiple"
                        placeholder="Choose Special"
                        optionLabelProp="label"
                        onChange={handleSpecialFilter}
                        style={{ width: 500 }}
                    >
                        <Option value="Dough" label="Dough">
                            Dough
                        </Option>
                        <Option value="Leopard" label="Leopard">
                            Leopard
                        </Option>
                        <Option value="Cursed Dual Katana" label="Cursed Dual Katana">
                            Cursed Dual Katana
                        </Option>
                        <Option value="Soul Guitar" label="Soul Guitar">
                            Soul Guitar
                        </Option>

                    </Select>

                        </Form.Item>
                    </Form>
                </div>

                <div style={{ marginBottom: 16, marginLeft: 16 }}>
                    <Form>
                        <Form.Item label="Sort Data">
                            <Select
                                labelInValue
                                defaultValue={{ value: 'Level', label: 'Level' }}
                                style={{ width: 120 }}
                                onChange= {handleData}
                                options={[
                                    {
                                        value: 'Level',
                                        label: 'Level',
                                    },
                                    {
                                        value: 'Fragments',
                                        label: 'Fragments',
                                    },
                                    {
                                        value: 'Beli',
                                        label: 'Beli',
                                    }
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </div>

                </Col>
                <Col span={24}>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataApiSpecialFilter}
                        rowKey={(record) => record.UsernameRoblocc}
                        pagination={{
                            total: dataApiSpecialFilter.length,
                            pageSizeOptions:[
                                100,
                                200,
                                500,
                                1000,
                                2000,
                                5000
                            ],
                            showTotal: (total,range) => `${range[0]}-${range[1]} of ${total} items`,
                            current: page,
                            pageSize: pageSize,
                            onChange: (page,pageSize) => {
                                setPage(page);
                                setPageSize(pageSize);
                            }
                        }}
                    />
                </Col>
            </Row>
        </div>
    )

}

export default  DataCompoment