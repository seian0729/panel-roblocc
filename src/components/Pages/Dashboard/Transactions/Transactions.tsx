import React, {useEffect, useState} from "react";
import {getTransactions} from "../../../../services/data";
import {ColumnsType} from "antd/es/table";
import {Col, Divider, Row, Table, Tag, Tooltip} from "antd";
import moment from "moment";

const Transactions: React.FC = () => {

    const [transactions, setTransactions] = useState([]);
    const [loadingTable, setLoadingTable] = useState(true)

    useEffect(() => {
        getTransactions().then((res) =>{
            setTransactions(res.data)
            setLoadingTable(false)
        })
    }, []);

    interface DataType {
        Id: number
        slots: number,
        dateExpired: string,
        note: string,
        status: string,
    }

    const columns: ColumnsType<DataType> = [
        {
            title: "Invoice ID",
            dataIndex: 'Id',
            key: "InvoiceID",
            render: (_, record) => {
                return record.Id
            },
            sorter: (a,b) => {
                return a.Id - b.Id
            }
        },
        {
            title: "Slots",
            dataIndex: 'slots',
            key: "slots",
            render: (_, record) => {
                return new Intl.NumberFormat().format(record.slots)
            },
            sorter: (a,b) => {
                return a.slots - b.slots
            },
        },
        {
            title: "Expired",
            dataIndex: 'dateExpired',
            key:"Expired",
            render: (_: any, record) => {
                return(
                    <Tooltip title={moment(record.dateExpired).format('MMMM Do YYYY, h:mm:ss a')} key={record.Id}>
                        <Tag style={{marginLeft: 4}} color={
                            moment().unix() - moment(record.dateExpired).unix()  >= 0 ? 'red' : 'green'}>
                            {moment().unix() - moment(record.dateExpired).unix() >= 0 ?  'Expired':
                                moment(record.dateExpired).fromNow() }
                        </Tag>
                    </Tooltip>
                )
            },
            sorter: (a,b) => {
                return moment(a.dateExpired).unix() - moment(b.dateExpired).unix()
            },
        },
        {
            title: "Status",
            dataIndex: 'status',
            key:"Status",
            render: (_: any, record) => {
                //console.log(typeof record.status)
                return <Tag style={{marginLeft: 4}} color={record.status == '1' ? 'green' : 'red'}>
                    {record.status == '1' ? 'Success' : 'Unpaid'}
                </Tag>
            },
            sorter: (a,b) => {
                return moment(a.dateExpired).unix() - moment(b.dateExpired).unix()
            },
        },
        {
            title: "Note",
            dataIndex: 'Note',
            key:"Note",
            render: (_: any, record) => {
                return record.note
            },
            sorter: (a,b) => {
                return moment(a.dateExpired).unix() - moment(b.dateExpired).unix()
            },
        }
    ]


    return <>
        <Row justify={'start'}>
            <Divider orientation="left">Roblocc Panel - Transactions</Divider>
            <Col span={24} style={{padding: 12}}>
                <Table
                    columns={columns}
                    dataSource={transactions}
                    loading={loadingTable}
                    rowKey={(record) => record.Id}
                    size={"small"}
                    pagination={{
                        total: transactions.length,
                        pageSizeOptions: [10, 20, 50, 100],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
                        defaultPageSize: 10,
                        showSizeChanger: true,
                    }}
                >
                </Table>
            </Col>
        </Row>
    </>
}

export default Transactions