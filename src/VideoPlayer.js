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
        // 🆕 优化播放器配置，支持HLS和缓冲优化
        const playerOptions = {
          controls: true,
          responsive: true,
          fluid: true,
          preload: 'metadata', // 预加载元数据
          autoplay: false,
          muted: false,
          // 🆕 HLS配置优化
          html5: {
            vhs: {
              // HLS配置
              overrideNative: true,
              enableLowInitialPlaylist: true,
              limitRenditionByPlayerDimensions: true,
              smoothQualityChange: true,
              backBufferLength: 15 // 15秒缓冲，平衡流畅度和流量
            }
          },
          sources: [{ 
            src, 
            type: src.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4' 
          }]
        };

        playerRef.current = videojs(videoRef.current, playerOptions);

        // 🆕 添加基本事件监听
        playerRef.current.on('loadstart', () => {
          console.log('🎬 开始加载视频');
        });

        playerRef.current.on('loadedmetadata', () => {
          console.log('📋 视频元数据加载完成');
        });

        playerRef.current.on('canplay', () => {
          console.log('✅ 视频可以开始播放');
        });

        playerRef.current.on('waiting', () => {
          console.log('⏳ 视频缓冲中...');
        });

        playerRef.current.on('error', (error) => {
          console.error('❌ 播放错误:', error);
        });

        // 🆕 网络质量监控和自适应缓冲
        let networkQualityCheckInterval;
        let bufferCheckCount = 0;
        
        playerRef.current.on('loadstart', () => {
          // 启动网络质量监控
          networkQualityCheckInterval = setInterval(() => {
            if (playerRef.current) {
              const buffered = playerRef.current.buffered();
              if (buffered.length > 0) {
                const bufferedEnd = buffered.end(buffered.length - 1);
                const currentTime = playerRef.current.currentTime();
                const bufferAhead = bufferedEnd - currentTime;
                
                // 网络质量评估
                if (bufferAhead < 3) {
                  console.log('⚠️ 网络质量较差，缓冲不足');
                  bufferCheckCount++;
                  
                  // 如果连续3次缓冲不足，可以考虑降低清晰度
                  if (bufferCheckCount >= 3) {
                    console.log('🔄 建议降低视频清晰度以改善播放体验');
                    bufferCheckCount = 0; // 重置计数器
                  }
                } else {
                  bufferCheckCount = 0; // 重置计数器
                }
                
                // 动态调整缓冲长度
                if (bufferAhead < 5) {
                  // 网络较差时，增加缓冲
                  playerRef.current.tech_.vhs?.options_.backBufferLength = 20;
                } else if (bufferAhead > 10) {
                  // 网络较好时，减少缓冲以节省流量
                  playerRef.current.tech_.vhs?.options_.backBufferLength = 10;
                }
              }
            }
          }, 5000); // 每5秒检查一次
        });

        // 🆕 清理定时器
        playerRef.current.on('dispose', () => {
          if (networkQualityCheckInterval) {
            clearInterval(networkQualityCheckInterval);
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
  }, [src]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;