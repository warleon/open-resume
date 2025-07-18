import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumePublication } from "lib/redux/types";

export const ResumePDFPublications = ({
  heading,
  publications,
  themeColor,
}: {
  heading: string;
  publications: ResumePublication[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {publications?.map(({ name, publisher, releaseDate, summary }, idx) => (
        <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: spacing["0.5"],
            }}
          >
            <ResumePDFText bold={true}>{name}</ResumePDFText>
            <ResumePDFText>{releaseDate}</ResumePDFText>
          </View>
          {publisher && (
            <ResumePDFText style={{ marginTop: spacing["0.5"] }}>
              {publisher}
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