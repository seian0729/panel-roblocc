const colorRods: {[index: string]:any} = {
    ['Phoenix Rod']: 'volcano',
    ['Scurvy Rod']: 'yellow',
    ['Aurora Rod'] : 'blue',
    ['Trident Rod']: 'gold',
    ['Rod Of The Depths']: 'magenta',
    ['Sunken Rod']: 'green',
    ['No-Life Rod']: 'error',
    ['Rod of The Eternal King']: 'gold',
    ['Rod Of The Forgotten Fang']: 'geekblue'
}

const indexRods: {[index: string]:any} = {
    ['Scurvy Rod']: 8,
    ['Phoenix Rod']: 7,
    ['Aurora Rod']: 6,
    ['Trident Rod']: 5,
    ['Sunken Rod']: 4,
    ['Rod Of The Depths']: 3,
    ['No-Life Rod']: 2,
    ['Rod of The Eternal King']: 1,
    ['Rod Of The Forgotten Fang']: 0,
}

const listRodShow = [
    'Aurora Rod',
    'Trident Rod',
    'Rod Of The Depths',
    'Sunken Rod',
    'Phoenix Rod',
    'Scurvy Rod',
    'No-Life Rod',
    'Rod of The Eternal King',
    'Rod Of The Forgotten Fang',
]


export function getIndexRod(rodName: string){
    if (indexRods[rodName] !== undefined){
        return indexRods[rodName]
    }
    return indexRods.length + 1
}

export function getColorRod(rodName: string)  {
    if (colorRods[rodName] !== undefined){
        return colorRods[rodName]
    }
    else return "default"
}

export {indexRods, colorRods, listRodShow}
