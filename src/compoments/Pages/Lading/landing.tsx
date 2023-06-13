import React from 'react';
import {Button, Card, Col, Layout, Row, theme, Typography} from 'antd';
import {Link} from 'react-router-dom';

import {useStore} from "../../../state/storeHooks";

import img from "../../../img/だいしきゅーだいしゅき_p1.png"

const { Title, Paragraph } = Typography;

const { Content, Footer } = Layout;
const Landing: React.FC = () => {
    const { user } = useStore(({ app }) => app);
    const userIsLogged = user.isSome();
    const {
    } = theme.useToken();


    return (
            <Content>
                <div id={'banner'} className={'banner'}>
                    <Row justify={'center'} style={{marginTop: 24}} className={'banner-title'}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <div>
                                        <Title level={3}>Just a Roblox Panel</Title>
                                        <Paragraph>
                                            Them bun long qua
                                        </Paragraph>
                                        <Link to={!userIsLogged ? "login" : "dashboard" }>
                                            <Button type={"primary"}> {!userIsLogged ? "Get Started" : "Dashboard" } </Button>
                                        </Link>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{padding: 12}}>
                                    <img alt={'thumb'} src={img} style={{maxWidth: '100%', height: 'auto', borderRadius: 8}}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                <div style={{marginTop: 24, paddingBottom: 48 , background:'#1f1f1f'}}>
                    <div style={{paddingTop: 12, textAlign:'center'}}>
                        <Title level={2} >
                            THEM BUN LONG QUA
                        </Title>
                    </div>
                    <Row justify={'center'} className={'banner-title'}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Row>
                                <Col xs={24} md={12}>
                                    <Card style={{margin: 4}}>
                                        7749 User
                                    </Card>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Card style={{margin: 4}}>
                                        9981 Accounts
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                <Footer style={{color:"white", textAlign:'center'}}>
                    <Title level={2}>
                        THEM BUN LONG QUA
                    </Title>
                </Footer>

            </Content>

    );
};

export default Landing;