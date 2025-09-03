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
        // 🆕 优化播放器配置，支持自动播放
        const playerOptions = {
          controls: true,
          responsive: true,
          fluid: true,
          preload: 'metadata', // 预加载元数据
          autoplay: true, // 🆕 启用自动播放
          muted: true, // 🆕 静音播放（浏览器策略要求）
          sources: [{ 
            src: video.video_url, 
            type: video.video_url?.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4' 
          }],
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
        };

        playerRef.current = videojs(videoRef.current, playerOptions);

        // 🆕 添加事件监听
        playerRef.current.on('loadstart', () => {
          console.log('🎬 开始加载视频');
        });

        playerRef.current.on('loadedmetadata', () => {
          console.log('📋 视频元数据加载完成');
        });

        playerRef.current.on('canplay', () => {
          console.log('✅ 视频可以开始播放');
          // 🆕 自动开始播放
          if (playerRef.current.paused()) {
            playerRef.current.play().catch(error => {
              console.log('⚠️ 自动播放失败，可能需要用户交互:', error);
            });
          }
        });

        playerRef.current.on('waiting', () => {
          console.log('⏳ 视频缓冲中...');
        });

        playerRef.current.on('error', (error) => {
          console.error('❌ 播放错误:', error);
        });

        // 🆕 播放开始后取消静音
        playerRef.current.on('play', () => {
          console.log('▶️ 视频开始播放');
          // 延迟取消静音，确保播放已经开始
          setTimeout(() => {
            if (playerRef.current && !playerRef.current.paused()) {
              playerRef.current.muted(false);
              console.log('🔊 已取消静音');
            }
          }, 100);
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