import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // 获取视频列表
  const fetchVideos = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = refresh ? 1 : page;
      const response = await api.getVideos(currentPage, 20);
      
      if (refresh) {
        setVideos(response);
        setPage(1);
      } else {
        setVideos(prev => [...prev, ...response]);
        setPage(prev => prev + 1);
      }
      
      // 如果返回的数据少于20条，说明没有更多数据了
      setHasMore(response.length === 20);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch videos:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // 刷新视频列表
  const refreshVideos = useCallback(() => {
    return fetchVideos(true);
  }, [fetchVideos]);

  // 加载更多视频
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchVideos();
    }
  }, [loading, hasMore, fetchVideos]);

  // 更新播放量
  const updateVideoViews = useCallback(async (videoId) => {
    try {
      await api.updateViews(videoId);
      // 更新本地视频列表中的播放量
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { ...video, view_count: (parseInt(video.view_count) + 1).toString() }
          : video
      ));
    } catch (err) {
      console.error('Failed to update views:', err);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    fetchVideos(true);
  }, []);

  return {
    videos,
    loading,
    error,
    hasMore,
    refreshVideos,
    loadMore,
    updateVideoViews,
  };
}; 