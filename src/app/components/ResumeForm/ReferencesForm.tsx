import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  Textarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectReferences, changeReferences } from "lib/redux/resumeSlice";
import type { ResumeReference } from "lib/redux/types";

export const ReferencesForm = () => {
  const references = useAppSelector(selectReferences);
  const dispatch = useAppDispatch();
  const showDelete = references.length > 1;

  return (
    <Form form="references" addButtonText="Add Reference">
      {references.map(({ name, reference }, idx) => {
        const handleReferenceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeReference>
        ) => {
          dispatch(changeReferences({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== references.length - 1;

        return (
          <FormSection
            key={idx}
            form="references"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete reference"
          >
            <Input
              label="Reference Name"
              labelClassName="col-span-full"
              name="name"
              placeholder="John Smith, Senior Software Engineer at Khan Academy"
              value={name}
              onChange={handleReferenceChange}
            />
            <Textarea
              label="Reference Statement"
              labelClassName="col-span-full"
              name="reference"
              placeholder="Quote or statement from the reference about your work performance"
              value={reference}
              onChange={handleReferenceChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
}; 