# Moe Counter!

多种风格可选的萌萌计数器，使用 typescript 重写。

Fork from [Moe Counter](https://github.com/journey-ad/Moe-Counter)

<p align="center">
  <a href="https://coun.t.yamr.cc" target="_blank">
    <img alt="Moe Counter!" src="https://coun.t.yamr.cc/@Moe-counter.github?name=Moe-counter.github&theme=booru-lewd&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto">
  </a>
</p>

## Demo

[coun.t.yamr.cc](https://coun.t.yamr.cc) 托管于 Vercel。

## Vercel 部署

准备一个可以被访问的 MongoDB。

[![Deploy to Vercel](https://vercel.com/button)](https%3a%2f%2fvercel.com%2fnew%2fclone%3frepository-url%3dhttps%3a%2f%2fgithub.com%2fkiruio%2fMoeV-Counter%26env%3dMONGODB_URI%26envDescription%3dMONGODB+server+uri%26project-name%3dmoe-counter%26repository-name%3dmoe-counter)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkiruio%2FMoeV-Counter.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkiruio%2FMoeV-Counter?ref=badge_shield)

或者，手动部署:

1. Fork 本项目
2. 在 Vercel 上新建项目，选择本仓库
3. 设置环境变量 `MONGODB_URI` 为你的 MongoDB 链接
4. 部署

### 配置

本应用程序通过环境变量进行配置:

- `MONGODB_URI`: MongoDB 链接 (必须)
- `APP_SITE`: 网站链接，用于首页 (可选)
- `GA_ID`: Google Analytics ID (可选)
- `DB_INTERVAL`: 数据库写入周期，单位秒 (可选, 默认: 30)
- `LOG_LEVEL`: 日志级别 (可选, 默认: warn)


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkiruio%2FMoeV-Counter.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkiruio%2FMoeV-Counter?ref=badge_large)