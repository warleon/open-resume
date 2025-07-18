import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  Textarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectAwards, changeAwards } from "lib/redux/resumeSlice";
import type { ResumeAward } from "lib/redux/types";

export const AwardsForm = () => {
  const awards = useAppSelector(selectAwards);
  const dispatch = useAppDispatch();
  const showDelete = awards.length > 1;

  return (
    <Form form="awards" addButtonText="Add Award">
      {awards.map(({ title, date, awarder, summary }, idx) => {
        const handleAwardChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeAward>
        ) => {
          dispatch(changeAwards({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== awards.length - 1;

        return (
          <FormSection
            key={idx}
            form="awards"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete award"
          >
            <Input
              label="Award Title"
              labelClassName="col-span-4"
              name="title"
              placeholder="Employee of the Year"
              value={title}
              onChange={handleAwardChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-2"
              name="date"
              placeholder="2023"
              value={date}
              onChange={handleAwardChange}
            />
            <Input
              label="Awarded By"
              labelClassName="col-span-full"
              name="awarder"
              placeholder="Khan Academy"
              value={awarder}
              onChange={handleAwardChange}
            />
            <Textarea
              label="Description"
              labelClassName="col-span-full"
              name="summary"
              placeholder="Brief description of the award and why it was received"
              value={summary}
              onChange={handleAwardChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
}; 