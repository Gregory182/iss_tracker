const trackIssCheckBox = document.getElementById('checkbox');

let firsTime = true;
let trackOnMap = localStorage.getItem('trackOnMap') =="true";
let zoomValue = localStorage.getItem('zoomValue') || 3;

trackIssCheckBox.checked=trackOnMap;


trackIssCheckBox.addEventListener('click', (e)=> {
  trackOnMap = e.target.checked;
  localStorage.setItem('trackOnMap',trackOnMap)
})


//ISS_API
const iss_api_url = 'https://api.wheretheiss.at/v1/satellites/25544';



// Making a map and tiles
const map = L.map('mapid').setView([0, 0], zoomValue);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, attribution);

tiles.addTo(map);

const issIcon = L.icon({
  iconUrl: 'death-star.svg',
  iconSize: [50, 32],
  iconAnchor: [25, 16],
});

const marker = L.marker([0, 0], { icon: issIcon }).addTo(map);


async function get_iss() {
  const response = await fetch(iss_api_url);
  const data = await response.json();
  const { latitude, longitude, velocity, altitude } = data;

  marker.setLatLng([latitude, longitude]);

  if (trackOnMap) {
    zoomValue = map.getZoom();
    localStorage.setItem('zoomValue', zoomValue)
    map.setView([latitude, longitude], zoomValue);
  }



  let v = velocity / 3600;

  if (firsTime) {
    map.setView([latitude, longitude], 6);

    firsTime = false;
  }

  document.getElementById('latitude').textContent = latitude.toFixed(4);
  document.getElementById('longitude').textContent = longitude.toFixed(4);
  document.getElementById('altitude').textContent = altitude.toFixed(2);
  document.getElementById('velocity').textContent = v.toFixed(2);
}

// get_iss();

setInterval(get_iss, 1500);
