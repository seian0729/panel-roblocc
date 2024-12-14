import React from "react";
import {Card, Col, Row, Statistic} from "antd";
import {LineChartOutlined} from "@ant-design/icons";

const ListRodOverview : React.FC = (data: any) => {

    interface DataType {
        UsernameRoblocc: string;
        Password: string;
        Cookie: string;
        Description: string;
        Note: string
        updatedAt: string;
        accountStatus: string;
    }

    const getTotalRoD = () => {
        var countRoD = 0
        data.forEach((item: DataType) => {
            let Description = JSON.parse(item.Description)
            const rods = Description['Rods']
            rods.map((item: any, index: number) => {
                if (item.search('Rod Of The Depths') > -1){
                    countRoD++;
                }
            })
        })
        return countRoD
    }

    const getTotalNoLife = () => {
        var countNoLifeRod = 0
        data.forEach((item: DataType) => {
            let Description = JSON.parse(item.Description)
            const rods = Description['Rods']
            rods.map((item: any, index: number) => {
                if (item.search('No-Life Rod') > -1){
                    countNoLifeRod++;
                }
            })
        })
        return countNoLifeRod
    }

    const getTotalROTFF = () => {
        var countROTFF = 0
        data.forEach((item: DataType) => {
            let Description = JSON.parse(item.Description)
            const rods = Description['Rods']
            rods.map((item: any, index: number) => {
                if (item.search('Rod Of The Forgotten Fang') > -1){
                    countROTFF++;
                }
            })
        })
        return countROTFF
    }

    return <>
        <Row gutter={[12,12]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Card>
                    <Statistic
                        title="Rod Of The Forgotten Fang"
                        value={getTotalROTFF()}
                        prefix={<LineChartOutlined />}
                        valueStyle={{color: '#83a4fc'}}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Card>
                    <Statistic
                        title="No Life"
                        value={getTotalNoLife()}
                        prefix={<LineChartOutlined />}
                        valueStyle={{color: '#ff2020'}}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Card>
                    <Statistic
                        title="Rod of the Depths"
                        value={getTotalRoD()}
                        prefix={<LineChartOutlined />}
                        valueStyle={{color: '#e0529c'}}
                    />
                </Card>
            </Col>
        </Row>
    </>
}

export default ListRodOverview