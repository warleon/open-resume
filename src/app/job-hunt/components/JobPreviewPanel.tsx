import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAppDispatch } from "lib/redux/hooks";
import { setIframeLoaded } from "lib/redux/jobHuntSlice";

interface JobPreviewPanelProps {
  jobUrl: string;
  isValidUrl: boolean;
}

export interface JobPreviewPanelRef {
  getIframeContent: () => string | null;
  getIframeDocument: () => Document | null;
  waitForIframeContent: (maxAttempts?: number, delay?: number) => Promise<string | null>;
}

export const JobPreviewPanel = forwardRef<JobPreviewPanelRef, JobPreviewPanelProps>(
  ({ jobUrl, isValidUrl }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => ({
      getIframeContent: () => {
        const iframe = iframeRef.current;
        if (!iframe) {
          console.log("No iframe reference available");
          return null;
        }

        // Method 1: Try contentDocument (standard approach)
        try {
          if (iframe.contentDocument && iframe.contentDocument.documentElement) {
            console.log("✅ Method 1: Successfully accessed via contentDocument");
            return iframe.contentDocument.documentElement.outerHTML;
          }
                 } catch (error) {
           console.log("❌ Method 1 failed (contentDocument):", error instanceof Error ? error.message : String(error));
         }

         // Method 2: Try contentWindow.document (alternative approach)
         try {
           if (iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.documentElement) {
             console.log("✅ Method 2: Successfully accessed via contentWindow.document");
             return iframe.contentWindow.document.documentElement.outerHTML;
           }
         } catch (error) {
           console.log("❌ Method 2 failed (contentWindow.document):", error instanceof Error ? error.message : String(error));
         }

         // Method 3: Try accessing body specifically
         try {
           const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
           if (doc && doc.body) {
             console.log("✅ Method 3: Successfully accessed body content");
             return doc.body.outerHTML;
           }
         } catch (error) {
           console.log("❌ Method 3 failed (body access):", error instanceof Error ? error.message : String(error));
        }

        // Method 4: Check if iframe is still loading
        if (iframe.contentDocument && iframe.contentDocument.readyState !== 'complete') {
          console.log("⏳ Method 4: Iframe still loading, readyState:", iframe.contentDocument.readyState);
          return null;
        }

        console.log("❌ All iframe access methods failed - likely CORS restriction");
        return null;
      },
      getIframeDocument: () => {
        const iframe = iframeRef.current;
        if (!iframe) return null;

        try {
          // Try multiple methods to get document
          return iframe.contentDocument || 
                 (iframe.contentWindow && iframe.contentWindow.document) || 
                 null;
        } catch (error) {
          console.error("Cannot access iframe document:", error);
          return null;
        }
      },
             waitForIframeContent: (maxAttempts = 10, delay = 500) => {
         return new Promise<string | null>((resolve) => {
           let attempts = 0;
           
           const checkContent = () => {
             const iframe = iframeRef.current;
             if (!iframe) {
               resolve(null);
               return;
             }

             // Try to get content using the same methods
             let content: string | null = null;
             try {
               if (iframe.contentDocument && iframe.contentDocument.documentElement) {
                 content = iframe.contentDocument.documentElement.outerHTML;
               } else if (iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.documentElement) {
                 content = iframe.contentWindow.document.documentElement.outerHTML;
               }
             } catch (error) {
               // Continue trying
             }

             if (content && content.length > 100) {
               console.log(`✅ Iframe content ready after ${attempts + 1} attempts`);
               resolve(content);
               return;
             }
             
             attempts++;
             if (attempts >= maxAttempts) {
               console.log(`❌ Iframe content not accessible after ${maxAttempts} attempts`);
               resolve(null);
               return;
             }
             
             console.log(`⏳ Attempt ${attempts}/${maxAttempts} - waiting for iframe content...`);
             setTimeout(checkContent, delay);
           };
           
           checkContent();
         });
       }
    }));

    const handleIframeLoad = () => {
      // Additional check to ensure content is actually ready
      setTimeout(() => {
        const iframe = iframeRef.current;
        if (iframe) {
          try {
            const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
            if (doc && doc.readyState === 'complete') {
              console.log('✅ Iframe fully loaded and ready');
              dispatch(setIframeLoaded(true));
            } else {
              console.log('⏳ Iframe load event fired but content not ready, waiting...');
              // Wait a bit more and check again
              setTimeout(() => {
                dispatch(setIframeLoaded(true));
              }, 1000);
            }
          } catch (error) {
            console.log('⚠️ Iframe loaded but content not accessible');
            dispatch(setIframeLoaded(true)); // Still set as loaded for fallback methods
          }
        }
      }, 500); // Small delay after load event
    };

    const handleIframeError = () => {
      console.log('❌ Iframe failed to load');
      dispatch(setIframeLoaded(false));
    };

    useEffect(() => {
      if (!isValidUrl) {
        dispatch(setIframeLoaded(false));
      }
    }, [isValidUrl, dispatch]);

    return (
      <div className="border-r border-gray-200 bg-white">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700">
            Job Opening
          </h2>
          {isValidUrl && (
            <p className="text-xs text-gray-500 truncate mt-1">{jobUrl}</p>
          )}
        </div>
        <div className="h-full">
          {isValidUrl ? (
            <iframe
              ref={iframeRef}
              src={jobUrl}
              className="w-full h-full border-0"
              title="Job Opening"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">🔗</div>
                <p className="text-lg font-medium">Enter a job URL above</p>
                <p className="text-sm">The job posting will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

JobPreviewPanel.displayName = "JobPreviewPanel"; 