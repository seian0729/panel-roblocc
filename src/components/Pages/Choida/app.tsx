import React, { useState } from 'react';
import {message, Table, InputNumber, Space, Button, Select } from 'antd';
import type { TableProps, InputNumberProps } from 'antd';

interface Item {
    key: string;
    name: string;
    task: string;
}

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
    originData.push({
        key: i.toString(),
        name: `Sach ${i}`,
        task: '-',
    });
}

const Choida: React.FC = () => {

    const [messageApi, contextHolder] = message.useMessage();

    const [data, setData] = useState(originData);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [minSelected, setMinSelected] = useState(0);
    const [maxSelected, setMaxSelected] = useState(10);

    const [task, setTask] = useState("sech");
    
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        disable: true,
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns = [
        {
            title: 'name',
            dataIndex: 'name',
        },
        {
            title: 'task',
            dataIndex: 'task',
        },
    ];

    const mergedColumns: TableProps['columns'] = columns.map((col) => {
        return {
          ...col,
          onCell: (record: Item) => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
          }),
        };
      });

    const onChangeMin: InputNumberProps['onChange'] = (value) => {
        if (value !== undefined && value !== null && typeof value == 'number') {
            setMinSelected(value)
        }
    };

    const onChangeMax: InputNumberProps['onChange'] = (value) => {
        if (value !== undefined && value !== null && typeof value == 'number') {
            setMaxSelected(value)
        }
    };

    const handleChange = (value: string) => {
        setTask(value)
      };


    return (
        <>
        {contextHolder}
        <Space>
            <InputNumber<number>
                defaultValue={0}
                placeholder="Từ"
                onChange={onChangeMin}
            />
            <InputNumber<number>
                defaultValue={10}
                placeholder="Đến"
                onChange={onChangeMax}
            />

            <Button size='small' type='primary' onClick={() => {
                    setSelectedRowKeys([])
                    let selected = []
                    for (let i = minSelected; i < maxSelected; i++) {
                        selected.push(i.toString())
                    }
                    setSelectedRowKeys(selected)
            }}>
                Chọn
            </Button>

            <Button size='small' disabled = {selectedRowKeys.length == 0} onClick={() =>{
                setSelectedRowKeys([])
            }}>
                Bỏ Chọn
            </Button>

            <Select
                defaultValue="sech"
                style={{ width: 120 }}
                onChange={handleChange}
                options={[
                    { value: 'sech', label: 'Sech' },
                    { value: 'djt', label: 'djt' },
                    { value: 'yaya', label: 'yaya' },
                ]}
                />

            <Button size='small' disabled = {selectedRowKeys.length == 0} onClick={() =>{
                console.log(task)
                console.log(selectedRowKeys)
                data.map(row =>{
                    if (selectedRowKeys.indexOf(row.key) > -1) {
                        row.task = task
                    }
                })
                messageApi.success("Successfully set task " + selectedRowKeys.length + " row to " + task)
                setSelectedRowKeys([])
            }}>
                Chọn Task
            </Button>

                

        </Space>

            <Table
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowSelection={rowSelection}
                rowClassName="editable-row"
            />
        </>
    );
};

export default Choida;