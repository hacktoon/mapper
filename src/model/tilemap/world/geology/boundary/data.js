
export const BD_LAND = 0
export const BD_WATER = 100
export const BD_CONVERGE = 16
export const BD_TRANSFORM = 4
export const BD_DIVERGE = 1
export const IDMAP = {
    L: BD_LAND,
    W: BD_WATER,
    C: BD_CONVERGE,
    D: BD_DIVERGE,
    T: BD_TRANSFORM,
}


export const BOUNDARY_TABLE = [
    // CONTINENTAL-CONTINENTAL ---------------------------
    {id: 'LLCC', name: 'Collision between continents', data: [
        {height: 100, border: '#EEE', color: '#CCC', energy: 3, chance: .5, growth: 2}
    ]},
    {id: 'LLCT', name: 'Early orogeny / sparse hills', rule: 'weight', data: [
        {height: 100, color: '#749750', energy: 1, chance: .1, growth: 6},
        {height: 100, color: '#9aae6d', energy: 1, chance: .4, growth: 3},
    ]},
    {id: 'LLCD', name: 'Early rift', data: [
        {height: 100, border: '#058', color: '#058', energy: 4, chance: .5, growth: 8},
        {height: 100, border: '#0b7005', color: '#0b7005', energy: 3, chance: .5, growth: 10},
    ]},
    {id: 'LLTT', name: 'Transform Fault', data: [
        {height: 100, color: '#9aae6d', energy: 1, chance: .5, growth: 8}
    ]},
    {id: 'LLDT', name: 'Medium continental rift / valley', data: [
        {height: 100, border: '#058', color: '#069', energy: 3, chance: .5, growth: 3},
        {height: 100, border: '#058', color: '#069', energy: 3, chance: .5, growth: 3},
    ]},
    {id: 'LLDD', name: 'Continental rift / early sea', rule: 'weight', data: [
        {height: 100, border: '#058', color: '#069', energy: 5, chance: .5, growth: 5},
        {height: 100, border: '#058', color: '#069', energy: 5, chance: .5, growth: 5},
    ]},

    // CONTINENTAL-OCEANIC ---------------------------
    {id: 'LWCC', name: 'Cordillera', rule: 'weight', data: [
        {height: 50, color: '#025', energy: 2, chance: .2, growth: 1}, //trench
        {height: 50, color: '#a79e86', energy: 2, chance: .6, growth: 1}, //mountains
    ]},
    {id: 'LWCT', name: 'Early cordillera', rule: 'weight', data: [
        {height: 50, color: '#036', energy: 1, chance: .1, growth: 5}, //trench
        {height: 50, color: '#a4ce84', energy: 1, chance: .1, growth: 10}, //mountains
    ]},
    {id: 'LWCD', name: 'Early passive margin', rule: 'weight', data: [
        {height: 50, color: '#069', energy: 1, chance: .5, growth: 8},
        {height: 50, border: '#058', color: '#069', energy: 1, chance: .5, growth: 2},
    ]},
    {id: 'LWTT', name: 'Coastal fault', rule: 'weight', data: [  // break regions
        {height: 50, color: '#069', energy: 1, chance: .5, growth: 8},
        {height: 50, border: '#069', color: '#069', energy: 1, chance: .5, growth: 8},
    ]},
    {id: 'LWDT', name: 'Early oceanic rift', rule: 'weight', data: [
        {height: 50, color: '#069', energy: 1, chance: .5, growth: 2},
        {height: 50, color: '#749750', energy: 1, chance: .5, growth: 2},
    ]},
    {id: 'LWDD', name: 'Passive margin/Oceanic rift', rule: 'weight', data: [
        {height: 50, border: '#069', color: '#069', energy: 1, chance: .5, growth: 2}
    ]},

    // OCEANIC-OCEANIC ---------------------------
    {id: 'WWCC', name: 'Island arc', rule: 'weight', data: [
        {height: 0, color: '#025', energy: 2, chance: .5, growth: 2}, //trench
        {height: 0, color: '#26a11f', energy: 2, chance: .5, growth: 2}, //arc
    ]},
    {id: 'WWCT', name: 'Early island arc', rule: 'weight', data: [
        {height: 0, border: '#025', color: '#025', energy: 1, chance: .1, growth: 5}, //trench
        {height: 0, color: '#26a11f', energy: 1, chance: .5, growth: 5}, //arc
    ]},
    {id: 'WWCD', name: 'Early continent', rule: 'weight', data: [
        {height: 0, border: '#069', color: '#058', energy: 3, chance: .1, growth: 5},
        {height: 0, border: '#069', color: '#26a11f', energy: 2, chance: .1, growth: 16},
    ]},
    {id: 'WWTT', name: 'Oceanic fault', data: [
        {height: 0, color: '#003f6c', energy: 1, chance: .5, growth: 8}
    ]},
    {id: 'WWDT', name: 'Early oceanic rift', data: [
        {height: 0, color: '#069', energy: 1, chance: .5, growth: 2},
    ]},
    {id: 'WWDD', name: 'Oceanic rift', data: [
        {height: 0, color: '#047', energy: 1, chance: .1, growth: 8}
    ]},
]
