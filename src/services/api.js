// API 配置
// 生产环境使用相对路径，开发环境使用完整URL
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'  // 生产环境：相对路径
  : 'http://10.100.126.62:3000/api';  // 开发环境：完整URL

// 通用请求函数
const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API 函数
export const api = {
  // 获取视频列表
  getVideos: async (page = 1, limit = 20) => {
    return request(`/videos?page=${page}&limit=${limit}`);
  },

  // 获取单个视频详情
  getVideo: async (id) => {
    return request(`/videos/${id}`);
  },

  // 更新播放量
  updateViews: async (id) => {
    return request(`/videos/${id}/views`, {
      method: 'PATCH',
    });
  },

  // 健康检查
  health: async () => {
    return request('/health');
  },
};

export default api; 