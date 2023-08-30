import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onPanToMyLoc = onPanToMyLoc
function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            addEventListener()
        })
        .catch(() => console.log('Error: cannot init map'))
}


function addEventListener() {
    const map = mapService.getMap()
    map.addListener("click", (mapsMouseEvent) => {
        console.log('mapsMouseEvent:', mapsMouseEvent);
        const { latLng } = mapsMouseEvent
        const { lat, lng } = latLng
        console.log('lat, lng :', lat, lng);
        onMapClick(lat(), lng())
    })
}

function onMapClick(lat, lang) {
    console.log('lat + lang:', lat, lang);
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
    }).catch((err) => {console.log(err)})
}