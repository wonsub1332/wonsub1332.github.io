# Dev.log

개인 기술 블로그를 위한 React + TypeScript + Vite 기반 정적 사이트입니다. 마크다운 포스트를 앱에 직접 포함해 렌더링하고, 태그 필터링과 Mermaid 다이어그램까지 지원합니다.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- React Markdown + Remark GFM
- Mermaid

## Features

- `src/posts/*.md` 포스트 자동 로딩
- frontmatter 기반 제목, 날짜, 카테고리, 요약, 태그 관리
- 태그별 포스트 필터링
- 코드 하이라이팅
- Mermaid 다이어그램 렌더링
- 다크 모드
- GitHub Pages 배포

## Project Structure

```text
src/
  components/     UI 컴포넌트와 ThemeProvider
  context/        테마 컨텍스트
  hooks/          커스텀 훅
  pages/          라우트 페이지
  posts/          마크다운 포스트
  styles/         전역/페이지 스타일
  utils/          포스트 로딩 및 frontmatter 파싱
public/
  assets/         포스트 이미지 등 정적 파일
```

## Development

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`를 열면 됩니다.

## Build

```bash
npm run build
npm run preview
```

## Writing Posts

새 글은 `src/posts` 아래에 `.md` 파일로 추가합니다.

```md
---
title: Example Post
date: 2026-06-08
category: React
excerpt: 짧은 소개 문장
tags: react,typescript,vite
---

# 본문
```

## Deployment

이 저장소는 `wonsub1332.github.io` 저장소로 연결되어 있어 GitHub Pages 루트 배포 구조를 사용합니다. 따라서 [vite.config.ts](/Users/kimwonsub/Desktop/git_blog/vite.config.ts:1) 의 `base`는 `/`가 맞습니다.

배포 워크플로우는 [deploy.yml](/Users/kimwonsub/Desktop/git_blog/.github/workflows/deploy.yml:1) 에서 `main` 브랜치 푸시를 기준으로 동작합니다.
