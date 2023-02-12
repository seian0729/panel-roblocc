import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import {
    Row,
    Col,
    Form,
    Input, Divider, Button
}
    from "antd";
import {useStore} from "../../../../state/storeHooks";

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
        layout="vertical"
        fields={fields}
        onFieldsChange={(_, allFields) => {
            onChange(allFields);
        }}
    >
        <Form.Item
            label="Username"
            name="username"
            rules={[{required: true, message: 'Username không được bỏ trống!'}]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Password"
            name="Password"
            rules={[{required: true, message: 'Password không được bỏ trống!'}]}
        >
            <Input.Password placeholder ='Password' />
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit"  >
                Sửa người dùng
            </Button>
        </Form.Item>

    </Form>
);

export interface editUserProps {}

const EditUser: React.FC<editUserProps> = (props) => {

    const [uid, setUid] = useState('');
    const {id} = useParams();

    useEffect(() => {
        if (id){
            setUid(id);
        }
        else {
            setUid('con me may beo');
        }
    },[])

    const { user } = useStore(({ app }) => app);
    // TODO: `Lấy username từ database thông qua tham số uid truyền vào`
    const username = "cac";
    const [fields, setFields] = useState<FieldData[]>([
        { name: ['username'], value: username },
    ]);

    return (
        <div>
            <Row justify={'start'}>
                <Col span={12} offset={6}>
                    <Divider orientation="left">Edit User - {uid}</Divider>
                    <CustomizedForm
                        fields={fields}
                        onChange={(newFields) => {
                            setFields(newFields);
                        }}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default  EditUser