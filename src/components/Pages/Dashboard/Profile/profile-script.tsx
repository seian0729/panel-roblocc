import React, {useState} from "react";
import {Alert, Button, Col, Collapse, Divider, message, Row, Space} from "antd";
import SyntaxHighlighter from "react-syntax-highlighter";
import {atomOneDark} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import {useStore} from "../../../../state/storeHooks";


const ProfileScript: React.FC = () => {
    const {user} = useStore(({app}) => app);
    const {id, username, siginKey} = user.unwrap();

    const access = user.isSome()!? user.unwrap().access : '[]';

    const decodeAccess = JSON.parse(access);

    const checkAccess = (accessVal: string) => {
        return decodeAccess.find((element: any) => element == accessVal) != undefined
    }


    const [messageApi, contextHolder] = message.useMessage();
    const [title, setTitle] = useState('Info')

    const bloxfruitString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 300,
    Note = '${username}'
}
loadstring(game:HttpGet('https://cdn.chimovo.com/private/blocc-trai-cay/panelv1'))()`;

    const bloxfruitStringAll = `getgenv().Setting = {
    UID = ${siginKey != '' ? `"${siginKey}"` : id},
    DelayUpdate = 300,
    Note = "${username}"
}
loadstring(http_request({Url = 'https://cdn.chimovo.com/private/blocc-trai-cay/panelv1', Method = "GET"})['Body'])()`;

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
repeat wait() spawn(function() 
    loadstring(request({Url = 'https://cdn.chimovo.com/private/nuoi-thu-cung/pet99', Method = "GET"})['Body'])()
end) wait(60) until HaneiDesu`;

const toiletString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 120,
    Note = '${username}'
}
loadstring(http_request({Url = 'https://cdn.chimovo.com/private/gia-lap-phong-thu-bon-cau/panel', Method = "GET"})['Body'])()`;

const adString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 120,
    Note = '${username}'
}
loadstring(http_request({Url = 'https://cdn.chimovo.com/private/anime-phong-thu/client.lua', Method = "GET"})['Body'])()`;

const avString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 120,
    Note = '${username}'
}
loadstring(http_request({Url = 'https://cdn.chimovo.com/private/anime-valorant/client.lua', Method = "GET"})['Body'])()`;

const pgString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 120,
    Note = '${username}'
}
loadstring(http_request({Url = 'https://cdn.chimovo.com/private/pet-go/client.lua', Method = "GET"})['Body'])()`;

const fischString = `getgenv().Setting = {
    UID = ${siginKey != '' ? `'${siginKey}'` : id},
    DelayUpdate = 120,
    Note = '${username}'
}
loadstring(http_request({Url = 'https://cdn.chimovo.com/private/fisch/client.lua', Method = "GET"})['Body'])()`;


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
                            Fluxus:
                            <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                {bloxfruitString}
                            </SyntaxHighlighter>
                            Another Exploit:
                            <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                {bloxfruitStringAll}
                            </SyntaxHighlighter>

                            <Space>
                                <Button type={"default"}
                                        onClick={() => copyScript('Blox Fruit', bloxfruitString)}>
                                    Copy Script
                                </Button>
                                <Button type={"default"}
                                        onClick={() => copyScript('Blox Fruit [Another Exploit]', bloxfruitStringAll)}>
                                    Copy Script [Another Exploit]
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
                        checkAccess("pet99") ? <Collapse bordered={false} items={[{
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
                    {
                        checkAccess("ttd") ? <Collapse bordered={false} items={[{
                                key: '6',
                                label: 'Toilet Tower Defense Simulator',
                                children: <>
                                    <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                        {toiletString}
                                    </SyntaxHighlighter>
                                    <Button type={"default"}
                                            onClick={() => copyScript('Toilet Tower Defense Simulator', toiletString)}>
                                        Copy Script
                                    </Button>
                                </>
                            }]} style={{marginTop: 6}}/>
                            : <></>
                    }
                    {
                        checkAccess("ad") ? <Collapse bordered={false} items={[{
                                key: '7',
                                label: 'Anime Defender',
                                children: <>
                                    <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                        {adString}
                                    </SyntaxHighlighter>
                                    <Button type={"default"}
                                            onClick={() => copyScript('Anime Defender', adString)}>
                                        Copy Script
                                    </Button>
                                </>
                            }]} style={{marginTop: 6}}/>
                            : <></>
                    }
                    {
                        checkAccess("av") ? <Collapse bordered={false} items={[{
                                key: '8',
                                label: 'Anime Valorant',
                                children: <>
                                    <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                        {avString}
                                    </SyntaxHighlighter>
                                    <Button type={"default"}
                                            onClick={() => copyScript('Anime Valorant', avString)}>
                                        Copy Script
                                    </Button>
                                </>
                            }]} style={{marginTop: 6}}/>
                            : <></>
                    }

                    {
                        checkAccess("pet-go") ? <Collapse bordered={false} items={[{
                                key: '9',
                                label: 'Pet Go',
                                children: <>
                                    <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                        {pgString}
                                    </SyntaxHighlighter>
                                    <Button type={"default"}
                                            onClick={() => copyScript('Pet Go', pgString)}>
                                        Copy Script
                                    </Button>
                                </>
                            }]} style={{marginTop: 6}}/>
                            : <></>

                    }
                    {
                        checkAccess("fisch") ? <Collapse bordered={false} items={[{
                                key: '10',
                                label: 'Fisch',
                                children: <>
                                    <SyntaxHighlighter language="lua" style={atomOneDark} customStyle={{borderRadius: 6}}>
                                        {fischString}
                                    </SyntaxHighlighter>
                                    <Button type={"default"}
                                            onClick={() => copyScript('Fisch', fischString)}>
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