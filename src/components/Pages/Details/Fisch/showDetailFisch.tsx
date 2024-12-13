import React, {useEffect, useState} from 'react';
import {
    getDataByUsernameAndGameId
} from "../../../../services/data";
import { useParams } from "react-router"
import {Card, Col, Result, Row, Tag} from "antd";
import moment from "moment";

const DetailFisch: React.FC = () => {
    let params = useParams()
    const username = params.Username;


    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    interface DataType {
        UsernameRoblocc: string;
        Description: string;
        updatedAt: string;
    }

    const [data, setData] = useState<DataType>({
        UsernameRoblocc: "",
        Description: '{"Inventory":[],"PlayerInfo":{"Coins":0,"Level":0},"Rods":[],"Times":0}',
        updatedAt: ""
    });

    useEffect(() => {
        setLoading(true)
        getDataByUsernameAndGameId(username, 5750914919).then((response) => {
            setData(response)
        }).catch((err) =>{
            setError(true)
            setErrorMessage(err.response.data.message)
        }).finally(() =>setLoading(false))
    }, []);

    const getInfo = () =>{
        const PlayerInfo = JSON.parse(data.Description)['PlayerInfo']
        return <>
            <Tag color={'yellow'} style={{margin: 4}}>
                Level: {PlayerInfo['Level']}
            </Tag>
            <Tag color={'orange'} style={{margin: 4}}>
                Level: {new Intl.NumberFormat().format(PlayerInfo['Coins'])}
            </Tag>
        </>
    }

    const getInventory = () =>{
        const Inventory = JSON.parse(data.Description)['Inventory']
        return <>{
            Inventory['Enchant Relic'] ?
                <Tag color={"purple"}>
                    Relic Enchant: {Inventory['Enchant Relic']}
                </Tag> : "-"
        } </>
    }

    const colorRods: {[index: string]:any} = {
        ['Phoenix Rod']: 'volcano',
        ['Scurvy Rod']: 'yellow',
        ['Aurora Rod'] : 'blue',
        ['Trident Rod']: 'gold',
        ['Rod Of The Depths']: 'magenta',
        ['Sunken Rod']: 'green',
        ['No-Life Rod']: 'error'
    }

    const getColorRod = (rodName: string) => {
        if (colorRods[rodName] != undefined){
            return colorRods[rodName]
        }
        else return "default"
    }

    const indexRods: {[index: string]:any} = {
        ['Scurvy Rod']: 6,
        ['Phoenix Rod']: 5,
        ['Aurora Rod']: 4,
        ['Trident Rod']: 3,
        ['Rod Of The Depths']: 1,
        ['Sunken Rod']: 2,
        ['No-Life Rod']: 0
    }

    const getIndexRod = (rodName: string) => {
        if (indexRods[rodName] != undefined){
            return indexRods[rodName]
        }
        return 7
    }

    const getRod = () => {
        const Rods = JSON.parse(data.Description)['Rods']

        var listRender: any[] = [];
        var tempListRender: any [] = [];

        Rods.map((item: any, index: number) => {
            if (item !== "RodBodyModel"){
                tempListRender.push({
                    rodIndex: getIndexRod(item),
                    rodName: item
                })
            }
        })

        tempListRender.sort((a, b) => a.rodIndex - b.rodIndex)

        tempListRender.map((item) => {
            listRender.push(item.rodName)
        })

        return <>
            {
                listRender.map((item: any, index: number) =>{
                    return <Tag key={item} color={getColorRod(item)} style={{margin: 4}}>
                        {`${item}`}
                    </Tag>
                })
            }
        </>
    }

    return<>
        {
            !error ? <>
                <Row justify={'start'}>
                    <Col span={24} style={{padding: 12}}>
                        <Card title={data.UsernameRoblocc} size={"small"} loading={loading} extra={<Tag color={'green'}> {
                            moment(data.updatedAt).fromNow()
                        } </Tag>}>
                            <Row gutter={16}>
                                <Col xs={4}>
                                    <Card title={"Account Info"} size={"small"} bordered={false}>
                                        {getInfo()}
                                    </Card>
                                </Col>
                                <Col xs={4}>
                                    <Card title={"Inventory Info"} size={"small"} bordered={false}>
                                        {getInventory()}
                                    </Card>
                                </Col>
                                <Col xs={16}>
                                    <Card title={"Rod Info"} size={"small"} bordered={false}>
                                        {getRod()}
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </> : <>
                <Row justify="center" style={{display: "flex", alignItems: "center", justifyContent:"center", minHeight:"calc(100vh - 164px)"}}>
                    <Col xs={20} sm={16} md={16} xl={8}>
                        <Result
                            status="error"
                            title={errorMessage}
                            subTitle="Please check and modify the following information before resubmitting."
                        >
                        </Result>
                    </Col>
                </Row>
            </>
        }
    </>
};

export default DetailFisch;
