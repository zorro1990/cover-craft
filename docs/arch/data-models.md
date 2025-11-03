# 3. 数据模型 (Data Models)
(用于支持 Phase 4 的分享功能)

Design (设计稿)

interface Design {
  id: string;          // 唯一ID (用于分享URL, e.g., DVlejG)
  userId?: string;     // (可选) 创建者ID
  content: JSON;       // Fabric.js 画布内容的 JSON 序列化
  isPublicTemplate: boolean; // 是否公开为模板
  createdAt: Date;
  previewUrl?: string; // 预览图 URL (用于模板库展示)
  name?: string;       // 模板名称
}


SharedMaterial (共享素材)

interface SharedMaterial {
  id: string;
  userId?: string;     // (可选) 分享者ID
  imageUrl: string;      // 素材的URL
  type: 'meme' | 'transparent_ai' | 'other'; // 素材类型
  tags: string[];        // 搜索标签
  createdAt: Date;
}
