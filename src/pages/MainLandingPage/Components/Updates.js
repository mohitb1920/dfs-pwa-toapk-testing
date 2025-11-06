import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Splide from "@splidejs/splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/dist/css/splide.min.css";
import useUrlDialog from "../../../Hooks/useUrlDialog";
import UrlDialog from "../../../components/dialog/UrlDialog";
import "../Styles/Updates.css";
import { useAnnouncementData } from "../../../Hooks/useAnnouncementData";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import "../Styles/InfiniteCarousel.css";

export const Updates = ({ t, language, isMobile }) => {
  const splideRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (splideRef.current) {
      const splide = new Splide(splideRef.current, {
        type: "loop",
        drag: "free",
        focus: "center",
        gap: ".5rem",
        autoScroll: {
          speed: 1.5,
        },
        arrows: false,
        pagination: false,
      });

      splide.mount({ AutoScroll });

      splideRef.current.splide = splide;

      return () => {
        splide.destroy();
      };
    }
  }, []);

  const handlePlayPause = () => {
    const splide = splideRef.current?.splide;

    if (splide) {
      const autoScroll = splide.Components.AutoScroll;

      if (isPaused) {
        autoScroll.play();
      } else {
        autoScroll.pause();
      }

      setIsPaused(!isPaused);
    }
  };

  const handleMouseEnter = () => {
    const splide = splideRef.current?.splide;
    if (splide) {
      splide.Components.AutoScroll.pause();
    }
  };

  const handleMouseLeave = () => {
    const splide = splideRef.current?.splide;
    if (splide && !isPaused) {
      splide.Components.AutoScroll.play();
    }
  };
  const navigate = useNavigate();
  const theme = useTheme();
  const { data } = useAnnouncementData({});
  const [bulletins, setBullatins] = useState([
    {
      name: "krishiAppPlay",
      button: "KnowMore",
      link: "https://play.google.com/store/apps/details?id=com.dfs.biharkrishi&hl=en_IN",
    },
    {
      name: "schemeBanner",
      button: "ViewAllSchemes",
      url: `${window.contextPath}/schemes`,
    },
  ]);
  useEffect(() => {
    if (data && data?.length > 0) {
      setBullatins([
        {
          name: "krishiAppPlay",
          button: "KnowMore",
          link: "https://play.google.com/store/apps/details?id=com.dfs.biharkrishi&hl=en_IN",
        },
        {
          name: "schemeBanner",
          button: "ViewAllSchemes",
          url: `${window.contextPath}/schemes`,
        },
      ]);
      data.map((d) => {
        if (d.state === "ACTIVE") {
          let name = "";
          d?.announcementTexts?.map((t) => {
            if (language === "en" && t.locale === "en_IN") {
              name = t?.announcement;
            } else if (language === "hi" && t.locale === "hi_IN") {
              name = t?.announcement;
            }
          });
          if (name != "") {
            setBullatins((list) => [
              ...list,
              {
                name: name,
                button: "KnowMore",
                link: d.url,
              },
            ]);
          }
        }
      });
    }
  }, [data, language]);

  const handleClick = (e, link, url) => {
    if (url != null) {
      navigate(url);
    } else if (link != null) {
      handleLinkClick(link, e);
    }
  };
  const { open, externalUrl, handleLinkClick, handleClose } = useUrlDialog();

  return (
    <Box id="main-content" className="main-content-updates">
      <Container variant="primaryGreen" className="imp-updates-container">
        <IconButton onClick={handlePlayPause} className="!p-0">
          {isPaused ? (
            <PlayArrowOutlinedIcon
              style={{ color: theme.palette.text.white }}
            />
          ) : (
            <PauseOutlinedIcon style={{ color: theme.palette.text.white }} />
          )}
        </IconButton>
        <Typography
          variant={isMobile ? "subtitle2" : "h5"}
          style={{ color: theme.palette.text.white }}
          fontWeight="600"
        >
          {t("imp_updates")}
        </Typography>
      </Container>
      <div
        ref={splideRef}
        className="splide"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="splide__track">
          <ul className="splide__list">
            {[...bulletins, ...bulletins, ...bulletins].map(
              (bulletin, index) => (
                <li className="splide__slide w-fit" key={index}>
                  <Box
                    key={index}
                    sx={{
                      display: "flex !important",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(208, 241, 158, 1)",
                        mx: 1,
                      }}
                    />

                    <Typography
                      variant="body2"
                      className="!font-semibold text-nowrap overflow-hidden text-ellipsis "
                      sx={{
                        color: "white",
                        // fontSize: "1.25rem !important",
                      }}
                    >
                      {t(bulletin.name)}
                    </Typography>

                    <Button
                      size="small"
                      variant="text"
                      className="!font-medium h-6 !underline underline-offset-2"
                      onClick={(e) =>
                        handleClick(e, bulletin.link, bulletin.url)
                      }
                      sx={{
                        marginInlineStart: "8px !important",
                        color: theme.palette.text.yellow,
                        fontSize: isMobile
                          ? "1rem !important"
                          : "1.25rem !important",
                      }}
                    >
                      {t(bulletin.button)}
                    </Button>
                  </Box>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      {/* open dialog */}
      <UrlDialog
        open={open}
        externalUrl={externalUrl}
        handleClose={handleClose}
        t={t}
      />
    </Box>
  );
};
