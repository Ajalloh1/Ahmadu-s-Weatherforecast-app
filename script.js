// global variables and moment format for now
var apiKey = "d1e2d0763204896fd894698f5c6e27ee";
var today = moment().format('LLL');
var searchHistoryList = [];
// start with first functions for fetching the conddingtion NOW via url-Asynchronous JavaScript and XML or ajax//
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
        var lat = cityWeatherResponse.coord.lat;
        var lon = cityWeatherResponse.coord.lon;
        var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        $.ajax({
            url: uviQueryURL,
            method: "GET"
        }).then(function(uviResponse) {
            console.log(uviResponse);
            var uvIndex = uviResponse.value;
            var uvIndexP = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
            `);
            $("#city").append(uvIndexP);
            futureCondition(lat, lon);
            // if statements to indicate the favorability of weather condition using color code
            if (uvIndex >= 0 && uvIndex <= 2) {
                $("#uvIndexColor").css("background-color", "green").css("color", "blue");
            } else if (uvIndex >= 3 && uvIndex <= 5) {
                $("#uvIndexColor").css("background-color", "yellow");
            } else if (uvIndex >= 6 && uvIndex <= 7) {
                $("#uvIndexColor").css("background-color", "orange");
            } else if (uvIndex >= 8 && uvIndex <= 10) {
                $("#uvIndexColor").css("background-color", "red").css("color", "blue");
            } else {
                $("#uvIndexColor").css("background-color", "purple").css("color", "blue"); 
            };  
        });
    });
}
//funtions forcast for future weather conditions //
function futureCondition(lat, lon) {
    var futureURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
    $.ajax({
        url: futureURL,
        method: "GET"
    }).then(function(futureResponse) {
        console.log(futureResponse);
        $("#fiveDay").empty();
        ///using forloop for where i start from 1 to less than 6//
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: futureResponse.daily[i].dt,
                icon: futureResponse.daily[i].weather[0].icon,
                temp: futureResponse.daily[i].temp.day,
                humidity: futureResponse.daily[i].humidity
            };
///variables storing mmoment  with format using month dayth and year//
            var currDate = moment.unix(cityInfo.date).format("MMMM Do YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;
            //cards for next five days forcast displaying dates and weather conditions//
            var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${currDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °F</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `);
            $("#fiveDay").append(futureCard);
        }
    }); 
}
// onclick event listener and search history storage to local storage//
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var city = $("#enterCity").val().trim();
    currentCondition(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = $(`
            <li class="list-group-item">${city}</li>
            `);
        $("#searchHistory").append(searchedCity);
    };
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
});
//retriving current weather details of cities in historic search//
$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    currentCondition(listCity);
});
///displaying last seached city when dasboard is viewed//
$(document).ready(function() {
    var searchHistoryArr = JSON.parse(localStorage.getItem("city"));
    if (searchHistoryArr !== null) {
        var lastSearchedIndex = searchHistoryArr.length - 1;
        var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
        currentCondition(lastSearchedCity);
        console.log(`Last searched city: ${lastSearchedCity}`);
    }
});