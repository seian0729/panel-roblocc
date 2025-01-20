import React, {useEffect, useState} from "react";
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    FloatButton,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Upload,
    Typography,
    Dropdown,
    Drawer,
} from 'antd';
import type { MenuProps, SelectProps } from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {UploadProps} from 'antd';
import {
    ExclamationCircleOutlined, InboxOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
} from '@ant-design/icons';

import type {CheckboxChangeEvent} from 'antd/es/checkbox';

// img
// item
import God from "../../../../assets/bloxfruit/item/Godhuman.webp"
import CDK from "../../../../assets/bloxfruit/item/Cursed_Dual_Katana.webp"
import SG from "../../../../assets/bloxfruit/item/Skull_Guitar.webp"
import SharkAnchor from "../../../../assets/bloxfruit/item/Shark_Anchor.webp"
import TTK from "../../../../assets/bloxfruit/item/True_Triple_Katana.webp"
import VH from "../../../../assets/bloxfruit/item/Valkyrie_Helm.webp"
import MF from "../../../../assets/bloxfruit/item/Mirror_Fractal.webp"
// fruit
import TRex from "../../../../assets/bloxfruit/fruits/T-RexFruit.webp"
import Dough from "../../../../assets/bloxfruit/fruits/DoughFruit.webp"
import Gas from "../../../../assets/bloxfruit/fruits/GasFruit.webp"
import Leo from "../../../../assets/bloxfruit/fruits/LeopardFruit.webp"
import Yeti from "../../../../assets/bloxfruit/fruits/YetiFruit.webp"
import Kit from "../../../../assets/bloxfruit/fruits/KitsuneFruit.webp"
import Dragon from "../../../../assets/bloxfruit/fruits/DragonFruit.webp"

import moment from "moment";

import {useStore} from "../../../../state/storeHooks";

import {bulkDeleteData, getData} from "../../../../services/data";
import {getRaceColor} from "../../../../services/bf";
import {Export} from "../Export/export";
import {RenderMythical} from "./render-data/render-mythical";
import {RenderDataCount} from "../../../utilities/render-count-data"

const { Text } = Typography;
const { Dragger } = Upload;



