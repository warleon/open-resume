import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectCertificates, changeCertificates } from "lib/redux/resumeSlice";
import type { ResumeCertificate } from "lib/redux/types";

export const CertificatesForm = () => {
  const certificates = useAppSelector(selectCertificates);
  const dispatch = useAppDispatch();
  const showDelete = certificates.length > 1;

  return (
    <Form form="certificates" addButtonText="Add Certificate">
      {certificates.map(({ name, date, url, issuer }, idx) => {
        const handleCertificateChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeCertificate>
        ) => {
          dispatch(changeCertificates({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== certificates.length - 1;

        return (
          <FormSection
            key={idx}
            form="certificates"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete certificate"
          >
            <Input
              label="Certificate Name"
              labelClassName="col-span-4"
              name="name"
              placeholder="AWS Certified Solutions Architect"
              value={name}
              onChange={handleCertificateChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-2"
              name="date"
              placeholder="2023-06"
              value={date}
              onChange={handleCertificateChange}
            />
            <Input
              label="Issuing Organization"
              labelClassName="col-span-3"
              name="issuer"
              placeholder="Amazon Web Services"
              value={issuer}
              onChange={handleCertificateChange}
            />
            <Input
              label="Certificate URL"
              labelClassName="col-span-3"
              name="url"
              placeholder="https://credly.com/badges/..."
              value={url}
              onChange={handleCertificateChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
}; 