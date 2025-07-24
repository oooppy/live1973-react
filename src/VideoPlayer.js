import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let timeout;
    if (videoRef.current) {
      // 延迟初始化，确保 video 元素已挂载
      timeout = setTimeout(() => {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          responsive: true,
          fluid: true,
          sources: [{ src, type: 'video/mp4' }]
        });
      }, 0);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;