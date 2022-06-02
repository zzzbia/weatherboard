const apiKey = "9f16d208ad1cda81d1b3a4d27caa60bf";

// https://openweathermap.org/api/one-call-3

// function getWeatherForecast takes in 2 parameters (city and country)
const getWeatherForecast = (city, country) => {
	// then it fetches the forecast and subs in the queries city, country and the API key
	fetch(
		`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			// Empty out the weather forecast so that we can return new data
			$("#weather-forecast").empty();
			console.log(data);
			// for each data list item we will then create a function that has an if statement
			data.list.forEach((item) => {
				// if the item.dt_text has 12:00 then we will create a const "forecastCard"
				if (item.dt_txt.includes("12:00:00")) {
					// forecastCard creates a div with a class of card col (to add bootstrap styling)
					const forecastCard = $("<div>")
						.addClass("card col")
						// append another div with the class "card body"(to add bootstrap styling)
						.append(
							$("<div>")
								.addClass("card-body")
								// then append a heading element <h5>
								.append(
									$("<h5>")
										// add the class card title to <h5> and the date, to the local date
										.addClass("card-title")
										.text(new Date(item.dt_txt).toLocaleDateString()),
									// pass in a image with the properties src to retrieve the weather icon
									$("<img>").prop({
										src: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
									}),
									// pass a paragraph element with the class "card text" (to add bootstrap styling)
									$("<p>")
										.addClass("card-text")
										// the text to include is rounding the temp received from kelvin to celcius
										.text(`Temp: ${Math.round(item.main.temp - 273.15)}°C`),
									// pass a paragraph element with the class "card text" (to add bootstrap styling)
									$("<p>")
										.addClass("card-text")
										// the text that is retrieved is the wind speed, miles per second
										.text(`Wind: ${item.wind.speed} m/s`),
									// pass a paragraph element with the class "card text" (to add bootstrap styling
									$("<p>")
										.addClass("card-text")
										// the text that is rendered is the items humidity percentage
										.text(`Humidity: ${item.main.humidity}%`)
								)
						);
					$("#weather-forecast").append(forecastCard);
					// .appendTo("#weather-forecast");
				}
			});
		});
};
// create function getUV that takes in the latitude and the longitude
const getUV = (lat, lon) => {
	fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			// console.log(data, "HELLOOOOO");
			// creating a badge variable that renders bg primary (blue)
			let badge = "bg-primary";
			//if uv is less than or equal to 0.7 then badge will be bg-success (green)
			if (data.current.uvi <= 0.7) {
				badge = "bg-success";
			}
			//if uv is greater than 0.7 then badge will be bg-danger(red)
			if (data.current.uvi > 0.7) {
				badge = "bg-danger";
			}
			// creating a const variable that creates a div and adds the class of "card px-3 py-3 my-4"(bootstrap styling)
			const uvtext = $("<div>")
				.addClass("card px-3 py-3 my-4")
				// then it appends it to another div with the added class of "card-text"(bootstrap styling)
				.append(
					$("<div>")
						.addClass("card-text")
						.html(`UV-Index: `)
						.append(
							$("<span>")
								.addClass(`badge badge-pill ${badge}`)
								.html(`${data.current.uvi}%`)
						)
				);
			$("#weather").append(uvtext);
		});
};

const getWeather = (city, countryCode = "US") => {
	/// Country code is only required if country is not USA
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			const weatherCard = $("<div>")
				.addClass("card px-3 py-3 my-4")
				.append(
					$("<h1>")
						.addClass("card-title")
						.text(
							`${data.name}, ${data.sys.country} - ${moment().format(
								"MMMM Do YYYY"
							)}`
						)
						.prepend(
							`<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png">`
						),

					$("<p>")
						.addClass("card-text")
						.text(`Temp: ${Math.round(data.main.temp - 273.15)}°C`),
					$("<p>").addClass("card-text").text(`Wind: ${data.wind.speed} m/s`),
					$("<p>")
						.addClass("card-text")
						.text(`Humidity: ${data.main.humidity}%`)
				);

			$("#weather").empty().append(weatherCard);

			getUV(data.coord.lat, data.coord.lon);
		})
		.catch((e) => {
			alert("Something went wrong.. Please recheck the city and try again");
			console.error(e);
		});
};

document.getElementById("citySearch").addEventListener("click", (e) => {
	e.preventDefault();
	const searchQuery = document.getElementById("search").value;
	if (searchQuery.length > 0) {
		let previousSearches = [];
		if (localStorage.getItem("previousSearches") !== null) {
			previousSearches = JSON.parse(localStorage.getItem("previousSearches"));
		}
		previousSearches.push(searchQuery);
		localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
		getWeather(searchQuery, "");
		getWeatherForecast(searchQuery, "");
		showPreviousSearches();
	}
});

// A Local Storage Function that parses the JSON (previousSearches)
// for each search, a constant variable that creates a list
const showPreviousSearches = () => {
	searches = JSON.parse(localStorage.getItem("previousSearches"));
	if (searches) {
		$("#previous-searches").empty();
		searches.forEach((search) => {
			const element = $(`<li>${search}</li>`).on("click", () => {
				getWeather(search, "");
				getWeatherForecast(search, "");
			});
			element.addClass("list-group-item search-history-item");
			$("#previous-searches").append(element);
		});
	}
};

// on first call we will run the weather for toronto
showPreviousSearches();
getWeather("Toronto", "CA");
getWeatherForecast("Toronto", "CA");
