import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  Textarea,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectVolunteer, changeVolunteer } from "lib/redux/resumeSlice";
import type { ResumeVolunteer } from "lib/redux/types";

export const VolunteerForm = () => {
  const volunteer = useAppSelector(selectVolunteer);
  const dispatch = useAppDispatch();
  const showDelete = volunteer.length > 1;

  return (
    <Form form="volunteer" addButtonText="Add Volunteer Work">
      {volunteer.map(({ organization, position, url, startDate, endDate, summary, highlights }, idx) => {
        const handleVolunteerChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeVolunteer>
        ) => {
          dispatch(changeVolunteer({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== volunteer.length - 1;

        return (
          <FormSection
            key={idx}
            form="volunteer"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete volunteer work"
          >
            <Input
              label="Organization"
              labelClassName="col-span-4"
              name="organization"
              placeholder="Red Cross"
              value={organization}
              onChange={handleVolunteerChange}
            />
            <Input
              label="Position"
              labelClassName="col-span-2"
              name="position"
              placeholder="Volunteer Coordinator"
              value={position}
              onChange={handleVolunteerChange}
            />
            <Input
              label="Start Date"
              labelClassName="col-span-3"
              name="startDate"
              placeholder="Jan 2022"
              value={startDate}
              onChange={handleVolunteerChange}
            />
            <Input
              label="End Date"
              labelClassName="col-span-3"
              name="endDate"
              placeholder="Present"
              value={endDate}
              onChange={handleVolunteerChange}
            />
            <Input
              label="Organization Website"
              labelClassName="col-span-full"
              name="url"
              placeholder="https://www.redcross.org"
              value={url}
              onChange={handleVolunteerChange}
            />
            <Textarea
              label="Role Summary"
              labelClassName="col-span-full"
              name="summary"
              placeholder="Brief overview of your volunteer responsibilities"
              value={summary}
              onChange={handleVolunteerChange}
            />
            <BulletListTextarea
              label="Key Contributions & Achievements"
              labelClassName="col-span-full"
              name="highlights"
              placeholder="Bullet points"
              value={highlights}
              onChange={handleVolunteerChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
}; 