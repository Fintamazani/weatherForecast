//tampilan awal
let cityName = "Depok";
let latitude = -6.4;
let longitude = 106.8186;

//global variable
let currentWeatherCode = 0;
let weatherCodes = [];
const weatherCode = {
  0: "Clear Sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Drizzle: Light",
  53: "Drizzle: dense intensity",
  56: "Freezing Drizzle: light",
  57: "Freezing Drizzle: dense intensity",
  61: "Rain: Slight",
  63: "Rain: Moderate",
  65: "Rain: Heavy Intensity",
  66: "Freezing Rain: Light",
  67: "Freezing Rain: Heavy Intensity",
  71: "Snow fall: Slight",
  73: "Snow fall: Moderate",
  75: "Snow fall: Heavy Intensity",
  77: "Snow grains",
  80: "Rain showers: Slight",
  81: "Rain showers: Moderate",
  82: "Rain showers: Violent",
  85: "Snow showers slight",
  86: "Snow showers heavy",
  95: "Thunderstorm: Slight",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

// Menyesuaikan background image berdasarkan kondisi cuaca dari weatherCode
function setWeatherBackground(weatherCode) {
  const body = document.body;

  if (weatherCode >= 0 && weatherCode <= 3) {
    body.classList = "sunny";
    // body.classList.add('sunny'); tidak dipakai karena menambah list, bukan mengganti
  } else if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 85)
  ) {
    body.classList = "rainy";
    // body.classList.add('rainy');
  } else if (weatherCode === 45 || weatherCode === 48) {
    body.classList = "foggy";
    // body.classList.add('foggy');
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    body.classList = "stormy";
    // body.classList.add('stormy');
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    body.classList = "snowy";
    // body.classList.add('snowy');
  } else {
    body.classList = "default";
    // body.classList.add('default');
  }
}

//fetch data untuk daily forecast
async function fetchWeatherForecast() {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Asia%2FBangkok`
  );

  const result = await response.json();

  result.daily.time.forEach((el, i) => {
    const dayCard = document.createElement("div");
    dayCard.classList.add("dayCard");
    dayCard.id = `daycard${i}`;

    //Data hari untuk di dayCard
    const cardTitle = document.createElement("h3");
    cardTitle.classList.add("cardTitle");
    cardTitle.id = `cardTitle${i}`;
    cardTitle.innerHTML = new Date(el).toLocaleDateString("en-US", {
      weekday: "long",
    });
    dayCard.append(cardTitle);

    //Data tanggal, bulan, tahun untuk di dayCard
    const dateTitle = document.createElement("p");
    dateTitle.classList.add("dateTitle");
    dateTitle.id = `dateTitle${i}`;
    dateTitle.innerHTML = new Date(el).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    dayCard.append(dateTitle);

    //Data temperature untuk di dayCard
    const temp = document.createElement("p");
    temp.classList.add("temp");
    temp.id = `temp${i}`;
    temp.innerHTML = result.daily.temperature_2m_max[i] + " °C";
    dayCard.append(temp);

    //Data weather condition untuk di dayCard
    const weather = document.createElement("p");
    weather.classList.add("weather");
    weather.id = `weather${i}`;
    weather.innerHTML = weatherCode[result.daily.weather_code[i]];
    weatherCodes.push(result.daily.weather_code[i]);
    dayCard.append(weather);

    const days = document.querySelector("#days");
    days.append(dayCard);

    //Hover untuk dayCard
    dayCard.addEventListener("mouseover", function () {
      dayCard.style.transform = "translateY(-10px)";
      console.log(weatherCodes[i]);
      setWeatherBackground(weatherCodes[i]); //background image berubah sesuai weather code/condition di dayCard
    });

    dayCard.addEventListener("mouseout", function () {
      dayCard.style.transform = "translateY(0)";
      setWeatherBackground(currentWeatherCode); //background image mengikuti current weather code
    });
  });
}

async function fetchCurrentForecast() {
  const response2 = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Asia%2FBangkok`
  );

  const result2 = await response2.json();

  const currentWeather = document.querySelector(".currentWeather");

  // City & Date Current Weather pada tampilan awal
  const cityDate = document.createElement("div");
  const city = document.createElement("h2");
  const date = document.createElement("h3");

  cityDate.classList.add("cityDate");
  city.classList.add("city");
  date.classList.add("date");

  city.innerHTML = cityName;
  date.innerHTML = new Date(result2.current.time).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  cityDate.append(city);
  cityDate.append(date);
  currentWeather.append(cityDate);

  //Temperature & Condition From Weather Code
  const temptCond = document.createElement("div");
  const temperature = document.createElement("h3");
  const condition = document.createElement("h3");

  temptCond.classList.add("temptCond");
  temperature.classList.add("temperature");
  condition.classList.add("condition");

  temperature.innerHTML = result2.current.temperature_2m + " °C";
  condition.innerHTML = weatherCode[result2.current.weather_code];
  currentWeatherCode = result2.current.weather_code;

  temptCond.append(temperature);
  temptCond.append(condition);
  currentWeather.append(temptCond);

  // Menambahkan background image berdasarkan kondisi cuaca
  setWeatherBackground(result2.current.weather_code);
}

