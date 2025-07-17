import React, { ReactNode } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { ExpanderWithHeightTransition } from "components/ExpanderWithHeightTransition";

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  className = "",
}) => {
  return (
    <div className={`border-t border-gray-200 pt-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isExpanded ? (
            <>
              Collapse
              <ChevronUpIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              Expand
              <ChevronDownIcon className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      
      <ExpanderWithHeightTransition expanded={isExpanded}>
        {children}
      </ExpanderWithHeightTransition>
    </div>
  );
}; 