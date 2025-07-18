import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeAward } from "lib/redux/types";

export const ResumePDFAwards = ({
  heading,
  awards,
  themeColor,
}: {
  heading: string;
  awards: ResumeAward[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {awards?.map(({ title, date, awarder, summary }, idx) => (
        <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: spacing["0.5"],
            }}
          >
            <ResumePDFText bold={true}>{title}</ResumePDFText>
            <ResumePDFText>{date}</ResumePDFText>
          </View>
          {awarder && (
            <ResumePDFText style={{ marginTop: spacing["0.5"] }}>
              {awarder}
            </ResumePDFText>
          )}
          {summary && (
            <ResumePDFText style={{ marginTop: spacing["0.5"] }}>
              {summary}
            </ResumePDFText>
          )}
        </View>
      ))}
    </ResumePDFSection>
  );
}; 