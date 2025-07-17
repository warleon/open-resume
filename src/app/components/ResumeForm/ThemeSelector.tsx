import React from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeSettings, selectSettings } from "lib/redux/settingsSlice";
import { BaseForm } from "components/ResumeForm/Form";
import { SwatchIcon } from "@heroicons/react/24/outline";

interface ThemePreset {
  name: string;
  description: string;
  themeColor: string;
  fontFamily: string;
  fontSize: string;
  documentSize: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Professional Blue",
    description: "Clean and professional look with blue accents",
    themeColor: "#1e40af",
    fontFamily: "Roboto",
    fontSize: "11",
    documentSize: "Letter",
  },
  {
    name: "Modern Gray",
    description: "Sleek modern design with gray tones",
    themeColor: "#4b5563",
    fontFamily: "Open Sans",
    fontSize: "10.5",
    documentSize: "Letter",
  },
  {
    name: "Creative Purple",
    description: "Stand out with creative purple styling",
    themeColor: "#7c3aed",
    fontFamily: "Lato",
    fontSize: "11",
    documentSize: "Letter",
  },
  {
    name: "Classic Black",
    description: "Timeless black and white combination",
    themeColor: "#000000",
    fontFamily: "Merriweather",
    fontSize: "11",
    documentSize: "Letter",
  },
  {
    name: "Warm Orange",
    description: "Friendly and approachable orange theme",
    themeColor: "#ea580c",
    fontFamily: "Montserrat",
    fontSize: "10.5",
    documentSize: "Letter",
  },
  {
    name: "Tech Green",
    description: "Perfect for tech roles with green accents",
    themeColor: "#059669",
    fontFamily: "Roboto",
    fontSize: "11",
    documentSize: "Letter",
  },
];

export const ThemeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const applyThemePreset = (preset: ThemePreset) => {
    dispatch(changeSettings({ field: "themeColor", value: preset.themeColor }));
    dispatch(changeSettings({ field: "fontFamily", value: preset.fontFamily }));
    dispatch(changeSettings({ field: "fontSize", value: preset.fontSize }));
    dispatch(changeSettings({ field: "documentSize", value: preset.documentSize }));
  };

  const isCurrentPreset = (preset: ThemePreset) => {
    return (
      settings.themeColor === preset.themeColor &&
      settings.fontFamily === preset.fontFamily &&
      settings.fontSize === preset.fontSize &&
      settings.documentSize === preset.documentSize
    );
  };

  return (
    <BaseForm>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <SwatchIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h3 className="text-lg font-semibold tracking-wide text-gray-900">
            Quick Theme Presets
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Choose from our curated theme combinations to quickly style your resume.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEME_PRESETS.map((preset, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg border p-4 hover:shadow-md transition-all ${
                isCurrentPreset(preset)
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => applyThemePreset(preset)}
            >
              {isCurrentPreset(preset) && (
                <div className="absolute top-2 right-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="h-6 w-6 rounded border border-gray-300"
                  style={{ backgroundColor: preset.themeColor }}
                ></div>
                <h4 className="font-medium text-gray-900">{preset.name}</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div>Font: {preset.fontFamily}</div>
                <div>Size: {preset.fontSize}pt</div>
                <div>Format: {preset.documentSize}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseForm>
  );
}; 