import { useEffect, useRef, useState, useTransition } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {
  List,
  ListItem,
  Paper,
  Typography,
  Skeleton,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const SuggestionSearchBox = ({
  setSearchQuery,
  searchQuery,
  suggestions = [],
  placeholder = "schemes.searchSchemes",
  selectedLocation,
  setSelectedLocation,
  isSearchDataLoading,
  handleSearchBar,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // Track active suggestion index
  const containerRef = useRef(null); // Ref to track clicks outside

  const handleInputChange = (event) => {
    const input = event.target.value;
    setSearchQuery(input);
    setActiveIndex(-1); // Reset active index when typing

    // Show suggestions when input has more than 2 characters
    setShowSuggestions(input.length > 2);
  };

  const handleOptionClick = (option) => {
    setSearchQuery(`${option.block}, ${option.district}`); // Update input with selected suggestion
    setSelectedLocation(option);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (searchQuery.length > 2) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (event) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (event.key) {
        case "ArrowDown":
          setActiveIndex((prev) => (prev + 1) % suggestions.length);
          break;
        case "ArrowUp":
          setActiveIndex(
            (prev) => (prev - 1 + suggestions.length) % suggestions.length
          );
          break;
        case "Enter":
          if (activeIndex >= 0) {
            handleOptionClick(suggestions[activeIndex]);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          break;
        default:
          break;
      }
    }
  };
  const handleClear = () => {
    setSearchQuery(""); // Clear the input value
    setShowSuggestions(false); // Close suggestions
  };
  const highlightMatch = (text, query) => {
    if (!query) return text;

    // Function to escape special characters in the query
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    };

    const safeQuery = escapeRegExp(query);
    const regex = new RegExp(`(${safeQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={index}
          style={{ fontWeight: "bold", color: theme.palette.text.textGreen }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      handleSearchBar();
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef} // Attach ref to the container
      style={{ position: "relative", maxWidth: "400px" }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          id="search-bar"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleFocus} // Listen for focus events
          variant="outlined"
          placeholder={t(placeholder)}
          size="small"
          onKeyDown={handleKeyDown}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />
      </form>
      {showSuggestions && (
        <Paper className="!absolute !top-full !left-0 !right-0 !z-10">
          {isSearchDataLoading && (
            <ListItem>
              <Skeleton className="w-20"></Skeleton>
            </ListItem>
          )}
          {!isSearchDataLoading && (
            <List>
              {suggestions.length > 0 ? (
                suggestions.map((option, index) => (
                  <ListItem
                    key={index}
                    button
                    onMouseDown={() => handleOptionClick(option)}
                    style={{
                      backgroundColor:
                        index === activeIndex ? "#f0f0f0" : "transparent",
                    }}
                  >
                    <Typography>
                      {highlightMatch(
                        `${option.block}, ${option.district}`,
                        searchQuery
                      )}
                    </Typography>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <Typography>{t("NoRecordFound")}</Typography>
                </ListItem>
              )}
            </List>
          )}
        </Paper>
      )}
    </div>
  );
};

export default SuggestionSearchBox;
