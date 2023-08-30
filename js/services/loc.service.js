import { storageService } from './services/storage.service.js'
import { utilService } from './services/util.service.js'

const LOC_STORAGE_KEY = 'locsDB'
export const locService = {
    getLocs,
    addNewLoc
}


const locs = [
    { id: 1, name: 'Greatplace', lat: 32.047104, lng: 34.832384, createdAt: 1693399740 },
    { id: 2, name: 'Neveragain', lat: 32.047201, lng: 34.832581 createdAt: 1293399740 }
]

function addNewLoc(lat, lng, createdAt) {
    locs.push({
        id: utilService.makeId(),
        name: prompt('Please name your new location:'), 
        lat,
        lng,
        createdAt
    })
    storageService.load(LOC_STORAGE_KEY, locs)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


