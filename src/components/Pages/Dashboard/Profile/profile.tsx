import React, {useEffect, useState} from 'react';
import {
    Button,
    Col,
    Divider,
    List,
    message,
    Row,
    Tag,
    Tooltip,
    Typography
} from 'antd';
import {useStore} from "../../../../state/storeHooks";
import moment from "moment";



const Profile: React.FC = () => {
    const {user} = useStore(({app}) => app);
    const {id, username, role, siginKey, dateExpired} = user.unwrap();
    const [ showKey, setShowKey ] = useState(false)
    useEffect(() => {
        document.title = 'Chimovo - Profile'
    })
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
                <Tag color={role === 'Admin' ? 'red' : 'blue' }>{role}</Tag>
            </>
        },
        {
            key: 5,
            title: 'Login Key',
            value: <>
                <Typography>
                        <pre>
                            {
                                siginKey === '' ? 'Undefined' : showKey ? siginKey : ("*".repeat(siginKey.length))
                            }
                        </pre>
                </Typography>
                <Button onClick={() => {

                    setTimeout(() => {
                        if (siginKey === '')
                        {
                            messageApi.error(`You don't have any key`)
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

    const [messageApi, contextHolder] = message.useMessage();
    return <div>
        {contextHolder}
        <Row style={{padding: 12}}>
            <Col xs={24} sm={24} md={24}>
                <Divider orientation="left">User - Profile</Divider>
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
            </Col>
        </Row>
    </div>
}

export default Profile
