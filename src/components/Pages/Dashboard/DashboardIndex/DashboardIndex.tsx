import {Button, Card, Col, Row} from "antd";
import bloxImg from "../../../../img/bloxshut.png";
import {Link} from "react-router-dom";
import psxImg from "../../../../img/psx.png";
import bladeballImg from "../../../../img/5487b2557b4811e4c8431f9faa663749.png";
import React from "react";
import {useStore} from "../../../../state/storeHooks";
const DashboardIndex: React.FC = () => {

    const {user} = useStore(({app}) => app);

    let { username } = user.unwrap()

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
                    username == "Hanei" ? <Col>
                        <Card title="Pet Simulator 99"
                              hoverable
                              cover={<img alt="example" src={psxImg}/>}
                        >
                            <Link to={"pet99"}>
                                <Button style={{width: "100%"}} type={"default"}> Pet Simulator
                                    99 </Button>
                            </Link>
                        </Card>
                    </Col> : <></>
                }

                {
                    whitelistAccounts.find((element) => element == username) != undefined ?
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

export default DashboardIndex