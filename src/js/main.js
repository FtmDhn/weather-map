const myApi = '247eb6ca6ab2f20863e0b276209bce95'
const main = document.querySelector('main')
const cityHover = document.getElementById('cityHover')
const forcastSec = document.getElementById('forcast-sec')

////////////search
const searchInput = document.getElementById('searchInput')
const suggestions = document.getElementById('suggestions')
let timer = null

async function getSuggestions(query) {
        const url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + encodeURIComponent(query) + '&limit=5&appid='+myApi
        try {
            const response = await fetch(url)
            const results = await response.json()

            if (searchInput.value.trim() !== query) {
                return
            }
            showSuggestions(results)

        } catch (error) {console.log('Error:', error)}
    }

    function showSuggestions(results) {
        suggestions.innerHTML = ''
        if (!results.length) {
            suggestions.style.display = 'none'
            return
        }
        for (let i = 0; i < results.length; i++) {
            const city = results[i]
            const item = document.createElement('li')
            const name = document.createElement('strong')
            name.innerText = city.name
            const place = document.createElement('span')

            if (city.state) {
                place.innerText = city.state + ', ' + city.country
            } else {
                place.innerText = city.country
            }

            item.append(name, place)

            item.addEventListener('click', function () {
                searchInput.value = city.name
                suggestions.style.display = 'none'
                userFly(city.lat, city.lon)
                showWeather(city.lat, city.lon, city.name)
            })

            suggestions.append(item)
        }

        suggestions.style.display = 'block'
    }


    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim()
        clearTimeout(timer)

        if (query.length < 2) {
            suggestions.style.display = 'none'
            return
        }

        timer = setTimeout(function () {
            getSuggestions(query)
        }, 300)
    })


    document.addEventListener('click', function (e) {
        if (e.target !== searchInput && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none'
        }
    })


    ///only enlish words
    searchInput.addEventListener('input', function () {
        searchInput.value = searchInput.value.replace(/[^a-zA-Z\s,.'-]/g, '')
    })

 
    async function searchCity(query) {
        const url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + encodeURIComponent(query) + '&limit=1&appid='+myApi
        try {
            const response = await fetch(url)
            const results = await response.json()

            if (!results.length) {
                console.log('City not found')
                alert('City not found ! please enter the city name correctly')
                return
            }

            const city = results[0]
            userFly(city.lat, city.lon)
            showWeather(city.lat, city.lon, city.name)

        } catch (error) { console.log('Error:', error)}
    }

    searchInput.addEventListener('keydown', function (e) {
        if (e.key == 'Enter' && searchInput.value.trim() !== '') {
            suggestions.style.display = 'none'
            searchCity(searchInput.value.trim())
        }
    })

    const map = new maplibregl.Map({
        container: 'map',
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [51.3890, 35.6892],
        zoom: 5
    });


    function getPlace(point) {
        if (!map.isStyleLoaded()) {
            return null
        }
        const places = map.queryRenderedFeatures(point);
        for (let i = 0; i < places.length; i++) {
            if (
                places[i].sourceLayer === 'place' &&
                (
                    places[i].properties.class === 'city' ||
                    places[i].properties.class === 'town' ||
                    places[i].properties.class === 'village'
                )
            ) {
                return places[i]
            }
        }

        return null
    }



    function getCityName(place) {
        if (place.properties['name:en']) {
            return place.properties['name:en']
        }
        return place.properties.name
    }


    function getWeatherIcon(icon) {
        return 'https://openweathermap.org/img/wn/' + icon + '@2x.png'
    }


    map.on('mousemove', function (e) {
        const place = getPlace(e.point)
        if (place) {
            const cityName = getCityName(place)
            cityHover.innerText = cityName
            cityHover.style.display = 'block'
            cityHover.style.left = e.point.x + 12 + 'px'
            cityHover.style.top = e.point.y + 12 + 'px'
            map.getCanvas().style.cursor = 'pointer'

        } else {
            cityHover.style.display = 'none'
            map.getCanvas().style.cursor = ''
        }
    });

    let flag = null
    map.on('click', function (e) {
        const place = getPlace(e.point)
        if (!place) {
            return
        }

        const lon = place.geometry.coordinates[0]
        const lat = place.geometry.coordinates[1]

        const cityName = getCityName(place)
        userFly(lat, lon)
        showWeather(lat, lon, cityName)
    });


    navigator.geolocation.getCurrentPosition(
        function (pos) {
            const lat = pos.coords.latitude
            const lon = pos.coords.longitude
            userFly(lat, lon)
            showWeather(lat, lon)
        },

        //////default
        function () {
            showWeather(35.6892, 51.3890)
        }
    )
    //////////user loc
    function userFly(lat, lon) {
        map.flyTo({
            center: [lon, lat],
            zoom: 12
        })
        if (flag == null) {
            flag = new maplibregl.Marker()
            flag.setLngLat([lon, lat]).addTo(map)

        } else {
            flag.setLngLat([lon, lat])
        }
    }


    function createInfoBox(icon, title, value) {
        const infoBox = document.createElement('div')
        infoBox.classList.add('info-box')

        const iconElement = document.createElement('span')
        iconElement.innerText = icon

        const content = document.createElement('div')

        const small = document.createElement('small')
        small.innerText = title

        const strong = document.createElement('strong')
        strong.innerText = value

        content.append(small, strong)
        infoBox.append(iconElement, content)

        return infoBox
    }


    function buildInfoBoxes(current) {
        let visibility = '-'
        if (current.visibility) {
            visibility = (current.visibility / 1000).toFixed(1)
        }

        const weatherInfo = document.createElement('div')
        weatherInfo.className = 'weather-info'
        const humidityBox = createInfoBox('💧', 'Humidity', current.main.humidity + '%')
        const windBox = createInfoBox('💨', 'Wind', current.wind.speed + ' m/s')
        const visibilityBox = createInfoBox('👓', 'Visibility', visibility + ' km')
        const pressureBox = createInfoBox('🌡️', 'Pressure', current.main.pressure + ' hPa')
        weatherInfo.append(humidityBox, windBox, visibilityBox, pressureBox)
        return weatherInfo
    }


    function groupByDay(list) {
        const days = {}
        for (let i = 0; i < list.length; i++) {
            const date = list[i].dt_txt.split(' ')[0]
            if (!days[date]) {
                days[date] = []
            }
            days[date].push(list[i])
        }
        return Object.values(days).slice(0, 5)
    }


    ////////// generate forcast 
    function createForecastDay(day, index) {
        let minTemp = day[0].main.temp
        let maxTemp = day[0].main.temp
        let midday = day[0]

        for (let j = 0; j < day.length; j++) {
            const temp = day[j].main.temp

            if (temp < minTemp) {
                minTemp = temp
            }
            if (temp > maxTemp) {
                maxTemp = temp
            }
            const hour = Number(day[j].dt_txt.split(' ')[1].slice(0, 2))
            if (hour >= 11 && hour <= 14) {
                midday = day[j]
            }
        }

        const date = new Date(midday.dt * 1000)
        let dayName
        if (index === 0) {
            dayName = 'Today'
        } else {
            dayName = date.toLocaleDateString('en-US', {weekday: 'short'})
        }
        const dateText = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        const description = midday.weather[0].description
        const icon = midday.weather[0].icon

        //////forcast day
        const forecastDay = document.createElement('div')
        forecastDay.classList.add('forecast-day')

        const dateContainer = document.createElement('div')
        const forecastDate = document.createElement('div')
        forecastDate.classList.add('forecast-date')
        forecastDate.innerText = dayName

        const forecastDescription = document.createElement('div')
        forecastDescription.classList.add('forecast-description')
        forecastDescription.innerText = dateText
        dateContainer.append(forecastDate, forecastDescription)

        const weatherImage = document.createElement('img')
        weatherImage.classList.add('forecast-icon')
        weatherImage.src = getWeatherIcon(icon)
        weatherImage.alt = description

        const descriptionElement = document.createElement('div')
        descriptionElement.classList.add('forecast-description')
        descriptionElement.innerText = description

        const temperature = document.createElement('div')
        temperature.classList.add('forecast-temp')

        const maxTemperature = document.createElement('strong')
        maxTemperature.innerText = Math.round(maxTemp) + '°'

        const minTemperature = document.createElement('span')
        minTemperature.innerText = Math.round(minTemp) + '°'
        temperature.append(maxTemperature, minTemperature)

        forecastDay.append(dateContainer, weatherImage, descriptionElement, temperature)
        return forecastDay;
    }


    function buildForecast(days) {
        const forecastList = document.createElement('div')
        forecastList.classList.add('forecast-list')

        for (let i = 0; i < days.length; i++) {
            const forecastDay = createForecastDay(days[i], i)
            forecastList.append(forecastDay)
        }
        return forecastList
    }


    async function showWeather(lat, lon, cityName) {
        const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=metric&appid='+myApi
        try {
            const response = await fetch(url)
            const data = await response.json()
            if (data.cod !== 200 &&data.cod !== '200') {
                console.log(data.message)
                return
            }

            const current = data.list[0]
            const weatherIcon = current.weather[0].icon

            if (!cityName) {
                cityName = data.city.name
            }

            const weatherCard = document.createElement('div')
            weatherCard.classList.add('weather-card')

            const weatherHeader = document.createElement('div')
            weatherHeader.classList.add('weather-header')

            const headerText = document.createElement('div')

            const location = document.createElement('p')
            location.classList.add('location')
            location.innerText = '📍 ' + cityName + ', ' + data.city.country

            const description = document.createElement('p')
            description.classList.add('description')
            description.innerText = current.weather[0].description
            headerText.append(location, description)

            const weatherImage = document.createElement('img')
            weatherImage.classList.add('weather-icon')
            weatherImage.src = getWeatherIcon(weatherIcon)
            weatherImage.alt = current.weather[0].description
            weatherHeader.append(headerText, weatherImage)

            const temperature = document.createElement('div')
            temperature.classList.add('temperature')
            temperature.innerText = Math.round(current.main.temp) + '°'

            const temperatureUnit = document.createElement('span')
            temperatureUnit.innerText = 'C'
            temperature.append(temperatureUnit)

            const feels = document.createElement('div')
            feels.classList.add('feels')
            feels.innerText = 'Feels like ' + Math.round(current.main.feels_like) + '°C'

            const weatherInfo = buildInfoBoxes(current)
            const forecastTitle = document.createElement('p')
            forecastTitle.classList.add('forecast-title')
            forecastTitle.innerText = '5 Day Forecast'

            const days = groupByDay(data.list)
            const forecast = buildForecast(days)
            weatherCard.append(weatherHeader, temperature, feels, weatherInfo)
            forcastSec.innerHTML = ''
            forcastSec.style.display = 'block'
            forcastSec.append(forecastTitle, forecast)

            main.innerHTML = ''
            main.append(weatherCard)

        } catch (error) {console.log('Error:', error)}
    }