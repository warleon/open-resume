import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeLanguage } from "lib/redux/types";

export const ResumePDFLanguages = ({
  heading,
  languages,
  themeColor,
}: {
  heading: string;
  languages: ResumeLanguage[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol, gap: spacing["1"] }}>
        {languages?.map(({ language, fluency }, idx) => (
          <View key={idx} style={{ ...styles.flexRowBetween }}>
            <ResumePDFText bold={true}>{language}</ResumePDFText>
            <ResumePDFText>{fluency}</ResumePDFText>
          </View>
        ))}
      </View>
    </ResumePDFSection>
  );
}; 