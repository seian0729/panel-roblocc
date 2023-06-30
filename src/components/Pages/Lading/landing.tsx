import React from 'react';
import { Button, Card, Col, Layout, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { useStore } from '../../../state/storeHooks';

import img from '../../../img/だいしきゅーだいしゅき_p1.png';

const { Title, Paragraph } = Typography;

const { Content, Footer } = Layout;

const Landing: React.FC = () => {
  const { user } = useStore(({ app }) => app);
  const userIsLogged = user.isSome();

  return (
    <Layout style={{ background: 'linear-gradient(rgba(10, 10, 12, 0.9), rgba(10, 10, 12, 0.9)), url("https://cdn.discordapp.com/attachments/765845133308461077/1124247841305530448/p1.png") no-repeat center center fixed', WebkitBackgroundSize: 'cover', MozBackgroundSize: 'cover', OBackgroundSize: 'cover', backgroundSize: 'cover', animationName: 'cac', animationDuration: '10s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}>
      <Content>
        <div id="banner" className="banner">
          <Row justify="center" style={{ marginTop: 24 }} className="banner-title">
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div>
                    <Title level={3}>Just a Roblox Panel</Title>
                    <Paragraph>Them bun long qua</Paragraph>
                    {!userIsLogged ? (
                      <Link to="login">
                        <Button type="primary">Get Started</Button>
                      </Link>
                    ) : (
                      <a href="dashboard">
                        <Button type="primary">Dashboard</Button>
                      </a>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} style={{ padding: 12 }}>
                  <img alt="thumb" src={img} style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)" }} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: 24, paddingBottom: 48, background: 'rgba(10, 10, 12, 0.2)', color: 'white' }}>
          <div style={{ paddingTop: 12, textAlign: 'center' }}>
            <Title level={2}>THEM BUN LONG QUA</Title>
          </div>

          <Row justify="center" className="banner-title">
    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
    <Row justify="center" align="middle">
        <Col xs={12} md={6}>
            <Card style={{ margin: 4, textAlign: "center", background: "rgba(10, 10, 12, 0.3)", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"}}>7749 User</Card>
              </Col>
        <Col xs={12} md={6}>
            <Card style={{ margin: 4, textAlign: "center", background: "rgba(10, 10, 12, 0.3)", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"}}>9981 Accounts</Card>
              </Col>
             </Row>
           </Col>
         </Row>
        </div>
      </Content>

      <Footer style={{ color: 'white', textAlign: 'center', background: 'rgba(10, 10, 12, 0.2)', padding: '24px 50px' }}>
        <Title level={2}>THEM BUN LONG QUA</Title>
      </Footer>
    </Layout>
  );
};

export default Landing;