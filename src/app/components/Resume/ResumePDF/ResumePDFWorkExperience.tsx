import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
  ResumePDFLink,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {workExperiences.map(({ company, location, description, jobTitle, url, date, summary, descriptions }, idx) => {
        // Hide company name if it is the same as the previous company
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;

        return (
          <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
            {!hideCompanyName && (
              <View style={{ ...styles.flexRowBetween, alignItems: "flex-start" }}>
                <ResumePDFText bold={true}>{company}</ResumePDFText>
                {location && (
                  <ResumePDFText style={{ fontSize: "10pt" }}>
                    {location}
                  </ResumePDFText>
                )}
              </View>
            )}
            {!hideCompanyName && url && (
              <ResumePDFLink src={url.startsWith("http") ? url : `https://${url}`} isPDF={true}>
                <ResumePDFText style={{ fontSize: "10pt", marginTop: spacing["0.5"] }}>
                  {url}
                </ResumePDFText>
              </ResumePDFLink>
            )}
            {!hideCompanyName && description && (
              <ResumePDFText style={{ fontSize: "10pt", marginTop: spacing["0.5"] }}>
                {description}
              </ResumePDFText>
            )}
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: hideCompanyName
                  ? "-" + spacing["1"]
                  : spacing["1.5"],
              }}
            >
              <ResumePDFText>{jobTitle}</ResumePDFText>
              <ResumePDFText>{date}</ResumePDFText>
            </View>
            {summary && (
              <ResumePDFText style={{ marginTop: spacing["1"] }}>
                {summary}
              </ResumePDFText>
            )}
            <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
              <ResumePDFBulletList items={descriptions} />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
