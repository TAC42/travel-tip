import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            addEventListener()
        })
        .catch(() => console.log('Error: cannot init map'))
}

function renderLocs(){
    const locs = locService.getLocs()
    console.log('locs:', locs);
    let strHTMLs = locs.map((loc) => {
        return `<article class="location" >
        <h5>${loc.name} </h5>
        <h5>Lat: ${loc.lat} </h5>
        <h5>Lng: ${loc.lng} </h5>
        <h5> ${new Date(loc.createdAt)}</h5>
        <button onclick="onAddMarker('${loc.name},${loc.lat},${loc.lng} ')">GO</button>
        <button onclick="onAddMarker('${loc.id}')">Delete</button>
        </article>`
    })
    const elLocTable = document.querySelector('.loc-table')
    elLocTable.innerHTML = strHTMLs.join('')


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
    locService.addNewMap(lat, lng, createdAt)
    mapService.addMarker({lat,lng})
    renderLocs()

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