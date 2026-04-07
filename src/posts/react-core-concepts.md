---
title: 블로그 제작으로 배우는 리액트(React) 핵심 문법 총정리
date: 2024-04-07
category: React
tags: React, 리액트, Frontend, 웹개발, TypeScript
excerpt: 리액트 블로그 프로젝트의 소스 코드를 바탕으로 JSX, Hooks, Context API 등 핵심 문법과 실무 패턴을 자세히 정리합니다.
---

# 리액트(React) 핵심 문법 총정리

이 블로그 프로젝트를 진행하며 사용한 리액트의 핵심 문법과 기초 개념들을 정리해 보았습니다. 단순한 이론 설명이 아니라, 실제 프로젝트 코드에서 어떻게 적용되었는지 예시를 통해 알아보겠습니다.

---

## 1. 컴포넌트 기반 설계 (Component-Based)

리액트의 가장 큰 특징은 UI를 재사용 가능한 독립적인 단위인 **컴포넌트**로 나누는 것입니다.

### 함수형 컴포넌트와 Props
우리 프로젝트의 `Layout` 컴포넌트는 전체적인 웹사이트의 틀을 담당합니다.

```tsx
// src/components/Layout.tsx
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <header>...</header>
      <main>{children}</main>
      <footer>...</footer>
    </div>
  );
};
```
- **Props:** `children`을 통해 부모 컴포넌트(`App.tsx`)로부터 하위 UI 요소를 전달받습니다.
- **TypeScript:** `React.FC`와 타입을 사용하여 안정성을 높였습니다.

---

## 2. 상태 관리 (useState Hook)

`useState`는 컴포넌트 내에서 변경되는 데이터를 관리할 때 사용합니다. 상태가 변하면 리액트가 UI를 자동으로 다시 그립니다(Re-rendering).

### 실전 예시: 태그 필터링
`Home` 페이지에서 선택된 태그를 추적하는 로직입니다.

```tsx
// src/pages/Home.tsx
const [selectedTag, setSelectedTag] = useState<string | null>(null);

const filteredPosts = selectedTag
  ? posts.filter((post) => post.tags?.includes(selectedTag))
  : posts;
```
- 사용자가 태그 버튼을 클릭하면 `setSelectedTag`가 호출되고, 이에 따라 `filteredPosts`가 실시간으로 계산되어 화면에 반영됩니다.

---

## 3. 부수 효과 처리 (useEffect Hook)

`useEffect`는 API 호출, 이벤트 리스너 등록 등 렌더링 외의 작업을 수행할 때 사용합니다.

### 데이터 페칭과 설정 저장
```tsx
// src/hooks/useTheme.tsx
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, [theme]);
```
- **의존성 배열:** `[theme]`가 변경될 때마다 실행되도록 설정하여, 테마 변경 시 문서 속성과 로컬 스토리지를 동기화합니다.

---

## 4. 전역 상태 관리 (Context API)

여러 컴포넌트에서 공통으로 필요한 데이터(예: 다크모드 테마)는 Context API를 통해 관리합니다.

```tsx
// src/hooks/useTheme.tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  // ...
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```
- **Provider:** 하위 모든 컴포넌트에게 테마 상태를 제공합니다.
- **Custom Hook:** `useTheme()` 훅을 만들어 어디서든 간편하게 상태를 가져올 수 있게 했습니다.

---

## 5. 라우팅 (React Router)

단일 페이지 애플리케이션(SPA)에서 페이지 이동을 구현하는 핵심 기술입니다.

```tsx
// src/App.tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/posts/:id" element={<PostDetail />} />
</Routes>
```
- **동적 파라미터:** `:id`를 사용하여 각 포스트의 상세 페이지로 연결합니다.
- **SPA 특징:** 페이지 전체를 새로고침하지 않고 필요한 컴포넌트만 교체하여 사용자 경험을 향상시킵니다.

---

## 6. JSX 문법의 심층적 특징

JSX(JavaScript XML)는 자바스크립트의 확장 문법으로, 리액트에서 UI 구조를 명확하게 표현하기 위해 사용됩니다. HTML과 비슷해 보이지만 몇 가지 중요한 차이점이 있습니다.

### 1) 반드시 하나의 부모 요소로 감싸기 (Fragment)
JSX는 여러 요소를 반환할 때 반드시 하나의 부모 태그로 감싸야 합니다. 이는 리액트가 내부적으로 가상 DOM을 효율적으로 관리하기 위해 하나의 트리 구조를 필요로 하기 때문입니다.

```tsx
// <></>는 React Fragment의 단축 문법입니다. 불필요한 div 생성을 막아줍니다.
return (
  <>
    <h1>안녕하세요</h1>
    <p>리액트 공부 중입니다.</p>
  </>
);
```

### 2) 자바스크립트 표현식 삽입 `{ }`
중괄호를 사용하면 JSX 내부 어디서든 자바스크립트 변수나 함수, 연산 결과를 직접 사용할 수 있습니다.

```tsx
const name = "Wonsub";
return <h1>Hello, {name}!</h1>; // 변수 삽입
return <p>결과: {1 + 1}</p>;   // 연산 결과 삽입
```

### 3) 속성 명명 규칙 (camelCase)
JSX는 자바스크립트 기반이므로 속성 이름에 카멜 케이스(camelCase)를 사용합니다. 또한 `class`나 `for` 같은 예약어 대신 `className`, `htmlFor`를 사용해야 합니다.

```tsx
<div className="container" onClick={handleClick}>
  <label htmlFor="user-id">ID</label>
  <input id="user-id" />
</div>
```

### 4) 인라인 스타일링은 객체(Object) 형태
문자열이 아닌 자바스크립트 객체 형태로 스타일을 지정합니다. CSS 속성명 역시 카멜 케이스를 따릅니다.

```tsx
const style = {
  backgroundColor: 'var(--primary)',
  fontSize: '1.2rem',
  padding: '10px'
};

return <div style={style}>스타일 적용됨</div>;
// 또는 직접 삽입: <div style={{ color: 'red' }}>직접 삽입</div>
```

### 5) 조건부 렌더링 (&& 연산자와 삼항 연산자)
`if` 문을 JSX 내부에서 직접 사용할 수 없으므로, 논리 연산자나 삼항 연산자를 활용하여 간결하게 조건부 UI를 구성합니다.

```tsx
// && 연산자: 조건이 true일 때만 렌더링
{isLoggedIn && <button>로그아웃</button>}

// 삼항 연산자: 조건에 따라 다른 요소를 렌더링
{theme === 'dark' ? <MoonIcon /> : <SunIcon />}
```

---

## 마무리하며

리액트는 단순한 라이브러리를 넘어 **"상태(State)를 기반으로 UI를 선언적으로 관리하는 사고방식"**을 요구합니다. 이 블로그를 직접 구현해 보면서 Hooks의 효율성과 컴포넌트 재사용의 강력함을 몸소 체험할 수 있었습니다.

앞으로 더 복잡한 기능을 추가하면서 리액트의 생태계를 더 깊이 탐험해 볼 예정입니다!
