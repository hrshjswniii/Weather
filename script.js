const apiKey = config.WEATHER_API_KEY;

// ---------------- WEATHER ----------------

function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error.message);
        return;
      }
      updateWeather(data);
    })
    .catch(() => alert("Failed to fetch weather data"));
}

function updateWeather(data) {
  document.getElementById("name").innerText =
    data.location.name + ", " + data.location.country;

  document.getElementById("temp").innerText =
    Math.round(data.current.temp_c) + " °C";

  document.getElementById("condition").innerText =
    data.current.condition.text;

  document.getElementById("icon").src =
    "https:" + data.current.condition.icon;
}

// ENTER KEY SUPPORT
document.getElementById("city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") getWeather();
});

// ---------------- AUTOCOMPLETE ----------------

const cityInput = document.getElementById("city");
const suggestionsList = document.getElementById("suggestions-list");

let debounceTimer;

cityInput.addEventListener("input", function () {
  const query = this.value.trim();

  clearTimeout(debounceTimer);

  if (query.length < 2) {
    suggestionsList.classList.add("hidden");
    return;
  }

  debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
});

document.addEventListener("click", (e) => {
  if (!cityInput.contains(e.target) && !suggestionsList.contains(e.target)) {
    suggestionsList.classList.add("hidden");
  }
});

function fetchSuggestions(query) {
  fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`)
    .then(res => res.json())
    .then(data => {
      suggestionsList.innerHTML = "";

      if (data.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No results found";
        suggestionsList.appendChild(li);
      } else {
        data.forEach(city => {
          const li = document.createElement("li");
          li.textContent = `${city.name}, ${city.country}`;

          li.addEventListener("click", () => {
            cityInput.value = city.name;
            suggestionsList.classList.add("hidden");
            getWeather();
          });

          suggestionsList.appendChild(li);
        });
      }

      suggestionsList.classList.remove("hidden");
    })
    .catch(() => {
      suggestionsList.classList.add("hidden");
    });
}