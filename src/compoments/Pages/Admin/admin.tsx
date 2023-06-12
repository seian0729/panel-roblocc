import React, { useState } from 'react';
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Popconfirm,
    Row,
    Space,
    Table,
    Modal,
    Select,
} from 'antd';


import {
    PlusCircleOutlined,
} from "@ant-design/icons";

interface Item {
    key: string;
    username: string;
    password: string;
    role: string;
    total: number;
}

const originData: Item[] = [];
for (let i = 0; i < 10; i++) {
    originData.push({
        key: i.toString(),
        username: `Edrward ${i}`,
        password: `London Park no. ${i}`,
        role: 'Users',
        total: Math.floor(Math.random() * 1000),
    });
}

//Modal form add account

const App: React.FC = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        form.setFieldsValue({ username: '', role: '', ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const deleteAccount = (key: React.Key) => {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
            newData.splice(index, 1);
            setData(newData);
            setEditingKey('');
        }
    }

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Item;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };


    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            width: '25%',
            editable: true,
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="username"
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input username!',
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                ): (
                    record.username
                )
            }
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: '15%',
            editable: true,
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="role"
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input role!',
                            }
                        ]}
                    >
                        <Select>
                            <Select.Option value="Users">Users</Select.Option>
                            <Select.Option value="Admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                ): (
                    record.role
                )
            }
        },
        {
            title: 'Password',
            dataIndex: 'password',
            width: '25%',
            editable: true,
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <Form.Item
                        name="password"
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input password!',
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    )
                    : (
                        <Input.Password disabled={true} value={record.password} />
                    )
            }
        },
        {
            title: 'Total Account',
            dataIndex: 'total',
            width: '15%',
            editable: false,
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button type='primary' onClick={() => save(record.key)} style={{ marginRight: 8 }}>Save</Button>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                          <Button type='primary' danger>Cancel</Button>
                        </Popconfirm>
                  </span>
                ) : (
                    <Space size={'small'}>
                        <Button type='primary' disabled={editingKey !== ''} onClick={() => edit(record)}>Edit</Button>
                        <Popconfirm title="Sure to delete? " onConfirm={()=> deleteAccount(record.key)}>
                            <Button type='primary' danger>Delete</Button>
                        </Popconfirm>
                    </Space>

                );

            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };


    return (
        <div>

            <Modal
                title="Thêm Account"
                open={open}
                onOk={hideModal}
                onCancel={hideModal}
                okText="Ok"
                cancelText="Cancel"
            >
                <Form form={form} component={false}>
                    <Form.Item
                        label="Username"
                        name="addusername"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="addpassword"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="addrole"
                        rules={[{ required: true, message: 'Please input your role!' }]}
                    >
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Row justify={'start'}>
                <Col span={24}>
                    <Divider orientation="left">Dashboard</Divider>
                </Col>
                <Col span={24}>
                    <div style={{marginBottom: 16, marginLeft: 16}}>
                        <Button type='primary' icon={<PlusCircleOutlined />} onClick={showModal}>Thêm Account</Button>
                    </div>
                </Col>
                <Col span={24}>
                    <Form form={form} component={false}>
                        <Table
                            bordered
                            dataSource={data}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={{
                                onChange: cancel,
                            }}
                        />
                    </Form>
                </Col>
            </Row>

        </div>
    );
};

export default App;