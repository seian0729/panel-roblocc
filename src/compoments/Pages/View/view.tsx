import {
    Button,
    Col,
    Divider,
    FloatButton,
    Form,
    message,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Upload,
    Modal,
    Badge,
    Input,
    Statistic,
    Card,
    Collapse,
    theme,
    Skeleton,
    Checkbox
} from 'antd';
import {
    QuestionCircleOutlined,
    UploadOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
    UserOutlined,
    CaretRightOutlined,
} from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import React, {useEffect, useState} from "react";
import type {ColumnsType} from 'antd/es/table';
import {deleteData, getData} from "../../../services/data";
import type { UploadProps } from 'antd';
import moment from "moment";
import {useStore} from "../../../state/storeHooks";
import type { TableProps } from 'antd';
import {count, fromPairs} from "ramda";
import * as child_process from "child_process";
import {useSpring, animated} from "@react-spring/web";
/*
import {array, string} from "decoders";
import {count, countBy, forEach} from "ramda";
import type { FilterConfirmProps } from 'antd/es/table/interface';
 */

const {Option} = Select

const { Panel } = Collapse;

function DataCompoment() {

    /*
    function AnimatedNumber(n: number){
        const { num } = useSpring({
            from: {num: 0},
            num: n,
            delay: 200,
            config: {mass: 1, tension: 20, friction: 10},
        })
        return (
            <animated.div>
                {num.to((n) => n.toFixed(0))}
            </animated.div>
        )
    }

     */


    const { token } = theme.useToken();

    const panelStyle = {
        marginBottom: 10,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // main loading
    const [loadingSkeTable, sLoadingSkeTable] = useState(true);
    const [loadingTable, setLoadingTable] = useState(true);

    // loading
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingReload, setLoadingReload] = useState(false);
    const [loadingCopy, setLoadingCopy] = useState(false);
    const [loadingUsername, setLoadingUsername] = useState(false);

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
    const handleData = (val: { value: any }) => {
        setDataValue(val.value)
    }

    //Filter Specical

    const [filteredSpecial, setFilteredSpecial] = useState(false)

    //Hidename
    const [hidename, setHidename] = useState(false)

    const onChangeHidename = (e: CheckboxChangeEvent) => {
        setHidename(e.target.checked)
    };

    //Online - Offline
    let ngu

    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        // ajax request after empty completing
        setTimeout(() => {
            getData().then((res) => {
                setDataApi(res.data);
            })

            messageApi.success('Refresh Success <3');
            setSelectedRowKeys([]);
            setLoadingReload(false);
            setLoadingTable(false)
        }, 1000);
    }

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

    const getOnline = () => {
        var temp = 0
        dataApi.forEach((item : DataType) => {
          const update = moment(item.updatedAt).unix()
            if (moment().unix() - update <= 500) {
                temp++
            }
        })
        return temp
    }

    const getOffline = () => {
        var temp = 0
        dataApi.forEach((item : DataType) => {
          const update = moment(item.updatedAt).unix()
            if (moment().unix() - update > 500) {
                temp++
            }
        })
        return temp
    }

    const copyData = () => {
        setLoadingCopy(true);
        // ajax request after empty completing
        setTimeout(() => {
            let text = '';

            dataApiSpecialFilter.forEach((item : DataType) => {
                // if item in selectedRowKeys
                if (selectedRowKeys.includes(item.UsernameRoblocc)) {
                    text += item.UsernameRoblocc + '/' + item.Password + '/' + item.Cookie + '\n';
                }
            })

            navigator.clipboard.writeText(text);
            messageApi.success(`Copied ${selectedRowKeys.length} account into clipboard <3`);
            setSelectedRowKeys([]);
            setLoadingCopy(false);
        }, 500)
    }

    const copyFullyData = () => {
        setLoadingCopy(true);
        setTimeout(() => {
            let text = '';
            dataApiSpecialFilter.forEach((item : DataType) => {
                // if item in selectedRowKeys
                if (selectedRowKeys.includes(item.UsernameRoblocc)) {
                    const itemDescript = JSON.parse(item.Description)
                    let dataList = itemDescript.Data
                    let fightingStyle = itemDescript['Fighting Style']
                    let bfData = itemDescript['Inventory']['Blox Fruit']
                    let sData = itemDescript['Inventory']['Sword']
                    let GData = itemDescript['Inventory']['Gun']
                    let MGata = itemDescript['Inventory']['Material']
                    let WGata = itemDescript['Inventory']['Wear']
                    let specaiCData = '';
                    let fullyCData ='';

                    fullyCData += 'Level: ' + new Intl.NumberFormat().format(dataList.Level)
                    fullyCData += ' - Fragments: ' + new Intl.NumberFormat().format(dataList.Fragments)
                    fullyCData += ' - Beli: ' + new Intl.NumberFormat().format(dataList.Beli)

                    {bfData.map((key: any) => {
                        if (key === 'Dough' || key === 'Leopard') {
                            specaiCData += key + ' - '
                        }
                    })}

                    {sData.map((key: any) => {
                        if (key === 'Cursed Dual Katana') {
                            specaiCData += key + ' - '
                        }
                    })}

                    {GData.map((key: any) => {
                        if (key === 'Soul Guitar') {
                            specaiCData += key + ' - '
                        }

                    })}

                    {MGata.map((key: any) => {
                        if (key === 'Mirror Fractal') {
                            specaiCData += key + ' / '
                        }

                    })}

                    {WGata.map((key: any) => {
                        if (key === 'Valkyrie Helm') {
                            specaiCData += key + ' / '
                        }

                    })}

                    {fightingStyle.map(() => {
                        if (fightingStyle.length === 6) {
                            fstext = 'Godhuman';
                        } else if (fightingStyle.length > 2) {
                            fstext = '3-5 Melee';
                        } else {
                            fstext = '0-2 Melee';
                        }

                    })}

                    text += item.UsernameRoblocc + '-' + item.Password + '/' + item.Cookie + '/' + fullyCData + '/' + itemDescript.Data.DevilFruit + '/'
                        + itemDescript['Awakened Abilities'] + '/' + fstext + '/' +  specaiCData.substring(0, specaiCData.length - 2) + "\n"
                }
            })

            navigator.clipboard.writeText(text);
            messageApi.success(`Copied ${selectedRowKeys.length} account into clipboard <3`);
            setSelectedRowKeys([]);
            setLoadingCopy(false);
        }, 500)
    }

    const copyUsername = () => {
        setLoadingUsername(true);
        // ajax request after empty completing
        setTimeout(() => {
            let text = '';
            selectedRowKeys.forEach((item : any) => {
                text += item + '\n';
            })
            navigator.clipboard.writeText(text);
            messageApi.success(`Copied ${selectedRowKeys.length} username into clipboard <3`);
            setSelectedRowKeys([]);
            setLoadingUsername(false);
        }, 500)
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
    const props: UploadProps = {
        name: 'file',
        listType: 'text',
        action: 'https://api.chimovo.com/v1/data/bulkUpdatePasswordAndCookie',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        onChange({ file}) {
            if (file.status !== 'uploading') {
                // console.log(file.status, file, fileList);
                if (file.status === 'done'){
                    messageApi.success('The file has been upload successfully!')
                }
                if (file.status === 'error'){
                    messageApi.error(`Failed to upload ${file.name}! - ${file.response.message}`)
                }
            }
        },
    }
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
        Password: string;
        Cookie: string;
        dataChildren?: DataType[]
    }

    // variable

    let fstext = '';
    let fscolor = '';

    const filtersNote: any [] = [];
    const filtersNoteT: any [] = [];

    const handleChange: TableProps<DataType>['onChange'] = (filters, sorter) => {
        // console.log('Various parameters', filters, sorter);
    };

    // @ts-ignore
    const columns: ColumnsType<DataType> = [
        {
            title: 'Roblox Username',
            dataIndex: 'UsernameRoblocc',
            width: '10%',
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
            title: 'Data',
            dataIndex: 'level',
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
                    value: '1500-2449',
                }
            ],
            onFilter: (value: any, record) => {
                let description = JSON.parse(record.Description);
                let dataList = description.Data
                if (value == '2450') {
                    return dataList.Level === 2450
                } else if (value == '1000-1500') {
                    return dataList.Level >= 1000 && dataList.Level <= 1500
                } else if (value == '1500-2449') {
                    return dataList.Level >= 1500 && dataList.Level < 2450
                } else {
                    return false
                }
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description).Data[dataValue] - JSON.parse(b.Description).Data[dataValue],
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                let dataList = description.Data
                return (<div>
                    <Tag color='orange' style={{margin: 4}}>
                        Level: {new Intl.NumberFormat().format(dataList.Level)}
                    </Tag>
                    <div>
                        <Tag color='purple' style={{margin: 4}}>
                            Fragments: {new Intl.NumberFormat().format(dataList.Fragments)}
                        </Tag>
                        <Tag color='green' style={{margin: 4}}>
                            Beli: {new Intl.NumberFormat().format(dataList.Beli)}
                        </Tag>
                    </div>
                </div>)
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

                if (value === 'God') {
                    return fsList.length === 6
                } else if (value === '3-5') {
                    return fsList.length < 6 && fsList.length > 2
                } else if (value === '<2') {
                    return fsList.length < 2
                } else {
                    return false
                }

            },
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                let fightingStyle = description['Fighting Style'];
                return (
                    <>
                        {fightingStyle.map(() => {
                            if (fightingStyle.length === 6) {
                                fstext = 'Godhuman';
                                fscolor = 'blue';
                            } else if (fightingStyle.length > 2) {
                                fstext = '3-5 Melee';
                                fscolor = 'volcano';
                            } else {
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
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style={{ padding: 8 }}>
                <Input
                  placeholder="Search DF"
                  value={selectedKeys[0]}
                  onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                  onPressEnter={() => confirm()}
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                  type="primary"
                  onClick={() => confirm()}
                  style={{ width: 90, marginRight: 8 }}
                >
                  Search
                </Button>
                <Button
                  onClick={() => clearFilters?.()}
                  style={{ width: 90 }}
                >
                  Reset
                </Button>
              </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#729ddc' : undefined }} />
            ),
            onFilter: (value, record) => {
                let description = JSON.parse(record.Description);
                return (
                  typeof description.Data.DevilFruit === 'string' &&
                  typeof value === 'string' &&
                  description.Data.DevilFruit.toLowerCase().includes(value.toLowerCase())
                );
              },
            render: (_, record) => {
              let description = JSON.parse(record.Description);
              return <div>{description.Data.DevilFruit}</div>;
            },
          },
          
        {
            title: 'Awakened Abilities',
            dataIndex: 'awakened',
            width: '10%',
            sorter: (a: any, b: any) => JSON.parse(a.Description)['Awakened Abilities'].length - JSON.parse(b.Description)['Awakened Abilities'].length,
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                let awakened = description['Awakened Abilities'];
                return (
                    <Space>

                        {awakened.map((key: any) => {
                            return (
                                <Tag color={key.length > 10 ? "red" : "green"} key={key}>
                                    {key.length > 10 ? 'None' : key }
                                </Tag>
                            );
                        })}
                    </Space>

                )
            }

        },
        {
            title: 'Special',
            dataIndex: 'special',
            width: '15%',
            filterIcon: () => (
                <SearchOutlined style={{ color: filteredSpecial ? '#729ddc' : undefined }} />
            ),
            filterDropdown: () =>{
                return (
                    <div style={{ padding: 8 }}>
                        <Select
                            key = "cac"
                            mode="multiple"
                            placeholder="Search Special (Multiple)"
                            optionLabelProp="label"
                            onChange={handleSpecialFilter}
                            style={{width: 310, marginBottom: 8, display: 'block' }}
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
                            <Option value="Mirror Fractal" label="Mirror Fractal">
                                Mirror Fractal
                            </Option>
                            <Option value="Valkyrie Helm" label="Valkyrie Helm">
                                Valkyrie Helm
                            </Option>
                        </Select>
                    </div>
                )
            },
            sorter: (a: any, b: any) => {
                let strSortA = '';
                let strSortB = '';
                let descriptionA = JSON.parse(a.Description);
                let descriptionB = JSON.parse(b.Description);
                let bfDataA = descriptionA['Inventory']['Blox Fruit']
                let sDataA = descriptionA['Inventory']['Sword']
                let GDataA = descriptionA['Inventory']['Gun']
                let MGataA = descriptionA['Inventory']['Material']
                let WGataA = descriptionA['Inventory']['Wear']
                let bfDataB = descriptionB['Inventory']['Blox Fruit']
                let sDataB = descriptionB['Inventory']['Sword']
                let GDataB = descriptionB['Inventory']['Gun']
                let MGataB = descriptionB['Inventory']['Material']
                let WGataB = descriptionB['Inventory']['Wear']

                bfDataA.map((key: any) => {
                    if (key === 'Dough' || key === 'Leopard') {
                        strSortA += key + ' / '
                    }
                })

                sDataA.map((key: any) => {
                    if (key === 'Cursed Dual Katana') {
                        strSortA += key + ' / '
                    }
                })

                GDataA.map((key: any) => {
                    if (key === 'Soul Guitar') {
                        strSortA += key + ' / '
                    }
                })

                {MGataA.map((key: any) => {
                    if (key === 'Mirror Fractal') {
                        strSortA += key + ' / '
                    }

                })}

                {WGataA.map((key: any) => {
                    if (key === 'Valkyrie Helm') {
                        strSortA += key + ' / '
                    }

                })}



                bfDataB.map((key: any) => {
                    if (key === 'Dough' || key === 'Leopard') {
                        strSortB += key + ' / '
                    }
                })

                sDataB.map((key: any) => {
                    if (key === 'Cursed Dual Katana') {
                        strSortB += key + ' / '
                    }
                })

                GDataB.map((key: any) => {
                    if (key === 'Soul Guitar') {
                        strSortB += key + ' / '
                    }
                })

                {MGataB.map((key: any) => {
                    if (key === 'Mirror Fractal') {
                        strSortB += key + ' / '
                    }

                })}

                {WGataB.map((key: any) => {
                    if (key === 'Valkyrie Helm') {
                        strSortB += key + ' / '
                    }

                })}

                return strSortA.length - strSortB.length

            },
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                let bfData = description['Inventory']['Blox Fruit']
                let sData = description['Inventory']['Sword']
                let GData = description['Inventory']['Gun']
                let MGata = description['Inventory']['Material']
                let WGata = description['Inventory']['Wear']

                const specialRender : any[] = [];

                return (
                    <>

                        {bfData.map((key: any) => {
                            if (key === 'Dough' || key === 'Leopard') {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            }
                        })}

                        {sData.map((key: any) => {
                            if (key === 'Cursed Dual Katana') {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            }
                        })}

                        {GData.map((key: any) => {
                            if (key === 'Soul Guitar') {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            }

                        })}

                        {MGata.map((key: any) => {
                            if (key === 'Mirror Fractal') {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            }

                        })}

                        {WGata.map((key: any) => {
                            if (key === 'Valkyrie Helm') {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            }

                        })}

                        {
                            specialRender.map((key: any) => {
                                return (
                                    <Tag color="red" key={key} style={{margin: 4}}>
                                        {key}
                                    </Tag>
                                );
                            })
                        }


                    </>

                )
            }

        },
        {
            title: 'Date Update',
            dataIndex: 'updateDate',
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
                    return moment().unix() - moment(record.updatedAt).unix() < 500
                } else if (value === 'Inactive') {
                    return moment().unix() - moment(record.updatedAt).unix() >= 500
                } else {
                    return false
                }

            },
            render: (_, record) => {
                return (
                    <>
                        <Badge status={moment().unix() - moment(record.updatedAt).unix() >= 500 ? 'error' : 'success' }
                               text={moment().unix() - moment(record.updatedAt).unix() >= 500 ? 'Inactive' : 'Active'} />
                    </>
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
        }
    ];

    // copy all value in the array

    useEffect(() => {

        getData().then((res) => {
            setDataApi(res.data);
            setLoadingTable(false)
            sLoadingSkeTable(false)
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
            let MGata = description['Inventory']['Material']
            let WGata = description['Inventory']['Wear']

            const specialList: any[] = [];


            bfData.map((key: any) => {
                if (key === 'Dough' || key === 'Leopard') {
                    specialList.push(key)
                }
            })

            sData.map((key: any) => {
                if (key === 'Cursed Dual Katana') {
                    specialList.push(key)
                }
            })

            GData.map((key: any) => {
                if (key === 'Soul Guitar') {
                    specialList.push(key)
                }
            })

            MGata.map((key: any) => {
                if (key === 'Mirror Fractal') {
                    specialList.push(key)
                }
            })

            WGata.map((key: any) => {
                if (key === 'Valkyrie Helm') {
                    specialList.push(key)
                }
            })

            //console.log(specialFilter)
            // kiểm specialFilter có trong specialList không
            setFilteredSpecial(!multipleInArray(specialList, specialFilter))
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

    const { user } = useStore(({ app }) => app);

    let { username } = user.unwrap();

    const [modal, ModalcontextHolder] = Modal.useModal();

    // console.log(getOnline())
    // console.log(getOffline())

    const openModal = () => {
        modal.confirm({
            title: 'Copy Data',
            icon: <ExclamationCircleOutlined />,
            content: 'Select method copy data',
            okText: 'Fully Data',
            cancelText: 'Basic Data',
            onOk: copyFullyData,
            onCancel: copyData
        });
    }

    return (

        <div>
            {contextHolder}
            {ModalcontextHolder}
            <Row justify={'start'} >
                <Divider orientation="left">Roblocc Panel - Blox Fruit</Divider>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                    <Card title="Account Control">
                        <div style={{marginBottom: 16}}>
                            <Space wrap>
                                <Button type="primary" onClick={username === "Chim" || "Chimmm" ? openModal : copyData} disabled={!hasSelected} loading={loadingCopy}>Copy
                                    Data</Button>
                                <Button type="primary" onClick={copyUsername} disabled={!hasSelected} loading={loadingUsername}>Copy
                                    Username</Button>

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
                        </div>

                        <div>
                            <Form>
                                <Form.Item label="Sort Data">
                                    <Select
                                        labelInValue
                                        defaultValue={{value: 'Level', label: 'Level'}}
                                        style={{width: 120}}
                                        onChange={handleData}
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
                        <div>
                            <Form>
                                <Form.Item label="Import">
                                    <Upload {...props}>
                                        <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                                    </Upload>

                                </Form.Item>
                                Ghi chú: File import phải là file .txt và định dạng như sau: username/password/cookie
                            </Form>
                        </div>

                        <div style={{marginTop: 12}}>
                            <Form>
                                <Form.Item label="Hide Name (optional)*">
                                    <Checkbox  onChange={onChangeHidename} />
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                    <Card title="Account Status">
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{paddingRight: 12}}>
                                <Card bordered={false}>
                                    <Statistic
                                        title="Active"
                                        value={getOnline()}
                                        valueStyle={{ color: '#6abe39' }}
                                        prefix={<UserOutlined />}
                                        suffix="Account(s)"
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}  style={{paddingLeft: 12}}>
                                <Card bordered={false}>
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
                                expandable={
                                    {expandedRowRender: (record, index) => {

                                            let recordInventory = JSON.parse(record.Description)['Inventory']
                                            let recordFruits = recordInventory['Blox Fruit']
                                            let recordSwords = recordInventory['Sword']
                                            let recordGuns = recordInventory['Gun']
                                            let recordWears = recordInventory['Wear']
                                            let recordMaterials = recordInventory['Material']
                                            // (recordInventory)

                                            return (
                                                <Collapse
                                                    bordered={false}
                                                    defaultActiveKey={['1']}
                                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                                >
                                                    <Panel header="Blox Fruit" key="1" style={panelStyle}>
                                                        {
                                                            recordFruits.map((key: any) => {
                                                                return (
                                                                    <Tag color="geekblue" key={key}>
                                                                        {key}
                                                                    </Tag>
                                                                );
                                                            })
                                                        }
                                                    </Panel>

                                                    <Panel header="Sword" key="2" style={panelStyle}>
                                                        {
                                                            recordSwords.length === 0 ? <Tag color="red">Sword Data Not Found</Tag> :
                                                                recordSwords.map((key: any) => {
                                                                    return (
                                                                        <Tag color="geekblue" key={key}>
                                                                            {key}
                                                                        </Tag>
                                                                    );
                                                                })
                                                        }
                                                    </Panel>

                                                    <Panel header="Gun" key="3" style={panelStyle}>
                                                        {
                                                            recordGuns.length === 0 ? <Tag color="red">Gun Data Not Found</Tag> :
                                                                recordGuns.map((key: any) => {
                                                                    return (
                                                                        <Tag color="geekblue" key={key}>
                                                                            {key}
                                                                        </Tag>
                                                                    );
                                                                })
                                                        }
                                                    </Panel>

                                                    <Panel header="Wear" key="4" style={panelStyle}>
                                                        {
                                                            recordWears.length === 0 ? <Tag color="red">Wear Data Not Found</Tag> :
                                                                recordWears.map((key: any) => {
                                                                    return (
                                                                        <Tag color="geekblue" key={key}>
                                                                            {key}
                                                                        </Tag>
                                                                    );
                                                                })
                                                        }
                                                    </Panel>

                                                    <Panel header="Material" key="5" style={panelStyle}>
                                                        {
                                                            recordMaterials.length === 0 ? <Tag color="red">Material Data Not Found</Tag> :
                                                                recordMaterials.map((key: any) => {
                                                                    return (
                                                                        <Tag color="geekblue" key={key}>
                                                                            {key}
                                                                        </Tag>
                                                                    );
                                                                })
                                                        }
                                                    </Panel>

                                                </Collapse>
                                            )
                                        },
                                    }

                                }
                                dataSource={dataApiSpecialFilter}
                                rowKey={(record) => record.UsernameRoblocc}
                                loading = {loadingTable}
                                pagination={{
                                    total: dataApiSpecialFilter.length,
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
        </div>
    )
}

export default DataCompoment
