import React from "react";
import {Button, Card, Col, Row} from "antd";
import {Link} from "react-router-dom";
import psxImg from '../../../../img/psx.png';
import bloxImg from '../../../../img/bloxshut.png';
import bladeballImg from "../../../../img/5487b2557b4811e4c8431f9faa663749.png";
import {useStore} from "../../../../state/storeHooks";
const DashboardHome: React.FC = () => {
    const {user} = useStore(({app}) => app);
    let { dateExpired, username } = user.unwrap()
    const whitelistAccounts = ["Hanei","k7ndz","huy8841"];

    return(
        <div style={{color: "white", marginTop: 12}}>
            <Row gutter={[16, 16]}>
                <Col>
                    <Card title="Blox Fruit"
                          hoverable
                          cover={<img style={{width: "100%"}} alt="example" src={bloxImg}/>}
                    >
                        <Link to={"bloxfruit"}>
                            <Button style={{width: "100%"}} type={"default"}> Blox Fruit </Button>
                        </Link>
                    </Card>
                </Col>
                <Col>
                    <Card title="Pet Simulator X"
                          hoverable
                          cover={<img alt="example" src={psxImg}/>}
                    >
                        <Link to={"petx"}>
                            <Button style={{width: "100%"}} type={"default"}> Pet Simulator
                                X </Button>
                        </Link>
                    </Card>
                </Col>
                {
                    whitelistAccounts.indexOf(username) != -1 ?
                        <Col>
                            <Card title="Blade Ball"
                                  hoverable
                                  cover={<img style={{width: 225}} alt="example" src={bladeballImg}/>}
                            >
                                <Link to={"bladeball"}>
                                    <Button style={{width: "100%"}} type={"default"}> Blade Ball </Button>
                                </Link>
                            </Card>
                        </Col>
                        : <></>
                }
            </Row>
        </div>
    )
}

export default DashboardHome