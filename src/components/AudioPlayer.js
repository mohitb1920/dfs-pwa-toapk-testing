import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { fileUrl } from "./Utils";

function formatDurationDisplay(duration) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);
  const formatted = [min, sec].map((n) => (n < 10 ? "0" + n : n)).join(":");
  return formatted;
}

function AudioPlayer(props) {
  const {source} = props;
  const audioRef = useRef(null);
  const [isReady, setIsReady] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currrentProgress, setCurrrentProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const durationDisplay = formatDurationDisplay(duration);
  const elapsedDisplay = formatDurationDisplay(currrentProgress);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleMuteUnmute = () => {
    if (!audioRef.current) return;

    if (audioRef.current.volume !== 0) {
      audioRef.current.volume = 0;
    } else {
      audioRef.current.volume = 1;
    }
  };

  useEffect(() => {
    audioRef.current?.pause();
  }, []);

  const value = currrentProgress/duration * 100;

  return (
    <Box className="audio-details">
      <audio
        ref={audioRef}
        preload="metadata"
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onCanPlay={(e) => {
          e.currentTarget.volume = volume;
          setIsReady(true);
        }}
        onTimeUpdate={(e) => {
          setCurrrentProgress(e.currentTarget.currentTime);
        }}
        onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
      >
        <source
          type="audio/mpeg"
          src={fileUrl(source?.fileStoreId)}
        />
      </audio>
      <Avatar
        alt="attachment"
        src={`${window.contextPath}/assets/audiowaves${
          isPlaying ? "play.gif" : ".png"
        }`}
        className="audio-wave"
      />
      <Box className="audio-player">
        <Box className="flex items-center gap-4 justify-self-center">
          <IconButton
            disabled={!isReady}
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            size="lg"
          >
            {!isReady ? (
              <CircularProgress color="success" />
            ) : isPlaying ? (
              <PauseIcon />
            ) : (
              <PlayArrowIcon size={30} />
            )}
          </IconButton>
        </Box>
        <Box className="text-xs mr-5">
          {elapsedDisplay} / {durationDisplay}
        </Box>
        <Box className="w-4/5 mr-3">
          <LinearProgress variant="determinate" value={value} />
        </Box>
        <Box className="flex gap-3 items-center justify-self-end">
          <IconButton
            intent="secondary"
            size="sm"
            onClick={handleMuteUnmute}
            aria-label={volume === 0 ? "unmute" : "mute"}
          >
            {volume === 0 ? (
              <VolumeOffIcon size={20} />
            ) : (
              <VolumeUpIcon size={20} />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default AudioPlayer;
