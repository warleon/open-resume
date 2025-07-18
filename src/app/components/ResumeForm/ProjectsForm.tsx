import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  Textarea,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectProjects, changeProjects } from "lib/redux/resumeSlice";
import type { ResumeProject } from "lib/redux/types";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const showDelete = projects.length > 1;

  return (
    <Form form="projects" addButtonText="Add Project">
      {projects.map(({ project, description, date, url, keywords, roles, entity, type, descriptions }, idx) => {
        const handleProjectChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeProject>
        ) => {
          dispatch(changeProjects({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={"Delete project"}
          >
            <Input
              name="project"
              label="Project Name"
              placeholder="OpenResume"
              value={project}
              onChange={handleProjectChange}
              labelClassName="col-span-4"
            />
            <Input
              name="date"
              label="Date"
              placeholder="Winter 2022"
              value={date}
              onChange={handleProjectChange}
              labelClassName="col-span-2"
            />
            <Input
              name="url"
              label="Project URL"
              placeholder="https://github.com/username/project"
              value={url}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
            <Textarea
              name="description"
              label="Project Description"
              placeholder="Brief overview of what the project is about"
              value={description}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
            <Input
              name="entity"
              label="Organization/Company"
              placeholder="Personal Project, Khan Academy, etc."
              value={entity}
              onChange={handleProjectChange}
              labelClassName="col-span-3"
            />
            <Input
              name="type"
              label="Project Type"
              placeholder="application, volunteering, conference, etc."
              value={type}
              onChange={handleProjectChange}
              labelClassName="col-span-3"
            />
            <BulletListTextarea
              name="keywords"
              label="Technologies Used"
              placeholder="React, TypeScript, Node.js"
              value={keywords}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
            <BulletListTextarea
              name="roles"
              label="Your Role(s)"
              placeholder="Frontend Developer, Team Lead, etc."
              value={roles}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
            <BulletListTextarea
              name="descriptions"
              label="Key Features & Achievements"
              placeholder="Bullet points"
              value={descriptions}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
