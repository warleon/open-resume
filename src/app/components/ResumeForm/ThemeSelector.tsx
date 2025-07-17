import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeSettings, selectSettings } from "lib/redux/settingsSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { BaseForm } from "components/ResumeForm/Form";
import { SwatchIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { convertToJsonResume } from "lib/convert-to-json-resume";

interface JsonResumeTheme {
  id: string;
  name: string;
  description?: string;
}

// Only keep the default OpenResume theme as hardcoded
const DEFAULT_OPENRESUME_THEME: JsonResumeTheme = {
  id: "default",
  name: "Default OpenResume",
  description: "The original OpenResume theme with customizable colors and fonts"
};

export const ThemeSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const resume = useAppSelector(selectResume);
  const [availableThemes, setAvailableThemes] = useState<JsonResumeTheme[]>([DEFAULT_OPENRESUME_THEME]);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);
  
  const selectedTheme = settings.jsonResumeTheme;

  // Load available themes from API
  useEffect(() => {
    const loadThemes = async () => {
      setIsLoadingThemes(true);
      try {
        const response = await fetch('/api/render-theme');
        if (response.ok) {
          const data = await response.json();
          // Combine default OpenResume theme with dynamically loaded JSON Resume themes
          const allThemes = [
            DEFAULT_OPENRESUME_THEME,
            ...data.themes.map((theme: any) => ({
              id: theme.id,
              name: theme.name,
              description: `JSON Resume theme: ${theme.name}`
            }))
          ];
          setAvailableThemes(allThemes);
        } else {
          console.warn('Failed to load themes from API, using default theme only');
        }
      } catch (error) {
        console.error('Failed to load themes:', error);
        // Keep only the default theme on error
        setAvailableThemes([DEFAULT_OPENRESUME_THEME]);
      } finally {
        setIsLoadingThemes(false);
      }
    };

    loadThemes();
  }, []);

  const downloadPdf = async (themeId: string) => {
    setIsDownloadingPdf(true);
    try {
      const jsonResume = convertToJsonResume(resume);

      const response = await fetch('/api/render-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: jsonResume,
          theme: themeId,
          format: 'pdf'
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.profile.name || 'resume'}-${themeId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to download PDF:', errorData.error || 'Unknown error');
        alert(`Failed to download PDF: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleThemeSelect = (themeId: string) => {
    dispatch(changeSettings({ field: "jsonResumeTheme", value: themeId }));
  };

  const handleDownloadClick = (themeId: string) => {
    if (themeId === "default") return;
    downloadPdf(themeId);
  };

  if (isLoadingThemes) {
    return (
      <BaseForm>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <SwatchIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <h3 className="text-lg font-semibold tracking-wide text-gray-900">
              JSON Resume Themes
            </h3>
          </div>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-600">Loading available themes...</p>
          </div>
        </div>
      </BaseForm>
    );
  }

  return (
    <BaseForm>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <SwatchIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h3 className="text-lg font-semibold tracking-wide text-gray-900">
            JSON Resume Themes
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Choose between the default OpenResume theme or professional JSON Resume themes. 
          {availableThemes.length > 1 && ` Found ${availableThemes.length - 1} additional theme${availableThemes.length > 2 ? 's' : ''} from your dependencies.`}
        </p>

        <div className="grid grid-cols-1 gap-4">
          {availableThemes.map((theme) => (
            <div
              key={theme.id}
              className={`relative cursor-pointer rounded-lg border p-4 hover:shadow-md transition-all ${
                selectedTheme === theme.id
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{theme.name}</h4>
                {theme.id !== "default" && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadClick(theme.id);
                      }}
                      disabled={isDownloadingPdf}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 disabled:opacity-50"
                      title="Download PDF"
                    >
                      <ArrowDownTrayIcon className="h-3 w-3" />
                      {isDownloadingPdf ? 'Generating...' : 'PDF'}
                    </button>
                  </div>
                )}
              </div>
              
              {theme.description && (
                <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
              )}
              
              <div className="text-xs text-gray-500">
                Theme ID: {theme.id}
                {theme.id !== "default" && " • JSON Resume Theme"}
              </div>
            </div>
          ))}
        </div>

        {availableThemes.length === 1 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>💡 Tip:</strong> To add more JSON Resume themes:
              <br />
              1. Install: <code className="bg-yellow-100 px-1 rounded text-xs">npm install jsonresume-theme-[name]</code>
              <br />
              2. Sync: <code className="bg-yellow-100 px-1 rounded text-xs">npm run sync-themes</code>
              <br />
              3. Restart dev server - themes appear automatically! 🎉
            </p>
          </div>
        )}
      </div>
    </BaseForm>
  );
}; 