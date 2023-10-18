import React, {useState} from 'react';
import type {TabsProps} from 'antd';
import {
    Alert,
    Button,
    Col,
    Collapse,
    Divider,
    List,
    message,
    Row,
    Space,
    Tabs,
    Tag, Tooltip,
    Typography
} from 'antd';
import {useStore} from "../../../state/storeHooks";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {atomOneDark} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import moment from "moment";

interface FieldData {
    name: string | number | (string | number)[];
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

interface CustomizedFormProps {
    onChange: (fields: FieldData[]) => void;
    fields: FieldData[];
}

function ProfileComponent() {
    const {user} = useStore(({app}) => app);
    const {id, username, role, siginKey, dateExpired} = user.unwrap();
    const whitelistAccounts = ["Hanei","k7ndz","huy8841"];
    const [ showKey, setShowKey ] = useState(false)
    const data = [
        {
            key: 1,
            title: 'Access',
            value: <>Your access expires
            <Tooltip title={moment(dateExpired*1000).format('MMMM Do YYYY, h:mm:ss a')}>
                <Tag style={{marginLeft: 4}}>
                    {moment(dateExpired*1000).fromNow()}
                </Tag>
            </Tooltip>
            </>
        },
        {
            key: 2,
            title: 'UID',
            value: `${id}`
        },
        {
            key: 3,
            title: 'Username',
            value: `${username.toUpperCase()}`
        },
        {
            key: 4,
            title: 'Tags',
            value: <>
                    {
                        username == 'Hanei' ? <>
                            <Space size={[0, 8]} wrap>
                                <Tag color={role == 'Admin' ? 'red' : 'blue' }>{role}</Tag>
                                <Tag color={'volcano'}>Developer</Tag>
                                <Tag color={'magenta'}>Tester</Tag>
                                <Tag color={'orange'}>Lifetime Access</Tag>
                            </Space>
                        </> : <Tag color={role == 'Admin' ? 'red' : 'blue' }>{role}</Tag>
                    }

            </>
        },
        {
            key: 5,
            title: 'Login Key',
            value: <>
                    <Typography>
                        <pre>
                            {
                                siginKey == '' ? 'Undefined' : showKey ? siginKey : ("*".repeat(siginKey.length))
                            }
                        </pre>
                    </Typography>
                    <Button onClick={() => {

                        setTimeout(() => {
                            if (siginKey == '')
                            {
                                messageApi.error(`You don't have key`)
                            }
                            else {
                                navigator.clipboard.writeText(siginKey);
                                messageApi.success(`Copied Secret Key script to clipboard`)
                            }
                        }, 1000)
                    }}>
                        Copy Key
                    </Button>
                    <Button type="link" onClick={() => {
                        setShowKey(! showKey)
                    }}>
                        {showKey ? 'Hide' : "Show"} Key
                    </Button>
                </>
        },
    ];

    const bloxfruitString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 300;
    Note = '${username}'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/blocc-trai-cay/panelv1'))()`;

    const petxString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 60;
    Note = '${username}'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/nuoi-thu-cung/panel'))()`;

    const bladeBallString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 120;
    Note = '${username}'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/banh-kiem/panel'))()`;

    const [messageApi, contextHolder] = message.useMessage();
    const [title, setTitle] = useState('Info')

    const copyScript = (scriptname: string, script: string) => {
        navigator.clipboard.writeText(script);
        setTimeout(() => {
            messageApi.success(`Copied ${scriptname} script to clipboard`)
        }, 1000)
    }

    const onChangeTab = (key: string) => {
        setTitle(key);
    };

    const edit = (record: & { key: React.Key }) => {
        console.log(record
        )
    };

    const items: TabsProps['items'] = [
        {
            key: 'Info',
            label: `Info`,
            children:
                <List
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
            ,
        },
        {
            key: 'Scripts',
            label: `Scripts`,
            children:
                <>
                    {

                        <Alert message="Please create a new file (.txt or .lua) in auto execute and put script into this" type="warning" showIcon />

                    }
                    <Collapse bordered={false} items={[{
                        key: '1',
                        label: 'Blox Fruit',
                        children: <>
                            <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                {bloxfruitString}
                            </SyntaxHighlighter>
                            <Button type={"default"}
                                    onClick={() => copyScript('Blox Fruit', bloxfruitString)}>
                                Copy Script
                            </Button>
                        </>
                    }]} style={{marginTop: 6}}/>
                    <Collapse bordered={false} items={[{
                        key: '3',
                        label: 'Pet Simulator X',
                        children: <>
                            <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                {petxString}
                            </SyntaxHighlighter>
                            <Button type={"default"}
                                    onClick={() => copyScript('Pet Simulator X', petxString)}>
                                Copy Script
                            </Button>
                        </>
                    }]} style={{marginTop: 6}}/>
                    {
                        whitelistAccounts.find((element) => element == username) != undefined ? <Collapse bordered={false} items={[{
                            key: '4',
                            label: 'Blade Ball',
                            children: <>
                                <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                    {bladeBallString}
                                </SyntaxHighlighter>
                                <Button type={"default"}
                                        onClick={() => copyScript('Blade Ball', bladeBallString)}>
                                    Copy Script
                                </Button>
                            </>
                        }]} style={{marginTop: 6}}/>
                            : <></>
                    }
                </>,
        },
        {
            key: 'Account Setting',
            label: `Account Setting`,
            children: `Soon`,
        },
    ];

    return <div>
        {contextHolder}
        <Row style={{padding: 12}}>
            <Col xs={24} sm={24} md={24}>
                <Divider orientation="left">Profile - {title}</Divider>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={onChangeTab}
                />
            </Col>
        </Row>
    </div>
}

export default ProfileComponent
