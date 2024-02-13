import React, {useState} from "react";
import {Alert, Button, Col, Collapse, Divider, List, message, Result, Row, Space} from "antd";
import {useNavigate} from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import {atomOneDark} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import {useStore} from "../../../../state/storeHooks";


const ProfileScript: React.FC = () => {
    const {user} = useStore(({app}) => app);
    const {id, username, siginKey} = user.unwrap();

    const whitelistAccountsPet = ["Hanei","Vanhxyz","tunakhanhv3","luciusdepzai"];

    const [messageApi, contextHolder] = message.useMessage();
    const [title, setTitle] = useState('Info')

    const bloxfruitString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 300,
    Note = '${username}'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/blocc-trai-cay/panelv1'))()`;

    const bloxfruitStringTrigon = `getgenv().Setting = {
    UID = ${siginKey != '' ? `"${siginKey}"` : id},
    DelayUpdate = 300,
    Note = "${username}"
}
loadstring(game:HttpGet("https://raw.githubusercontent.com/chimnguu/ngu/master/bulularchive.lua"))()`;

    const petxString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 60,
    Note = '${username}'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/nuoi-thu-cung/panel'))()`;

    const bladeBallString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 120,
    Note = '${username}'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/banh-kiem/panel'))()`;

    const pet99String = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 60,
    Note = '${username}',
    ['Inventory'] = {
        'Magic Shard'
    }
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/nuoi-thu-cung/pet99'))()`;


    const copyScript = (scriptname: string, script: string) => {
        navigator.clipboard.writeText(script);
        setTimeout(() => {
            messageApi.success(`Copied ${scriptname} script to clipboard`)
        }, 1000)
    }
    return <div>
        {contextHolder}
        <Row style={{padding: 12}}>
            <Col xs={24} sm={24} md={24}>
                <Divider orientation="left">User - Script</Divider>
                <>
                    <Alert message="Please create a new file (.txt or .lua) in auto execute and put script into this" type="warning" showIcon />
                    <Collapse bordered={false} items={[{
                        key: '1',
                        label: 'Blox Fruit',
                        children: <>
                            Another Exploit:
                            <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                {bloxfruitString}
                            </SyntaxHighlighter>
                            Trigon:
                            <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                {bloxfruitStringTrigon}
                            </SyntaxHighlighter>

                            <Space>
                                <Button type={"default"}
                                        onClick={() => copyScript('Blox Fruit', bloxfruitString)}>
                                    Copy Script
                                </Button>
                                <Button type={"default"}
                                        onClick={() => copyScript('Blox Fruit [Trigon]', bloxfruitStringTrigon)}>
                                    Copy Script [Trigon]
                                </Button>
                            </Space>
                        </>
                    }]} style={{marginTop: 6}}/>
                    <Collapse bordered={false} items={[{
                        key: '3',
                        label: 'Pet Simulator X',
                        children: <>
                            <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                {petxString}
                            </SyntaxHighlighter>
                            <Button type={"default"}
                                    onClick={() => copyScript('Pet Simulator X', petxString)}>
                                Copy Script
                            </Button>
                        </>
                    }]} style={{marginTop: 6}}/>
                    {
                        /*
                        whitelistAccounts.find((element) => element == username) != undefined ? <Collapse bordered={false} items={[{
                                key: '4',
                                label: 'Blade Ball',
                                children: <>
                                    <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                        {bladeBallString}
                                    </SyntaxHighlighter>
                                    <Button type={"default"}
                                            onClick={() => copyScript('Blade Ball', bladeBallString)}>
                                        Copy Script
                                    </Button>
                                </>
                            }]} style={{marginTop: 6}}/>
                            : <></>
                         */
                    }
                    {
                        whitelistAccountsPet.find((element) => element == username) != undefined ? <Collapse bordered={false} items={[{
                                key: '5',
                                label: 'Pet Simulator 99',
                                children: <>
                                    <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                        {pet99String}
                                    </SyntaxHighlighter>
                                    <Button type={"default"}
                                            onClick={() => copyScript('Pet Simulator 99', pet99String)}>
                                        Copy Script
                                    </Button>
                                </>
                            }]} style={{marginTop: 6}}/>
                            : <></>
                    }
                </>,
            </Col>
        </Row>
    </div>
}

export default ProfileScript