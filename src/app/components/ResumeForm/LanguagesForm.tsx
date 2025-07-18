import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectLanguages, changeLanguages } from "lib/redux/resumeSlice";
import type { ResumeLanguage } from "lib/redux/types";

export const LanguagesForm = () => {
  const languages = useAppSelector(selectLanguages);
  const dispatch = useAppDispatch();
  const showDelete = languages.length > 1;

  return (
    <Form form="languages" addButtonText="Add Language">
      {languages.map(({ language, fluency }, idx) => {
        const handleLanguageChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeLanguage>
        ) => {
          dispatch(changeLanguages({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== languages.length - 1;

        return (
          <FormSection
            key={idx}
            form="languages"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete language"
          >
            <Input
              label="Language"
              labelClassName="col-span-3"
              name="language"
              placeholder="Spanish"
              value={language}
              onChange={handleLanguageChange}
            />
            <Input
              label="Fluency Level"
              labelClassName="col-span-3"
              name="fluency"
              placeholder="Native, Fluent, Conversational, Basic"
              value={fluency}
              onChange={handleLanguageChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
}; 