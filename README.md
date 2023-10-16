# Maptalks Web Worker 静态编译工具

## 📘 安装
```bash
pnpm install mtk-tool
```

## Ⓜ️ 使用示例

```bash
// 打印cli使用帮助
pnpm exec mtk-tool -h

// 编译worker
pnpm exec mtk-tool compile -i test/worker-source -o test/mtk-worker
```

## 💎 特性
- 支持使用TypeScript编写Web Worker

## 🎢 计划
- 增加快速创建Maptalks插件功能
- 改写为Vite或Rollup插件
- 实现Github Actions自动发布到npm