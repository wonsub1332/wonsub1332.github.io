---
title: "[블로그 구축기 #2] 마크다운 기반의 동적 포스트 시스템 구현"
date: 2024-04-02
category: Development
tags: Markdown, React, 프론트엔드, 기술블로그
excerpt: Vite의 import.meta.glob을 활용해 마크다운 파일을 자동으로 불러오고, Frontmatter를 파싱하여 포스트 목록을 만드는 방법을 알아봅니다.
---

# 1. 마크다운 파일 자동 로드

블로그 글을 추가할 때마다 수동으로 임포트하는 대신, Vite의 동적 임포트 기능을 사용했습니다.

```typescript
export async function getAllPosts(): Promise<Post[]> {
  const modules = import.meta.glob('../posts/*.md', { 
    query: '?raw', 
    import: 'default', 
    eager: true 
  });
  // ... 파싱 로직
}
```

# 2. Frontmatter 파싱

글의 제목, 날짜, 태그와 같은 메타데이터를 추출하기 위해 정규식을 사용하여 직접 파서를 구현했습니다. 이를 통해 DB 없이도 풍부한 정보를 관리할 수 있게 되었습니다.

# 3. 마크다운 렌더링과 코드 하이라이트

`react-markdown` 라이브러리를 사용하여 마크다운을 HTML로 변환하고, 개발자 블로그의 꽃인 코드 블록을 위해 `react-syntax-highlighter`를 적용했습니다.

```tsx
<ReactMarkdown
  components={{
    code({ node, inline, className, children, ...props }) {
      // 코드 문법 강조 로직
    }
  }}
>
  {post.content}
</ReactMarkdown>
```

# 4. Mermaid 다이어그램 지원 (문제 해결)

마크다운에서 `graph TD`와 같은 Mermaid 문법을 사용했을 때, 그림이 아닌 단순한 코드 블록으로 출력되는 문제가 있었습니다. 이를 해결하기 위해 `mermaid` 라이브러리를 직접 연동했습니다.

### 해결 방법

1.  **Mermaid 전용 컴포넌트 생성**: `mermaid.initialize`와 `mermaid.render`를 사용하여 SVG를 생성하는 전용 컴포넌트를 만들었습니다.
2.  **ReactMarkdown 컴포넌트 확장**: 코드 블록의 언어(`className`)가 `language-mermaid`인 경우, 일반 하이라이터 대신 위에서 만든 `Mermaid` 컴포넌트를 반환하도록 설정했습니다.
3.  **다크 모드 대응**: `useTheme` 훅에서 현재 테마를 가져와 Mermaid 차트의 색상 테마도 실시간으로 전환되도록 처리했습니다.

```tsx
// PostDetail.tsx 내 일부
if (!inline && language === 'mermaid') {
  return <Mermaid chart={String(children)} theme={mermaidTheme} />;
}
```

이제 복잡한 아키텍처나 흐름도를 마크다운 내에서 손쉽게 그릴 수 있게 되었습니다! 🚀

이제 글을 작성하면 자동으로 블로그에 목록이 나타나고 상세 페이지까지 연결됩니다.
