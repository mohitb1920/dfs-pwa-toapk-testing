import { IconButton, Box } from "@mui/material";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

function CustomTablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    if (page === 0) {
      // Go to the last page if on the first page
      const lastPageIndex = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
      onPageChange(event, lastPageIndex);
    } else {
      onPageChange(event, page - 1);
    }
  };

  const handleNextButtonClick = (event) => {
    const lastPageIndex = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
    if (page === lastPageIndex) onPageChange(event, 0);
    else onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      ></IconButton>
      <IconButton onClick={handleBackButtonClick} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} aria-label="next page">
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

export default CustomTablePaginationActions;
