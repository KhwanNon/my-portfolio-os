import type { FileNode } from "@/app/shared/types/file-system";
import { ICONS } from "./icons";
import { uiNode } from "./ui-node";

export const educationFolder: FileNode = {
  id: "education",
  name: "Education",
  type: "folder",
  icon: ICONS.folder,
  data: {
    kind: "folder",
    children: [
      uiNode(
        { id: "edu-high-school", name: "High_School.ui" },
        "EducationUI",
        {
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
      ),
      uiNode(
        { id: "edu-bachelor", name: "Bachelor_Degree.ui" },
        "EducationUI",
        {
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
      ),
    ],
  },
};
