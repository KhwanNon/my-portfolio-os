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
          institution: "Sanam Chai Khet School — Chachoengsao, Thailand",
          field: "Science & Mathematics",
          period: "2011 – 2017",
          description:
            "Completed a comprehensive high school curriculum while participating in extracurricular activities that built interpersonal and leadership skills.",
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
          institution: "Burapha University — Chonburi, Thailand",
          field: "Software Engineering",
          period: "2017 – 2021",
          description:
            "Comprehensive software engineering curriculum — development, algorithms, and databases — with hands-on projects applying theory to real-world scenarios.",
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
