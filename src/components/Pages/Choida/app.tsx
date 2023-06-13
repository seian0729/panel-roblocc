import React from 'react';
import {Button, message, QRCode} from 'antd';

const Choida: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'This is a prompt message for success, and it will disappear in 10 seconds',
            duration: 10,
        });
    };

    return (
        <>
            {contextHolder}
            <Button onClick={success}>Customized display duration</Button>

            <QRCode
                style={{marginBottom: 16}}
                size={300}
                errorLevel={'H'}
                value="https://discord.gg/seahub"
            />
        </>
    );
};

export default Choida;