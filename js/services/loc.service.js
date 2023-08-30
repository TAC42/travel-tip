import { storageService } from './storage.service.js'

const LOC_STORAGE_KEY = 'locsDB'
export const locService = {
    getLocs,
    addNewLoc,
    removeLoc,
    checkDataB
}

let locs = [
    {  name: 'Greatplace', lat: 32.047104, lng: 34.832384, createdAt: 1693399740 },
    {  name: 'Neveragain', lat: 32.047201, lng: 34.832581, createdAt: 1293399740 }
]

function checkDataB() {
    storageService.query(LOC_STORAGE_KEY)
        .then((locations) => {
            console.log('locations:', locations)
            if(!locations || !locations.length) {
                storageService.post(LOC_STORAGE_KEY, locs[0])
                storageService.post(LOC_STORAGE_KEY, locs[1])
            } else locs = locations
        })
        .catch( (error) => {
            console.log(error)})
}

function addNewLoc(lat, lng, name, createdAt) {
    const loc = {
        name,
        lat,
        lng,
        createdAt
    }
    locs.push(loc)
    storageService.post(LOC_STORAGE_KEY, loc)
}

function removeLoc(locId) {
    console.log('locId:', locId);
    storageService.remove(LOC_STORAGE_KEY, locId)
}


function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


