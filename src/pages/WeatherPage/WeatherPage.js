import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import {
  Box,
  Container,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useSearchLocationData,
  useWeatherHomeData,
} from "../../Hooks/useAssets";
import WeatherCard from "./components/WeatherCard";
import { formatDateWeather } from "../../components/Utils";
import { isToday, parse } from "date-fns";
import { useDispatch } from "react-redux";
import { weatherLocationData } from "../../Modules/Actions/weatherActions";

function WeatherPage({ isMobile }) {
  const dispatch = useDispatch();
  //   const l = useLocation();
  const location = JSON.parse(localStorage.getItem("DfsWeb.locationData"));
  //   const { data, name } = l.state || {};
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language == "en_IN" ? "en" : "hi"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    setLanguage(i18n.language == "en_IN" ? "en" : "hi");
  }, [i18n.language]);
  let { data: weatherData, isLoading: isWeatherLoading } = useWeatherHomeData({
    blockLG: selectedLocation?.blockLG,
    districtLg: selectedLocation?.districtLg,
  });
  const [todayWeatherData, setTodayWeatherData] = useState();
  const [weatherForecastData, setWeatherForecastData] = useState();

  useEffect(() => {
    setWeatherForecastData(weatherData?.weatherForecast);

    weatherData?.weatherForecast?.forEach((e) => {
      const dateCheck = isToday(
        parse(e.date || "", "yyyy-MM-dd HH:mm:ss", new Date())
      );

      if (dateCheck) {
        const weatherToday = {
          block: e.block,
          district: e.district,
          cloudiness: e.cloudiness,
          date: e.date,
          humidityAverage: e.humidity,
          rainmm: e.rainmm,
          tempMaxCenti: e.tempMaxCenti,
          tempMinCenti: e.tempMinCenti,
          windDirectionInCardinal: e.windDirectionInCardinal,
          windDirection: e.windDirection,
          windSpeedMaxms: e.windSpeedms,
        };

        setTodayWeatherData(weatherToday);
      }
    });
  }, [weatherData]);

  let {
    data: searchData,
    isLoading: isSearchDataLoading,
    refetch,
  } = useSearchLocationData({ searchQuery: searchQuery });
  useEffect(() => {
    refetch();
  }, [searchQuery]);
  useEffect(() => {
    if (!showSearchBar) {
      setSearchQuery("");
      setSelectedLocation();
      setSuggestions([]);
    }
  }, [showSearchBar]);
  useEffect(() => {
    setSuggestions(searchData);
  }, [searchData]);
  useEffect(() => {
    if (selectedLocation) {
      dispatch(weatherLocationData(selectedLocation));
      localStorage.setItem(
        "DfsWeb.selectedWeatherLocation",
        JSON.stringify(selectedLocation)
      );
    }
    // refetchWeather();
  }, [selectedLocation]);
  useEffect(() => {
    setShowSearchBar(false);
  }, [isWeatherLoading, todayWeatherData]);

  const handleSearchBar = () => {
    setShowSearchBar((value) => !value);
  };
  return (
    <Container variant="primary" sx={{ mb: "4rem" }}>
      <Box>
        <Box className="inner-box-screen m-auto">
          <Box className="breadcrumbs-container" sx={{ pb: "40px" }}>
            <BasicBreadcrumbs />
          </Box>
          {/* {isWeatherLoading && (
            <Box className="loader-style">
              <CircularProgress />{" "}
            </Box>
          )} */}
          {/* {!isWeatherLoading && ( */}
          <Box>
            <Box className="header-display">
              <Typography variant={isMobile ? "h5" : "h1"} fontWeight={700}>
                {t("TodayWeather")}
              </Typography>
              {!isMobile && (
                <Typography variant="h5" sx={{ fontWeight: "600" }}>
                  <span className="text-[1.25rem] !font-normal">
                    {t("sourceText")}
                  </span>
                  {t("sourceWeather")}
                </Typography>
              )}
            </Box>
            {/* {todayWeatherData != null && ( */}
            <WeatherCard
              data={todayWeatherData}
              t={t}
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              suggestions={suggestions}
              isSearchDataLoading={isSearchDataLoading}
              showSearchBar={showSearchBar}
              handleSearchBar={handleSearchBar}
              isWeatherLoading={isWeatherLoading}
              isMobile={isMobile}
            />
            {/* )} */}
            <Typography
              variant={isMobile ? "h6" : "h3"}
              className="forecast-header-styles"
            >
              {t("day_forcast")}
            </Typography>
            <Container
              component={Paper}
              className="card-weather-style overflow-x-auto !p-0"
            >
              <Table
                className="rounded-lg overflow-hidden"
                sx={{
                  border: "1px solid #D7DEDA",
                  borderCollapse: "collapse",
                }}
              >
                <TableHead
                  sx={{
                    backgroundColor: theme.palette.background.primaryGreen,
                    color: theme.palette.text.white,
                  }}
                >
                  <TableRow>
                    <TableCell className="border-cell">
                      <Box className="cell-style">
                        <Typography color="white" fontWeight="700">
                          {t("Date")}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell className="border-cell max-sm:min-w-52">
                      <Box className="cell-style">
                        <Typography color="white" fontWeight="700">
                          {t("Max_MinTemp")}
                        </Typography>
                        <img
                          src={`${window.contextPath}/assets/temp-outline.svg`}
                          style={{ marginLeft: "10px" }}
                          alt="max-min-temperature"
                        />
                      </Box>
                    </TableCell>
                    <TableCell className="border-cell min-w-24">
                      <Box className="cell-style">
                        <Typography color="white" fontWeight="700">
                          {t("Rain")}
                        </Typography>
                        <img
                          src={`${window.contextPath}/assets/rain-outline.svg`}
                          style={{ marginLeft: "10px" }}
                          alt="rain"
                        />
                      </Box>
                    </TableCell>
                    <TableCell className="border-cell min-w-32">
                      <Box className="cell-style">
                        <Typography color="white" fontWeight="700">
                          {t("Humidity")}
                        </Typography>
                        <img
                          src={`${window.contextPath}/assets/humidity-outline.svg`}
                          style={{ marginLeft: "10px" }}
                          alt="humidity"
                        />
                      </Box>
                    </TableCell>
                    <TableCell className="border-cell min-w-28 max-sm:min-w-44">
                      <Box className="cell-style">
                        <Typography color="white" fontWeight="700">
                          {t("WindSpeed")}
                        </Typography>
                        <img
                          src={`${window.contextPath}/assets/wind-outline.svg`}
                          style={{ marginLeft: "10px" }}
                          alt="wind speed"
                        />
                      </Box>
                    </TableCell>
                    <TableCell className="min-w-24 max-sm:min-w-48">
                      <Box className="cell-style">
                        <Typography color="white" fontWeight="700">
                          {t("WindDirection")}
                        </Typography>
                        <img
                          src={`${window.contextPath}/assets/direction-outline.svg`}
                          style={{ marginLeft: "10px" }}
                          alt="wind direction"
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isWeatherLoading &&
                    [1, 2, 3].map(() => (
                      <TableRow key={"loader"}>
                        <TableCell>
                          <Skeleton></Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton></Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton></Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton></Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton></Skeleton>
                        </TableCell>
                        <TableCell>
                          <Skeleton></Skeleton>
                        </TableCell>
                      </TableRow>
                    ))}
                  {weatherForecastData != null &&
                    weatherForecastData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {formatDateWeather(data?.date, true, t)}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: "flex" }}>
                            <Typography fontWeight="700">
                              {data?.tempMaxCenti}°C &nbsp;
                            </Typography>
                            <Typography>
                              /&nbsp;{data?.tempMinCenti}°C
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>{data?.rainmm} mm</TableCell>
                        <TableCell>{data?.humidity} %</TableCell>
                        <TableCell>{data?.windSpeedms} m/s</TableCell>
                        <TableCell>
                          {t(data?.windDirectionInCardinal ?? " ")}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Container>
          </Box>
          {/* )} */}
        </Box>
      </Box>
    </Container>
  );
}

export default WeatherPage;
