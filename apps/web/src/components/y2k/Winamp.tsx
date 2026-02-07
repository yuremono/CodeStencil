"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

export interface WinampProps {
  className?: string;
  width?: string | number;
}

type PlaybackState = "stopped" | "playing" | "paused";

const Winamp = React.forwardRef<HTMLDivElement, WinampProps>(
  ({ className, width = 275 }, ref
  ) => {
    const [playbackState, setPlaybackState] = React.useState<PlaybackState>("stopped");
    const [volume, setVolume] = React.useState(75);
    const [balance, setBalance] = React.useState(50);
    const [currentTrack, setCurrentTrack] = React.useState(0);
    const [position, setPosition] = React.useState(0);
    const [isShuffle, setIsShuffle] = React.useState(false);
    const [isRepeat, setIsRepeat] = React.useState(false);

    // ダミープレイリスト
    const playlist = [
      { title: "Darude - Sandstorm", time: "3:45" },
      { title: "Eiffel 65 - Blue", time: "4:08" },
      { title: "Safri Duo - Played-A-Live", time: "3:52" },
      { title: "Alice Deejay - Better Off Alone", time: "3:34" },
    ];

    const togglePlayPause = () => {
      if (playbackState === "playing") {
        setPlaybackState("paused");
      } else {
        setPlaybackState("playing");
      }
    };

    const stopPlayback = () => {
      setPlaybackState("stopped");
      setPosition(0);
    };

    const nextTrack = () => {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
      setPosition(0);
    };

    const prevTrack = () => {
      setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
      setPosition(0);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-block bg-gradient-to-b from-[#2a2a5a] to-[#000000]",
          "border-2 border-[#000000]",
          "font-['Arial_Narrow', 'Arial', sans-serif]",
          className
        )}
        style={{ width }}
      >
        {/* Main display area */}
        <div className="bg-[#000000] p-1">
          {/* Marquee display */}
          <div className="bg-[#000033] border border-[#000066] p-1 mb-2">
            <div className="text-[#00ff00] text-xs font-mono truncate">
              {playbackState !== "stopped" ? (
                <>
                  <span className="text-[#00ff00]">♫</span> {playlist[currentTrack].title}
                </>
              ) : (
                <span className="text-[#00ff00]">WINAMP RECOMMENDS</span>
              )}
            </div>
          </div>

          {/* Time display */}
          <div className="flex justify-between items-center text-[#00ff00] text-xs font-mono mb-2">
            <div className="bg-[#000000] border border-[#000066] px-2 py-1">
              {position}:{String(Math.floor(Math.random() * 60)).padStart(2, "0")} / {playlist[currentTrack]?.time || "0:00"}
            </div>
            <div className="bg-[#000000] border border-[#000066] px-2 py-1">
              {Math.floor(Math.random() * 128)}kbps
            </div>
          </div>

          {/* Visualizer (simple animation) */}
          <div className="h-8 bg-[#000000] border border-[#000066] mb-2 flex items-end justify-center gap-0.5 p-1">
            {playbackState === "playing" && Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-[#00ff00]"
                style={{
                  height: `${Math.random() * 24 + 4}px`,
                  animation: "pulse 0.2s ease-in-out"
                }}
              />
            ))}
            {playbackState !== "playing" && (
              <div className="text-[#00ff00] text-xs">WINAMP</div>
            )}
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#00ff00] text-xs">VOL:</span>
            <div className="flex-1 bg-[#000033] border border-[#000066] h-3 relative">
              <div
                className="absolute left-0 top-0 bottom-0 bg-[#00ff00]/50"
                style={{ width: `${volume}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-[#00ff00] text-xs w-6">{volume}</span>
          </div>

          {/* Balance slider */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#00ff00] text-xs">BAL:</span>
            <div className="flex-1 bg-[#000033] border border-[#000066] h-3 relative">
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#00ff00]"
                style={{ left: `${balance}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div className="bg-gradient-to-b from-[#3a3a6a] to-[#1a1a4a] p-2 border-t border-[#000066]">
          <div className="flex justify-center gap-1">
            {/* Previous */}
            <button
              onClick={prevTrack}
              className={cn(
                "w-8 h-8 flex items-center justify-center",
                "bg-gradient-to-b from-[#5a5a8a] to-[#2a2a5a]",
                "border border-[#000066]",
                "hover:from-[#6a6a9a] hover:to-[#3a3a6a]",
                "active:from-[#2a2a5a] active:to-[#1a1a3a]"
              )}
            >
              <SkipBack size={14} className="text-[#00ff00]" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className={cn(
                "w-10 h-10 flex items-center justify-center",
                "bg-gradient-to-b from-[#5a5a8a] to-[#2a2a5a]",
                "border border-[#000066]",
                "hover:from-[#6a6a9a] hover:to-[#3a3a6a]",
                "active:from-[#2a2a5a] active:to-[#1a1a3a]"
              )}
            >
              {playbackState === "playing" ? (
                <Pause size={16} className="text-[#00ff00]" />
              ) : (
                <Play size={16} className="text-[#00ff00]" fill="currentColor" />
              )}
            </button>

            {/* Stop */}
            <button
              onClick={stopPlayback}
              className={cn(
                "w-8 h-8 flex items-center justify-center",
                "bg-gradient-to-b from-[#5a5a8a] to-[#2a2a5a]",
                "border border-[#000066]",
                "hover:from-[#6a6a9a] hover:to-[#3a3a6a]",
                "active:from-[#2a2a5a] active:to-[#1a1a3a]"
              )}
            >
              <div className="w-3 h-3 bg-[#00ff00]" />
            </button>

            {/* Next */}
            <button
              onClick={nextTrack}
              className={cn(
                "w-8 h-8 flex items-center justify-center",
                "bg-gradient-to-b from-[#5a5a8a] to-[#2a2a5a]",
                "border border-[#000066]",
                "hover:from-[#6a6a9a] hover:to-[#3a3a6a]",
                "active:from-[#2a2a5a] active:to-[#1a1a3a]"
              )}
            >
              <SkipForward size={14} className="text-[#00ff00]" />
            </button>
          </div>

          {/* Shuffle and Repeat buttons */}
          <div className="flex justify-center gap-2 mt-2">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={cn(
                "px-2 py-0.5 text-xs",
                "bg-gradient-to-b from-[#5a5a8a] to-[#2a2a5a]",
                "border border-[#000066]",
                isShuffle ? "text-[#00ff00]" : "text-[#808080]"
              )}
            >
              SHUF
            </button>
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={cn(
                "px-2 py-0.5 text-xs",
                "bg-gradient-to-b from-[#5a5a8a] to-[#2a2a5a]",
                "border border-[#000066]",
                isRepeat ? "text-[#00ff00]" : "text-[#808080]"
              )}
            >
              RPT
            </button>
          </div>
        </div>

        {/* Playlist window */}
        <div className="bg-[#c0c0c0] border-t-2 border-l border-white border-b-2 border-r border-[#808080]">
          <div className="bg-[#000080] text-white text-xs px-2 py-1 font-mono flex items-center justify-between">
            <span>Playlist</span>
            <div className="flex gap-1">
              <button className="w-3 h-3 bg-[#c0c0c0] border border-[#808080]" />
              <button className="w-3 h-3 bg-[#c0c0c0] border border-[#808080]" />
            </div>
          </div>
          <div className="p-1 bg-[#ffffff] h-32 overflow-y-auto">
            {playlist.map((track, index) => (
              <div
                key={index}
                className={cn(
                  "text-xs py-0.5 px-2 cursor-pointer",
                  "font-mono",
                  index === currentTrack
                    ? "bg-[#000080] text-white"
                    : "text-[#000000] hover:bg-[#c0c0c0]"
                )}
              >
                {index + 1}. {track.title}
              </div>
            ))}
          </div>
        </div>

        {/* Winamp logo/status bar */}
        <div className="bg-gradient-to-r from-[#000000] via-[#1a0030] to-[#000000] px-2 py-1 flex items-center justify-between">
          <span className="text-[#ff00ff] text-xs font-bold">Winamp</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ff0000]" />
            <div className="w-2 h-2 rounded-full bg-[#00ff00]" />
            <div className="w-2 h-2 rounded-full bg-[#0000ff]" />
          </div>
        </div>
      </div>
    );
  }
);

Winamp.displayName = "Winamp";

export { Winamp };
