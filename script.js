// global variables and moment format for now

var apiKey = "d1e2d0763204896fd894698f5c6e27ee";
var today = moment().format('LLL');
var searchHistoryList = [];

// start with first functions for fething the coddingtion now via url-Asynchronous JavaScript and XML or ajax//
function currentCondition(city) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResponse) {
        console.log(cityWeatherResponse);
        
        $("#weather-infor").css("display", "block");
        $("#city-infor").empty();
        
        var iconCode = cityWeatherResponse.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
        // displayign city informations and current weather conditions including in para:
        //  tempreture, humidity and wind speed. in fahrenheit
        var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
            <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
        `);

        $("#city-infor").append(currentCity);

        // variables for UV index live fectching forcasting the daily and expected intensity of
        //  the UV index to users//
        