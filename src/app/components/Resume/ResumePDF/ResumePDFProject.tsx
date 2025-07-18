import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
  ResumePDFLink,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {projects.map(({ project, description, date, url, keywords, roles, entity, type, descriptions }, idx) => (
        <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: spacing["0.5"],
            }}
          >
            <ResumePDFText bold={true}>{project}</ResumePDFText>
            <ResumePDFText>{date}</ResumePDFText>
          </View>
          {entity && (
            <ResumePDFText style={{ fontSize: "10pt", marginTop: spacing["0.5"] }}>
              {entity}
            </ResumePDFText>
          )}
          {type && (
            <ResumePDFText style={{ fontSize: "10pt", marginTop: spacing["0.5"] }}>
              {type}
            </ResumePDFText>
          )}
          {url && (
            <ResumePDFLink src={url.startsWith("http") ? url : `https://${url}`} isPDF={true}>
              <ResumePDFText style={{ fontSize: "10pt", marginTop: spacing["0.5"] }}>
                {url}
              </ResumePDFText>
            </ResumePDFLink>
          )}
          {description && (
            <ResumePDFText style={{ marginTop: spacing["0.5"] }}>
              {description}
            </ResumePDFText>
          )}
          {roles && roles.length > 0 && roles.join("").trim() !== "" && (
            <ResumePDFText style={{ fontSize: "10pt", marginTop: spacing["0.5"] }}>
              <ResumePDFText bold={true}>Roles: </ResumePDFText>
              {roles.join(", ")}
            </ResumePDFText>
          )}
          {keywords && keywords.length > 0 && keywords.join("").trim() !== "" && (
            <ResumePDFText style={{ fontSize: "10pt", marginTop: spacing["0.5"] }}>
              <ResumePDFText bold={true}>Technologies: </ResumePDFText>
              {keywords.join(", ")}
            </ResumePDFText>
          )}
          <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
            <ResumePDFBulletList items={descriptions} />
          </View>
        </View>
      ))}
    </ResumePDFSection>
  );
};
