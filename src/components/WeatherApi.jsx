import { useEffect, useRef, useState } from "react";
import { Tilt } from "react-tilt";
import { Tooltip } from "@heroui/tooltip";

export default function WeatherApp() {
  const [location, setLocation] = useState("arani");
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);
  const [prevLocation, setPrevLocation] = useState("");
  const [loc, setLoc] = useState("");
  const inputRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = "https://api.weatherapi.com/v1/current.json";
  useEffect(() => {
    inputRef.current.focus();

    fetchWeather();
  }, []);
  useEffect(() => {
    if (error) {
      setIsOpen(true);
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);
  const fetchWeather = async () => {
    inputRef.current.focus();

    if (!location) {
      setError("Please enter a location");
      return;
    }
    setError(null);
    try {
      const response = await fetch(`${url}?key=${apiKey}&q=${location}`);
      if (!response.ok) throw new Error("Location not found");
      const data = await response.json();
      setWeather({
        temp: data.current.temp_c,
        humidity: data.current.humidity,
        wind: data.current.wind_kph,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
      });

      setLoc(
        `${data.location.name}, ${data.location.region}, ${data.location.country}`
      );
      setPrevLocation(location);
    } catch (err) {
      setError(err.message);
      setLocation(prevLocation);
    }
    setLocation("");
  };

  const defaultOptions = {
    reverse: true,
    max: 35,
    perspective: 1000,
    scale: 1.1,
    speed: 1000,
    transition: true,
    axis: null,
    reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  };

  function getWeatherCondition(temp, windSpeed, humidity) {
    let img;
    let bgggg;
    switch (true) {
      case temp > 20:
        img = "/weatherapp/sunny1.svg";
        bgggg = `/weatherapp/sunnygif.gif`;
        break;
      case temp > 25 && windSpeed < 10:
        img = "/weatherapp/sunny1.svg";
        bgggg = ` /weatherapp/sunnygif.gif`;
        break;
      case temp >= 15 && temp <= 25 && windSpeed >= 10 && windSpeed <= 20:
        img = "/weatherapp/cloudy1.svg";
        bgggg = `/weatherapp/cloudygif.gif`;
        break;
      case windSpeed > 25:
        img = "/weatherapp/wind.svg";
        bgggg = "/weatherapp/stormgif.gif";
        break;
      case windSpeed > 40:
        img = "/weatherapp/storm.svg";
        bgggg = "/weatherapp/stormgif.gif";
        break;

      case humidity > 75 && temp >= 17 && temp <= 30:
        img = "/weatherapp/rainy.svg";
        bgggg = `/weatherapp/rainygif.gif`;
        break;
      case temp > 10:
        img = "/weatherapp/snowy1.svg";
        bgggg = `/weatherapp/coldgif.gif`;
        break;

      default:
        img = "/weatherapp/snowy1.svg";
        bgggg = `/weatherapp/coldgif.gif`;
    }

    return { img, bgggg };
  }

  const { img, bgggg } = getWeatherCondition(
    weather.temp,
    weather.wind,
    weather.humidity
  );

  document.getElementById("enter");

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${bgggg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
        }}
        className='flex justify-center items-center'
      >
        <div className='flex flex-col md:flex-row justify-between items-center md:px-[250px] py-5  fixed top-0 left-0  w-full'>
          <h1 className='text-md md:text-2xl font-bold mb-4'>
            <span className='text-blue-600 font-[600]'>Ur</span> Weather
          </h1>
          <div className='flex gap-2  items-center flex-col md:flex-row'>
            <div className='w-10rem h-5rem'>
              <Tooltip
                showArrow
                classNames={{
                  base: [
                    // arrow color
                    "before:bg-red-600 dark:before:bg-red-600 rounded",
                  ],
                  content: [
                    "py-2 px-4 shadow-xl",
                    "text-white bg-gradient-to-br from-red-600 to-red-600",
                  ],
                }}
                closeDelay={1000}
                content={error}
                isOpen={isOpen}
                placement='bottom'
              >
                <form
                  action=''
                  onSubmit={(e) => {
                    e.preventDefault(), fetchWeather();
                  }}
                  className='w-full'
                >
                  <input
                    type='text'
                    placeholder='Enter location'
                    value={location}
                    ref={inputRef}
                    onChange={(e) => setLocation(e.target.value)}
                    className='p-2 focus:outline-0 rounded text-white text-sm h-5rem border-1 border-color-white bg-gray-600'
                  />
                </form>
              </Tooltip>
            </div>
            <button
              onClick={fetchWeather}
              className='bg-blue-500 px-4 py-2 focus:bg-green-600 hover:bg-green-500 text-sm h-5rem text-white  rounded w-full '
            >
              Get Weather
            </button>
          </div>
        </div>

        {weather && (
          <Tilt
            options={defaultOptions}
            className='text-center md:w-[20rem] md:h-[32rem] w-[18rem] h-[27rem]  borderr text-white relative md:mt-10 mt-35 '
          >
            <div className='p-4 bg-gray-900  flex flex-col items-center w-full h-full rounded-xl  overflow-visible'>
              <div className='w-80 h-20  overflow-visible'></div>

              <img
                src={img}
                alt={weather.condition}
                className='w-70 md:w-180 h-auto absolute z-1 top-[-60px] left-[40px]'
              />

              <p className='text-8xl  text-white  mt-auto'>{weather.temp}°C</p>

              <p className='text-xl  text-gray-400 mt-2'>{loc}</p>

              <div className='flex justify-around mx-auto mb-5 w-full mt-auto'>
                <div className='flex flex-col'>
                  <p className='text-xl md:2xl text-gray-400 mt-2'>Humidity</p>
                  <div className='flex gap-5 mt-auto'>
                    <img src='/humid1.svg' alt='' className='w-[30px]' />
                    <p className='md:text-[18px] text-[20px]'>
                      {" "}
                      {weather.humidity}%
                    </p>
                  </div>
                </div>
                <div className='inline-flex flex-col '>
                  <p className='md:text-2xl  text-xl text-gray-400 mt-2 '>
                    Wind Speed
                  </p>
                  <div className='flex justify-between gap-1 mt-auto'>
                    <img src='/humidity.svg' alt='' className='w-[32px]' />
                    <p className='md:text-[18px] text-[20px]'>
                      {" "}
                      {weather.wind} km/h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Tilt>
        )}
      </div>
    </>
  );
}
