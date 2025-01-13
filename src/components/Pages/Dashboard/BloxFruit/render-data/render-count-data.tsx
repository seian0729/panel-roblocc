import {Avatar, Card, Col} from "antd";
export const RenderDataCount = ({imgItem, amountItem}: any) => {
    return (
        <Col>
            <Card size={"small"}>
                <Card.Meta
                    avatar={<Avatar src={imgItem} shape={"square"} />}
                    title={<div style={{marginTop: 2}}>{amountItem}</div>}
                />
            </Card>
        </Col>
    )
}