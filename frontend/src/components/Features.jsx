import React from "react";
import DFAorNFA from "./features/DFAorNFA";
import InputString from "./features/InputString";
import DFAMinimizer from "./features/DFAMinimizer";
import NFAtoDFA from "./features/NFAtoDFA";

const Features = ({ transitions, start_state, end_states, states, symbols }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <svg className="w-8 h-8 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Features & Operations
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DFAorNFA
          transitions={transitions}
          start_state={start_state}
          end_states={end_states}
          states={states}
          symbols={symbols}
        />
        
        <InputString
          transitions={transitions}
          start_state={start_state}
          end_states={end_states}
          states={states}
          symbols={symbols}
        />
        
        <DFAMinimizer
          transitions={transitions}
          start_state={start_state}
          end_states={end_states}
          states={states}
          symbols={symbols}
        />
        
        <NFAtoDFA
          transitions={transitions}
          start_state={start_state}
          end_states={end_states}
          states={states}
          symbols={symbols}
        />
      </div>
    </div>
  );
};

export default Features;
