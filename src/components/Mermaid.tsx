import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  theme?: 'default' | 'dark' | 'neutral' | 'forest';
}

const Mermaid: React.FC<MermaidProps> = ({ chart, theme = 'default' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme,
      securityLevel: 'loose',
    });
    
    if (ref.current) {
      ref.current.innerHTML = '';
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      mermaid.render(id, chart).then((result) => {
        if (ref.current) {
          ref.current.innerHTML = result.svg;
        }
      });
    }
  }, [chart, theme]);

  return <div key={chart} ref={ref} style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }} />;
};

export default Mermaid;
