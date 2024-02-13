import React, {useEffect, useState} from "react";
import {Select, Card, Col, Divider, Row, message, Typography, List, Form, Input, Button, Table, Space, Tag} from "antd";
import type { SelectProps } from 'antd';
import {UserOutlined, MailOutlined, SyncOutlined, CloseCircleOutlined, CheckCircleOutlined} from "@ant-design/icons";
import {getData, createPet99Mail, getAllMail} from "../../../../services/data";
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
    const options: SelectProps['options'] = [];

    const [messageApi, contextHolder] = message.useMessage();

    const [loadingMail, setLoadingMail] = useState(false);

    const [disableSend, setDisableSend] = useState(false)

    //data
    const [dataApi, setDataApi] = useState([]);

    const [mailApi, setMailApi] = useState([]);

    const [dataAccount, setDataAccount] = useState([]);

    const [dataSend, setDataSend] = useState([{}]);

    //username

    const [username, setUsername] = useState("");

    const [form] = Form.useForm();
    const [clientReady, setClientReady] = useState<boolean>(false);

    // To disable submit button at the beginning.
    useEffect(() => {
        setClientReady(true);
    }, []);

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

        createPet99Mail(username, details).then((res) => {
            setTimeout(() => {
                messageApi.open({
                    key,
                    type: 'success',
                    content: res.message,
                    onClose: refreshGetMail
                })
            }, 1500);
        }).catch((err) => {
            messageApi.open({
                key,
                type: 'error',
                content: 'Got error while send mail into server'
            })
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

    const refreshGetMail = () => {
        getAllMail().then((res) => {
            setMailApi(res.data)
        }).catch((error) => {
            messageApi.error('Got error while getting mail');
        }).finally(() => {
            messageApi.success('All mail has been loaded');
        })
    }

    useEffect(() => {
        refreshGetMail()
    }, []);

    const handleChange = (value: string) => {
        console.log('changed')
        setUsername(value)
        const tempSendData = []
        const data = dataApi.find((key) => key['UsernameRoblocc'] == value)
        if (data != undefined){
            setDataAccount(data)
            const Description = JSON.parse(data['Description'])
            const {Diamonds} = Description['Farming']
            const {Inventory} = Description
            if (Inventory != undefined) {
                Inventory.map((key: any) => {
                    if(key.Count != 0){
                        tempSendData.push({
                            item: {id: key.Name},
                            quantity: key.Count
                        })
                    }
                })
            }
            tempSendData.push({
                item: {Type: "Currency",id: "Diamonds"},
                quantity: Diamonds - ((tempSendData.length * 10000) + 10000)
            })

            if (Diamonds - ((tempSendData.length * 10000) + 10000) >= 0){
                setDisableSend(false)
                setDataSend(tempSendData)
            }
            else {
                setDisableSend(true)
                messageApi.error("Hey! don't try send if u don't enough diamond todo this action")
            }
        }
    };

    dataApi.forEach((item: any) => {
        const usernameRoblocc = item['UsernameRoblocc']
        const Description = JSON.parse(item.Description)
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
            width: '1%',
            render: (text, record, index) => ( index + 1 )
        },
        {
            title: "Account",
            dataIndex: "userSend",
            width: "10%",
            render: (_, record) => {
                return record['user_send']
            }
        },
        {
            title: "Mail Details",
            dataIndex: "details",
            width: "30%",
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
                        return message == "" ? "-" : message
                    }
                },
                {
                    title: 'Details',
                    dataIndex: 'detail-details',
                    key: 'detail-details',
                    render: (_, record) => {
                        let details = JSON.parse(record.details)
                        return (
                            <>
                                <Space direction="horizontal">
                                {
                                    details['mailDetails'].map((key: any) => {
                                        return (
                                            <Text key={key['item']['id']}>
                                                {`${key['item']['id']}: ${new Intl.NumberFormat().format(key.quantity)}`}
                                            </Text>
                                        );
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
            width: "10%",
            render: (_, record) => {
                return moment(record['createdAt']).calendar()
            }
        },
        {
            title: "Completed Date",
            dataIndex: "updatedAt",
            width: "10%",
            render: (_, record) => {
                return moment(record['updatedAt']).unix() - moment(record['createdAt']).unix() <= 0 ? "-" : moment(record['updatedAt']).calendar()
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            width: "10%",
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

    return(
        <>
            {contextHolder}
            <Row style={{padding: 12}}>
                <Col xs={24} sm={24} md={24}>
                    <Divider orientation="left">Pet 99 - Mail Box</Divider>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                            <Card size={"small"} title={"Select Account"}>
                                <Select
                                    onChange={handleChange}
                                    style={{ width: "100%"}}
                                    options={options}
                                    showSearch={true}
                                    placeholder={"Select your account"}
                                />
                            </Card>

                            <Card size={"small"} title={"Send Into"} style={{marginTop: 16}}>
                                {
                                    dataAccount.length == 0 ? <> PLEASE SELECT ACCOUNT </> : <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
                                        <Form.Item
                                            name="Username"
                                            rules={[{ required: true, message: 'Please input your username!' }]}
                                        >
                                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                                        </Form.Item>
                                        <Form.Item
                                            name="Message"
                                        >
                                            <Input
                                                prefix={<MailOutlined className="site-form-item-icon"/>}
                                                type="Message"
                                                placeholder="Message (optional)"
                                            />
                                        </Form.Item>
                                        <Form.Item shouldUpdate>
                                            {() => (
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    disabled={
                                                        !clientReady ||
                                                        !form.isFieldsTouched(true) ||
                                                        !!form.getFieldsError().filter(({ errors }) => errors.length).length ||
                                                        disableSend
                                                    }
                                                >
                                                    Send Request Mail
                                                </Button>
                                            )}
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                onClick={refreshGetMail}
                                            >
                                                Refresh Mail
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                }

                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                            <Card size={"small"} title={`Account Info - ${username == "" ? "Username" : username.toUpperCase()}`}>
                                {
                                    dataAccount.length != 0 ? AccountData(dataAccount) : <> PLEASE SELECT ACCOUNT </>
                                }
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