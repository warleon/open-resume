import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeInterest } from "lib/redux/types";

export const ResumePDFInterests = ({
  heading,
  interests,
  themeColor,
}: {
  heading: string;
  interests: ResumeInterest[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol, gap: spacing["1"] }}>
        {interests?.map(({ name, keywords }, idx) => (
          <View key={idx}>
            <ResumePDFText bold={true}>{name}</ResumePDFText>
            {keywords && keywords.length > 0 && (
              <ResumePDFText style={{ marginTop: spacing["0.5"] }}>
                {keywords.join(", ")}
              </ResumePDFText>
            )}
          </View>
        ))}
      </View>
    </ResumePDFSection>
  );
}; 