import React,  { useState } from 'react';
import {Row, Col, Typography, Divider, Form, Input, Button} from 'antd';
import {useStore} from "../../../state/storeHooks";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {darcula} from "react-syntax-highlighter/dist/cjs/styles/hljs";

const { Paragraph } = Typography;

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

const CustomizedForm: React.FC<CustomizedFormProps> = ({ onChange, fields }) => (
    <Form
        name="basic"
        autoComplete="on"
        layout="inline"
        disabled={true}
        fields={fields}
        onFieldsChange={(_, allFields) => {
            onChange(allFields);
        }}
    >
        <Form.Item
            label="UID"
            name="uid"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0px' }}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label="Username"
            name="username"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
        >
            <Input />
        </Form.Item>


        <Form.Item
            label="Role"
            name="role"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 0px' }}
        >
            <Input />
        </Form.Item>

    </Form>
);

function changePass(){
    console.log('cut');
}

function ProfileComponent(){
    const { user } = useStore(({ app }) => app);
    const {username,id,role} = user.unwrap();
    const [fields, setFields] = useState<FieldData[]>([
        { name: ['username'], value: username },
        { name: ['uid'], value: id},
        { name: ['role'], value: role},
    ]);
    const codeString = `getgenv().Setting = {
    UID = ${id},
    DelayUpdate = 120;
    Note = 'May 1'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/blocc-trai-cay/panelv1'))()`;
    return <div>

        <Row justify={'start'}>
            <Col span={12} offset={6}>
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
                <Divider orientation="left"></Divider>
                <Paragraph copyable={{ text: codeString }}>
                    Script:
                </Paragraph>
                <SyntaxHighlighter language="lua" style={darcula}>
                    {codeString}
                </SyntaxHighlighter>
            </Col>
        </Row>
    </div>
}

export default ProfileComponent
