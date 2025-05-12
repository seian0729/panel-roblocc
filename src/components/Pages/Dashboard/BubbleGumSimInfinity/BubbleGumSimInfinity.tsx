import React, {useEffect, useRef, useState} from "react";
import moment from 'moment';
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {Avatar, Button, Card, Checkbox, Col, Divider, Empty, Input, InputNumber, List, message, Modal, Popconfirm, Row, Select, Space, Statistic, Table, Tag, Typography} from "antd";
import {DeleteOutlined, FileSearchOutlined, FilterOutlined, QuestionCircleOutlined, ReloadOutlined, SearchOutlined, TableOutlined, UserOutlined} from "@ant-design/icons";
import type {ColumnsType} from 'antd/es/table';
import type { GetProps } from 'antd';
import type { InputNumberProps } from 'antd';

//components
import {Export} from "../Export/export";

import {bulkDeleteData, getData} from "../../../../services/data";
import {useStore} from "../../../../state/storeHooks";
//assets
import Egg from "../../../../assets/bgsi/Egg.webp"
import Multi_Egg from "../../../../assets/bgsi/Multi_Egg.webp"
//currencies
import Coins from "../../../../assets/bgsi/currencies/Coins.webp"
import Gems from "../../../../assets/bgsi/currencies/Gems.webp"
import Tickets from "../../../../assets/bgsi/currencies/Tickets.webp"
//pet
import bsgiPetDataJson from "../../../../services/bsgiPetData.json"
//css
import cardStyle from "./card.module.css"

const errorIMG = 'https://tr.rbxcdn.com/180DAY-32c9eb0c14f4cf3e4fb1664ae8fa8b31/256/256/Image/Webp/noFilter'

//json data pet
type bsgiPetDataType = {
    [key: string]: any
}
const bsgiPetData:bsgiPetDataType = bsgiPetDataJson

