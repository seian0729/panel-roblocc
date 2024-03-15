import React, {useEffect, useState} from "react";
import {
    Select,
    Card,
    Col,
    Divider,
    Row,
    message,
    Typography,
    List,
    Form,
    Input,
    Button,
    Table,
    Space,
    Tag,
    Tooltip, Alert, Slider, InputNumber
} from "antd";
import type { SelectProps } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import {getData, createPet99Mail, getAllMail, createBulkPet99Mail} from "../../../../services/data";
import {ColumnsType} from "antd/es/table";
import moment from "moment";

function AccountData(account: any) {
    const usernameRoblocc = account['UsernameRoblocc']
    const Description = JSON.parse(account['Description'])
    const {Inventory} = Description
    const {Huge} = Description
    const {Diamonds} =  Description['Farming']
    const data = [];

    if (Inventory != undefined){
        Inventory.map((key: any) => {
            data.push({
                key: usernameRoblocc+key.Name,
                title: key.Name,
                value: new Intl.NumberFormat().format(key.Count),
            })
        })
    }

    data.push({
        key: usernameRoblocc+"Diamonds",
        title: 'Diamonds',
        value: new Intl.NumberFormat().format(Diamonds),
    })

    return <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
            <List.Item>
                <List.Item.Meta
                    title={item.title}
                    description={item.value}
                />
            </List.Item>
        )}
    />
}

