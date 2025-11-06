import {
  Box,
  Card,
  Grid,
  List,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { formatDateWeather } from "../../../components/Utils";
import "../styles/WeatherStyles.css";
import SearchBar from "../../../components/SearchBar";
import SuggestionSearchBox from "../../../components/SuggestionSearchBox";
import EditIcon from "@mui/icons-material/Edit";
function WeatherBox({ src, name, value, t, md }) {
  return (
    <Grid item sx={{ width: { xs: "50%", md: md } }}>
      <Box className="weather-direction">
        <img src={src} style={{ marginRight: "10px" }} />
        <Box>
          <Typography variant="body2" color="text.primary">
            {t(name)}
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            className="!font-semibold"
          >
            {t(value)}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
}

function WeatherCard({
  data,
  t,
  setSearchQuery,
  searchQuery,
  selectedLocation,
  setSelectedLocation,
  suggestions,
  isSearchDataLoading,
  showSearchBar,
  handleSearchBar,
  isWeatherLoading,
  isMobile,
}) {
  const theme = useTheme();
  return (
    <Card className="card-weather-style">
      {isMobile && (
        <Typography
          variant={isMobile ? "subtitle2" : "h5"}
          sx={{ fontWeight: "600" }}
          mb={2}
        >
          {t("sourceWeather")}
        </Typography>
      )}
      {showSearchBar && isMobile && (
        <Box className="mb-3">
          <SuggestionSearchBox
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            placeholder="searchLocation"
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            suggestions={suggestions}
            isSearchDataLoading={isSearchDataLoading}
            handleSearchBar={handleSearchBar}
          />
        </Box>
      )}
      <Box className="weather-style">
        <Box>
          <Box>
            {isWeatherLoading && (
              <Box className="w-56">
                <Skeleton className="date-time"></Skeleton>
                <Skeleton className="!h-14"></Skeleton>
                <Skeleton className="date-time"></Skeleton>
              </Box>
            )}
            {!isWeatherLoading && (
              <Box className="flex flex-col gap-2 sm:block">
                {data?.date != null && (
                  <Typography variant="body2" className="date-time">
                    {formatDateWeather(data?.date, false, t)}
                  </Typography>
                )}
                <Box className="temp-styles">
                  <Typography
                    variant={isMobile ? "h5" : "h1"}
                    className="tempe-style !font-semibold"
                  >
                    {data?.tempMaxCenti}°C
                  </Typography>

                  {/* <ArrowUpwardIcon sx={{ color: "rgba(92, 100, 96, 1)" }} /> */}
                  <Typography
                    variant={isMobile ? "h6" : "h3"}
                    className="tempe-style !font-semibold"
                  >
                    / {data?.tempMinCenti}°C
                  </Typography>
                  {/* <ArrowDownwardIcon sx={{ color: "rgba(92, 100, 96, 1)" }} /> */}
                </Box>
                <Typography variant="body2" color="text.textGrey">
                  {t("Max_MinTemp")}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        {isWeatherLoading && (
          <Box className="w-28">
            <Skeleton className="!h-14"></Skeleton>
            <Skeleton className="date-time"></Skeleton>
          </Box>
        )}
        {!isWeatherLoading && (
          <Box className="w-fit ">
            {showSearchBar && !isMobile && (
              <Box
                className="search-bar-container self-start flex justify-center ml-[10px]"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <SuggestionSearchBox
                  setSearchQuery={setSearchQuery}
                  searchQuery={searchQuery}
                  placeholder="searchLocation"
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  suggestions={suggestions}
                  isSearchDataLoading={isSearchDataLoading}
                  handleSearchBar={handleSearchBar}
                />
              </Box>
            )}
            {!showSearchBar && (
              <Box className="flex items-baseline gap-2" fontSize={"24px"}>
                <Box
                  className="location-text-box cursor-pointer"
                  onClick={() => handleSearchBar()}
                >
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    className="!font-semibold"
                  >
                    {data?.block}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color={theme.palette.text.darkGreyGreen}
                    className="location-weather-style"
                  >
                    {data?.district}, {t("Bihar")}
                  </Typography>
                </Box>
                {!isMobile && (
                  <EditIcon
                    onClick={() => handleSearchBar()}
                    className="cursor-pointer"
                  />
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Box className="weather-style !mb-0">
        {isWeatherLoading && (
          <Grid container rowSpacing={{ sm: 2, md: 1 }} justifyContent="start">
            {[1, 2, 3, 4].map((val) => (
              <Grid item key={val} sx={{ width: { xs: "50%", md: "25%" } }}>
                <Box className="flex justify-start items-center">
                  <Skeleton className="!w-14 !h-14 !rounded-full mb-3"></Skeleton>
                  <Box className="">
                    <Skeleton className="!w-14 !h-5 "></Skeleton>
                    <Skeleton></Skeleton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
        {!isWeatherLoading && (
          <Grid container rowSpacing={{ xs: 2, md: 1 }} justifyContent="start">
            {data?.rainmm != null && (
              <WeatherBox
                md={"25%"}
                name={"Rain"}
                src={`${window.contextPath}/assets/rain.svg`}
                t={t}
                value={`${data?.rainmm} mm`}
              />
            )}
            {data?.humidityAverage != null && (
              <WeatherBox
                md={"25%"}
                name={"Humidity"}
                src={`${window.contextPath}/assets/HumidityIcon.svg`}
                t={t}
                value={`${data.humidityAverage}%`}
              />
            )}
            {data?.windSpeedMaxms != null && (
              <WeatherBox
                md={"25%"}
                name={"WindSpeed"}
                src={`${window.contextPath}/assets/windspeed.svg`}
                t={t}
                value={`${data.windSpeedMaxms} m/s`}
              />
            )}
            {data?.windDirectionInCardinal != null && (
              <WeatherBox
                md={"25%"}
                name={"WindDirection"}
                src={`${window.contextPath}/assets/direction.svg`}
                t={t}
                value={`${data.windDirectionInCardinal}`}
              />
            )}
          </Grid>
        )}
      </Box>
    </Card>
  );
}

export default WeatherCard;
