/*start html elements */
var find = document.getElementById('findInput');
var day1 = document.getElementById('day1');
var day2 = document.getElementById('day2');
var day3 = document.getElementById('day3');
/*end html elements */

/* start global functions */
function getDay(date) {
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const d = new Date(date);
  let day = weekday[d.getDay()];
  return day;
}
function getStringDate(dateString) {
      const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const formattedDate = `${day}${month}`;

    return formattedDate;

}
/* end global functions */
/*start get current location */
async function reverseGeocode(lat, lon) {
  let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
  let data = await response.json();
  return data.address.city || data.address.town || "Unknown";
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const city = await reverseGeocode(lat, lon);
        getData(city); 
      },
      (error) => {
        console.log("Error getting location, defaulting to Cairo:", error);
        getData('Cairo'); 
      }
    );
  } else {
    console.log("Geolocation is not supported, defaulting to Cairo.");
    getData('Cairo'); 
  }
}
/*end get current location */

/* fetching weather data */
async function getData(city) {
  try {
    var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=1b1e045e63b143debde143316241010&q=${city}&days=3`);
    var data = await response.json();
    console.log(data)
    displayWeather(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
/* display weather data */
function displayWeather(data) {
    console.log("in display")

  day1.innerHTML = `
    <div class="card-head forecast-header px-3 d-flex justify-content-between">
      <p class="day">${getDay(data.forecast.forecastday[0].date)}</p>
      <p class="date">${getStringDate(data.forecast.forecastday[0].date)}</p>
    </div>
    <div class="card-content forecast-content px-3">
      <p class="location">${data.location.name}</p>
      <p class="degree">${data.current.temp_c}<sup>o</sup>C</p>
      <div class="forecast-icon">
        <img src="${data.current.condition.icon}" alt="" width="90">
      </div>
      <p class="degree-desc">${data.current.condition.text}</p>
      <div class="weather-details">
        <span> <img src="./images/icon-umberella.png" class="p-2"/>${data.current.cloud}%</span>
        <span> <img src="./images/icon-wind.png" class="p-2"/>${data.current.wind_kph}km/h</span>
        <span> <img src="./images/icon-compass.png" class="p-2"/>${data.current.wind_dir}</span>
      </div>
    </div>`;
    
  day2.innerHTML = `<div class="card-head forecast-header px-3 d-flex justify-content-center bg-petrol">
    <p class="day">${getDay(data.forecast.forecastday[1].date)}</p>
  </div>
  <div class="card-content forecast-content px-3">
    <div class="degree-img">
      <img src="${data.forecast.forecastday[1].day.condition.icon}" alt="">
    </div>
    <p class="custom-degree">${data.forecast.forecastday[1].day.maxtemp_c}<sup>o</sup>C</p>
    <p class="average-degree">${data.forecast.forecastday[1].day.mintemp_c}<sup>o</sup></p>
    <p class="degree-desc">${data.forecast.forecastday[1].day.condition.text}</p>
  </div>`;
  
  day3.innerHTML = `<div class="card-head forecast-header px-3 d-flex justify-content-center bg-petrol">
    <p class="day">${getDay(data.forecast.forecastday[2].date)}</p>
  </div>
  <div class="card-content forecast-content px-3">
    <div class="degree-img">
      <img src="${data.forecast.forecastday[2].day.condition.icon}" alt="">
    </div>
    <p class="custom-degree">${data.forecast.forecastday[2].day.maxtemp_c}<sup>o</sup>C</p>
    <p class="average-degree">${data.forecast.forecastday[2].day.mintemp_c}<sup>o</sup></p>
    <p class="degree-desc">${data.forecast.forecastday[2].day.condition.text}</p>
  </div>`;
}

/* calling functions */
(function () {
    getUserLocation();
})();
find.addEventListener('input', function () {
  getData(find.value)
})