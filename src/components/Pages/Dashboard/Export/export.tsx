import React from "react";
import {Button, message} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import moment from "moment";

import * as XLSX from "xlsx";
import {saveAs} from "file-saver";


export const Export = ({data, gameName} : any) => {

    const [messageApi, contextHolder] = message.useMessage();

    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});

        // format the date to be used as the file name, e.g. data_yyyy-mm-dd hh:mm:ss.xlsx

        try {
            saveAs(blob, `${gameName}_${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx`);
            messageApi.success('Export successful, please check your download folder');
        } catch (e) {
            messageApi.error('Export failed');
        }


    }

    return (
        <>
            {contextHolder}
            <Button
                type="primary"
                size={"small"}
                icon={<DownloadOutlined/>}
                onClick={handleExport}
            >Export to xlsx</Button>
        </>
    )
}