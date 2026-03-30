---
title: "[블로그 구축기 #3] 태그 시스템 구현과 GitHub Pages 자동 배포"
date: 2024-04-03
category: Development
tags: GitHubActions, CI/CD, 배포, 리액트
excerpt: 태그별 필터링 기능을 추가하여 글 관리 편의성을 높이고, GitHub Actions를 활용해 푸시 한 번으로 블로그를 배포하는 과정을 정리합니다.
---

# 1. 태그 필터링 시스템

포스트 목록에서 원하는 주제의 글만 골라볼 수 있도록 태그 필터 기능을 추가했습니다. `Array.from(new Set(...))`을 사용하여 중복되지 않는 전체 태그 목록을 뽑아내고 버튼으로 표시했습니다.

# 2. GitHub Pages와 React Router 호환성

깃허브 페이지의 `404 에러`(새로고침 시 발생)를 해결하기 위해 `BrowserRouter` 대신 `HashRouter`를 채택했습니다. URL에 `#`이 붙지만, 정적 호스팅 환경에서 가장 확실하고 간단한 해결책입니다.

```tsx
<HashRouter>
  <ThemeProvider>
    <App />
  </ThemeProvider>
</HashRouter>
```

# 3. GitHub Actions를 이용한 CI/CD

`.github/workflows/deploy.yml` 파일을 작성하여, `main` 브랜치에 코드가 푸시될 때마다 자동으로 빌드와 배포가 이루어지도록 자동화했습니다.

```yaml
steps:
  - name: Build
    run: npm run build
  - name: Deploy to GitHub Pages
    uses: actions/deploy-pages@v4
```

이제 블로그 구축의 모든 과정이 마무리되었습니다. 나만의 기술 블로그를 운영하며 지식을 쌓아가는 즐거움을 만끽해 보세요!
