import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { uiNode } from "./ui-node";

// All education in one .ui file at the drive root, newest first.
//
// Years are Gregorian in both languages. A Thai reader is well used to reading
// them, and half this portfolio's dates — a project's year, a store listing —
// have no Thai form to switch to, so one calendar throughout is the only way
// Experience and Projects can be read against each other.
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
        period: "2017 – 2021",
        description: L(
          "Software engineering end to end — programming, algorithms, databases, networks — with a project each term that had to actually run, not just compile.",
          "เรียนวิศวกรรมซอฟต์แวร์ครบสาย ทั้งการเขียนโปรแกรม อัลกอริทึม ฐานข้อมูล และเครือข่าย พร้อมโปรเจกต์ประจำเทอมที่ต้องทำให้ใช้งานได้จริง ไม่ใช่แค่คอมไพล์ผ่าน",
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
        period: "2011 – 2017",
        description: L(
          "The science and mathematics track, alongside student activities that were my first go at leading a group of people.",
          "เรียนสายวิทยาศาสตร์–คณิตศาสตร์ ควบคู่กับกิจกรรมนักเรียน ซึ่งเป็นครั้งแรกที่ได้ลองนำกลุ่มคน",
        ),
        subjects: L(
          ["Mathematics", "Physics", "Chemistry", "Computer Science", "English"],
          ["คณิตศาสตร์", "ฟิสิกส์", "เคมี", "คอมพิวเตอร์", "ภาษาอังกฤษ"],
        ),
      },
    ],
  });
}
