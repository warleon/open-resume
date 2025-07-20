import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface JobHuntState {
  jobUrl: string;
  isValidUrl: boolean;
  extractedHtml: string;
  extractedText: string;
  extractedKeywords: string[];
  isExtracting: boolean;
  extractionError: string | null;
  iframeLoaded: boolean;
}

export const initialJobHuntState: JobHuntState = {
  jobUrl: "",
  isValidUrl: false,
  extractedHtml: "",
  extractedText: "",
  extractedKeywords: [],
  isExtracting: false,
  extractionError: null,
  iframeLoaded: false,
};

export const jobHuntSlice = createSlice({
  name: "jobHunt",
  initialState: initialJobHuntState,
  reducers: {
    setJobUrl: (state, action: PayloadAction<string>) => {
      state.jobUrl = action.payload;
      
      // Validate URL
      if (!action.payload) {
        state.isValidUrl = false;
        state.extractedHtml = "";
        state.extractedText = "";
        state.extractedKeywords = [];
        state.extractionError = null;
        state.iframeLoaded = false;
      } else {
        try {
          new URL(action.payload);
          state.isValidUrl = true;
        } catch {
          state.isValidUrl = false;
          state.extractedHtml = "";
          state.extractedText = "";
          state.extractedKeywords = [];
          state.extractionError = null;
          state.iframeLoaded = false;
        }
      }
    },
    setIframeLoaded: (state, action: PayloadAction<boolean>) => {
      state.iframeLoaded = action.payload;
    },
    setExtractedHtml: (state, action: PayloadAction<string>) => {
      state.extractedHtml = action.payload;
    },
    setExtractedText: (state, action: PayloadAction<string>) => {
      state.extractedText = action.payload;
    },
    setExtractedKeywords: (state, action: PayloadAction<string[]>) => {
      state.extractedKeywords = action.payload;
    },
    setIsExtracting: (state, action: PayloadAction<boolean>) => {
      state.isExtracting = action.payload;
      if (action.payload) {
        state.extractionError = null;
      }
    },
    setExtractionError: (state, action: PayloadAction<string | null>) => {
      state.extractionError = action.payload;
      if (action.payload) {
        state.isExtracting = false;
      }
    },
    clearExtraction: (state) => {
      state.extractedHtml = "";
      state.extractedText = "";
      state.extractedKeywords = [];
      state.isExtracting = false;
      state.extractionError = null;
      state.iframeLoaded = false;
    },
  },
});

export const {
  setJobUrl,
  setIframeLoaded,
  setExtractedHtml,
  setExtractedText,
  setExtractedKeywords,
  setIsExtracting,
  setExtractionError,
  clearExtraction,
} = jobHuntSlice.actions;

export default jobHuntSlice.reducer; 