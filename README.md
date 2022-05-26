# Text Dash - plugin for figma

| using      | target                                                                                  |
| :--------- | :-------------------------------------------------------------------------------------- |
| framework  | vue3                                                                                    |
| template   | [PluginFinchy/Figma-Vue3-Template](https://github.com/PluginFinchy/Figma-Vue3-Template) |
| ui library | [thomas-lowry/figma-plugin-ds](https://github.com/thomas-lowry/figma-plugin-ds)         |

# Development

```shell
# dev
npm run dev
# buibld for production
npm run build
```

# Bug Fixed Log

1. 需要把 Typescript 版本升级到 4.6.4（多了也不行）
2. 需要把 vue 和 vue-loader 升级到 `@latest`
3. Typescript 编译需要补充声明没有 types 的 moudle 和文件 moudle，内容在 `src/moudle.d.ts`