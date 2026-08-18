"use client"

import { PauseIcon, PlayIcon, SquareIcon } from "lucide-react";
import Button from "./button";

interface ReadAloudControlsProps {
  paused: boolean
  speed: number
  onTogglePlay: () => void
  onStop: () => void
  onSpeedChange: (speed: number) => void
}

export default function ReadAloudControls({
  paused,
  speed,
  onTogglePlay,
  onStop,
  onSpeedChange,
}: ReadAloudControlsProps) {
  return (
    <div className="flex flex-row items-center align-middle justify-between w-full gap-2">
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={onTogglePlay}
          aria-label={paused ? 'Resume' : 'Pause'}
          className="flex items-center align-middle"
        >
          <div className="w-4 h-4">
            {paused ? (
              <PlayIcon className="text-foreground w-full h-full" />
            ) : (
              <PauseIcon className="text-foreground w-full h-full" />
            )}
          </div>
        </Button>

        <Button
          onClick={onStop}
          aria-label="Stop"
          className="flex items-center align-middle"
        >
          <div className="w-4 h-4">
            <SquareIcon className="text-foreground w-full h-full" />
          </div>
        </Button>
      </div>

      <label className="flex flex-row items-center align-middle gap-2">
        <span className="text-xs text-foreground/70 w-8">{speed.toFixed(2)}x</span>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.05}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-28 accent-foreground"
          aria-label="Playback speed"
        />
      </label>
    </div>
  )
}
