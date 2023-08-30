import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onPanToMyLoc = onPanToMyLoc
window.onRemoveLoc = onRemoveLoc
window.onGotoLoc = onGotoLoc

function onInit() {
    mapService.initMap()
        .then(addEventListener)
        .then(locService.checkDataB)
        .then(renderLocs)
        .catch(() => console.log('Error: cannot init map'))
}

function renderLocs() {
    locService.getLocs()
        .then((locs) => {
            console.log('locs:', locs);
            let strHTMLs = locs.map((loc) => {
                return `<article class="location">
                <h5>${loc.name} </h5>
                <h5>Lat: ${loc.lat} </h5>
                <h5>Lng: ${loc.lng} </h5>
                <h5> ${new Date(loc.createdAt)}</h5>
                <button onclick="onGotoLoc('${loc.name}',${loc.lat},${loc.lng})">GO</button>
                <button onclick="onRemoveLoc('${loc.id}')">Delete</button>
                </article>`
            })
            const elLocTable = document.querySelector('.locs')
            elLocTable.innerHTML = strHTMLs.join('')
        })
}


function addEventListener() {
    const map = mapService.getMap()
    map.addListener("click", (mapsMouseEvent) => {
        console.log('mapsMouseEvent:', mapsMouseEvent);
        const { latLng } = mapsMouseEvent
        const { lat, lng } = latLng
        const { timeStamp: createdAt } = mapsMouseEvent.domEvent
        onMapClick(lat(), lng(), createdAt)
    })
}

function onMapClick(lat, lng, createdAt) {
    const name = prompt("please insert locations name:")
    locService.addNewLoc(lat, lng, name, createdAt)
    mapService.addMarker({ lat, lng })
    renderLocs()
}

function onRemoveLoc(locId) {
    locService.removeLoc(locId)
}

function onGotoLoc(name, lat, lng) {
    const loc = { lat, lng }
    mapService.addMarker(loc, name)
    mapService.panTo(lat, lng)
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
        .addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function onPanToMyLoc() {
    console.log('Panning the Map to the My Location')

    mapService.getUserLocation().then((user) => {
        console.log('user', user)
        mapService.panTo(user.lat, user.lng)
    }).catch((err) => { console.log(err) })
}