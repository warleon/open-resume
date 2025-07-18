import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectInterests, changeInterests } from "lib/redux/resumeSlice";
import type { ResumeInterest } from "lib/redux/types";

export const InterestsForm = () => {
  const interests = useAppSelector(selectInterests);
  const dispatch = useAppDispatch();
  const showDelete = interests.length > 1;

  return (
    <Form form="interests" addButtonText="Add Interest">
      {interests.map(({ name, keywords }, idx) => {
        const handleInterestChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeInterest>
        ) => {
          dispatch(changeInterests({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== interests.length - 1;

        return (
          <FormSection
            key={idx}
            form="interests"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete interest"
          >
            <Input
              label="Interest/Hobby"
              labelClassName="col-span-full"
              name="name"
              placeholder="Photography"
              value={name}
              onChange={handleInterestChange}
            />
            <BulletListTextarea
              label="Related Keywords"
              labelClassName="col-span-full"
              name="keywords"
              placeholder="Landscape photography, Digital editing, Canon cameras"
              value={keywords}
              onChange={handleInterestChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
}; 