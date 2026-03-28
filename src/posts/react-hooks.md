---
title: Understanding React Hooks
date: 2024-03-30
category: React
excerpt: A deep dive into the most common React hooks.
---

# Understanding React Hooks

React hooks revolutionized how we write components. Let's look at `useState` and `useEffect`.

## useState
`useState` allows you to add state to functional components.

```tsx
const [count, setCount] = useState(0);
```

## useEffect
`useEffect` handles side effects in your components.

```tsx
useEffect(() => {
  console.log('Component mounted');
}, []);
```

They are essential for building modern React applications.
