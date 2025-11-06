import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import { CssTextField } from "./Form/CustomWidget";

const SearchBar = ({
  setSearchQuery,
  placeholder = "schemes.searchSchemes",
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="search-bar"
        className="text"
        onInput={handleInputChange}
        variant="outlined"
        placeholder={t(placeholder)}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};
export default SearchBar;