// Fitur Search

document.querySelector("#searchButton").addEventListener("click", function () {
  const city = document.querySelector("#inputSearch").value;
  if (!city) {
    alert("Please enter a city");
    return;
  } else {
    geoCode(city);
  }

  // Fetch Geo Code Untuk Search City
  async function geoCode(city) {
    const geoCodeApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}`;
    const geoCodeResult = await fetch(geoCodeApiUrl);
    const geoCodeData = await geoCodeResult.json();

    if (!geoCodeData.results || geoCodeData.results.length === 0) {
      alert("City not found, try again"); 
      return;
    }
    latitude = geoCodeData.results[0].latitude;
    longitude = geoCodeData.results[0].longitude;
    cityName = city.charAt(0).toUpperCase() + city.substring(1);

    fetchSearchCurrentForecast();
    fetchSearchDailyForecast();
  }
});

fetchWeatherForecast();
fetchCurrentForecast();

weatherCodes.forEach((el, i) => {
  let dayCardComponent = component.querySelector(`#daycard${i}`);
  dayCardComponent.addEventListener("mouseover", function () {
    dayCardComponent.style.transform = "translateY(-10px)";
    setWeatherBackground(weatherCodes[el]);
  });

  dayCardComponent.addEventListener("mouseout", function () {
    dayCardComponent.style.transform = "translateY(0)";
    setWeatherBackground(currentWeatherCode);
  });
});

//fetch data daily dari hasil search 
async function fetchSearchDailyForecast() {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Asia%2FBangkok`
  );

  const result = await response.json();
  weatherCodes = [];
  // Set value tiap dayCard berdasarkan index dengan mengambil ID dari masing-masing tag
  result.daily.time.forEach((el, i) => {
    let cardTitle = document.querySelector("#cardTitle" + i);
    let dateTitle = document.querySelector("#dateTitle" + i);
    let temp = document.querySelector("#temp" + i);
    let weather = document.querySelector("#weather" + i);

    cardTitle.innerHTML = new Date(el).toLocaleDateString("en-US", {
      weekday: "long",
    });
    dateTitle.innerHTML = new Date(el).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    temp.innerHTML = result.daily.temperature_2m_max[i] + " °C";
    weather.innerHTML = weatherCode[result.daily.weather_code[i]];
    weatherCodes.push(result.daily.weather_code[i]);
  });
}

//fetch data current dari hasil search 
async function fetchSearchCurrentForecast() {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Asia%2FBangkok`
  );

  const result = await response.json();

  let city = document.querySelector(".city");
  let date = document.querySelector(".date");
  let temperature = document.querySelector(".temperature");
  let condition = document.querySelector(".condition");

  city.innerHTML = cityName;
  date.innerHTML = new Date(result.current.time).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  temperature.innerHTML = result.current.temperature_2m + " °C";
  condition.innerHTML = weatherCode[result.current.weather_code];

  // Background image berdasarkan kondisi cuaca
  setWeatherBackground(result.current.weather_code);
  currentWeatherCode = result.current.weather_code;
}


// setWeatherBackground();
