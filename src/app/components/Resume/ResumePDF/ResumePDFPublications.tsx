import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
  ResumePDFLink,
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
      {publications?.map(({ name, publisher, releaseDate, url, summary }, idx) => (
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
          {url && (
            <ResumePDFLink src={url.startsWith("http") ? url : `https://${url}`} isPDF={true}>
              <ResumePDFText style={{ fontSize: "10pt", marginTop: spacing["0.5"] }}>
                {url}
              </ResumePDFText>
            </ResumePDFLink>
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