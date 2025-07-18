import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeCertificate } from "lib/redux/types";

export const ResumePDFCertificates = ({
  heading,
  certificates,
  themeColor,
}: {
  heading: string;
  certificates: ResumeCertificate[];
  themeColor: string;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {certificates?.map(({ name, date, issuer }, idx) => (
        <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: spacing["0.5"],
            }}
          >
            <ResumePDFText bold={true}>{name}</ResumePDFText>
            <ResumePDFText>{date}</ResumePDFText>
          </View>
          {issuer && (
            <ResumePDFText style={{ marginTop: spacing["0.5"] }}>
              {issuer}
            </ResumePDFText>
          )}
        </View>
      ))}
    </ResumePDFSection>
  );
}; 