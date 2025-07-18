import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  Textarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectPublications, changePublications } from "lib/redux/resumeSlice";
import type { ResumePublication } from "lib/redux/types";

export const PublicationsForm = () => {
  const publications = useAppSelector(selectPublications);
  const dispatch = useAppDispatch();
  const showDelete = publications.length > 1;

  return (
    <Form form="publications" addButtonText="Add Publication">
      {publications.map(({ name, publisher, releaseDate, url, summary }, idx) => {
        const handlePublicationChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumePublication>
        ) => {
          dispatch(changePublications({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== publications.length - 1;

        return (
          <FormSection
            key={idx}
            form="publications"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete publication"
          >
            <Input
              label="Publication Title"
              labelClassName="col-span-4"
              name="name"
              placeholder="Machine Learning in Healthcare"
              value={name}
              onChange={handlePublicationChange}
            />
            <Input
              label="Release Date"
              labelClassName="col-span-2"
              name="releaseDate"
              placeholder="2023-03"
              value={releaseDate}
              onChange={handlePublicationChange}
            />
            <Input
              label="Publisher"
              labelClassName="col-span-3"
              name="publisher"
              placeholder="IEEE Computer Society"
              value={publisher}
              onChange={handlePublicationChange}
            />
            <Input
              label="Publication URL"
              labelClassName="col-span-3"
              name="url"
              placeholder="https://doi.org/10.1109/..."
              value={url}
              onChange={handlePublicationChange}
            />
            <Textarea
              label="Summary"
              labelClassName="col-span-full"
              name="summary"
              placeholder="Brief description of the publication"
              value={summary}
              onChange={handlePublicationChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
}; 