# 🗺️ Weather Map

> **Weather isn't a number in a list.  
> It's a place you can point at.**

Weather Map is an interactive, map-first weather app.  
Instead of typing a city into a form and reading a wall of text, you **explore the world** and the weather comes to you.

Hover over a city to see its name, click it to fly there, and watch a glass-style dashboard slide in with the current conditions and a 5-day forecast.

## The Concept

Most weather apps start with a search box and end with a table.  
This project flips that idea: **the map is the interface.**

The user doesn't just look up data; they travel to it. Every click on the map becomes a request, every request becomes a card, and the whole experience stays smooth, dark, and atmospheric.

> **The map is not a background — it is the navigation.**

##  What I Practiced

This project was my sandbox for working with real APIs and a real map engine. Key skills implemented:

- **Working with APIs:** Fetching data from two OpenWeather endpoints with `fetch` and `async/await`.
- **Dynamic DOM Building:** Creating the weather card, info boxes, and forecast rows entirely with JavaScript (`createElement`, `append`, `classList`).
- **Map Interaction:** Reading map features with `queryRenderedFeatures` to detect cities, towns, and villages under the cursor.
- **Debounced Search:** Live city suggestions that wait for the user to stop typing before calling the API.
- **Async Safety:** Protecting the UI from outdated responses (race conditions) when the user clicks quickly.
- **Time Zones:** Grouping forecast data by the *local* day of each city instead of the browser's time.
- **Glassmorphism UI:** Blur, gradients, and soft borders with pure CSS.

##  Ready to check the sky?

**Live Demo** → **[Click here to view the project online](https://weather-map-lovat-seven.vercel.app/)**

**Preview**
<br>

<img width="1536" height="1024" alt="Image" src="https://github.com/user-attachments/assets/6490d523-6a23-4948-8d22-3278df7669cf" />




##  Features

- **Click-to-Forecast:** Click any city, town, or village on the map to load its weather.
- **Hover Tooltip:** City names appear next to your cursor as you move over the map.
- **Smart Search:** Type a city name and get instant suggestions with state and country.
- **Current Conditions:** Temperature, feels-like, humidity, wind, visibility, and pressure.
- **5-Day Forecast:** Daily high/low temperatures with icons and descriptions.
- **Fly-To Animation:** The map smoothly travels to the selected location with a marker.
- **Auto Location:** Starts with your current position (with a fallback if you decline).
- **Responsive Design:** Cards rearrange into a bottom panel on mobile screens.

## Built With

This project uses **Vanilla JavaScript** with no framework and no build step. Just open it and it runs.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MapLibre](https://img.shields.io/badge/MapLibre_GL-396CB2?style=for-the-badge&logo=maplibre&logoColor=white)
![OpenWeather](https://img.shields.io/badge/OpenWeather_API-EB6E4B?style=for-the-badge&logo=openweathermap&logoColor=white)

**Data & tiles:** [OpenWeather API](https://openweathermap.org/api) for weather, [OpenFreeMap](https://openfreemap.org/) for map tiles.

##  Getting Started

No build tools or dependencies required.

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Get an API key:** Create a free account on [OpenWeather](https://openweathermap.org/api) and copy your key.

3. **Add your key:** Open the JavaScript file and set your key here:
```js
const API_KEY = 'YOUR_API_KEY'
```
> ⚠️ Never commit your real key to a public repository.

4. **Run:** Open `index.html` in your browser.  
   For the location feature to work reliably, use a local server (for example the **Live Server** extension in VS Code) or open the deployed HTTPS version.

## 🗂️ How It Works

| Step | What happens |
| --- | --- |
| **1. Locate** | The browser asks for your position; if declined, the app falls back to a default city. |
| **2. Point** | Hovering or clicking the map detects the nearest city, town, or village. |
| **3. Fetch** | `/weather` and `/forecast` are requested in parallel. |
| **4. Render** | The dashboard and the 5-day forecast are built dynamically from the response. |

##  Future Ideas

- [ ] °C / °F unit toggle
- [ ] Hourly forecast chart
- [ ] Weather layers on the map (rain, clouds, wind)
- [ ] Save favorite cities
- [ ] Move the API key behind a small server-side proxy

## Developer

This project was designed and built by:

### **[Fatemeh Dehghani]**
*Front-End Developer in the making*

Hi! I built this project to practice working with APIs and interactive maps. If you have feedback or want to build something together, feel free to reach out!

[![GitHub](https://img.shields.io/badge/GitHub-FtmDhn-181717?style=for-the-badge&logo=github)](https://github.com/FtmDhn)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Fatemeh%20Dehghani-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/FatemehDehghani)
[![Instagram](https://img.shields.io/badge/Instagram-@ftm.dehgni-E4405F?style=for-the-badge&logo=instagram)](https://instagram.com/ftm.dehgni)

---

<div align="center">
  <b>Pick a city. Watch the sky. 🌤️</b>
  <br>
  <sub>Click anywhere on the map to begin.</sub>
</div>
