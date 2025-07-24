import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import api from '../services/api';
import './VideoPlayerPage.css';

const VideoPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [video, setVideo] = useState(location.state?.video || null);
  const [loading, setLoading] = useState(!location.state?.video);
  const [error, setError] = useState(null);

  // 如果没有从路由状态获取到视频信息，则从API获取
  useEffect(() => {
    if (!location.state?.video) {
      const fetchVideo = async () => {
        try {
          setLoading(true);
          const videoData = await api.getVideo(id);
          setVideo(videoData);
        } catch (err) {
          console.error('Failed to fetch video:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchVideo();
    }
  }, [id, location.state]);

  useEffect(() => {
    if (!video) return;

    let timeout;
    if (videoRef.current) {
      timeout = setTimeout(() => {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          responsive: true,
          fluid: true,
          sources: [{ src: video.video_url, type: 'video/mp4' }],
          controlBar: {
            children: [
              'playToggle',
              'volumePanel',
              'currentTimeDisplay',
              'timeDivider',
              'durationDisplay',
              'progressControl',
              'remainingTimeDisplay',
              'fullscreenToggle'
            ]
          }
        });
      }, 0);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [video]);

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="video-player-page">
        <header className="player-header">
          <div className="header-content">
            <button className="back-button" onClick={handleBack}>
              ←
            </button>
            <h1 className="video-title">加载中...</h1>
          </div>
        </header>
        <main className="video-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>正在加载视频...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-player-page">
        <header className="player-header">
          <div className="header-content">
            <button className="back-button" onClick={handleBack}>
              ←
            </button>
            <h1 className="video-title">加载失败</h1>
          </div>
        </header>
        <main className="video-container">
          <div className="error-container">
            <p>加载视频失败: {error}</p>
            <button onClick={() => window.location.reload()}>重试</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      {/* 顶部导航栏 */}
      <header className="player-header">
        <div className="header-content">
          <button className="back-button" onClick={handleBack}>
            ←
          </button>
          <h1 className="video-title">{video?.title || '未命名视频'}</h1>
          <button className="more-button">
            ⋯
          </button>
        </div>
      </header>

      {/* 视频播放器 */}
      <main className="video-container">
        <div data-vjs-player>
          <video 
            ref={videoRef} 
            className="video-js vjs-big-play-centered vjs-theme-city"
          />
        </div>
      </main>
    </div>
  );
};

export default VideoPlayerPage; 