const colorRaces: {[index: string]:any} = {
    ['Fishman']: 'geekblue',
    ['Draco']: 'volcano',
    ['Skypiea']: 'gold',
    ['Mink']: 'green',
    ['Human']: 'red'
}

export function getRaceColor(raceName: string)  {
    let rodNameSub = raceName.substring(0, raceName.indexOf("[") - 1)
    if (colorRaces[rodNameSub] !== undefined){
        return colorRaces[rodNameSub]
    }
    else return "default"
}