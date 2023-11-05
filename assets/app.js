
// openWeather Query Selectors
let currentWeatherDiv = document.querySelector('#currentWeather')

let openWeatherApiKey = "8a9b986776d2999e3580193c86a5744c"
let lat = ""
let lon = ""
let inputtedCity = "El Monte"
let findLatLongUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${inputtedCity}&appid=${openWeatherApiKey}`

async function latLongApi() {
    let response = await fetch(findLatLongUrl)
    try {
        if (response.ok) {
            let data = await response.json();
            let fetchedLat = data[0]["lat"]
            let fetchedLon = data[0]["lon"]
            lat = fetchedLat
            lon = fetchedLon
            getWeather()
            // console.log(data)
        } else {
            console.log("Response not OK")
        }
    }
    catch (err) {
        console.log(err)
    }
}

latLongApi()

async function getWeather() {
    let getWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=imperial`
    let response = await fetch(getWeatherUrl)
    try {
        if (response.ok) {
            let data = await response.json();
            console.log(data)
        }
    } catch (err) {
        console.log(err)
    }
}

// -----------------END openWeather API-------------------

let ticketMasterApiKey = "SGU2gyci9kgPhW35MA8NlejLs92Z4EM4"
let city = "El Monte"

async function getEvents() {
    let ticketMasterUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=${ticketMasterApiKey}&city=$Seattle`
    try {
        let response = await fetch(ticketMasterUrl);

        if (response.ok) {
            let data = (await response.json())
            console.log(data["_embedded"]["events"])
        }
    } catch (err) {
        console.log(err)
    }
}

getEvents()

// -----------------END TicketMaster API-------------------
