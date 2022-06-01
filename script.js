const apiKey = "9f16d208ad1cda81d1b3a4d27caa60bf";

// https://openweathermap.org/api/one-call-3

const getWeatherForecast = (city, country) => {
	fetch(
		`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			$("#weather-forecast").empty();
			data.list.forEach((item) => {
				if (item.dt_txt.includes("12:00:00")) {
					const forecastCard = $("<div>")
						.addClass("card col")
						.append(
							$("<div>")
								.addClass("card-body")
								.append(
									$("<h5>")
										.addClass("card-title")
										.text(new Date(item.dt_txt).toLocaleDateString()),
									$("<p>")
										.addClass("card-text")
										.text(`Temp: ${Math.round(item.main.temp - 273.15)}°C`),
									$("<p>")
										.addClass("card-text")
										.text(`Wind: ${item.wind.speed} m/s`),
									$("<p>")
										.addClass("card-text")
										.text(`Humidity: ${item.main.humidity}%`)
								)
						);
					$("#weather-forecast").append(forecastCard);
					// .appendTo("#weather-forecast");
				}
			});
		});
};

const getWeather = (city, countryCode) => {
	/// Country code is only required if country is not USA
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`
	)
		.then((response) => response.json())
		.then((data) => {
			const weatherCard = $("<div>")
				.addClass("card px-3 py-3 my-4")
				.append(
					$("<h1>")
						.addClass("card-title")
						.text(`${data.name}, ${moment().format("MMMM Do YYYY")}`),
					$("<p>")
						.addClass("card-text")
						.text(`Temp: ${Math.round(data.main.temp - 273.15)}°C`),
					$("<p>").addClass("card-text").text(`Wind: ${data.wind.speed} m/s`),
					$("<p>")
						.addClass("card-text")
						.text(`Humidity: ${data.main.humidity}%`)
				);

			$("#weather").empty().append(weatherCard);
		})
		.catch((e) => console.error(e));
};

document.getElementById("citySearch").addEventListener("click", (e) => {
	e.preventDefault();
	const searchQuery = document.getElementById("search").value;
	if (searchQuery.length > 0) {
		getWeather(searchQuery, "");
		getWeatherForecast(searchQuery, "");
	}
});

// on first call we will run the weather for toronto
getWeather("Toronto", "CA");
getWeatherForecast("Toronto", "CA");
// after searching for a city get current weather conditions (for that city) and then that city is added to search history

//include success vs modal error 404 response
// 5-Day Forecast, icons come from open weather
//
