import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { THEME_COLORS } from "components/ResumeForm/ThemeForm/constants";
import { InlineInput } from "components/ResumeForm/ThemeForm/InlineInput";
import {
  DocumentSizeSelections,
  FontFamilySelectionsCSR,
  FontSizeSelections,
} from "components/ResumeForm/ThemeForm/Selection";
import {
  changeSettings,
  DEFAULT_THEME_COLOR,
  selectSettings,
  type GeneralSetting,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import type { FontFamily } from "components/fonts/constants";
import { Cog6ToothIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { ExpanderWithHeightTransition } from "components/ExpanderWithHeightTransition";
import { useState } from "react";

export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const { fontSize, fontFamily, documentSize } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cog6ToothIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-wide text-gray-900">
              Default Theme Settings
            </h1>
          </div>
          <button
            type="button"
            onClick={toggleExpanded}
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
          <div className="space-y-6">
            <div>
              <InlineInput
                label="Theme Color"
                name="themeColor"
                value={settings.themeColor}
                placeholder={DEFAULT_THEME_COLOR}
                onChange={handleSettingsChange}
                inputStyle={{ color: themeColor }}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {THEME_COLORS.map((color, idx) => (
                  <div
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-sm text-white"
                    style={{ backgroundColor: color }}
                    key={idx}
                    onClick={() => handleSettingsChange("themeColor", color)}
                    onKeyDown={(e) => {
                      if (["Enter", " "].includes(e.key))
                        handleSettingsChange("themeColor", color);
                    }}
                    tabIndex={0}
                  >
                    {settings.themeColor === color ? "✓" : ""}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <InputGroupWrapper label="Font Family" />
              <FontFamilySelectionsCSR
                selectedFontFamily={fontFamily}
                themeColor={themeColor}
                handleSettingsChange={handleSettingsChange}
              />
            </div>
            <div>
              <InlineInput
                label="Font Size (pt)"
                name="fontSize"
                value={fontSize}
                placeholder="11"
                onChange={handleSettingsChange}
              />
              <FontSizeSelections
                fontFamily={fontFamily as FontFamily}
                themeColor={themeColor}
                selectedFontSize={fontSize}
                handleSettingsChange={handleSettingsChange}
              />
            </div>
            <div>
              <InputGroupWrapper label="Document Size" />
              <DocumentSizeSelections
                themeColor={themeColor}
                selectedDocumentSize={documentSize}
                handleSettingsChange={handleSettingsChange}
              />
            </div>
          </div>
        </ExpanderWithHeightTransition>
      </div>
    </BaseForm>
  );
};
