import type {CollapseProps, TableProps, UploadProps} from 'antd';
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Collapse,
    Divider,
    Drawer,
    FloatButton,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    theme,
    Upload,
    Progress,
    Typography,
    Tooltip,
    Dropdown
} from 'antd';
import {
    CaretRightOutlined, DownOutlined,
    ExclamationCircleOutlined, InboxOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    UserOutlined,
} from '@ant-design/icons';

import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import React, {useEffect, useState} from "react";
import type {ColumnsType} from 'antd/es/table';
import {deleteData, getData, getTotalAccount, getDataLimit} from "../../../../services/data";
import moment from "moment";
import {useStore} from "../../../../state/storeHooks";
import type { MenuProps } from 'antd';

const { Text } = Typography;
const {Option} = Select
const {Panel} = Collapse;
const { Dragger } = Upload;


function DataCompoment() {

    const {token} = theme.useToken();

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

    // data
    const [dataApi, setDataApi] = useState([]);
    const [dataLimitApi, setDataLimitApi] = useState([]);
    const [countAccount, setCountAccount] = useState(0)
    //dataSpecialFilter
    const [dataApiSpecialFilter, setDataApiSpecialFilter] = useState([]);
    const [specialFilter, setSpecialFilter] = useState([]);

    // page pagination
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    //Sort - Data
    const [dataValue, setDataValue] = useState('Level')

    //Active
    const [active, setActive] = useState(false);
    const handleData = (val: { value: any }) => {
        setDataValue(val.value)
    }

    //Filter Specical

    const [filteredSpecial, setFilteredSpecial] = useState(false)

    //Hidename
    const [hidename, setHidename] = useState(false)
    //Render Method
    const [newRender, setNewRender] = useState(false);

    const onChangeHidename = (e: CheckboxChangeEvent) => {
        setHidename(e.target.checked)
    };

    const onChangeRender = (e: CheckboxChangeEvent) => {
        setNewRender(e.target.checked)
    };

    //Online - Offline
    let ngu

    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        // ajax request after empty completing
        setTimeout(() => {
            getData(994732206).then((res) => {
                setDataApi(res.data);
            })

            getTotalAccount().then((res) => {
                setCountAccount(res.data)
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
        dataApi.forEach((item: DataType) => {
            const update = moment(item.updatedAt).unix()
            if (moment().unix() - update <= 600) {
                temp++
            }
        })
        return temp
    }
    // get online for each note

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
            if (moment().unix() - update <= 600) {
                temp.find((item: DrawerProps) => item.note === note)!.online++
            }
        })
        //console.log(temp)
        return temp
    }

    const getOffline = () => {
        var temp = 0
        dataApi.forEach((item: DataType) => {
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

            dataApiSpecialFilter.forEach((item: DataType) => {
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
            dataApiSpecialFilter.forEach((item: DataType) => {
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
                    let fullyCData = '';

                    fullyCData += 'Level: ' + new Intl.NumberFormat().format(dataList.Level)
                    fullyCData += ' - Fragments: ' + new Intl.NumberFormat().format(dataList.Fragments)
                    fullyCData += ' - Beli: ' + new Intl.NumberFormat().format(dataList.Beli)

                    bfData.map((key: any) => {
                        if (typeof (key) == 'string' && (key === 'Dough' || key === 'Leopard'|| key === 'Mammoth')) {
                            specaiCData += key + ' - '
                        } else if (typeof (key) == 'object' && (key.Name === 'Dough' || key.Name === 'Leopard' || key.Name === 'Mammoth')) {
                            specaiCData += key.Name + ' - '
                        }
                    })

                    sData.map((key: any) => {
                        if (typeof (key) == 'string' && key === 'Cursed Dual Katana') {
                            specaiCData += key + ' - '
                        } else if (typeof (key) == 'object' && key.Name === 'Cursed Dual Katana') {
                            specaiCData += key.Name + ' - '
                        }
                    })

                    GData.map((key: any) => {
                        if (typeof (key) == 'string' && key === 'Soul Guitar') {
                            specaiCData += key + ' - '
                        } else if (typeof (key) == 'object' && key.Name === 'Soul Guitar') {
                            specaiCData += key.Name + ' - '
                        }
                    })

                    MGata.map((key: any) => {
                        if (typeof (key) == 'string' && key === 'Mirror Fractal') {
                            specaiCData += key + ' - '
                        } else if (typeof (key) == 'object' && key.Name === 'Mirror Fractal') {
                            specaiCData += key.Name + ' - '
                        }
                    })

                    WGata.map((key: any) => {
                        if (typeof (key) == 'string' && key === 'Valkyrie Helm') {
                            specaiCData += key + ' - '
                        } else if (typeof (key) == 'object' && key.Name === 'Valkyrie Helm') {
                            specaiCData += key.Name + ' - '
                        }
                    })

                    fightingStyle.map(() => {
                        if (fightingStyle.length === 6) {
                            fstext = 'Godhuman';
                        } else if (fightingStyle.length > 2) {
                            fstext = '3-5 Melee';
                        } else {
                            fstext = '0-2 Melee';
                        }
                    })

                    text += item.UsernameRoblocc + '-' + item.Password + '/' + item.Cookie + '/' + fullyCData + '/' + itemDescript.Data.DevilFruit + '/'
                        + itemDescript['Awakened Abilities'] + '/' + fstext + '/' + specaiCData.substring(0, specaiCData.length - 2) + "\n"
                }
            })

            navigator.clipboard.writeText(text);
            messageApi.success(`Copied ${selectedRowKeys.length} account into clipboard <3`);
            setSelectedRowKeys([]);
            setLoadingCopy(false);
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
        accept:".txt",
        onChange({file}) {
            if (file.status !== 'uploading') {
                // console.log(file.status, file, fileList);
                if (file.status === 'done') {
                    messageApi.success('The file has been upload successfully!')
                    refreshData()
                }
                if (file.status === 'error') {
                    console.log(file.response)
                    file.response = file.response.message
                    messageApi.error(`Failed to upload ${file.name}! - ${file.response}`)
                    refreshData()
                }
            }
        },
    }

    const [openNoteDrawer, setOpenNoteDrawer] = useState(false);

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
            dataIndex: 'level',
            width: '15%',
            filters: [
                {
                    text: 'Level 2550',
                    value: '2550',

                },
                {
                    text: '1000-1500',
                    value: '1000-1500',
                },
                {
                    text: '1500-2549',
                    value: '1500-2549',
                }
            ],
            onFilter: (value: any, record) => {
                let description = JSON.parse(record.Description);
                let dataList = description.Data
                if (value == '2550') {
                    return dataList.Level === 2550
                } else if (value == '1000-1500') {
                    return dataList.Level >= 1000 && dataList.Level <= 1500
                } else if (value == '1500-2549') {
                    return dataList.Level >= 1500 && dataList.Level < 2550
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
                const items: MenuProps['items'] = [
                    {
                        label: 'Fighting Style - List',
                        key: 'list',
                        disabled: true
                    },
                    {
                        type: 'divider',
                    },
                ];

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

                        {
                            fightingStyle.map((str: string, index: number) => {
                                items?.push({
                                    key: index,
                                    label: `${index +  1}. ${str}`,
                                })
                                }
                            )
                        }

                        <Dropdown menu={{ items }}>
                            <Tag color={fscolor}>{fstext}</Tag>
                        </Dropdown>
                    </>
                )
            },
        },

        {
            title: 'DF',
            dataIndex: 'df',
            width: '5%',
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
                    <>

                        {awakened.map((key: any) => {
                            return (
                                <Tag color={key.length > 10 ? "red" : "green"} key={key} style={{margin: 4}}>
                                    {key.length > 10 ? 'None' : key}
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
            width: '15%',
            filterIcon: () => (
                <SearchOutlined style={{color: filteredSpecial ? '#729ddc' : undefined}}/>
            ),
            filterDropdown: () => {
                return (
                    <div style={{padding: 8}}>
                        <Select
                            key="cac"
                            mode="multiple"
                            placeholder="Search Special (Multiple)"
                            optionLabelProp="label"
                            onChange={handleSpecialFilter}
                            style={{width: 310, marginBottom: 8, display: 'block'}}
                        >
                            <Option value="Dough" label="Dough">
                                Dough
                            </Option>
                            <Option value="Leopard" label="Leopard">
                                Leopard
                            </Option>
                            <Option value="Mammoth" label="Mammoth">
                                Mammoth
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
                let objSortA = [];
                let objSortB = [];
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
                    if (typeof (key) == 'string' && (key === 'Dough' || key === 'Leopard' || key === 'Mammoth')) {
                        objSortA.push(key)
                    } else if (typeof (key) == 'object' && (key.Name === 'Dough' || key.Name === 'Leopard' || key.Name === 'Mammoth')) {
                        objSortA.push(key.Name)
                    }

                })

                sDataA.map((key: any) => {
                    if (typeof (key) == 'string' && key === 'Cursed Dual Katana') {
                        objSortA.push(key)
                    } else if (typeof (key) == 'object' && key.Name === 'Cursed Dual Katana') {
                        objSortA.push(key.Name)
                    }
                })

                GDataA.map((key: any) => {
                    if (typeof (key) == 'string' && key === 'Soul Guitar') {
                        objSortA.push(key)
                    } else if (typeof (key) == 'object' && key.Name === 'Soul Guitar') {
                        objSortA.push(key.Name)
                    }
                })

                MGataA.map((key: any) => {
                    if (typeof (key) == 'string' && key === 'Mirror Fractal') {
                        objSortA.push(key)
                    } else if (typeof (key) == 'object' && key.Name === 'Mirror Fractal') {
                        objSortA.push(key.Name)
                    }
                })

                WGataA.map((key: any) => {
                    if (typeof (key) == 'string' && key === 'Valkyrie Helm') {
                        objSortA.push(key)
                    } else if (typeof (key) == 'object' && key.Name === 'Valkyrie Helm') {
                        objSortA.push(key.Name)
                    }
                })


                bfDataB.map((key: any) => {
                    if (typeof (key) == 'string' && (key === 'Dough' || key === 'Leopard')) {
                        objSortB.push(key)
                    } else if (typeof (key) == 'object' && (key.Name === 'Dough' || key.Name === 'Leopard')) {
                        objSortB.push(key.Name)
                    }

                })

                sDataB.map((key: any) => {
                    if (typeof (key) == 'string' && key === 'Cursed Dual Katana') {
                        objSortB.push(key)
                    } else if (typeof (key) == 'object' && key.Name === 'Cursed Dual Katana') {
                        objSortB.push(key.Name)
                    }
                })

                GDataB.map((key: any) => {
                    if (typeof (key) == 'string' && key === 'Soul Guitar') {
                        objSortB.push(key)
                    } else if (typeof (key) == 'object' && key.Name === 'Soul Guitar') {
                        objSortB.push(key.Name)
                    }
                })

                MGataB.map((key: any) => {
                    if (typeof (key) == 'string' && key === 'Mirror Fractal') {
                        objSortB.push(key)
                    } else if (typeof (key) == 'object' && key.Name === 'Mirror Fractal') {
                        objSortB.push(key.Name)
                    }
                })

                WGataB.map((key: any) => {
                    if (typeof (key) == 'string' && key === 'Valkyrie Helm') {
                        objSortB.push(key)
                    } else if (typeof (key) == 'object' && key.Name === 'Valkyrie Helm') {
                        objSortB.push(key.Name)
                    }
                })

                return objSortA.length - objSortB.length

            },
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                let bfData = description['Inventory']['Blox Fruit']
                let sData = description['Inventory']['Sword']
                let GData = description['Inventory']['Gun']
                let MGata = description['Inventory']['Material']
                let WGata = description['Inventory']['Wear']


                const specialRender: any[] = [];

                const specialRenderShortname: any = {
                    ['Cursed Dual Katana']: 'CDK',
                    ['Soul Guitar']: 'SG',
                    ['Mirror Fractal']: 'MF',
                    ['Valkyrie Helm']: 'VH',
                    ['Dough']: 'Dough',
                    ['Leopard']: 'Leopard',
                    ['Mammoth']: 'Mammoth'
                }


                return (
                    <>
                        {bfData.map((key: any) => {
                            if (typeof (key) == 'string' && (key === 'Dough' || key === 'Leopard' || key === 'Mammoth')) {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            } else if (typeof (key) == 'object' && (key.Name === 'Dough' || key.Name === 'Leopard' || key.Name === 'Mammoth')) {
                                //strRender += key + ' / '
                                specialRender.push(key.Name)
                            }
                        })}

                        {sData.map((key: any) => {
                            if (typeof (key) == 'string' && key === 'Cursed Dual Katana') {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            } else if (typeof (key) == 'object' && key.Name === 'Cursed Dual Katana') {
                                //strRender += key + ' / '
                                specialRender.push(key.Name)
                            }
                        })}

                        {GData.map((key: any) => {
                            if (typeof (key) == 'string' && key === 'Soul Guitar') {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            } else if (typeof (key) == 'object' && key.Name === 'Soul Guitar') {
                                //strRender += key + ' / '
                                specialRender.push(key.Name)
                            }
                        })}

                        {MGata.map((key: any) => {
                            if (typeof (key) == 'string' && key === 'Mirror Fractal') {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            } else if (typeof (key) == 'object' && key.Name === 'Mirror Fractal') {
                                //strRender += key + ' / '
                                specialRender.push(key.Name)
                            }

                        })}

                        {WGata.map((key: any) => {
                            if (typeof (key) == 'string' && key === 'Valkyrie Helm') {
                                //strRender += key + ' / '
                                specialRender.push(key)
                            } else if (typeof (key) == 'object' && key.Name === 'Valkyrie Helm') {
                                //strRender += key + ' / '
                                specialRender.push(key.Name)
                            }
                        })}


                        {

                            specialRender.length == 0 ?
                                <Tag color="red" key={'none'} style={{margin: 4}}>
                                    Special Item Not Found
                                </Tag>
                                :
                                specialRender.map((key: any) => {
                                    return (
                                        <Tag color="red" key={key} style={{margin: 4}}>
                                            {specialRenderShortname[key]}
                                        </Tag>
                                    );
                                })
                        }


                    </>

                )
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
                    return moment().unix() - moment(record.updatedAt).unix() < 600
                } else if (value === 'Inactive') {
                    return moment().unix() - moment(record.updatedAt).unix() >= 600
                } else {
                    return false
                }

            },
            render: (_, record) => {
                let description = JSON.parse(record.Description);
                const items: MenuProps['items'] = [
                    {
                        label: 'Dit khoi trai cay',
                        key: '0',
                        disabled: true
                    },
                    {
                        type: 'divider',
                    },
                ];
                if ('SeaHub BF' in description){
                    let SeaHubBF = description['SeaHub BF'];
                    if (typeof(SeaHubBF) == 'object' ) {
                        const seaHubBFRender = Object.entries(SeaHubBF)
                        seaHubBFRender.map((key) => {
                            const labelKey = key[1]
                            const labelKeyB: string = labelKey as string;
                            if (moment().unix() - moment(record.updatedAt).unix() <= 600){
                                items?.push(
                                    {
                                        key: key[0],
                                        type: 'group',
                                        label: key[0],
                                        children: [
                                            {
                                                key: key[0],
                                                label: labelKeyB,
                                            },
                                        ],
                                    },
                                )
                            }
                            else
                                items?.push(
                                    {
                                        key: key[0],
                                        type: 'group',
                                        label: key[0],
                                        children: [
                                            {
                                                key: key[0],
                                                label: 'Inactive',
                                                danger: true,
                                            },
                                        ],
                                    },
                                )

                        })
                    }

                    return (
                        <>
                            <Dropdown menu={{ items }}>
                                <Badge
                                    status={moment().unix() - moment(record.updatedAt).unix() >= 600 ? 'error' : 'success'}
                                    text={
                                        <Space>
                                            {moment().unix() - moment(record.updatedAt).unix() >= 600 ? 'Inactive' : 'Active'}
                                            <DownOutlined />
                                        </Space>
                                    }/>
                            </Dropdown>

                        </>
                    )
                }
                else {
                    return (
                        <>
                            <Badge
                                status={moment().unix() - moment(record.updatedAt).unix() >= 600 ? 'error' : 'success'}
                                text={moment().unix() - moment(record.updatedAt).unix() >= 600 ? 'Inactive' : 'Active'}/>
                        </>
                    )
                }
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

    const fetchDataLimit = (page: number, pageSize: number) => {
        // console.log(`page: ${page} pageSize: ${pageSize}`)
        if (newRender) {
            setLoadingTable(true)
        }
        getDataLimit(994732206,page,pageSize).then((res) => {
            setTotalPage(res.totalData)
            setDataLimitApi(res.data)
            if (newRender) {
                setLoadingTable(false)
                sLoadingSkeTable(false)
            }
        })
    }

    // copy all value in the array

    useEffect(() => {
        getData(994732206).then((res) => {
            setDataApi(res.data);
            setLoadingTable(false)
            sLoadingSkeTable(false)
            messageApi.success('Data has been loaded')
        })
    }, [])

    useEffect(() => {
        getTotalAccount().then((res) => {
            setCountAccount(res.data)
        })
    }, [])

    useEffect(() => {
        fetchDataLimit(1, 10)
    },[pageSize])

    useEffect(() => {
        if (newRender) {
            setDataApiSpecialFilter(dataLimitApi)
        }
        else{
            setDataApiSpecialFilter(dataApi)
        }
    }, [newRender ? dataLimitApi : dataApi])

    useEffect(() =>{
        window.onfocus = function (ev) {
            setActive(true)
        };

        window.onblur = function (ev) {
            setActive(false)
        };
    })

    const AutoRefreshData = () => {
        if(active){
            refreshData()
            messageApi.success(`Automatically Refresh Data ${moment(Date.now() + 300000).fromNow() }`,10);
            messageApi.info(`Last Updated - ${moment(Date.now()).calendar()}`,60)
        }
        else{
            messageApi.error('AFK Detected - Automatically Refresh Data has been disabled')
        }
    }

    useEffect(() =>{
        const intervalId = setInterval(AutoRefreshData, 300000);
        return () => clearInterval(intervalId);
    })

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
                if (typeof (key) == 'string' && (key === 'Dough' || key === 'Leopard' || key === 'Mammoth')) {
                    specialList.push(key)
                } else if (typeof (key) == 'object' && (key.Name === 'Dough' || key.Name === 'Leopard' || key.Name === 'Mammoth')) {
                    specialList.push(key.Name)
                }

            })

            sData.map((key: any) => {
                if (typeof (key) == 'string' && key === 'Cursed Dual Katana') {
                    specialList.push(key)
                } else if (typeof (key) == 'object' && key.Name === 'Cursed Dual Katana') {
                    specialList.push(key.Name)
                }
            })

            GData.map((key: any) => {
                if (typeof (key) == 'string' && key === 'Soul Guitar') {
                    specialList.push(key)
                } else if (typeof (key) == 'object' && key.Name === 'Soul Guitar') {
                    specialList.push(key.Name)
                }
            })

            MGata.map((key: any) => {
                if (typeof (key) == 'string' && key === 'Mirror Fractal') {
                    specialList.push(key)
                } else if (typeof (key) == 'object' && key.Name === 'Mirror Fractal') {
                    specialList.push(key.Name)
                }
            })

            WGata.map((key: any) => {
                if (typeof (key) == 'string' && key === 'Valkyrie Helm') {
                    specialList.push(key)
                } else if (typeof (key) == 'object' && key.Name === 'Valkyrie Helm') {
                    specialList.push(key.Name)
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

    const {user} = useStore(({app}) => app);

    const limitacc = Number(user.unwrap().limitacc);

    const [modal, ModalcontextHolder] = Modal.useModal();

    const openModal = () => {
        modal.confirm({
            title: 'Copy Data',
            icon: <ExclamationCircleOutlined/>,
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
            <Row justify={'start'}>
                <Divider orientation="left">Roblocc Panel - Blox Fruit</Divider>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                    <Card size="small" title="Account Control">
                        <div style={{marginBottom: 16}}>
                            <Space wrap>
                                <Button type="primary"
                                        onClick={openModal}
                                        disabled={!hasSelected} loading={loadingCopy}>Copy
                                    Data</Button>

                                <Button type="primary" onClick={refreshData} loading={loadingReload}>Refresh</Button>
                                <Button type="primary" onClick={() => {
                                    setOpenNoteDrawer(true)
                                }}>Note Active</Button>
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
                                <Form.Item>
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload account into panel</p>
                                        <p className="ant-upload-hint">
                                            {"Supported only .txt file and formatted file accounts => username/password/cookie"}
                                        </p>
                                    </Dragger>

                                </Form.Item>
                            </Form>
                        </div>

                        <div style={{marginTop: 12}}>
                            <Form>
                                <Form.Item label="Hide Name (optional)*">
                                    <Checkbox onChange={onChangeHidename}/>
                                </Form.Item>
                            </Form>
                        </div>

                        { /*
                        <div style={{marginTop: 12}}>
                            <Form>
                                <Form.Item label="New Render Method (optional)*">
                                    <Checkbox onChange={onChangeRender}/>
                                </Form.Item>
                            </Form>
                        </div>
                        */
                        }

                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                    <Card size="small" title="Accounts Status">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <Card size="small" hoverable={true}>
                                    <Statistic
                                        title="Active Accounts"
                                        value={getOnline()}
                                        valueStyle={{color: '#6abe39'}}
                                        prefix={<UserOutlined/>}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <Card size="small" hoverable={true}>
                                    <Statistic
                                        title="Inactive Accounts"
                                        value={getOffline()}
                                        valueStyle={{color: '#e84749'}}
                                        prefix={<UserOutlined/>}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <Card size="small" hoverable={true}>
                                    <Statistic
                                        title="Total Accounts"
                                        value={getOffline() + getOnline()}
                                        valueStyle={{color: '#535dff'}}
                                        prefix={<UserOutlined/>}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <Card size="small" hoverable={true}>
                                    <Space direction={"vertical"} style={{width: '100%'}}>
                                        <Text type="secondary">Limit Account</Text>
                                        <Tooltip title={countAccount + " / " + limitacc + " accounts"}>
                                            <Progress percent={countAccount*(100/limitacc)} format={percent => `${percent?.toFixed(0)}%`} size="small"  status={countAccount*(100/limitacc) >= 100 ? "exception" : "success"}/>
                                        </Tooltip>
                                    </Space>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{paddingTop: 32}}>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        expandable={
                            {
                                expandedRowRender: (record, index) => {

                                    let recordInventory = JSON.parse(record.Description)['Inventory']
                                    let recordFruits = recordInventory['Blox Fruit']
                                    let recordSwords = recordInventory['Sword']
                                    let recordGuns = recordInventory['Gun']
                                    let recordWears = recordInventory['Wear']
                                    let recordMaterials = recordInventory['Material']

                                    const colorsInventory = [
                                        'default',
                                        'processing',
                                        'purple',
                                        'magenta',
                                        'error',
                                    ]
                                    recordFruits.sort((a: any, b: any) => b.Rarity - a.Rarity);
                                    recordSwords.sort((a: any, b: any) => b.Rarity - a.Rarity);
                                    recordGuns.sort((a: any, b: any) => b.Rarity - a.Rarity);
                                    recordWears.sort((a: any, b: any) => b.Rarity - a.Rarity);
                                    recordMaterials.sort((a: any, b: any) => b.Rarity - a.Rarity);
                                    // (recordInventory)

                                    const collapseItems: CollapseProps['items'] = [
                                        {
                                            key: 'bloxfruit',
                                            label: 'Blox Fruit',
                                            children: <>
                                                {
                                                    recordFruits.map((key: any) => {
                                                        if (typeof (key) == 'string') {
                                                            return (
                                                                <Tag color="geekblue" key={key} style={{margin: 4}}>
                                                                    {key}
                                                                </Tag>
                                                            );
                                                        } else if (typeof (key) == 'object') {
                                                            return (
                                                                <Tag color={colorsInventory[key.Rarity]}
                                                                     key={key.Name} style={{margin: 4}}>
                                                                    {key.Name}
                                                                </Tag>
                                                            );
                                                        }
                                                    })
                                                }
                                            </>,
                                            style: panelStyle
                                        },
                                        {
                                            key: 'sword',
                                            label: 'Sword',
                                            children: <>
                                                {
                                                    recordSwords.length === 0 ?
                                                        <Tag color="red">Sword Data Not Found</Tag> :
                                                        recordSwords.map((key: any) => {
                                                            if (typeof (key) == 'string') {
                                                                return (
                                                                    <Tag color="geekblue" key={key}
                                                                         style={{margin: 4}}>
                                                                        {key}
                                                                    </Tag>
                                                                );
                                                            } else if (typeof (key) == 'object') {
                                                                return (
                                                                    <Tag color={colorsInventory[key.Rarity]}
                                                                         key={key.Name} style={{margin: 4}}>
                                                                        {key.Name}
                                                                    </Tag>
                                                                );
                                                            }
                                                        })
                                                }
                                            </>,
                                            style: panelStyle
                                        },
                                        {
                                            key: 'gun',
                                            label: 'Gun',
                                            children: <>
                                                {
                                                    recordGuns.length === 0 ?
                                                        <Tag color="red">Gun Data Not Found</Tag> :
                                                        recordGuns.map((key: any) => {
                                                            if (typeof (key) == 'string') {
                                                                return (
                                                                    <Tag color="geekblue" key={key}
                                                                         style={{margin: 4}}>
                                                                        {key}
                                                                    </Tag>
                                                                );
                                                            } else if (typeof (key) == 'object') {
                                                                return (
                                                                    <Tag color={colorsInventory[key.Rarity]}
                                                                         key={key.Name} style={{margin: 4}}>
                                                                        {key.Name}
                                                                    </Tag>
                                                                );
                                                            }
                                                        })
                                                }
                                            </>,
                                            style: panelStyle
                                        },
                                        {
                                            key: 'wear',
                                            label: 'Wear',
                                            children: <>
                                                {
                                                    recordWears.length === 0 ?
                                                        <Tag color="red">Wear Data Not Found</Tag> :
                                                        recordWears.map((key: any) => {
                                                            if (typeof (key) == 'string') {
                                                                return (
                                                                    <Tag color="geekblue" key={key}
                                                                         style={{margin: 4}}>
                                                                        {key}
                                                                    </Tag>
                                                                );
                                                            } else if (typeof (key) == 'object') {
                                                                return (
                                                                    <Tag color={colorsInventory[key.Rarity]}
                                                                         key={key.Name} style={{margin: 4}}>
                                                                        {key.Name}
                                                                    </Tag>
                                                                );
                                                            }
                                                        })
                                                }
                                            </>,
                                            style: panelStyle
                                        },
                                        {
                                            key: 'materials',
                                            label: 'Material',
                                            children: <>
                                                {
                                                    recordMaterials.length === 0 ?
                                                        <Tag color="red">Material Data Not Found</Tag> :
                                                        recordMaterials.map((key: any) => {
                                                            if (typeof (key) == 'string') {
                                                                return (
                                                                    <Tag color="geekblue" key={key}
                                                                         style={{margin: 4}}>
                                                                        {key}
                                                                    </Tag>
                                                                );
                                                            } else if (typeof (key) == 'object') {
                                                                return (
                                                                    <Tag color={colorsInventory[key.Rarity]}
                                                                         key={key.Name} style={{margin: 4}}>
                                                                        {key.Name}
                                                                    </Tag>
                                                                );
                                                            }
                                                        })
                                                }
                                            </>,
                                            style: panelStyle
                                        },
                                    ]

                                    return (
                                        <Collapse
                                            bordered={false}
                                            defaultActiveKey={['1']}
                                            items={collapseItems}
                                            expandIcon={({isActive}) => <CaretRightOutlined
                                                rotate={isActive ? 90 : 0}/>}/>
                                    )
                                },
                            }

                        }
                        dataSource={dataApiSpecialFilter}
                        rowKey={(record) => record.UsernameRoblocc}
                        loading={loadingTable}
                        size={"small"}
                        pagination={{
                            total: newRender ? totalPage : dataApiSpecialFilter.length,
                            pageSizeOptions: [10, 50, 100, 500, 1000, 2000, 5000],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} accounts`,
                            position: ['topCenter'],
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            onChange: (page, pageSize) => {
                                if (newRender) {
                                    fetchDataLimit(page, pageSize)
                                }
                                else {
                                    setPage(page);
                                    setPageSize(pageSize);
                                }
                            },
                        }}
                    />
                    <FloatButton.BackTop/>
                </Col>
            </Row>
            <Drawer
                title="Active từng Note"
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
        </div>
    )
}

export default DataCompoment