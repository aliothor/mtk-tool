# maptalks web worker 静态编译工具

#### 安装
```bash
pnpm install mtk-tool
```

#### 使用示例

```bash
// 打印cli使用帮助
pnpm exec mtk-tool -h

// 编译worker
pnpm exec mtk-tool compile -i test/worker-source -o test/mtk-worker
```

#### Feature
- 支持使用typescript编写web worker

#### RoadMap
- 增加快速创建maptalks插件功能
- 改写为vite或rollup插件