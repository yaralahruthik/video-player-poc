import React from 'react';

import SampleVideo from './video/sample.mp4';
import SampleSubtitles from './video/sample.vtt';
import { PauseIcon, PlayIcon } from 'lucide-react';

export default function App() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [showControls, setShowControls] = React.useState(false);

  React.useEffect(() => {
    if (isHovered) {
      setShowControls(true);
    } else {
      const timer = setTimeout(() => setShowControls(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  const playVideo = React.useCallback(() => {
    videoRef.current?.play();
  }, [videoRef]);

  const pauseVideo = React.useCallback(() => {
    videoRef.current?.pause();
  }, [videoRef]);

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Video ref={videoRef} />
      {showControls && (
        <Controls>
          <ControlItem onClick={playVideo}>
            <PlayIcon className="size-6" fill="white" />{' '}
            <span className="sr-only">Play</span>
          </ControlItem>
          <ControlItem onClick={pauseVideo}>
            <PauseIcon className="size-6" fill="white" />{' '}
            <span className="sr-only">Play</span>
          </ControlItem>
        </Controls>
      )}
    </Container>
  );
}

type ContainerProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function Container({
  children,
  onMouseEnter,
  onMouseLeave,
}: React.PropsWithChildren<ContainerProps>) {
  return (
    <figure
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative flex h-svh flex-col justify-center bg-black text-white"
    >
      {children}
    </figure>
  );
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
    <ul className="absolute bottom-0 flex w-full items-center gap-1 bg-neutral-950/15 p-1">
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
        className="scale-95 transition-all hover:scale-100"
        onClick={onClick}
      >
        {children}
      </button>
    </li>
  );
}
