import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchChristmasSongs,
  fetchAllMembers,
} from "@/services/chillzone/chillzone";
import { NowPlaying } from "@/components/chillzone/nowPlaying";
import { Playlist } from "@/components/chillzone/playList";
import { VolumeControl } from "@/components/chillzone/volumeControl";
import { UnderlineTitle } from "@/components/global/underlineTitle";
import { Wishes } from "@/components/chillzone/wishesZone";
import {
  LoadingScreen,
  ErrorScreen,
} from "@/components/global/santaDataLoader";

export const ChillZone = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(10);
  const audioRef = useRef(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const playPromiseRef = useRef(null);

  const {
    data: christmasSongs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["christmasSongs"],
    queryFn: fetchChristmasSongs,
  });

  const { data: membersData } = useQuery({
    queryKey: ["members"],
    queryFn: fetchAllMembers,
  });

  const stopCurrentPlayback = useCallback(async () => {
    if (playPromiseRef.current) {
      try {
        playPromiseRef.current;
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } catch (error) {
        console.error("Error stopping playback:", error);
      }
      playPromiseRef.current = null;
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const playSong = useCallback(
    async (song) => {
      if (!audioRef.current || !song?.previewUrl) return;

      try {
        await stopCurrentPlayback();
        audioRef.current.src = song.previewUrl;
        audioRef.current.load();
        playPromiseRef.current = audioRef.current.play();
        playPromiseRef.current;
        setIsPlaying(true);
        playPromiseRef.current = null;
      } catch (error) {
        console.error("Playback failed:", error);
        setIsPlaying(false);
        playPromiseRef.current = null;
      }
    },
    [stopCurrentPlayback]
  );

  useEffect(() => {
    if (christmasSongs && christmasSongs.length > 0) {
      const song = christmasSongs[currentSongIndex];
      setCurrentSong(song);
      if (song?.previewUrl) {
        playSong(song);
      }
    }

    return () => {
      stopCurrentPlayback();
    };
  }, [christmasSongs, currentSongIndex, playSong, stopCurrentPlayback]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = useCallback(async () => {
    if (!audioRef.current || !audioRef.current.src) {
      console.error("No audio source available");
      return;
    }

    try {
      if (isPlaying) {
        await stopCurrentPlayback();
        setIsPlaying(false);
      } else {
        playPromiseRef.current = audioRef.current.play();
        playPromiseRef.current;
        setIsPlaying(true);
        playPromiseRef.current = null;
      }
    } catch (error) {
      console.error("PlayPause failed:", error);
      setIsPlaying(false);
      playPromiseRef.current = null;
    }
  }, [isPlaying, stopCurrentPlayback]);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume[0]);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100;
    }
  };

  const handleSongSelect = useCallback(
    async (song, index) => {
      setCurrentSong(song);
      setCurrentSongIndex(index);
      if (song?.previewUrl) {
        await playSong(song);
      }
    },
    [playSong]
  );

  const handleSkipForward = useCallback(async () => {
    if (christmasSongs && christmasSongs.length > 0) {
      const nextIndex = (currentSongIndex + 1) % christmasSongs.length;
      const nextSong = christmasSongs[nextIndex];
      await handleSongSelect(nextSong, nextIndex);
    }
  }, [christmasSongs, currentSongIndex, handleSongSelect]);

  const handleSkipBack = useCallback(async () => {
    if (christmasSongs && christmasSongs.length > 0) {
      const prevIndex =
        (currentSongIndex - 1 + christmasSongs.length) % christmasSongs.length;
      const prevSong = christmasSongs[prevIndex];
      await handleSongSelect(prevSong, prevIndex);
    }
  }, [christmasSongs, currentSongIndex, handleSongSelect]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen />;
  }

  const members = Array.isArray(membersData?.data) ? membersData.data : [];

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <h1 className="text-4xl text-center font-bold text-red-600 mb-8">
        <UnderlineTitle text="Chillzone" />
      </h1>
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NowPlaying
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSkipForward={handleSkipForward}
            onSkipBack={handleSkipBack}
            isPlayable={!!currentSong?.previewUrl}
          />
          <div className="mt-6">
            <VolumeControl
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Playlist
            songs={christmasSongs}
            onSongSelect={handleSongSelect}
            currentSongIndex={currentSongIndex}
          />
        </div>
      </div>
      <div className="mt-8">
        <Wishes members={members} />
      </div>
      <audio
        ref={audioRef}
        src={currentSong?.previewUrl}
        onEnded={handleSkipForward}
        onError={(e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
          playPromiseRef.current = null;
        }}
      />
    </div>
  );
};
