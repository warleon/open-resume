import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeReference } from "lib/redux/types";

export const ResumePDFReferences = ({
  heading,
  references,
  themeColor,
}: {
  heading: string;
  references: ResumeReference[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol, gap: spacing["2"] }}>
        {references?.map(({ name, reference }, idx) => (
          <View key={idx}>
            <ResumePDFText bold={true}>{name}</ResumePDFText>
            {reference && (
              <ResumePDFText style={{ marginTop: spacing["0.5"] }}>
                {reference}
              </ResumePDFText>
            )}
          </View>
        ))}
      </View>
    </ResumePDFSection>
  );
}; 