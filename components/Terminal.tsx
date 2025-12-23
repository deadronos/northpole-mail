
import React, { useEffect, useRef } from 'react';

interface TerminalProps {
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black border border-green-900/50 rounded-lg p-3 fira-code text-xs text-green-500 h-48 overflow-hidden flex flex-col shadow-2xl">
      <div className="flex items-center gap-2 mb-2 border-b border-green-900/30 pb-1">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-[10px] text-green-800 ml-2">north-pole-core-v4.2.0-lts</span>
      </div>
      <div ref={scrollRef} className="overflow-y-auto flex-1 scrollbar-hide">
        {logs.map((log, i) => (
          <div key={i} className="mb-1">
            <span className="text-green-800">user@claus-it:~$</span> {log}
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>
    </div>
  );
};

export default Terminal;
