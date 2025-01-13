import {Avatar, Card, Col, Tooltip} from "antd";
export const RenderDataCount = ({imgItem, amountItem, itemName}: any) => {
    return (
        <Col>
            <Tooltip placement="top" title={itemName}>
                <Card size={"small"}>
                    <Card.Meta
                        avatar={

                                <Avatar src={imgItem} shape={"square"} />

                        }
                        title={<div style={{marginTop: 2}}>{amountItem}</div>}
                    />
                </Card>
            </Tooltip>
        </Col>
    )
}