const BloxFruit: React.FC = () => {


    const {user} = useStore(({app}) => app);

    const {username} = user.unwrap();

    const [openNoteDrawer, setOpenNoteDrawer] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // main loading
    const [loadingTable, setLoadingTable] = useState(true);

    // loading
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingReload, setLoadingReload] = useState(false);
    const [loadingCopy, setLoadingCopy] = useState(false);

    // loading - special
    const [loadingDeleteAccounntHaveCookie, setLoadingDeleteAccounntHaveCookie] = useState(false);
    const [loadingCopyAccounntHaveCookie, setLoadingCopyAccounntHaveCookie] = useState(false);


    // data
    const [dataApi, setDataApi] = useState([]);
    //dataSpecialFilter
    const [dataApiSpecialFilter, setDataApiSpecialFilter] = useState([]);
    const [specialFilter, setSpecialFilter] = useState([]);

    //whitelist account
    const whitelistAccounts = ["Hanei","k7ndz","huy8841","winyeubop","k7ndz2"];


    //Filter Specical / Mythical Fruits

    const [filteredSpecial, setFilteredSpecial] = useState(false)

    const [mythicalFruits, setMythicalFruits] = useState([
        'Leopard',
        'Dragon',
        'Dough',
        'Mammoth',
        'Kitsune',
        'T-Rex',
        'Gas',
        'Yeti'
    ]);

    const mythicalItems = [
        'Cursed Dual Katana',
        'Skull Guitar',
        'Mirror Fractal',
        'Valkyrie Helm',
        'Shark Anchor'
    ]

    if (whitelistAccounts.find((element) => element == username) != undefined){
        mythicalItems.push('True Triple Katana')
    }

    const optionsMythical: SelectProps['options'] = [];
    const optionsMythicalFruits: SelectProps['options'] = [];
    const optionsMythicalItems: SelectProps['options'] = [];

    // Insert Mythical Items

    mythicalItems.forEach((item) => {
        optionsMythicalItems.push({
            value: item,
            label: item
        })
    })

    // Insert Mythical Fruits
    mythicalFruits.forEach((fruits) => {
        optionsMythicalFruits.push({
            value: fruits,
            label: fruits,
        })
    })

    optionsMythical.push({
        label: "Mythical Fruits",
        options: optionsMythicalFruits
    },{
        label: "Mythical Items",
        options: optionsMythicalItems
    })


    //Hidename
    const [hidename, setHidename] = useState(false)

    const onChangeHidename = (e: CheckboxChangeEvent) => {
        setHidename(e.target.checked)
    };

    //Online - Offline

    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        // ajax request after empty completing
        setTimeout(() => {
            getData(994732206).then((res) => {
                setDataApi(res.data);
            })
            messageApi.success('Refresh Success <3');
            setSelectedRowKeys([]);
            setLoadingReload(false);
            setLoadingTable(false)
        }, 1000);
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
            if (moment().unix() - update <= 900) {
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
            if (moment().unix() - update <= 900) {
                temp.find((item: DrawerProps) => item.note === note)!.online++
            }
        })
        //console.log(temp)
        return temp
    }

    const getOffline = () => {
        let temp = 0
        dataApi.forEach((item: DataType) => {
            const update = moment(item.updatedAt).unix()
            if (moment().unix() - update > 900) {
                temp++
            }
        })
        return temp
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
                        if (typeof (key) == 'object' && mythicalFruits.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    sData.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    GData.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    MGata.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    WGata.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    fightingStyle.map(() => {
                        if (fightingStyle.length === 6) {
                            fsText = 'Godhuman';
                        } else if (fightingStyle.length > 2) {
                            fsText = '3-5 Melee';
                        } else {
                            fsText = '0-2 Melee';
                        }
                    })

                    text +=
                        item.UsernameRoblocc + '/' +
                        item.Password + '/' +
                        item.Cookie + '/' +
                        fullyCData + '/' +
                        itemDescript.Data.DevilFruit + (itemDescript['Awakened Abilities'].includes("V") ? " - Full" : " - " + itemDescript['Awakened Abilities']) + '/' +
                        fsText + '/' +
                        specaiCData.substring(0, specaiCData.length - 2) + "\n"
                }
            })

            navigator.clipboard.writeText(text);
            messageApi.success(`Copied ${selectedRowKeys.length} account into clipboard <3`);
            setSelectedRowKeys([]);
            setLoadingCopy(false);
        }, 500)
    }

    const copyFullyDataAllFruit = () => {
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
                    let fullFruits = '';

                    bfData.sort((a: any, b: any) => b['Rarity'] - a['Rarity']);

                    fullyCData += 'Level: ' + new Intl.NumberFormat().format(dataList.Level)
                    fullyCData += ' - Fragments: ' + new Intl.NumberFormat().format(dataList.Fragments)
                    fullyCData += ' - Beli: ' + new Intl.NumberFormat().format(dataList.Beli)

                    bfData.map((key: any) => {
                        if (typeof (key) == 'object') {
                            fullFruits += key['Name'] + ' - '
                        }
                    })

                    sData.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    GData.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    MGata.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    WGata.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    fsText = fightingStyle.length === 6 ? "Godhuman" : fightingStyle.length > 2 ? "3-5 Melee" : "0-2 Melee"

                    text +=
                        item.UsernameRoblocc + '/' +
                        item.Password + '/' +
                        item.Cookie + '/' +
                        fullyCData + '/' +
                        itemDescript.Data.DevilFruit + (itemDescript['Awakened Abilities'].includes("V") ? " - Full" : " - " + itemDescript['Awakened Abilities']) + '/' +
                        fsText + '/' +
                        fullFruits.substring(0, fullFruits.length - 2) + '/' +
                        specaiCData.substring(0, specaiCData.length - 2) + "\n"
                }
            })

            navigator.clipboard.writeText(text);
            messageApi.success(`Copied ${selectedRowKeys.length} account into clipboard <3`);
            setSelectedRowKeys([]);
            setLoadingCopy(false);
        }, 500)
    }

    const getAmountAccountHaveCookie = () => {
        let tempCount = 0
        dataApiSpecialFilter.forEach((item: DataType) => {
            if (item.Cookie != null){
                tempCount++
            }
        })
        return tempCount
    }

    const copyDataHaveCookieAccount = () => {
        setLoadingCopyAccounntHaveCookie(true);
        setTimeout(() => {
            let text = '';
            dataApiSpecialFilter.forEach((item: DataType) => {
                // if item in has cookie
                if (item.Cookie != null){
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

                    const specialFruit: any[] = [];
                    const allMythicalFruit: any[] = [];

                    fullyCData += 'Level: ' + new Intl.NumberFormat().format(dataList.Level)
                    fullyCData += ' - Fragments: ' + new Intl.NumberFormat().format(dataList.Fragments)
                    fullyCData += ' - Beli: ' + new Intl.NumberFormat().format(dataList.Beli)

                    bfData.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalFruits.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                            specialFruit.push(key['Name'])
                        }
                        if (key['Rarity'] == 4){
                            allMythicalFruit.push(key['Name'])
                        }
                    })

                    sData.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    GData.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    MGata.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    WGata.map((key: any) => {
                        if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                            specaiCData += key['Name'] + ' - '
                        }
                    })

                    fsText = fightingStyle.length === 6 ? "Godhuman" : fightingStyle.length > 2 ? "3-5 Melee" : "0-2 Melee"

                    text += item.UsernameRoblocc + '-' +
                        item.Password + '/' +
                        item.Cookie + '/' +
                        fullyCData + '/' +
                        itemDescript.Data.DevilFruit + (itemDescript['Awakened Abilities'].includes("V") ? " - Full" : " - "+ itemDescript['Awakened Abilities']) + '/' +
                        fsText + '/' +
                        specaiCData.substring(0, specaiCData.length - 2) + '/' +
                        `Mythical Fruits: ${allMythicalFruit.length - specialFruit.length}`+ "\n"
                }
            })

            navigator.clipboard.writeText(text);
            messageApi.success(`Copied ${getAmountAccountHaveCookie()} account into clipboard <3`);
            setLoadingCopyAccounntHaveCookie(false);
        }, 500)
    }

    const deleteHaveCookieAccount = () => {
        let tempListAccount: string[] = []
        dataApiSpecialFilter.forEach((item: DataType) => {
            // if item in has cookie
            if (item.Cookie != null) {
                tempListAccount.push(item.UsernameRoblocc)
            }
        })
        setLoadingDeleteAccounntHaveCookie(true);
        bulkDeleteData(tempListAccount).then(() => {
            setTimeout(() => {
                messageApi.success(`Deleted: ${getAmountAccountHaveCookie()} account !`);
                setLoadingDeleteAccounntHaveCookie(false);
                refreshData()
            },500)
        })
    }

    // get count item

    const getTotalItem = (itemType: string, itemName: string | null) => {
        let tempItem = 0
        dataApi.forEach((item: DataType) => {
            const dataDescription = JSON.parse(item.Description);
            switch (itemType){
                case "Melee": {
                    let fightingStyle = dataDescription['Fighting Style']
                    if (fightingStyle.length == 6){
                        tempItem++
                    }
                    break
                }
                default: {
                    let itemData = dataDescription['Inventory'][itemType]
                    if (itemData.some((itemFind: any) => itemFind['Name'] == itemName)){
                        tempItem++
                    }
                }
            }
        })
        return new Intl.NumberFormat().format(tempItem)
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
        action: 'https://sv1.chimovo.com/v1/data/bulkUpdatePasswordAndCookie?GameId=994732206',
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
                    //console.log(file.response)
                    file.response = file.response.message
                    messageApi.error(`Failed to upload ${file.name}! - ${file.response}`)
                    refreshData()
                }
            }
        },
    }

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
            return (num / found.threshold).toFixed(precision) + found.suffix;
        }

        return num;
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

    let fsText = '';
    let fsColor = '';

    const filtersNote: any [] = [];
    const filtersNoteT: any [] = [];

    // @ts-ignore
    const columns: ColumnsType<DataType> = [
        {
            title: 'Account',
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
                    dataIndex: 'level',
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
                    sorter: (a: any, b: any) => JSON.parse(a.Description).Data['Level'] - JSON.parse(b.Description).Data['Level'],
                    render: (_, record) => {
                        let description = JSON.parse(record.Description);
                        let dataList = description.Data
                        return (
                            <Tag color='orange' style={{margin: 4}}>
                                {new Intl.NumberFormat().format(dataList.Level)}
                            </Tag>
                        )
                    }
                },
                {
                    title: 'Race',
                    dataIndex: 'race',
                    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                        <div style={{padding: 8}}>
                            <Input
                                placeholder="Race DF"
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
                            typeof description.Data.Race === 'string' &&
                            typeof value === 'string' &&
                            description.Data.Race.toLowerCase().includes(value.toLowerCase())
                        );
                    },
                    render: (_, record) => {
                        let description = JSON.parse(record.Description);
                        let dataList = description.Data
                        return (
                            <>
                                {
                                    dataList.Race != undefined ? <Tag color={getRaceColor(dataList.Race)} style={{margin: 4}}>
                                        {dataList.Race}
                                    </Tag> : <>
                                    -
                                    </>
                                }
                            </>
                        )
                    }
                },
                {
                    title: 'Beli',
                    dataIndex: 'beli',
                    sorter: (a: any, b: any) => JSON.parse(a.Description).Data['Beli'] - JSON.parse(b.Description).Data['Beli'],
                    render: (_, record) => {
                        let description = JSON.parse(record.Description);
                        let dataList = description.Data
                        return (
                            <Tag color='green' style={{margin: 4}}>
                                {formatNumber(dataList.Beli, 3)}
                            </Tag>
                        )
                    }
                },
                {
                    title: 'Fragments',
                    dataIndex: 'fragments',
                    sorter: (a: any, b: any) => JSON.parse(a.Description).Data['Fragments'] - JSON.parse(b.Description).Data['Fragments'],
                    render: (_, record) => {
                        let description = JSON.parse(record.Description);
                        let dataList = description.Data
                        return (
                            <Tag color='purple' style={{margin: 4}}>
                                {formatNumber(dataList.Fragments, 1)}
                            </Tag>
                        )
                    }
                },
                {
                    title: 'Melee',
                    dataIndex: 'fightingStyle',
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
                            text: 'God',
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
                    sorter: (a: any, b: any) => {
                        return JSON.parse(a.Description)['Fighting Style'].length - JSON.parse(b.Description)['Fighting Style'].length
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

                        fsText = fightingStyle.length === 6 ? "God" : fightingStyle.length > 2 ? "3-5" : "0-2"
                        fsColor = fightingStyle.length === 6 ? "blue" : fightingStyle.length > 2 ? "volcano" : "red"


                        return (
                            <>

                                {
                                    fightingStyle.map((str: string, index: number) => {
                                            items?.push({
                                                key: index,
                                                label: `${index +  1}. ${str}`,
                                            })
                                        }
                                    )
                                }

                                {
                                    fightingStyle.includes('Fighting Style Data Not Found') == true ?
                                        <Text>-</Text> :
                                        <Dropdown menu={{ items }}>
                                            <Tag color={fsColor}>{fsText}</Tag>
                                        </Dropdown>
                                }

                            </>
                        )
                    },
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
                            typeof description.Data.DevilFruit === 'string' &&
                            typeof value === 'string' &&
                            description.Data.DevilFruit.toLowerCase().includes(value.toLowerCase())
                        );
                    },
                    sorter: (a: any, b: any) => {
                        return JSON.parse(a.Description)['Awakened Abilities'].length - JSON.parse(b.Description)['Awakened Abilities'].length
                    },
                    render: (_, record) => {
                        let description = JSON.parse(record.Description);
                        let awakened = description['Awakened Abilities'];
                        const returnAwakened = () =>{
                            if (awakened.includes('Awakened Abilities Data Not Found')){
                                return "None"
                            }

                            if (awakened.includes('V'))
                            {
                                return "Full"
                            }

                            return awakened.length

                        }
                        return <>
                            <Tag color={"geekblue"}>
                                {
                                    description.Data.DevilFruit == '' ? "-" : `${description.Data.DevilFruit} | ${returnAwakened()}`
                                }
                            </Tag>
                        </>

                    },
                },
            ]
        },

        // {
        //     title: 'Awakened',
        //     dataIndex: 'awakened',
        //     width: '15%',
        //     sorter: (a: any, b: any) => JSON.parse(a.Description)['Awakened Abilities'].length - JSON.parse(b.Description)['Awakened Abilities'].length,
        //     render: (_, record) => {
        //         let description = JSON.parse(record.Description);
        //         let awakened = description['Awakened Abilities'];
        //         return (
        //             <>
        //
        //                 {
        //                     awakened.includes('Awakened Abilities Data Not Found') ?
        //                         <Text>-</Text> :
        //                         awakened.includes('V') ?
        //                             <Tag color={"green"} key={'full'} style={{margin: 4}}>
        //                                 {'Full'}
        //                             </Tag> :
        //                                 awakened.map((key: any) => {
        //                                     return (
        //                                         <Tag color={key.length > 10 ? "red" : "green"} key={key} style={{margin: 2}}>
        //                                             {key.length > 10 ? 'None' : key}
        //                                         </Tag>
        //                                     );
        //                                 })
        //                 }
        //             </>
        //
        //         )
        //     }
        //
        // },
        {
            title: 'Mythical - Item - Fruit',
            dataIndex: 'special',
            filterIcon: () => (
                <SearchOutlined style={{color: filteredSpecial ? '#729ddc' : undefined}}/>
            ),
            filterDropdown: () => {
                return (
                    <div style={{padding: 8}}>
                        <Select
                            key="cac"
                            mode="multiple"
                            placeholder="Search Mythical Items/Fruits (Multiple)"
                            optionLabelProp="label"
                            onChange={handleSpecialFilter}
                            style={{width: 310, marginBottom: 8, display: 'block'}}
                            options={optionsMythical}
                        >
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
                    if (typeof (key) == 'object' && mythicalFruits.indexOf(key['Name']) !== -1) {
                        objSortA.push(key['Name'])
                    }
                })

                sDataA.map((key: any) => {
                    if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                        objSortA.push(key['Name'])
                    }
                })

                GDataA.map((key: any) => {
                    if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                        objSortA.push(key['Name'])
                    }
                })

                MGataA.map((key: any) => {
                    if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                        objSortA.push(key['Name'])
                    }
                })

                WGataA.map((key: any) => {
                    if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                        objSortA.push(key['Name'])
                    }
                })


                bfDataB.map((key: any) => {
                    if (typeof (key) == 'object' && mythicalFruits.indexOf(key['Name']) !== -1) {
                        objSortB.push(key['Name'])
                    }
                })

                sDataB.map((key: any) => {
                    if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                        objSortB.push(key['Name'])
                    }
                })

                GDataB.map((key: any) => {
                    if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                        objSortB.push(key['Name'])
                    }
                })

                MGataB.map((key: any) => {
                    if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                        objSortB.push(key['Name'])
                    }
                })

                WGataB.map((key: any) => {
                    if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                        objSortB.push(key['Name'])
                    }
                })

                return objSortA.length - objSortB.length

            },
            children: [
                {
                    title: 'Item',
                    width: "20%",
                    render: (_, record) => {
                        return <RenderMythical data={record} type={"Item"}/>
                    },
                },
                {
                    title: 'Fruit',
                    width: "30%",
                    render: (_, record) => {
                        return <RenderMythical data={record} type={"Fruit"}/>
                    },
                }
            ],
        },
        {
            title: 'Status',
            dataIndex: 'accountStatus',
            width: '20%',
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
            sorter: (a: any, b: any) =>  moment(a.updatedAt).unix() - moment(b.updatedAt).unix(),
            render: (_, record) => {
                return (
                    <>
                        <Badge status={moment().unix() - moment(record.updatedAt).unix() >= 300 ? 'error' : 'success'}
                               text={moment(record.updatedAt).fromNow()}/>
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
    ];

    // copy all value in the array

    useEffect(() => {
        getData(994732206).then((res) => {
            setDataApi(res.data);
            setLoadingTable(false)
            messageApi.success('Data has been loaded')
        })
    }, [])

    useEffect(() => {
        setDataApiSpecialFilter(dataApi)
    }, [dataApi])

    const AutoRefreshData = () => {
        refreshData()
        messageApi.success(`Automatically Refresh Data ${moment(Date.now() + 300000).fromNow() }`,10);
        messageApi.info(`Last Updated - ${moment(Date.now()).calendar()}`,60)
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
                if (typeof (key) == 'object' && mythicalFruits.indexOf(key.Name) !== -1) {
                    specialList.push(key.Name)
                }

            })

            sData.map((key: any) => {
                if (typeof (key) == 'object' && mythicalItems.indexOf(key.Name) !== -1) {
                    specialList.push(key.Name)
                }
            })

            GData.map((key: any) => {
                if (typeof (key) == 'object' && mythicalItems.indexOf(key.Name) !== -1) {
                    specialList.push(key.Name)
                }
            })

            MGata.map((key: any) => {
                if (typeof (key) == 'object' && mythicalItems.indexOf(key.Name) !== -1) {
                    specialList.push(key.Name)
                }
            })

            WGata.map((key: any) => {
                if (typeof (key) == 'object' && mythicalItems.indexOf(key.Name) !== -1) {
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

    const [modal, ModalcontextHolder] = Modal.useModal();

    const openModal = () => {
        modal.confirm({
            title: 'Copy Data',
            icon: <ExclamationCircleOutlined/>,
            content: 'Select method copy data',
            cancelText: 'Fully Data',
            okText: 'Fully Data (All Fruit)',
            onOk: copyFullyDataAllFruit,
            onCancel: copyFullyData

        });

    }

    const dataDefault = [
        ['Username', 'Password', 'Cookie', 'Data', 'Melee', 'Fruit', 'Mythical Item', 'Mythical Fruit (Inventory)', 'Mythical Fruit (Trash)'],
    ]
    dataApiSpecialFilter.forEach((item: DataType) => {

        const dataDescription = JSON.parse(item.Description)
        let fightingStyle = dataDescription['Fighting Style']
        let bfData = dataDescription['Inventory']['Blox Fruit']
        let sData = dataDescription['Inventory']['Sword']
        let GData = dataDescription['Inventory']['Gun']
        let MGata = dataDescription['Inventory']['Material']
        let WGata = dataDescription['Inventory']['Wear']

        let stringItemData = ""

        const specialFruit: any[] = [];
        const allMythicalFruit: any[] = [];

        bfData.map((key: any) => {
            if (typeof (key) == 'object' && mythicalFruits.indexOf(key['Name']) !== -1) {
                specialFruit.push(key['Name'])
            }
            if (key['Rarity'] == 4){
                allMythicalFruit.push(key['Name'])
            }
        })

        sData.map((key: any) => {
            if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                stringItemData += key['Name'] + ' - '
            }
        })

        GData.map((key: any) => {
            if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                stringItemData += key['Name'] + ' - '
            }
        })

        MGata.map((key: any) => {
            if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                stringItemData += key['Name'] + ' - '
            }
        })

        WGata.map((key: any) => {
            if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                stringItemData += key['Name'] + ' - '
            }
        })

        fightingStyle.map(() => {
            if (fightingStyle.length === 6) {
                fsText = 'God';
            } else if (fightingStyle.length > 2) {
                fsText = '3-5 Melee';
            } else {
                fsText = '0-2 Melee';
            }
        })

        dataDefault.push([
            item.UsernameRoblocc,
            item.Password,
            item.Cookie,
            `Level: ${JSON.parse(item.Description).Data.Level} 
            - Beli: ${JSON.parse(item.Description).Data.Beli} 
            - Fragments: ${JSON.parse(item.Description).Data.Fragments}`,
            fsText,
            dataDescription.Data.DevilFruit + (dataDescription['Awakened Abilities'].includes("V") ? " - Full" : " - " + dataDescription['Awakened Abilities']),
            stringItemData.substring(0, stringItemData.length - 2),
            specialFruit.concat("").toString().substring(0,specialFruit.concat(" ").toString().length-2),
            `Mythical Fruits: ${allMythicalFruit.length - specialFruit.length}`
        ])
    })

    const dataItemRender = [
        {
            pathImg: God,
            type: 'Melee',
            itemName: 'God'
        },
        {
            pathImg: CDK,
            type: 'Sword',
            itemName: 'Cursed Dual Katana'
        },
        {
            pathImg: SG,
            type: 'Gun',
            itemName: 'Skull Guitar'
        },
        {
            pathImg: SharkAnchor,
            type: 'Sword',
            itemName: 'Shark Anchor'
        },
        {
            pathImg: TTK,
            type: 'Sword',
            itemName: 'True Triple Katana'
        },
        {
            pathImg: VH,
            type: 'Wear',
            itemName: 'Valkyrie Helm'
        },
        {
            pathImg: MF,
            type: 'Material',
            itemName: 'Mirror Fractal'
        }
    ]

    const dataFruitRender = [
        {
            pathImg: TRex,
            itemName: 'T-Rex'
        },
        {
            pathImg: Dough,
            itemName: 'Dough'
        },
        {
            pathImg: Gas,
            itemName: 'Gas'
        },
        {
            pathImg: Leo,
            itemName: 'Leopard'
        },
        {
            pathImg: Yeti,
            itemName: 'Yeti'
        },
        {
            pathImg: Kit,
            itemName: 'Kitsune'
        },
        {
            pathImg: Dragon,
            itemName: 'Dragon'
        },
    ]


    return (

        <div>
            {contextHolder}
            {ModalcontextHolder}
            <Row justify={'start'}>
                <Divider orientation="left">Roblocc Panel - Blox Fruit</Divider>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{padding: 12}}>
                    <Row gutter={[12,12]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={10}>
                            <Card size="small" title="Account Control" extra={
                                <Export data={dataDefault} gameName = {"BF"} />
                            }>

                                <div style={{marginBottom: 16}}>
                                    <Space wrap>
                                    <Button type="primary" onClick={refreshData} loading={loadingReload}>Refresh</Button>
                                        <Button type="primary"
                                                onClick={openModal}
                                                disabled={!hasSelected} loading={loadingCopy}>Copy
                                            Data</Button>

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
                                            <Button type="primary" disabled={!hasSelected} loading={loadingDelete} danger>
                                                Delete Account
                                            </Button>
                                        </Popconfirm>
                                        <Button type="primary" onClick={() => {
                                            setOpenNoteDrawer(true)
                                        }}>Note Active</Button>
                                        <span style={{color: "#f6e9e9"}}>
                                        {hasSelected ? `Selected ${selectedRowKeys.length} account` : ''}
                                        </span>

                                    </Space>
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
                            {
                                whitelistAccounts.find((element) => element == username) != undefined ?
                                    <div style={{marginTop: 16}}>
                                        <Card size={'small'} title={"Account Control 「WIP」"} extra={<Tag color={getAmountAccountHaveCookie() > 0 ? 'green' : 'red'}> {getAmountAccountHaveCookie()} </Tag>}>
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
                            <Col xs={24} sm={24} md={24} lg={24} xl={14}>
                                <Card size="small" title="Account Data「TOTAL ACCOUNT」" extra={<Tag color={'green'}>
                                    {`${getOnline()} / ${getOnline() + getOffline()}`}
                                </Tag>}>
                                    <Card size={"small"} bordered={false} title={"Inventory"}>
                                        <Row gutter={[16, 16]}>
                                            {
                                                dataItemRender.map((key) =>{
                                                    return <RenderDataCount imgItem={key['pathImg']} amountItem={getTotalItem(key['type'], key['itemName'])} itemName={key['itemName']} />
                                                })
                                            }
                                        </Row>
                                    </Card>
                                    <Card size={"small"} bordered={false} title={"Fruit"}>
                                        <Row gutter={[16, 16]}>
                                            {
                                                dataFruitRender.map((key) =>{
                                                    return <RenderDataCount imgItem={key['pathImg']} amountItem={getTotalItem('Blox Fruit', key['itemName'])} itemName={key['itemName']} />
                                                })
                                            }
                                        </Row>
                                    </Card>
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{paddingTop: 32}}>
                                <Table
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={dataApiSpecialFilter}
                                    rowKey={(record) => record.UsernameRoblocc}
                                    loading={loadingTable}
                                    size={"small"}
                                    scroll={{x: true}}
                                    bordered
                                    pagination={{
                                        total: dataApiSpecialFilter.length,
                                        pageSizeOptions: [10, 50, 100, 500, 1000, 2000, 5000],
                                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} accounts`,
                                        position: ['topCenter'],
                                        defaultPageSize: 10,
                                        showSizeChanger: true,
                                    }}
                                />
                                <FloatButton.BackTop/>
                            </Col>
                    </Row>,
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
        </div>
    )
}

export default BloxFruit
