import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useUrlDialog = () => {
  const [open, setOpen] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const navigate = useNavigate();

  const handleLinkClick = (url) => {
    setExternalUrl(url);
    setOpen(true);
  };

  const handleClose = ({ proceed = false, internal = false }) => {
    if (proceed) {
      window.open(externalUrl, "_blank");
    } else if (internal) {
      navigate(`${window.contextPath}/${externalUrl}`);
    }
    setOpen(false);
  };

  return {
    open,
    externalUrl,
    handleLinkClick,
    handleClose,
  };
};

export default useUrlDialog;
