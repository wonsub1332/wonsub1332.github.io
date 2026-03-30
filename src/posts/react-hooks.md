---
title: 리액트 훅(React Hooks) 완벽 이해하기
date: 2024-03-30
category: React
excerpt: 가장 자주 사용되는 useState와 useEffect 훅의 개념과 활용법을 자세히 알아봅니다.
---

# 리액트 훅(React Hooks) 이해하기

리액트 훅은 클래스형 컴포넌트 없이도 상태(state)와 여러 리액트 기능을 사용할 수 있게 해주는 기능입니다. 현대적인 리액트 개발에서는 필수적인 요소입니다.

## 1. useState: 상태 관리의 시작
`useState`는 컴포넌트 내에서 변화하는 데이터를 관리할 때 사용합니다.

```tsx
import { useState } from 'react';

function Counter() {
  // count는 현재 상태값, setCount는 상태를 변경하는 함수입니다.
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 클릭 횟수: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        클릭하세요
      </button>
    </div>
  );
}
```

## 2. useEffect: 부수 효과 처리
`useEffect`는 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있습니다. API 호출, 이벤트 리스너 등록, 타이머 설정 등에 주로 사용됩니다.

```tsx
import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 컴포넌트가 마운트(처음 나타남)될 때 실행됩니다.
    console.log('컴포넌트가 마운트되었습니다!');
    
    // 예시: API 호출
    // fetchData().then(res => setData(res));

    // 정리가 필요한 경우 cleanup 함수를 반환할 수 있습니다.
    return () => {
      console.log('컴포넌트가 언마운트되기 전 실행됩니다.');
    };
  }, []); // 의존성 배열이 빈 배열[]이면 처음에만 한 번 실행됩니다.

  return <div>데이터 로딩 상태 확인 중...</div>;
}
```

## 왜 훅을 사용할까요?
- **코드 재사용:** 복잡한 로직을 커스텀 훅으로 분리하여 여러 컴포넌트에서 재사용할 수 있습니다.
- **가독성:** 클래스형 컴포넌트보다 구조가 단순해지고 가독성이 좋아집니다.
- **라이프사이클 통합:** 흩어져 있던 라이프사이클 메서드들을 하나의 훅 안에서 관리할 수 있습니다.

리액트 개발을 더 즐겁게 만들어주는 훅을 적극적으로 활용해 보세요!
