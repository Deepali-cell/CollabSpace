import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

const FinalizedSection = ({ finalizedTasks }) => {
  return (
    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl overflow-hidden">
      <h3 className="text-emerald-800 font-bold mb-3 flex items-center gap-2">
        <ShieldCheck size={16} /> Finalized
      </h3>
      <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
        {finalizedTasks.map((t) => (
          <div
            key={t.id}
            className="bg-white border-emerald-200 border p-2 rounded-lg flex items-center gap-2 text-sm shadow-sm"
          >
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-emerald-900 font-medium">{t.title}</span>
            <span className="text-[10px] bg-emerald-100 px-1 rounded text-emerald-600">
              {t.assignedTo?.name || "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalizedSection;
