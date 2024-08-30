import React from 'react';

import {
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  RotateCwIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from 'lucide-react';
import SampleVideo from './video/sample.mp4';
import SampleSubtitles from './video/sample.vtt';

export default function App() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [volume, setVolume] = React.useState(1);

  const handleVolumeChange = (volume: number) => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.volume = volume;
    setVolume(volume);
  };

  const playVideo = React.useCallback(() => {
    videoRef.current?.play();
  }, [videoRef]);

  const pauseVideo = React.useCallback(() => {
    videoRef.current?.pause();
  }, [videoRef]);

  const seekTo = React.useCallback(
    (time: number) => {
      if (!videoRef.current) {
        return;
      }

      videoRef.current.currentTime = time;
    },
    [videoRef],
  );

  const seek10Forward = React.useCallback(() => {
    if (!videoRef.current) {
      return;
    }

    seekTo(videoRef.current.currentTime + 10);
  }, [seekTo, videoRef]);

  const seek10Backward = React.useCallback(() => {
    if (!videoRef.current) {
      return;
    }

    seekTo(videoRef.current.currentTime - 10);
  }, [seekTo, videoRef]);

  return (
    <Container>
      <Video ref={videoRef} />
      <BottomContainer>
        <div className="relative h-1 w-full rounded bg-gray-700">
          <div></div>
        </div>
        <Controls>
          <PlayPauseButton onPlay={playVideo} onPause={pauseVideo} />
          <SeekBackwardButton onSeekBack={seek10Backward} />
          <SeekForwardButton onSeekForward={seek10Forward} />
          <AudioControl setVolume={handleVolumeChange} volume={volume} />
        </Controls>
      </BottomContainer>
    </Container>
  );
}

function SeekBackwardButton({ onSeekBack }: { onSeekBack: () => void }) {
  return (
    <ControlItem onClick={onSeekBack}>
      <RotateCcwIcon className="size-6" />
      <span className="sr-only">Seek backward</span>
    </ControlItem>
  );
}

function SeekForwardButton({ onSeekForward }: { onSeekForward: () => void }) {
  return (
    <ControlItem onClick={onSeekForward}>
      <RotateCwIcon className="size-6" />
      <span className="sr-only">Seek forward</span>
    </ControlItem>
  );
}

function AudioControl({
  setVolume,
  volume,
}: {
  setVolume: (volume: number) => void;
  volume: number;
}) {
  const volumeIconToRender = React.useMemo(() => {
    if (volume === 0) {
      return <VolumeXIcon className="size-6" />;
    }
    if (volume > 0 && volume < 0.5) {
      return <Volume1Icon className="size-6" />;
    } else {
      return <Volume2Icon className="size-6" />;
    }
  }, [volume]);

  const toggleMute = React.useCallback(() => {
    setVolume(volume === 0 ? 1 : 0);
  }, [setVolume, volume]);

  return (
    <ControlItem onClick={toggleMute}>
      {volumeIconToRender}
      <span className="sr-only">Volume: {volume}</span>
    </ControlItem>
  );
}

function PlayPauseButton({
  onPlay,
  onPause,
}: {
  onPlay: () => void;
  onPause: () => void;
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const playVideo = React.useCallback(() => {
    onPlay();
    setIsPlaying(true);
  }, [onPlay]);

  const pauseVideo = React.useCallback(() => {
    onPause();
    setIsPlaying(false);
  }, [onPause]);

  return (
    <>
      {isPlaying ? (
        <ControlItem onClick={pauseVideo}>
          <PauseIcon className="size-6" fill="white" />{' '}
          <span className="sr-only">Pause</span>
        </ControlItem>
      ) : (
        <ControlItem onClick={playVideo}>
          <PlayIcon className="size-6" fill="white" />{' '}
          <span className="sr-only">Play</span>
        </ControlItem>
      )}
    </>
  );
}

function Container({ children }: React.PropsWithChildren) {
  return (
    <figure className="relative flex h-svh flex-col justify-center bg-black text-white">
      {children}
    </figure>
  );
}

function BottomContainer({ children }: React.PropsWithChildren) {
  return <div className="absolute bottom-0 w-full">{children}</div>;
}

const Video = React.forwardRef<HTMLVideoElement>((_, ref) => {
  return (
    <video ref={ref}>
      <source src={SampleVideo} type="video/mp4" />
      <track
        label="English"
        kind="subtitles"
        srcLang="en"
        src={SampleSubtitles}
      />
    </video>
  );
});

function Controls({ children }: React.PropsWithChildren) {
  return (
    <ul className="flex w-full items-center gap-2 bg-neutral-950/80 p-1">
      {children}
    </ul>
  );
}

type ControlItemProps = {
  onClick: () => void;
};

function ControlItem({
  onClick,
  children,
}: React.PropsWithChildren<ControlItemProps>) {
  return (
    <li className="flex items-center">
      <button
        className="scale-90 transition-all hover:scale-100"
        onClick={onClick}
      >
        {children}
      </button>
    </li>
  );
}
