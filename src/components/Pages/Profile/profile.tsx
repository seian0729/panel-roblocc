import React, {useState} from 'react';
import {Button, Col, Collapse, Divider, Form, Input, message, Row, Space, Typography} from 'antd';
import {useStore} from "../../../state/storeHooks";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {darcula} from "react-syntax-highlighter/dist/cjs/styles/hljs";

const {Paragraph} = Typography;

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

const CustomizedForm: React.FC<CustomizedFormProps> = ({onChange, fields}) => (
    <Form
        name="basic"
        autoComplete="on"
        layout="vertical"
        disabled={true}
        fields={fields}
        onFieldsChange={(_, allFields) => {
            onChange(allFields);
        }}
    >
        <Space size='middle'>
            <Form.Item
                label="UID"
                name="uid">
                <Input/>
            </Form.Item>
            <Form.Item
                label="Username"
                name="username"
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="Role"
                name="role">
                <Input/>
            </Form.Item>

        </Space>
    </Form>
);

function ProfileComponent() {
    const {user} = useStore(({app}) => app);
    const {username, id, role} = user.unwrap();
    const [fields, setFields] = useState<FieldData[]>([
        {name: ['username'], value: username},
        {name: ['uid'], value: id},
        {name: ['role'], value: role},
    ]);
    const bloxfruitString = `getgenv().Setting = {
    UID = ${id},
    DelayUpdate = 120;
    Note = 'May 1'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/blocc-trai-cay/panelv1'))()`;

    const petxString = `getgenv().Setting = {
    UID = ${id},
    DelayUpdate = 60;
    Note = 'May 1'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/nuoi-thu-cung/panel'))()`;

    const [messageApi, contextHolder] = message.useMessage();

    const copyScript = (scriptname: string, script: string) => {
        navigator.clipboard.writeText(script);
        setTimeout(() => {
            messageApi.success(`Copied ${scriptname} script to clipboard`)
        }, 1000)
    }

    return <div>
        {contextHolder}
        <Row justify={'start'}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} offset={6}>
                <Divider orientation="left">Profile</Divider>
                <CustomizedForm
                    fields={fields}
                    onChange={(newFields) => {
                        setFields(newFields);
                    }}
                />
                {/*
                <Divider orientation="left">Password</Divider>
                <Form
                    name="basic"
                    onFinish={changePass}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Current Password"
                        name="oldpassword"

                        rules={[{required: true, message: 'Current Password is empty!'}]}
                    >
                        <Input.Password placeholder="Current Password"/>
                    </Form.Item>

                    <Form.Item label="New Password" style={{ marginBottom: 0 }} rules={[{required: true, message: '!'}]}>

                        <Form.Item
                            name="newpass"
                            rules={[{ required: true, message: 'New Password is empty!' }]}
                            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                        >
                            <Input.Password placeholder="New Password" />
                        </Form.Item>
                        <Form.Item
                            name="renewpass"
                            rules={[{ required: true, message: 'Confirm New Password is empty!' }]}
                            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                        >
                            <Input.Password placeholder="Confirm New Password" />
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit"  >
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
                */}
                <Divider orientation="left">Scripts</Divider>
                <Paragraph copyable={{text: bloxfruitString}}>
                    Script:
                </Paragraph>
                    <Collapse bordered={false} items={[{
                        key: '1',
                        label: 'Blox Fruit',
                        children: <>
                            <SyntaxHighlighter language="lua" style={darcula} customStyle={{borderRadius: 6}}>
                                {bloxfruitString}
                            </SyntaxHighlighter>
                            <Button type={"default"}
                                    onClick={() => copyScript('Blox Fruit', bloxfruitString)}>
                                Copy Script
                            </Button>
                        </>
                    }]} style={{marginTop: 6}}/>
                    <Collapse bordered={false} items={[{
                        key: '1',
                        label: 'Pet Simulator X',
                        children: <>
                            <SyntaxHighlighter language="lua" style={darcula} customStyle={{borderRadius: 6}}>
                                {petxString}
                            </SyntaxHighlighter>
                            <Button type={"default"}
                                    onClick={() => copyScript('Pet Simulator X', petxString)}>
                                Copy Script
                            </Button>
                        </>
                    }]} style={{marginTop: 6}}/>
            </Col>
        </Row>
    </div>
}

export default ProfileComponent
