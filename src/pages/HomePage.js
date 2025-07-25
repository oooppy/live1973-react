import React, { useRef, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import { useVideos } from '../hooks/useVideos';
import './HomePage.css';

const HomePage = () => {
  const {
    videos,
    loading,
    error,
    hasMore,
    refreshVideos,
    loadMore,
    updateVideoViews
  } = useVideos();

  const scrollRef = useRef(null);

  // 监听滚动，实现分页加载
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;
      
      if (isNearBottom && hasMore && !loading) {
        loadMore();
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, loading, loadMore]);

  const handleRefresh = async () => {
    await refreshVideos();
  };

  const handleVideoClick = (videoId) => {
    // 更新播放量
    updateVideoViews(videoId);
  };

  // 错误状态
  if (error && videos.length === 0) {
    return (
      <div className="home-page">
        {/* 版权声明 */}
        <div className="copyright-notice">
          视频如有侵权，请联系微信群删除
        </div>
        
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Live1973</h1>
            <button className="refresh-button" onClick={handleRefresh}>
              🔄
            </button>
          </div>
        </header>
        <main className="video-list">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-text">加载失败: {error}</p>
            <button className="retry-button" onClick={handleRefresh}>
              重试
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page" ref={scrollRef}>
      {/* 版权声明 */}
      <div className="copyright-notice">
        视频如有侵权，请联系微信群删除
      </div>
      
      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Live1973</h1>
          <button className="refresh-button" onClick={handleRefresh}>
            🔄
          </button>
        </div>
      </header>

      {/* 视频列表 */}
      <main className="video-list">
        {loading && videos.length === 0 ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">正在加载视频...</p>
          </div>
        ) : (
          <div className="videos-container">
            {videos.map(video => (
              <VideoCard 
                key={video.id} 
                video={video}
                onClick={() => handleVideoClick(video.id)}
              />
            ))}
            
            {/* 加载更多指示器 */}
            {loading && videos.length > 0 && (
              <div className="loading-more">
                <div className="loading-spinner"></div>
                <p className="loading-text">加载更多...</p>
              </div>
            )}
            
            {/* 没有更多数据 */}
            {!hasMore && videos.length > 0 && (
              <div className="no-more">
                <p className="no-more-text">已加载全部视频</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage; 