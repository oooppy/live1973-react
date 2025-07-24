import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoCard.css';

const VideoCard = ({ video, onClick }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // 调用父组件传入的onClick事件
    if (onClick) {
      onClick();
    }
    
    // 跳转到视频播放页
    navigate(`/video/${video.id}`, { 
      state: { video } 
    });
  };

  return (
    <div className="video-card" onClick={handleCardClick}>
      {/* 视频封面区域 */}
      <div className="video-thumbnail">
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title} />
        ) : (
          <div className="thumbnail-placeholder">
            <div className="play-icon">▶</div>
            <div className="placeholder-text">Live1973</div>
          </div>
        )}
      </div>
      
      {/* 视频信息区域 */}
      <div className="video-info">
        <div className="video-title">{video.title || '未命名视频'}</div>
        <div className="video-duration">{video.duration || '00:00'}</div>
      </div>
      
      {/* 播放量 */}
      <div className="video-views">
        <span className="views-icon">👁</span>
        <span className="views-count">{video.view_count || '0'} 次播放</span>
      </div>
    </div>
  );
};

export default VideoCard; 