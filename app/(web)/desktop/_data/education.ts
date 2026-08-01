import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { uiNode } from "./ui-node";

// All education in one .ui file at the drive root, newest first.
export function educationFile(L: Localize): FileNode {
  return uiNode({ id: "education", name: "Education.ui" }, "EducationUI", {
    entries: [
      {
        type: L("Bachelor of Science", "วิทยาศาสตรบัณฑิต"),
        institution: L(
          "Burapha University — Chonburi, Thailand",
          "มหาวิทยาลัยบูรพา — ชลบุรี",
        ),
        field: L("Software Engineering", "วิศวกรรมซอฟต์แวร์"),
        period: L("2017 – 2021", "2560 – 2564"),
        description: L(
          "Comprehensive software engineering curriculum — development, algorithms, and databases — with hands-on projects applying theory to real-world scenarios.",
          "หลักสูตรวิศวกรรมซอฟต์แวร์เต็มรูปแบบ ครอบคลุมการพัฒนาโปรแกรม อัลกอริทึม และฐานข้อมูล พร้อมโปรเจกต์ที่ได้ลงมือทำจริงเพื่อนำทฤษฎีไปใช้กับโจทย์จริง",
        ),
        subjects: L(
          [
            "Data Structures & Algorithms",
            "OOP Design",
            "Database Systems",
            "Software Engineering",
            "Computer Networks",
            "Operating Systems",
            "Mobile Development",
          ],
          [
            "โครงสร้างข้อมูลและอัลกอริทึม",
            "การออกแบบเชิงวัตถุ",
            "ระบบฐานข้อมูล",
            "วิศวกรรมซอฟต์แวร์",
            "เครือข่ายคอมพิวเตอร์",
            "ระบบปฏิบัติการ",
            "การพัฒนาแอปมือถือ",
          ],
        ),
      },
      {
        type: L("High School Diploma", "มัธยมศึกษาตอนปลาย"),
        institution: L(
          "Sanam Chai Khet School — Chachoengsao, Thailand",
          "โรงเรียนสนามชัยเขต — ฉะเชิงเทรา",
        ),
        field: L("Science & Mathematics", "วิทยาศาสตร์ – คณิตศาสตร์"),
        period: L("2011 – 2017", "2554 – 2560"),
        description: L(
          "Completed a comprehensive high school curriculum while participating in extracurricular activities that built interpersonal and leadership skills.",
          "เรียนจบหลักสูตรมัธยมศึกษาครบถ้วน ควบคู่กับกิจกรรมนอกหลักสูตรที่ช่วยฝึกการทำงานร่วมกับผู้อื่นและความเป็นผู้นำ",
        ),
        subjects: L(
          ["Mathematics", "Physics", "Chemistry", "Computer Science", "English"],
          ["คณิตศาสตร์", "ฟิสิกส์", "เคมี", "คอมพิวเตอร์", "ภาษาอังกฤษ"],
        ),
      },
    ],
  });
}
