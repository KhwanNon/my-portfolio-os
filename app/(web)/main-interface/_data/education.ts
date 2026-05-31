import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";

export const educationFolder: FileNode = {
  id: "education",
  name: "Education",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      {
        id: "edu-high-school",
        name: "High_School.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "EducationUI",
          props: {
            type: "High School Diploma",
            institution: "School Name, Thailand",
            field: "Science & Mathematics",
            period: "2014 – 2017",
            description:
              "Focused on mathematics, physics, and computer fundamentals.",
            subjects: [
              "Mathematics",
              "Physics",
              "Chemistry",
              "Computer Science",
              "English",
            ],
          },
        },
      },
      {
        id: "edu-bachelor",
        name: "Bachelor_Degree.ui",
        type: "ui",
        icon: ICONS.ui,
        data: {
          kind: "ui",
          component: "EducationUI",
          props: {
            type: "Bachelor of Science",
            institution: "University Name, Thailand",
            field: "Computer Science / Information Technology",
            period: "2018 – 2022",
            description:
              "4-year program covering software engineering fundamentals, data structures, algorithms, database systems, and software architecture.",
            subjects: [
              "Data Structures & Algorithms",
              "OOP Design",
              "Database Systems",
              "Software Engineering",
              "Computer Networks",
              "Operating Systems",
              "Mobile Development",
            ],
          },
        },
      },
    ],
  },
};