const BubbleGumSimInfinity: React.FC = () => {

    const { Meta } = Card;
    const { Text } = Typography;

    // const {user} = useStore(({app}) => app);
    const [openNoteDrawer, setOpenNoteDrawer] = useState(false);

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

    const [hidename, setHidename] = useState(false)

    const secretRenderList = ['Luminosity','Lord Shock', 'Prophet', 'Wolflord', 'Queen Kitty', 'D0GGY1337']

    const getLengthSecPet = () =>{
        if (24/secretRenderList.length < 4){
            return 4
        } 
        return 24/secretRenderList.length
    }

    const onChangeHidename = (e: CheckboxChangeEvent) => {
        setHidename(e.target.checked)
    };

    // modal 

    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [modalPetData, setModalPetData] = useState([]);
    const [modalPetDataFilter, setModalPetDataFilter] = useState([]);
    const [modalPetTitle, setModalPetTitle] = useState('');
    const [modalPetPerPage, setModalPetPerPage] = useState(12);

    // filter 

    const [filterPetName, setFilterPetName] = useState('');
    const [filterRarity, setFilterRarity] = useState('');
    const [filterType, setFilterType] = useState([]);
    const [sortByChance, setSortByChance] = useState('descending')
    const [filterMinChance, setFilterMinChance] = useState(0);
    const [filterMaxChance, setFilterMaxChance] = useState(1e16);

    const [isFilterLoading, setIsFilterLoading] = useState(false)

    const onChangeMin: InputNumberProps['onChange'] = (value: any) => {
        setFilterMinChance(value)
    };

    const onChangeMax: InputNumberProps['onChange'] = (value: any) => {
        setFilterMaxChance(value)
    };


    useEffect(() => {
        setIsFilterLoading(true)
        const tempModalPetDataFilter = modalPetDataFilter
        tempModalPetDataFilter.sort((a:any, b:any) =>{
            return sortByChance == 'descending' ? b['chance'] - a['chance'] : a['chance'] - b['chance']
        })
        setModalPetDataFilter(tempModalPetDataFilter)
        setTimeout(() =>{
            setIsFilterLoading(false)
        })
    }, [sortByChance, isPetModalOpen, isFilterLoading])

    useEffect(() => {
        setModalPetDataFilter(modalPetData)
    }, [modalPetData])



    // useEffect(() => {
    //     setIsFilterLoading(true)
    //     if (filterPetName != ''){
    //         const petDataAfterFilter = modalPetData.filter((item: any) => item['name'].toLowerCase().includes(filterPetName.toLocaleLowerCase()))
    //         setModalPetDataFilter(petDataAfterFilter)
    //     }
    //     else setModalPetDataFilter(modalPetData)
        
    //     setTimeout(() =>{
    //         setIsFilterLoading(false)
    //     })
    // }, [filterPetName, isPetModalOpen])

    const filterByChance = () =>{
        setIsFilterLoading(true)

        let globalFilterPet = modalPetData
        let filteredByName
        let filteredByRarity
        // let filteredByType

        if (filterPetName != ''){
            filteredByName = modalPetData.filter((item: any) => item['name'].toLowerCase().includes(filterPetName.toLocaleLowerCase()))
        }
        else filteredByName = modalPetData

        if (filterRarity != '') {
            filteredByRarity = filteredByName.filter((item: any) => {
                return item['rarity'] == filterRarity
            })
        }
        else filteredByRarity = filteredByName

        if (filterType.length > 0){
            filteredByRarity = filteredByName.filter((item: any) => {
                return filterType.every(value => {
                    if (value == 'mythic'){
                        return item['isMythic']
                    }
                    if (value == 'shiny'){
                        return item['isShiny']
                    }
                })
            })
        }

        globalFilterPet = filteredByRarity.filter((item: any) => {
            return item['chance'] >= filterMinChance && item['chance'] <= filterMaxChance
        })
        
        setModalPetDataFilter(globalFilterPet)
        setTimeout(() =>{
            setIsFilterLoading(false)
        })
    }



    const clearFilter = () =>{
        setFilterMaxChance(1e16)
        setFilterMinChance(0)
        setFilterPetName('')
        setFilterRarity('')
        setFilterType([])
        setSortByChance('descending')
        setIsFilterLoading(true)
        setModalPetDataFilter(modalPetData)
        setTimeout(() =>{
            setIsFilterLoading(false)
        })
    }



    const openPetModal = (titleModal: string, petData: any) => {
        setIsPetModalOpen(true);
        setModalPetTitle(titleModal)
        setModalPetData(petData)
    }

    const handleModalOk = () => {
        setModalPetDataFilter([])
        setIsPetModalOpen(false);
    };
    
    const handleModalCancel = () => {
        setModalPetDataFilter([])
        setIsPetModalOpen(false);
    };

    useEffect(() =>{
        if(isPetModalOpen){
            const scrollList: HTMLElement | null = document.getElementById('scroll-list')
            if(scrollList){
                setTimeout(()=>{
                    scrollList.scroll({
                        behavior: "smooth",
                        top: 0
                    })
                })
            }
        }
    }, [isPetModalOpen])

    const getPetsAllAccount = (typePet: string | null) => {
        let PetsWithOwner:any = []
        dataApi.forEach((item: any) => {
        const Pets = JSON.parse(item['Description'])['Pets']
            Pets.forEach((pet: any) => {
                if (typePet){
                    if (pet['rarity'] == typePet) {
                        PetsWithOwner.push({
                            ...{
                                owner: item['UsernameRoblocc']
                            },...pet
                        })
                    }
                }
                else{
                    PetsWithOwner.push({
                        ...{
                            owner: item['UsernameRoblocc']
                        },...pet
                    })
                }
            });
        })
        return PetsWithOwner
    }

    function formatNumber(num: number, precision: number) {
        const map = [
            {suffix: 'T', threshold: 1e12},
            {suffix: 'B', threshold: 1e9},
            {suffix: 'M', threshold: 1e6},
            {suffix: 'K', threshold: 1e3},
        ];
    
        const found = map.find((x) => Math.abs(num) >= x.threshold);
        if (found) {
            return (num / found.threshold).toFixed(precision) + found.suffix;
        }
    
        return Math.round(num);
    }

    //Online - Offline

    const refreshData = () => {
        setLoadingReload(true);
        setLoadingTable(true);
        getData(6504986360).then((res) => {
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

    const getTotalCurrencies = (currency: string) => {
        let totalCurrencies = 0
        dataApi.forEach((item: DataType) => {
            const Data = JSON.parse(item.Description)['Data']
            totalCurrencies += Data[currency]
        })
        return totalCurrencies
    }

    interface petDataType {
        name: string,
        rarity: string,
        isShiny: boolean,
        isMythic: boolean,
        amount: number,
    }

    const getTotalSecretPetByName = (petName: string) => {
        let totalPet = 0
        dataApi.forEach((item: DataType) => {
            const Pets = JSON.parse(item.Description)['Pets']
            Pets.forEach((pet: petDataType) =>{
                if (pet.rarity == 'Secret' && pet.name == petName) {
                    totalPet += pet.amount | 1
                }
            })
        })
        return totalPet
    }

    const getTotalSecretPet = () => {
        let totalPet = 0
        dataApi.forEach((item: DataType) => {
            const Pets = JSON.parse(item.Description)['Pets']
            Pets.forEach((pet: petDataType) =>{
                if (pet.rarity == 'Secret') {
                    totalPet += pet.amount | 1
                }
            })
        })
        return totalPet
    }

    const getTotalHatches = () =>{
        let totalEggs = 0
        dataApi.forEach((item: DataType) => {
            const Description = JSON.parse(item.Description)
            totalEggs += Description['Farming']['Hatches']
        })
        return totalEggs
    }

    const getTotalHatchesPerMin = () => {
        let totalEggsPerMin = 0
        dataApi.forEach((item: DataType) => {
            let Farming = JSON.parse(item.Description)['Farming']
            if (moment().unix() - moment(item.updatedAt).unix() <= 300){
                totalEggsPerMin += isNaN((Farming['Hatches'] - Farming['oldHatches']) / Math.floor((Farming['UTC'] - Farming['oldUTC'])/60)) ? 1 : (Farming['Hatches'] - Farming['oldHatches']) / Math.floor((Farming['UTC'] - Farming['oldUTC'])/60)
            }
        })
        return totalEggsPerMin
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
            title: 'Coins',
            dataIndex: 'Descriptions',
            width: '5%',
            render: (_, record) => {
                const data = JSON.parse(record.Description)['Data']
                return <Tag color="yellow" bordered={false}>
                    {formatNumber(data['Coins'], 3)}
                </Tag>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description).Data['Coins'] - JSON.parse(b.Description).Data['Coins'],

        },
        {
            title: 'Gems',
            dataIndex: 'Descriptions',
            width: '5%',
            render: (_, record) => {
                const data = JSON.parse(record.Description)['Data']
                return <Tag color="magenta" bordered={false}>
                    {formatNumber(data['Gems'], 3)}
                </Tag>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description).Data['Gems'] - JSON.parse(b.Description).Data['Gems'],

        },
        {
            title: 'Tickets',
            dataIndex: 'Descriptions',
            width: '5%',
            render: (_, record) => {
                const data = JSON.parse(record.Description)['Data']
                return <Tag color="purple" bordered={false}>
                    {formatNumber(data['Tickets'], 3)}
                </Tag>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description).Data['Tickets'] - JSON.parse(b.Description).Data['Tickets'],

        },
        {
            title: 'Hatches',
            dataIndex: 'Descriptions',
            width: '5%',
            render: (_, record) => {
                const data = JSON.parse(record.Description)['Farming']
                return <Tag color="blue" bordered={false}>
                    {formatNumber(data['Hatches'], 3)}
                </Tag>
            },
            sorter: (a: any, b: any) => JSON.parse(a.Description).Farming['Hatches'] - JSON.parse(b.Description).Farming['Hatches'],
        },
        {
            title: 'Hatche / Min',
            dataIndex: 'Descriptions',
            width: '10%',
            render: (_, record) => {
                const Farming = JSON.parse(record.Description)['Farming']
                return <Tag color="orange" bordered={false}>
                    {Math.round(isNaN((Farming['Hatches'] - Farming['oldHatches']) / Math.floor((Farming['UTC'] - Farming['oldUTC'])/60)) ? 0 : (Farming['Hatches'] - Farming['oldHatches']) / Math.floor((Farming['UTC'] - Farming['oldUTC'])/60))}
                </Tag>
            },
        },
        {
            title: 'Mastery',
            dataIndex: 'Descriptions',
            render: (_, record) => {
                const Mastery = JSON.parse(record.Description)['Data']['Mastery']
                const colors:{[index: string]:any} = {
                    ['Pets']: 'gold',
                    ['Buffs']: 'lime',
                    ['Shops']: 'geekblue',
                    ['Minigames']: 'volcano'
                }
                return (
                    <>
                    {
                        Object.keys(Mastery).map((key: string) => {
                            return <Tag color={colors[key] || 'default'} style={{margin: 4}} key={key}>
                                {`${key}: ${Mastery[key]['level']}/${Mastery[key]['maxLevel']}`}
                            </Tag>
                        })
                    }

                    </>
                )
            }
        },
        {
            title: 'Pets',
            dataIndex: 'Descriptions',
            render: (_, record) => {
                const Pets = JSON.parse(record.Description)['Pets']
                const legPets: any[] = []
                Pets.forEach((item: any, index: any) => {
                    if (item['rarity'] != 'Secret'){
                        legPets.push(item)
                    }
                })
                return (
                    <Button 
                        color="green" 
                        variant="filled" 
                        size="small" 
                        type="primary"
                        icon={<FileSearchOutlined />}
                        onClick={() => openPetModal(record.UsernameRoblocc, legPets)}
                    >
                        {`${legPets.length} Legendary`}
                    </Button>
                )
            }
        },
        {
            title: 'Secret',
            dataIndex: 'Descriptions',
            render: (_, record) => {
                const Pets = JSON.parse(record.Description)['Pets']
                const secPets: any[] = []
                Pets.forEach((item: any, index: any) => {
                    if (item['rarity'] == 'Secret'){
                        secPets.push(item)
                    }
                })
                return (
                    <Button 
                        color="danger" 
                        variant="filled" 
                        size="small" 
                        type="primary"
                        icon={<FileSearchOutlined />}
                        onClick={() => openPetModal(record.UsernameRoblocc, secPets)}
                    >
                        {`${secPets.length} Secret`}
                    </Button>
                )
            }
        }
    ]

    const getColorTagPet = (chance: number, tag: string | null) => {

        if (tag) {
            if (tag == 'Exclusive Pet') return '#70ff23'
            
            if (tag.includes('Season')) return '#ff4649'

            if (tag == 'Competitive') return '#ffed27'

            return 'green'

        }
        else{
            if (chance >= 5e6){
                return '#ff14d4'
            }
            
            if(chance >= 1e6){
                return '#ff4649'
            }
    
            if(chance >= 5e5){
                return '#ff4fbc'
            }
    
            if (chance >= 1e5){
                return '#e390ff'
            }
    
            if (chance >= 5e4){
                return 'cyan'
            }
    
            if (chance >= 1e4){
                return 'green'
            }
    
            if (chance > 1e3){
                return 'yellow'
            }
    
            return 'lime'
        }

        

    }

    useEffect(() => {
        refreshData()
        document.title = 'Chimovo - Bubble Gum Simulator Infinity'
    }, []);

    const AutoRefreshData = () => {
        refreshData()
        messageApi.success(`Next refresh ${moment(Date.now() + 60000).fromNow() }`,10);
        messageApi.info(`Last Updated - ${moment(Date.now()).calendar()}`,15)
    }

    useEffect(() =>{
        const intervalId = setInterval(AutoRefreshData, 60000);
        return () => clearInterval(intervalId);
    })

    return (
        <>
            {contextHolder}
            <Divider orientation="left">Roblocc Panel - Bubble Gum Sim Inf</Divider>
            <Row gutter={[12,12]}>
                <Col span={24}>
                    <Card
                        size="small"
                        title="Total Account Data"
                        >
                        <Card size={"small"} variant="borderless" title={"Data"}>
                            <Row gutter={[12,12]}>
                                <Col span={24} sm={12} md={8} xl={4}>
                                    <Card size={"small"}>
                                        <Statistic
                                            title="Total Hatches"
                                            value={formatNumber(getTotalHatches(), 3)}
                                            prefix={
                                                <Avatar
                                                    size={{ xs: 24, sm: 32, md: 40, xl: 64 }}
                                                    src={Multi_Egg}
                                                />
                                            }
                                        />
                                    </Card>
                                </Col>
                                <Col span={24} sm={12} md={8} xl={4}>
                                    <Card size={"small"}>
                                        <Statistic
                                            title="Hatches Per Minute"
                                            value={formatNumber(getTotalHatchesPerMin(), 3)}
                                            prefix={
                                                <Avatar
                                                    size={{ xs: 24, sm: 32, md: 40, xl: 64 }}
                                                    src={Egg}
                                                />
                                            }
                                        />
                                    </Card>
                                </Col>
                                <Col span={24}sm={12} md={8} xl={4}>
                                    <Card size={"small"}>
                                        <Statistic
                                            title="Total Secrets"
                                            value={formatNumber(getTotalSecretPet(), 3)}
                                            prefix={
                                                <Avatar
                                                    size={{ xs: 24, sm: 32, md: 40, xl: 64 }}
                                                    src={Egg}
                                                    style={{backgroundColor: '#ff4059'}}
                                                />
                                            }
                                        />
                                    </Card>
                                </Col>
                                <Col span={24} sm={12} md={8} xl={4}>
                                    <Card size={"small"}>
                                        <Statistic
                                            title="Total Coins"
                                            value={formatNumber(getTotalCurrencies('Coins'), 3)}
                                            prefix={
                                                <Avatar
                                                    size={{ xs: 24, sm: 32, md: 40, xl: 64 }}
                                                    src={Coins}
                                                />
                                            }
                                        />
                                    </Card>
                                </Col>
                                <Col span={24} sm={12} md={8} xl={4}>
                                    <Card size={"small"}>
                                        <Statistic
                                            title="Total Gems"
                                            value={formatNumber(getTotalCurrencies('Gems'), 3)}
                                            prefix={
                                                <Avatar
                                                    size={{ xs: 24, sm: 32, md: 40, xl: 64 }}
                                                    src={Gems}
                                                />
                                            }
                                        />
                                    </Card>
                                </Col>
                                <Col span={24} sm={12} md={8} xl={4}>
                                    <Card size={"small"}>
                                        <Statistic
                                            title="Total Tickets"
                                            value={formatNumber(getTotalCurrencies('Tickets'), 3)}
                                            prefix={
                                                <Avatar
                                                    size={{ xs: 24, sm: 32, md: 40, xl: 64 }}
                                                    src={Tickets}
                                                />
                                            }
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                        <Card size={"small"} variant="borderless" title={"Pets"} key={'pet'}>
                            <Row gutter={[12,12]}>
                                {
                                    secretRenderList.map((petName: string) => {
                                        return (
                                            <Col span={24} xs={12} sm={12} md={getLengthSecPet()} xl={getLengthSecPet()} key={petName}>
                                                <Card size={"small"} >
                                                    <Statistic
                                                        title={petName}
                                                        value={formatNumber(getTotalSecretPetByName(petName), 3)}
                                                        prefix={
                                                            <Avatar
                                                                size={{ xs: 24, sm: 32, md: 40, xl: 64 }}
                                                                src={bsgiPetData[petName] != undefined ? 
                                                                    bsgiPetData[petName]['Normal'] :
                                                                    errorIMG
                                                                }
                                                                shape="square"
                                                            />
                                                        }
                                                    />
                                                </Card>
                                            </Col>
                                        )
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
                                    color="green" 
                                    variant="filled" 
                                    size="small" 
                                    type="primary"
                                    icon={<FileSearchOutlined />}
                                    onClick={() => openPetModal('ALL ACCOUNT', getPetsAllAccount(null))}
                                    >
                                    {`Show Pets All Account`}
                                </Button>  
                                <Button 
                                    color="red" 
                                    variant="filled" 
                                    size="small" 
                                    type="primary"
                                    icon={<FileSearchOutlined />}
                                    onClick={() => openPetModal('ALL ACCOUNT', getPetsAllAccount('Secret'))}
                                    >
                                    {`Show Secret Pets All Account`}
                                </Button>  
                                {/* <Button 
                                    color="red" 
                                    variant="filled" 
                                    size="small" 
                                    type="primary"
                                    icon={<FileSearchOutlined />}
                                    onClick={() => openPetModal('ALL ACCOUNT', getPetsAllAccount('Secret'))}
                                    disabled={!hasSelected} 
                                    >
                                    {`Show Secret Pets ${selectedRowKeys.length} Account`}
                                </Button>     */}
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
                                <Button 
                                    type="primary"  
                                    size={"small"} 
                                    icon={<TableOutlined />}
                                    onClick={() => {
                                        setOpenNoteDrawer(true)
                                    }}
                                >
                                    Note Active
                                </Button>
                                <Checkbox onChange={onChangeHidename}>
                                    Hide Name (optional)*
                                </Checkbox>
                                {/*<Export data={[]} gameName={"BF"}/>*/}
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
                title={<Space>
                    <UserOutlined /> 
                    {modalPetTitle != 'ALL ACCOUNT' ? 
                    (!hidename ? modalPetTitle :
                     (modalPetTitle.substring(0, modalPetTitle.length / 100 * 30) +
                      "*".repeat(modalPetTitle.length - modalPetTitle.length / 100 * 30)
                    )) : modalPetTitle
                    }
                </Space>}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isPetModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '80%',
                    xl: '80%',
                    xxl: '80%',
                }}
                style={{ top: 10 }}
            >
                {
                    modalPetData.length <= 0 ? 
                        <Empty />
                    :
                    <div 
                        id='scroll-list'
                        style={{
                            height: 'calc(100vh - 190px)',
                            overflowX: 'hidden',
                            overflowY: 'auto'
                        }}
                    >
                        <Row gutter={[12,12]} style={{marginRight: 12}}>
                            <Col span={12} md={12}>
                                <Input 
                                    placeholder="Pet name ..." 
                                    onChange={(e) => setFilterPetName(e.target.value)}
                                    value={filterPetName}
                                />
                            </Col>
                            <Col span={12} md={6}>
                            <Select
                                prefix="Rarity:"
                                onChange={(value: any) => setFilterRarity(value)}
                                options={[
                                    { value: 'Secret', label: 'Secret' },
                                    { value: 'Legendary', label: 'Legendary' },
                                ]}
                                style={{width: '100%'}}
                                value={filterRarity}
                            />
                            </Col>
                            <Col span={12} md={6}>
                                <Select
                                    prefix="Type:"
                                    mode="multiple"
                                    placeholder='none'
                                    onChange={(value: any) => setFilterType(value)}
                                    options={[
                                        { value: 'mythic', label: 'Mythic' },
                                        { value: 'shiny', label: 'Shiny' },
                                    ]}
                                    value={filterType}
                                    style={{width: '100%'}}
                                />
                            </Col>
                            <Col span={4}>
                                <Select
                                    prefix="Chance:"
                                    onChange={(value: string) => setSortByChance(value)}
                                    options={[
                                        { value: 'ascending', label: 'Ascending' },
                                        { value: 'descending', label: 'Descending' },
                                    ]}
                                    value={sortByChance}
                                    style={{width: '100%'}}
                                />
                            </Col>
                            <Col span={8}>
                                <InputNumber 
                                    prefix="Min:" 
                                    min={0}
                                    max={1e16}
                                    value={filterMinChance} 
                                    onChange={onChangeMin}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                    style={{width:'100%'}}
                                />
                                    
                            </Col>
                            <Col span={8}>
                                <InputNumber 
                                    prefix="Max:" 
                                    min={0}
                                    max={1e16}
                                    value={filterMaxChance} 
                                    onChange={onChangeMax}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                                    style={{width:'100%'}}
                                />
                            </Col>
                            <Col span={2}>
                                <Button 
                                    type="primary" 
                                    icon={<FilterOutlined />}
                                    onClick={filterByChance}
                                    block
                                    >
                                    Filter
                                </Button>
                            </Col>
                            <Col span={2}>
                                <Button 
                                    type="default" 
                                    icon={<DeleteOutlined />}
                                    onClick={clearFilter}
                                    danger
                                    block
                                    >
                                    Clear
                                </Button>
                            </Col>
                        </Row>
                        <List style={{paddingRight: 12}}
                            grid={{
                                gutter: 12,
                                xs: 1,
                                sm: 2,
                                md: 4,
                                lg: 4,
                                xl: 6,
                                xxl: 6,
                            }}
                            pagination={{
                                pageSize: modalPetPerPage,
                                showLessItems: true,
                                pageSizeOptions:[12,24,36],
                                position: 'top',
                                align: 'center',
                                size: 'small',
                                showSizeChanger: true,
                                onShowSizeChange: (current, size) =>{
                                    setModalPetPerPage(size)
                                }
                            }}
                            dataSource={modalPetDataFilter}
                            renderItem={(item: any, index) => (
                                <List.Item>
                                    <Card
                                            cover={
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}>
                                                <img alt={`img - ${item['name']}`} 
                                                src={bsgiPetData[item['name']] != undefined ? (bsgiPetData[item['name']][
                                                item['isMythic'] && item['isShiny'] ? 'MythicShiny'
                                                : item['isMythic'] ? 'Mythic' : item['isShiny'] ? 'Shiny' : 'Normal'
                                                ]) : errorIMG} 
                                                style={{
                                                    aspectRatio: 1,
                                                    height: 80,
                                                    width: 80,
                                                    marginTop: 6
                                                }}
                                                />
                                            </div>
                                            }
                                            size="small"
                                            className={
                                                item['isShiny'] ? `${cardStyle['shiny']} ${cardStyle['sida']}` :
                                                item['isMythic'] && item['isShiny'] ? `${cardStyle['shinyMythic']} ${cardStyle['sida']}` : 
                                                item['rarity'] == 'Secret' ? `${cardStyle['secret']}` :
                                                item['isMythic'] ? `${cardStyle['mythic']}` : `${cardStyle['legengary']}`
                                            }
                                            style={{
                                                marginTop: index < 6 && 12 || 0,
                                            }}
                                        >
                                            <Meta 
                                                title={
                                                <Space direction="vertical">
                                                    <Text 
                                                    type={item['isShiny'] && 'warning'}
                                                    >
                                                        {item['name']}
                                                    </Text>
                                                </Space>
                                                } 
                                                description={
                                                    <Space direction="vertical">
                                                        <Text>
                                                            {`Quanlity: ${item['amount'] || 1} `}
                                                        </Text>
                                                        <div>
                                                        {
                                                            item['rarity'] == 'Secret' ?
                                                            <Tag color="red">
                                                                Secret
                                                            </Tag> :
                                                            ! item['isMythic'] ?
                                                            <Tag color="green">
                                                                {item['rarity']}
                                                            </Tag> : <> </>
                                                        }
                                                        {
                                                            item['isMythic'] ?
                                                            <Tag color="purple">
                                                                Mythic
                                                            </Tag> : <></>
                                                        }
                                                        {
                                                            item['isShiny'] ? 
                                                            <Tag color="yellow">
                                                                Shiny
                                                            </Tag> : <></>
                                                        }
                                                    </div>
                                                </Space>
                                            } />
                                        </Card>
                                        
                                        {
                                            modalPetTitle == 'ALL ACCOUNT' && 
                                            <Tag 
                                                style={{position: 'absolute', top: 4, left: 10}}
                                                bordered={false}
                                                color="red"
                                                >
                                            {
                                            !hidename ? item['owner'] :
                                            (item['owner'].substring(0, item['owner'].length / 100 * 30) +
                                            "*".repeat(item['owner'].length - item['owner'].length / 100 * 30)
                                            )}
                                            </Tag>
                                        }
                                        <Tag 
                                            style={{position: 'absolute', top: 4, right: 2}} 
                                            color={getColorTagPet(item['chance'], item['tag'])}
                                            bordered={false}
                                        >
                                        {
                                            item['tag'] ? item['tag'] :
                                            `1 in ${formatNumber(item['chance'],0)}`
                                        }
                                        </Tag>

                                </List.Item>
                            )}
                        />
                    </div>
                }
            </Modal>
        </>
    )
}

export default BubbleGumSimInfinity
