import React, { useEffect, useRef, useState } from "react";
import "../../styles/BiharKrishiRadio.css";
import Hls from "hls.js";
import { Box, Tooltip, Typography } from "@mui/material";
import InteractiveElement from "../InteractiveElement/InteractiveElement";

const BiharKrishiRadio = ({ t }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [nowSelected, setNowSelected] = useState(9);
  const totalBars = 10; // Total number of sound bars
  const maxHeight = 35; // Maximum height of the bars
  const audioRef = useRef(null);
  const hslStreamUrl =
    "https://dmr6tx0csl9hs.cloudfront.net/biharkrishiradio.m3u8";

  const aacStreamUrl =
    "https://streamasiacdn.atc-labs.com/biharkrishiradio.aac";

  useEffect(() => {
    if (Hls.isSupported()) {
      const audio = audioRef.current;
      const hls = new Hls();
      hls.loadSource(hslStreamUrl);
      hls.attachMedia(audio);
      audioRef.current.volume = volume;
    } else {
      audioRef.current.src = aacStreamUrl;
      audioRef.current.volume = volume;
    }
  }, []);

  const togglePlayPause = async () => {
    if (isPlaying) {
      await audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (index) => {
    setNowSelected(index);
    setMute(false);

    // Spread index [0…totalBars-1] evenly across [0…1]:
    const volumeLevel = index / (totalBars - 1);

    // Just in case, clamp to [0,1]:
    const clamped = Math.min(Math.max(volumeLevel, 0), 1);

    setVolume(clamped);
    audioRef.current.volume = clamped;
  };

  const stopStream = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const muteUnmute = () => {
    if (mute) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    setMute(!mute);
  };

  return (
    <Box className="radio-scroll-box">
      <Box
        className="radio-container"
        style={{
          backgroundImage: `url(${window.contextPath}/assets/RadioImages/radioBg.png)`,
        }}
      >
        <Box className="logo-container">
          <img
            src={`${window.contextPath}/assets/RadioImages/logo.png`}
            alt="Logo"
            className="radio-logo"
          />
        </Box>
        <Box className="flex justify-between pl-6 pr-5 relative -top-[35px]">
          <Typography className="radio-title">
            {t("Bihar_Krishi_Radio")}
          </Typography>
          <Box className="animation-container">
            <img
              src={`${window.contextPath}/assets/RadioImages/animation.${
                isPlaying ? "gif" : "svg"
              }`}
              alt="animation"
              className={"animation-gif"}
            />
          </Box>
        </Box>
        <audio
          ref={audioRef}
          id="audioPlayer"
          controls
          style={{ display: "none" }}
        />
        <Box className="audio-controls-container">
          <InteractiveElement onClick={togglePlayPause}>
            <Tooltip title={t(isPlaying ? "Pause" : "Play")}>
              <img
                src={`${window.contextPath}/assets/RadioImages/${
                  isPlaying ? "pause" : "play"
                }.svg`}
                alt="Play"
                className={`${isPlaying ? "pause-icon" : ""}`}
                style={{ width: 35 }}
              />
            </Tooltip>
          </InteractiveElement>
          <InteractiveElement onClick={stopStream} sx={{ marginLeft: "15px" }}>
            <Tooltip title={t("Stop")}>
              <img
                src={`${window.contextPath}/assets/RadioImages/stop.svg`}
                alt="Stop"
                style={{ width: 35 }}
              />
            </Tooltip>
          </InteractiveElement>
          <InteractiveElement onClick={muteUnmute} sx={{ marginLeft: "15px" }}>
            <Tooltip title={t(mute ? "Unmute" : "Mute")}>
              <img
                src={`${window.contextPath}/assets/RadioImages/${
                  mute ? "speakerMuteIcon" : "speakerIcon"
                }.svg`}
                alt="Mute"
                style={{ width: 35 }}
              />
            </Tooltip>
          </InteractiveElement>
          <Tooltip title={t("Volume")}>
            <Box
              role="range"
              aria-label={t("Volume Level")}
              aria-valuemin={0}
              aria-valuemax={totalBars - 1}
              aria-valuenow={nowSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" && nowSelected < totalBars - 1)
                  handleVolumeChange(nowSelected + 1);
                if (e.key === "ArrowLeft" && nowSelected > 0)
                  handleVolumeChange(nowSelected - 1);
              }}
              className="volume-controller"
            >
              {Array.from({ length: totalBars }, (_, i) => {
                const barHeight = Math.round((i / (totalBars - 1)) * maxHeight);
                return (
                  <Box
                    key={i}
                    className={`volume-bar ${
                      i <= nowSelected ? "selected" : ""
                    }`}
                    style={{ height: `${barHeight}px` }}
                    onClick={() => handleVolumeChange(i)}
                  />
                );
              })}
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default BiharKrishiRadio;
