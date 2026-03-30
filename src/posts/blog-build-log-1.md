---
title: "[블로그 구축기 #1] Vite와 리액트로 나만의 기술 블로그 시작하기"
date: 2024-04-01
category: Development
tags: React, Vite, 프로젝트, 블로그구축
excerpt: 빠르고 가벼운 Vite를 사용하여 리액트 블로그의 기틀을 잡고, 다크 모드가 포함된 기본 레이아웃을 구현하는 과정을 소개합니다.
---

# 1. 왜 Vite와 리액트인가?

기존의 CRA(Create React App)보다 훨씬 빠른 빌드 속도를 자랑하는 **Vite**를 선택했습니다. 개발자 블로그인 만큼 쾌적한 개발 환경과 빠른 피드백 루프가 중요하기 때문입니다.

## 프로젝트 초기화

```bash
npm create vite@latest my-blog -- --template react-ts
cd my-blog
npm install
```

# 2. 폴더 구조 설계

확장성을 고려하여 다음과 같은 구조로 시작했습니다.

- `src/components`: 재사용 가능한 UI 컴포넌트
- `src/pages`: 독립적인 페이지 구성
- `src/posts`: 마크다운(.md) 파일 저장소
- `src/hooks`: 다크 모드 등 상태 관리 로직
- `src/utils`: 마크다운 파싱 유틸리티

# 3. 다크 모드와 테마 시스템

CSS 변수를 활용하여 시스템 설정에 연동되는 다크 모드를 구현했습니다. `ThemeContext`를 만들어 앱 전체에서 테마 상태를 공유하도록 설정했습니다.

```css
:root {
  --bg-color: #ffffff;
  --text-color: #1f2937;
}

[data-theme='dark'] {
  --bg-color: #0f172a;
  --text-color: #f1f5f9;
}
```

이제 기본적인 틀이 완성되었습니다. 다음 포스트에서는 실제 마크다운 파일을 읽어와 화면에 보여주는 핵심 기능을 살펴보겠습니다.
