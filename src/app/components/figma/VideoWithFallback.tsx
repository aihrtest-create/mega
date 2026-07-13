import React, { useState, useEffect, useRef } from 'react';

export function VideoWithFallback(props: React.VideoHTMLAttributes<HTMLVideoElement>) {
  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 1) {
      setIsLoading(false);
      return;
    }

    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const handleLoadStart = () => {
      if (video.readyState >= 1) {
        setIsLoading(false);
        clearTimeout(safetyTimeout);
      }
    };

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      clearTimeout(safetyTimeout);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      clearTimeout(safetyTimeout);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsLoading(false);
    if (props.onLoadedData) props.onLoadedData(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    console.error('VideoWithFallback ERROR:', {
      src: video.src,
      errorInfo: video.error ? { code: video.error.code, message: video.error.message } : null,
      networkState: video.networkState
    });
    setDidError(true);
    setIsLoading(false);
    if (props.onError) props.onError(e);
  };

  const { className, style, onLoadedData, onError, ...rest } = props;

  return (
    <>
      {isLoading && !didError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/30 backdrop-blur-sm z-10 pointer-events-none rounded-[inherit]">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FF6022] rounded-full animate-spin"></div>
        </div>
      )}
      {didError && (
        <div className={`absolute z-20 flex items-center justify-center w-full h-full bg-gray-100/80 text-gray-800 text-sm font-bold ${className || ''}`}>
          Failed: {props.src}
        </div>
      )}
      <video
        ref={videoRef}
        className={`${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={style}
        onLoadedData={handleLoadedData}
        onError={handleError}
        {...rest}
      />
    </>
  );
}
