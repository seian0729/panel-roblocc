import {Tag, Typography} from "antd";
import React, {useState} from "react";
const { Text } = Typography;

export const RenderMythical = ({data, type}: any) => {
    const specialRenderShortName: any = {
        ['Cursed Dual Katana']: 'CDK',
        ['Skull Guitar']: 'SG',
        ['Mirror Fractal']: 'MF',
        ['Valkyrie Helm']: 'VH',
        ['True Triple Katana']: 'TTK',
        ['Shark Anchor']: 'Shark Anchor',
    }

    const [mythicalFruits, setMythicalFruits] = useState([
        'Leopard',
        'Dragon',
        'Dough',
        'Mammoth',
        'Kitsune',
        'T-Rex',
        'Gas',
        'Yeti',
        'Gravity'
    ]);

    const mythicalItems = [
        'Cursed Dual Katana',
        'Skull Guitar',
        'Mirror Fractal',
        'Valkyrie Helm',
        'Shark Anchor'
    ]

    let description = JSON.parse(data.Description);
    let bfData = description['Inventory']['Blox Fruit']
    let sData = description['Inventory']['Sword']
    let GData = description['Inventory']['Gun']
    let MGata = description['Inventory']['Material']
    let WGata = description['Inventory']['Wear']

    const specialRender: any[] = [];
    const specialFruit: any[] = [];
    const allMythicalFruit: any[] = [];

    switch (type) {
        case "Fruit": {
            bfData.map((key: any) => {
                if (typeof (key) == 'object' && mythicalFruits.indexOf(key['Name']) !== -1) {
                    specialRender.push(key['Name'])
                    specialFruit.push(key['Name'])
                }
                if (key.Rarity == 4){
                    allMythicalFruit.push(key['Name'])
                }
            })
            break
        }
        case "Item": {
            sData.map((key: any) => {
                if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                    specialRender.push(key['Name'])
                }
            })

            GData.map((key: any) => {
                if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                    specialRender.push(key['Name'])
                }
            })

            MGata.map((key: any) => {
                if (typeof (key) == 'object' && mythicalItems.indexOf(key['Name']) !== -1) {
                    specialRender.push(key['Name'])
                }
            })

            WGata.map((key: any) => {
                if (typeof (key) == 'object' && mythicalItems.indexOf(key.Name) !== -1) {
                    specialRender.push(key.Name)
                }
            })
        }
    }

    if (specialFruit.length > 0 && allMythicalFruit.length > 0 && allMythicalFruit.length - specialFruit.length > 0){
        specialRender.push(`Mythical Fruits: ${allMythicalFruit.length - specialFruit.length}`)
    }

    if (specialRender.includes('Valkyrie Helm') && specialRender.includes('Mirror Fractal')){
        let indexVH = specialRender.indexOf('Valkyrie Helm')
        let indexMF = specialRender.indexOf('Mirror Fractal')
        specialRender.splice(indexVH)
        specialRender.splice(indexMF)
        specialRender.push("MM")
    }

    return (
        <>

            {

                specialRender.length == 0 ?
                    <Text>-</Text>
                    :
                    specialRender.map((key: any) => {
                        return (
                            <Tag color="red" key={key} style={{margin: 4}}>
                                {specialRenderShortName[key] != undefined ? specialRenderShortName[key] : key }
                            </Tag>
                        );
                    })
            }


        </>

    )
}