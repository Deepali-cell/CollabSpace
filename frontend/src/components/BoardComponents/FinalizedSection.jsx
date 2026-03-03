import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Info, X } from "lucide-react";

const FinalizedSection = ({ finalizedTasks }) => {
  const [activeDesc, setActiveDesc] = useState(null);

  return (
    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
      <h3 className="text-emerald-800 font-bold mb-3 flex items-center gap-2">
        <ShieldCheck size={16} /> Finalized
      </h3>

      {/* Overflow-y-auto yahan rakha hai, par overflow-x visible hai taaki popover na kate */}
      <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar overflow-x-visible">
        {finalizedTasks.map((t) => (
          <div key={t.id} className="relative">
            <div className="bg-white border-emerald-200 border p-2 rounded-lg flex items-center gap-2 text-sm shadow-sm transition-all hover:border-emerald-400">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <span className="text-emerald-900 font-medium truncate max-w-[100px]">
                {t.title}
              </span>

              <span className="text-[10px] bg-emerald-100 px-1 rounded text-emerald-600 shrink-0">
                {t.assignedTo?.name || "N/A"}
              </span>

              {t.description && (
                <button
                  onClick={() =>
                    setActiveDesc(activeDesc === t.id ? null : t.id)
                  }
                  className={`ml-1 p-0.5 rounded-full transition-colors ${
                    activeDesc === t.id
                      ? "bg-emerald-500 text-white"
                      : "text-emerald-400 hover:bg-emerald-50"
                  }`}
                >
                  <Info size={14} />
                </button>
              )}
            </div>

            {/* DESCRIPTION POPOVER - Position adjusted to show below the task */}
            {activeDesc === t.id && (
              <div className="absolute z-[100] top-full mt-2 left-0 w-64 bg-slate-800 text-white text-[11px] p-3 rounded-lg shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex justify-between items-start mb-1 border-b border-slate-700 pb-1">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[9px]">
                    Description
                  </span>
                  <button onClick={() => setActiveDesc(null)}>
                    <X size={12} className="hover:text-red-400" />
                  </button>
                </div>
                <p className="leading-relaxed opacity-90 pt-1 whitespace-pre-wrap">
                  {t.description}
                </p>
                {/* Arrow pointing up */}
                <div className="absolute bottom-full left-4 border-8 border-transparent border-b-slate-800" />
              </div>
            )}
          </div>
        ))}

        {finalizedTasks.length === 0 && (
          <p className="text-emerald-600/50 text-xs italic">
            No finalized tasks yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default FinalizedSection;
