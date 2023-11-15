// openWeather Query Selectors
let currentCityDiv = document.querySelector(`#currentCityDiv`);
let currentTempDiv = document.querySelector('#currentTempDiv');
let currentWeatherStatusDiv = document.querySelector('#currentWeatherStatusDiv');
let userInput = document.querySelector('#cityInput');
let stateInput = document.querySelector('#stateInput')
let userInputBtn = document.querySelector('#cityInput-Btn');

let requestedCity = "";
let requestedState = "";

let openWeatherApiKey = "8a9b986776d2999e3580193c86a5744c";
let lat = "34.073334";
let lon = "-118.027496";

async function latLongApi() {
    let findLatLongUrl = "";
    if (location.protocol === 'http') {
        findLatLongUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${requestedCity}&appid=${openWeatherApiKey}`
    } else {
        findLatLongUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${requestedCity}&appid=${openWeatherApiKey}`
    }
    let response = await fetch(findLatLongUrl)
    try {
        if (response.ok) {
            let data = await response.json();
            let fetchedLat = data[0]["lat"];
            let fetchedLon = data[0]["lon"];
            lat = fetchedLat;
            lon = fetchedLon;
            getWeather();
        } else {
            console.log("Response not OK");
        };
    }
    catch (err) {
        console.log(err);
    };
};

async function getWeather() {
    let baseUrl;
    if (location.protocol === 'http') {
        baseUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`
    } else {
        baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`
    };
    const response = await fetch(baseUrl);
    try {
        if (response.ok) {
            let data = await response.json();
            let currentCity = data["city"]["name"];
            let currentTemperature = data["list"][0]["main"]["temp"];
            let currentWeather = data["list"][0]["weather"][0]["description"];
            currentCityDiv.textContent = `City: ${currentCity}`;
            currentTempDiv.textContent = `Current Temperature: ${currentTemperature}F`;
            currentWeatherStatusDiv.textContent = `Status: ${currentWeather}`;
        }
    } catch (err) {
        console.log(err);
    };
};

// -----------------END openWeather API-------------------

let ticketMasterApiKey = "SGU2gyci9kgPhW35MA8NlejLs92Z4EM4";
let fetchedEvents = [];
let eventsListUL = document.querySelector('#eventsList');

async function getEvents() {
    const formattedCity = formatCity(requestedCity);
    let ticketMasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=${ticketMasterApiKey}&city=$${formattedCity}`;
    try {
        let response = await fetch(ticketMasterUrl);

        if (response.ok) {
            let result = (await response.json());
            let data = result["_embedded"]["events"];
            
            for (i = 0; i < data.length; i++) {
                let eventData = data[i]["name"];
                fetchedEvents.push(eventData);
                let newLi = document.createElement('li');
                newLi.textContent = fetchedEvents[i];
                eventsListUL.appendChild(newLi);
            };
        };
    } catch (err) {
        console.log(err);
    };
};

// -----------------END TicketMaster API-------------------

function formatCity(cityName) {
    if (cityName.includes(' ')) {
      return cityName.replace(/\s/g, '%20');
    } else {
      return cityName;
    }
  };

let fetchedRestaurantNames = [];

async function getRestaurants() {
    const formattedCity = await formatCity(requestedCity);
    let restaurantListDivUL = document.querySelector('#restaurantList');
    const url = `https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/state/${requestedState}/city/${formattedCity}/0`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b7633d815emsh3230d09d00cd30bp130f8fjsnd43c8fffa537',
            'X-RapidAPI-Host': 'restaurants-near-me-usa.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        let data = result["restaurants"]["restarantName"];
        result.restaurants.forEach(restaurantz => {
            const restarantName = restaurantz["restaurantName"];
            fetchedRestaurantNames.push(restarantName);
        })
        fetchedRestaurantNames.forEach(restaurant => {
            newLi = document.createElement('li');
            newLi.textContent = restaurant;
            restaurantListDivUL.appendChild(newLi);

        })
    } catch (error) {
        console.error(error);
    };
};

// -----------------END Restaurants API-------------------

let hotelUL = document.querySelector('#hotelsList');

const hotels = [];

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '2533ec1a1amshf6c5a3c72a4243ap124946jsn68c2d2fed973',
		'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
	}
};


async function getHotels() {
    const formattedCity = formatCity(requestedCity);
    const url = `https://hotels4.p.rapidapi.com/locations/v3/search?q=${formattedCity}&locale=en_US&langid=1033&siteid=300000001`;

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        result.sr.forEach(item => {
            if (item["@type"] === "gaiaHotelResult") {
                hotels.push(item.regionNames.shortName);
            };
        });
        hotels.forEach(hotel => {
            newLi = document.createElement('li');
            newLi.textContent = hotel;
            hotelUL.appendChild(newLi);
        })
    } catch (error) {
        console.error(error);
    }
}

// -----------------END Hotels API-------------------

document.addEventListener('DOMContentLoaded', function() {
    userInputBtn.addEventListener('click', function(e) {
        e.preventDefault();
        requestedCity = userInput.value;
        requestedState = stateInput.value
        latLongApi();
        getEvents();
        getHotels();
        getRestaurants();
    })
})