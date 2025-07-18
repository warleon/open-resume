import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeVolunteer } from "lib/redux/types";

export const ResumePDFVolunteer = ({
  heading,
  volunteer,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  volunteer: ResumeVolunteer[];
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {volunteer?.map(({ organization, position, startDate, endDate, highlights }, idx) => {
        const date = [startDate, endDate].filter(Boolean).join(" - ");
        
        return (
          <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
            <ResumePDFText bold={true}>{organization}</ResumePDFText>
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: spacing["1.5"],
              }}
            >
              <ResumePDFText>{position}</ResumePDFText>
              <ResumePDFText>{date}</ResumePDFText>
            </View>
            {highlights && highlights.length > 0 && (
              <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                <ResumePDFBulletList
                  items={highlights}
                  showBulletPoints={showBulletPoints}
                />
              </View>
            )}
          </View>
        );
      })}
    </ResumePDFSection>
  );
}; 