const Pet99Mail: React.FC = () => {
    const { Text } = Typography;
    const options: SelectProps['options'] = [{
        label: "ALL ACCOUNT (THIS OPTION IS IN DEV, COMING SOON)",
        value: "ALL ACCOUNT",
    }];

    const [messageApi, contextHolder] = message.useMessage();

    const [loadingMail, setLoadingMail] = useState(false);

    const [disableSend, setDisableSend] = useState(true)

    const [loadingSend, setLoadingSend] = useState(false);

    const [typeSend, setTypeSend] = useState("")

    const [loadingBtnData, setLoadingBtnData] = useState(false);
    const [loadingBtnMail, setLoadingBtnMail] = useState(false);

    //data
    const [dataApi, setDataApi] = useState([]);

    const [mailApi, setMailApi] = useState([]);

    const [dataAccount, setDataAccount] = useState([]);

    const [dataSend, setDataSend] = useState([{}]);
    const [allDataSend, setAllDataSend] = useState("");

    //username

    const [username, setUsername] = useState("");

    const [usernameR, setUsernameR] = useState("");
    const [messageSend, setMessageSend] = useState("");

    const [form] = Form.useForm();
    const [clientReady, setClientReady] = useState<boolean>(false);

    const [diamondAboveAmount, setDiamondAboveAmount] = useState(2e6);

    const onChangeSlider = (value: number) => {
        if (isNaN(value)) {
            return;
        }
        setDiamondAboveAmount(value);
    };

    // type

    const [type, setType] = useState("")

    // To disable submit button at the beginning.
    useEffect(() => {
        setClientReady(true);
    }, []);

    const pushBulkMail = () => {
        const key = 'notification-mail'
        messageApi.open({
            key,
            type: 'loading',
            content: 'Sent the mail to server...',
            duration: 10
        })
        setLoadingSend(true);
        createBulkPet99Mail(allDataSend).then((res) => {
            console.log(res)
            setTimeout(() => {
                messageApi.open({
                    key,
                    type: 'success',
                    content: res.message,
                })

                setLoadingSend(false);
                refreshMail()
            }, 1500);
        }).catch((err) => {
            messageApi.open({
                key,
                type: 'error',
                content: 'Got error while send mail into server'
            })
            console.log(err)
            setLoadingSend(false);
        })
    }

    const onFinish = (values: any) => {
        const key = 'notification-mail'
        messageApi.open({
            key,
            type: 'loading',
            content: 'Sent the mail to server...',
            duration: 10
        })
        const detailsObject = {
            username: values['Username'],
            message: values['Message'],
            mailDetails: dataSend
        }
        const details = JSON.stringify(detailsObject)
        setLoadingSend(true);
        createPet99Mail(username, details).then((res) => {
            setTimeout(() => {
                messageApi.open({
                    key,
                    type: 'success',
                    content: res.message,
                })

                setLoadingSend(false);
                refreshMail()
            }, 1500);
        }).catch((err) => {
            messageApi.open({
                key,
                type: 'error',
                content: 'Got error while send mail into server'
            })
            setLoadingSend(false);
        })
    };

    useEffect(() => {
        getData(3317771874).then((res) => {
            setDataApi(res.data);
        }).catch((error) => {
            messageApi.error('Got error while getting data');
        }).finally(() => {
            messageApi.success('All data has been loaded');
        })
    },[])
    const refreshMail = () => {
        setLoadingBtnMail(true)
        getAllMail().then((res) => {
            setMailApi(res.data)
        }).catch((error) => {
            messageApi.error('Got error while getting mail');
        }).finally(() => {
            messageApi.success('All mail has been loaded');
            setLoadingBtnMail(false)
        })
    }

    useEffect(() => {
        refreshMail()
    }, []);
    const refreshData = () => {
        setLoadingBtnData(true);
        getData(3317771874).then((res) => {
            setDataApi(res.data);
        }).catch((error) => {
            messageApi.error('Got error while getting data');
        }).finally(() => {
            messageApi.success('Refresh Success <3');
            setLoadingBtnData(false);
        })
    }

    const AutoRefreshData = () => {
        refreshData()
        messageApi.success(`Next refresh ${moment(Date.now() + 60000).fromNow() }`,10);
        messageApi.info(`Last Updated - ${moment(Date.now()).calendar()}`,15)
    }

    useEffect(() =>{
        const intervalId = setInterval(AutoRefreshData, 60000);
        return () => clearInterval(intervalId);
    })

    const handleChange = (value: string) => {
        setUsername(value)
        if (value != "ALL ACCOUNT") {
            const tempSendData = []
            const data = dataApi.find((key) => key['UsernameRoblocc'] == value)
            if (data != undefined) {
                setDataAccount(data)
                const Description = JSON.parse(data['Description'])
                const {Diamonds} = Description['Farming']
                const {Inventory} = Description
                if (typeSend == "Both"){
                    if (Inventory != undefined) {
                        Inventory.map((key: any) => {
                            if (key.Count != 0) {
                                tempSendData.push({
                                    item: {id: key.Name},
                                    quantity: key.Count
                                })
                            }
                        })
                    }
                    if (Diamonds > diamondAboveAmount){
                        tempSendData.push({
                            item: {Type: "Currency", id: "Diamonds"},
                            quantity: Diamonds - ((tempSendData.length * 10000) + 10000)
                        })
                    }
                }
                else if (typeSend == 'Items'){
                    if (Inventory != undefined) {
                        Inventory.map((key: any) => {
                            if (key.Count != 0) {
                                tempSendData.push({
                                    item: {id: key.Name},
                                    quantity: key.Count
                                })
                            }
                        })
                    }
                }
                else{
                    if (Diamonds > diamondAboveAmount){
                        tempSendData.push({
                            item: {Type: "Currency", id: "Diamonds"},
                            quantity: Diamonds - ((tempSendData.length * 10000) + 10000)
                        })
                    }
                }

                if (tempSendData.length == 0){
                    messageApi.error(`Not enough diamond, because u set Above ${diamondAboveAmount}`)
                }

                if (Diamonds - ((tempSendData.length * 10000) + 10000) >= 0) {
                    setDisableSend(false)
                    setDataSend(tempSendData)
                } else {
                    setDisableSend(true)
                    messageApi.error("Hey! don't try send if u don't enough diamond todo this action")
                }
                console.log(tempSendData)
            }
        }
        else {
            const allData: { usernameSend: never; details: { username: string; message: string; mailDetails: { item: { id: any; } | { Type: string; id: string; }; quantity: any; }[]; }; }[] = []
            dataApi.forEach((key) => {
                const tempSendAccountData: { item: { id: any; } | { Type: string; id: string; }; quantity: any; }[] = []
                const Description = JSON.parse(key['Description'])
                const {Diamonds} = Description['Farming']
                const {Inventory} = Description
                if (typeSend == "Both"){
                    if (Inventory != undefined) {
                        Inventory.map((key: any) => {
                            if (key.Count != 0) {
                                tempSendAccountData.push({
                                    item: {id: key.Name},
                                    quantity: key.Count
                                })
                            }
                        })
                    }
                    tempSendAccountData.push({
                        item: {Type: "Currency", id: "Diamonds"},
                        quantity: Diamonds - ((tempSendAccountData.length * 10000) + 10000)
                    })
                }
                else if (typeSend == 'Items'){
                    if (Inventory != undefined) {
                        Inventory.map((key: any) => {
                            if (key.Count != 0) {
                                tempSendAccountData.push({
                                    item: {id: key.Name},
                                    quantity: key.Count
                                })
                            }
                        })
                    }
                }
                else{
                    tempSendAccountData.push({
                        item: {Type: "Currency", id: "Diamonds"},
                        quantity: Diamonds - ((tempSendAccountData.length * 10000) + 10000)
                    })
                }
                if (Diamonds > diamondAboveAmount){
                    allData.push({
                        usernameSend: key['UsernameRoblocc'],
                        details: {
                            username: usernameR,
                            message: messageSend,
                            mailDetails: tempSendAccountData
                        }
                    })
                }
            })
            console.log("All data", JSON.stringify(allData))
            setAllDataSend(JSON.stringify(allData))
        }
    };


    dataApi.forEach((item: any) => {
        const usernameRoblocc = item['UsernameRoblocc']
        options.push({
            value: usernameRoblocc,
            label: usernameRoblocc
        });
    })

    interface MailType {
        id: number
        user_send: string
        details: string
        createdAt: string
        updatedAt: string
        status: any
    }

    const columnsMail: ColumnsType<MailType> = [
        {
            title: "#",
            dataIndex: "Id",
            render: (text, record, index) => ( index + 1 )
        },
        {
            title: "Account",
            dataIndex: "userSend",
            render: (_, record) => {
                return record['user_send']
            }
        },
        {
            title: "Mail Details",
            dataIndex: "details",
            children: [
                {
                    title: 'To Account',
                    dataIndex: 'username',
                    key: 'to-account',
                    render: (_, record) => {
                        const {username} = JSON.parse(record['details'])
                        return username
                    }
                },
                {
                    title: 'Message',
                    dataIndex: 'message-details',
                    key: 'message',
                    render: (_, record) => {
                        const {message} = JSON.parse(record['details'])
                        return(
                            message == "" || message == undefined ? "-" : <Tag>
                                { message}
                            </Tag>
                        )

                    }
                },
                {
                    title: 'Details',
                    dataIndex: 'detail-details',
                    key: 'detail-details',
                    render: (_, record) => {
                        let details = JSON.parse(record.details)
                        details['mailDetails'].sort((a: any,b: any) => {
                            return a['quantity'] - b['quantity']
                        })
                        const colorTag: any = {
                            ["Diamonds"]: "cyan",
                            ["Bucket"]: "green",
                            ["Bucket O' Magic"]: "purple",
                            ["Magic Shard"]: "purple"
                        }
                        return (
                            <>
                                <Space direction="horizontal">
                                {
                                    details['mailDetails'].map((key: any) => {
                                        if (Object.keys(key).length > 0){
                                            const itemName = key['item']['id']
                                            return (
                                                <Tag key={key['item']['id']} color={colorTag[itemName] ? colorTag[itemName] : "default" }>
                                                    {`${key['item']['id']}: ${new Intl.NumberFormat().format(key['quantity'])}`}
                                                </Tag>
                                            );
                                        }
                                        else return "-"
                                    })
                                }
                                </Space>
                            </>
                        )
                    }
                },
            ]
        },
        {
            title: "Send Date",
            dataIndex: "createdAt",
            render: (_, record) => {
                return moment(record['createdAt']).calendar()
            },
            sorter: (a, b) => {
                return moment(a['createdAt']).unix() - moment(b['createdAt']).unix()
            }
        },
        {
            title: "Completed Date",
            dataIndex: "updatedAt",
            render: (_, record) => {
                return moment(record['updatedAt']).unix() - moment(record['createdAt']).unix() <= 0 ? "-" : moment(record['updatedAt']).calendar()
            },
            sorter: (a, b) => {
                return moment(a['updatedAt']).unix() - moment(b['updatedAt']).unix()
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (_, record) => {
                const status = JSON.parse(record['status'])
                const colorStatus = [
                    'processing',
                    'success',
                    'error'
                ]
                const iconStatus = [
                    <SyncOutlined spin />,
                    <CheckCircleOutlined/>,
                    <CloseCircleOutlined />
                ]
                return <Tag key={record.id + "status"} icon={iconStatus[status.status]} color={colorStatus[status.status]}>
                    {status.messages}
                </Tag>
            }
        }
    ]

    // @ts-ignore
    return(
        <>
            {contextHolder}
            <Row style={{padding: 12}}>
                <Col xs={24} sm={24} md={24}>
                    <Divider orientation="left">Pet 99 - Mail Box</Divider>
                    <Row gutter={[12, 12]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Row gutter={[12, 12]}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={17}>
                                    <Card size={"small"} title={"Send Into"} >
                                        <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish} labelWrap={true}>
                                            <Form.Item
                                                name="Username"
                                                rules={[{ required: true, message: 'Please input your username!' }]}
                                                style={{ marginBottom: "6px" }}
                                            >
                                                <Input
                                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                                    placeholder="Username"
                                                    onChange = {(e) => setUsernameR(e.target.value)}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="Message"
                                                style={{ marginBottom: "6px" }}
                                            >
                                                <Input
                                                    prefix={<MailOutlined className="site-form-item-icon"/>}
                                                    type="Message"
                                                    placeholder="Message (optional)"
                                                    onChange = {(e) => setMessageSend(e.target.value)}
                                                    suffix={
                                                        <Tooltip title="Leave in blank if you want message is your receive username account">
                                                            <InfoCircleOutlined />
                                                        </Tooltip>
                                                    }
                                                />
                                            </Form.Item>
                                            {
                                                username != "ALL ACCOUNT" ?
                                                    <Form.Item shouldUpdate style={{ marginBottom: "6px" }}>
                                                        {() => (
                                                            <Button
                                                                type="primary"
                                                                htmlType="submit"
                                                                disabled={
                                                                    !clientReady ||
                                                                    !!form.getFieldsError().filter(({ errors }) => errors.length).length ||
                                                                    disableSend
                                                                }
                                                                loading={loadingSend}
                                                            >
                                                                Send Mail
                                                            </Button>
                                                        )}
                                                    </Form.Item>
                                                    :
                                                    <>
                                                        <Form.Item style={{ marginBottom: "6px" }} >
                                                            <Button
                                                                type="primary"
                                                                onClick={pushBulkMail}
                                                                loading={loadingSend}
                                                            >
                                                                Send Mail (ALL ACTIVE ACCOUNT)
                                                            </Button>
                                                        </Form.Item>
                                                    </>
                                            }
                                        </Form>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={7}>
                                    <Card size={"small"} title={"Data Action"}>
                                        <Space wrap>
                                            <Button
                                                type={"primary"}
                                                onClick={refreshData}
                                                loading={loadingBtnData}
                                            >
                                                Refresh Data
                                            </Button>

                                            <Button
                                                type={"primary"}
                                                onClick={refreshMail}
                                                loading={loadingBtnMail}
                                            >
                                                Refresh Mail
                                            </Button>
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Alert
                                showIcon
                                message="VUI LÒNG CHỌN NHẬP USERNAME ACC NHẬN TRƯỚC KHI CHỌN ALL ACTIVE ACCOUNT (LÀM SAI MẤT DỮ LIỆU KHÔNG CHỊU TRÁCH NHIỆM)"
                                type={"error"}
                            />
                            <Alert
                                showIcon
                                message="CHỌN DETAIL TRƯỚC KHI CHỌN ACCOUNT ĐỂ TRÁNH LỖI"
                                type={"error"}
                                style={{marginTop: 6}}
                            />
                        </Col>
                    </Row>

                    <Row style={{marginTop: 12}} gutter={[12, 12]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <Card size={"small"} title={"Select Account"} >
                                <Select
                                    onChange={handleChange}
                                    style={{ width: "100%"}}
                                    options={options}
                                    showSearch={true}
                                    placeholder={"Select your account"}
                                    disabled={usernameR == ""}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <Card size={"small"} title={"Select Detail"}>
                                <Select
                                    onChange={(value) => {setTypeSend(value)}}
                                    style={{ width: "100%"}}
                                    defaultValue={"Diamond"}
                                    options={[
                                        { value: 'Diamond', label: 'Diamond' },
                                        { value: 'Items', label: 'Items' },
                                        { value: 'Both', label: 'Both' },
                                    ]}
                                    showSearch={true}
                                    placeholder={"Select your details for mail"}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <Card size={"small"} title={"Optional - Diamond Above Amount"}>
                                <Row>
                                    <Col xs={12} sm={20} md={18} lg={20}>
                                        <Slider
                                            min={0}
                                            max={10000000}
                                            onChange={onChangeSlider}
                                            value={typeof diamondAboveAmount === 'number' ? diamondAboveAmount : 0}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <InputNumber
                                            min={0}
                                            max={10000000}
                                            style={{ margin: '0 16px' }}
                                            value={diamondAboveAmount}
                                            //@ts-ignore
                                            onChange={onChangeSlider}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{paddingTop: 32}}>
                            <Table
                                columns={columnsMail}
                                dataSource={mailApi}
                                rowKey={(record) => record.id}
                                loading={loadingMail}
                                size={"small"}
                                scroll={{x: true}}
                                bordered
                                pagination={{
                                    total: mailApi.length,
                                    pageSizeOptions: [25, 100, 200, 500, 1000, 2000, 5000],
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} mails`,
                                    position: ['topCenter'],
                                    defaultPageSize: 25,
                                    showSizeChanger: true,
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )

}

export default Pet99Mail