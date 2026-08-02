import type { FileNode } from "@/app/shared/types/file-system";
import type { Localize } from "@/app/shared/i18n/locale";
import { ICONS } from "./icons";

/**
 * The lines the rail's craft card shows: the five principles the file below
 * states in full. They live here rather than in the component because card and
 * file are one statement, and splitting them across two modules is how they
 * drift apart.
 */
export function craftLines(L: Localize): string[] {
  return L(
    [
      "Best, but simplest.",
      "Big things are small things.",
      "Thoughtful process.",
      "Clean craft.",
      "Always the standard.",
    ],
    [
      "ดีที่สุด แต่เรียบง่ายที่สุด",
      "เรื่องใหญ่คือเรื่องเล็กที่ประกอบกัน",
      "คิดให้รอบก่อนลงมือ",
      "งานฝีมือที่สะอาด",
      "ยึดมาตรฐานเดียวเสมอ",
    ],
  );
}

/**
 * What the craft card opens: the standard in full, the same text the working
 * skill file carries. It sits at the root of the drive beside Profile and
 * Resume rather than inside C-DRIVE: it is a statement about the work, not one
 * of the folders the work is filed under. Being in the tree is what lets
 * search, the terminal and Properties find it; the card on the desktop is the
 * only shortcut to it, and the rail deliberately carries none.
 */
export function craftFile(L: Localize): FileNode {
  return {
    id: "khwan-craft-md",
    name: "khwan-craft.md",
    type: "txt",
    icon: ICONS.txt,
    data: {
      kind: "txt",
      content: L(
        `> KHWAN-CRAFT.MD — THE STANDARD
> ─────────────────────────────────────────

  Khwan's working mindset, applied to every piece of work. It
  outranks habit and speed, and it is language- and framework-
  agnostic: it defines the standard and the process, not domain
  specifics.

  How to apply — turn the dial to the work. This is a lens for
  every decision, not a ceremony. For genuinely trivial work the
  loop below runs in seconds and mostly disappears. For real
  features, functions or structural choices, run it in full —
  that is where it earns the difference between good and
  forgettable. When in doubt, treat the work as real.

# The north star: the chair

  "A great chair is redesigned again and again, until it finally
  looks simple — yet everyone agrees it is the best."

  The goal is never "code that works". The goal is the solution
  that is simultaneously the best and the simplest — where
  simplicity is earned through iteration, not skipped by
  laziness. Cheap-simple (the first thing that compiles) and
  complex-clever (impressive but tangled) are both failures. Aim
  for the third thing: refined simplicity — depth of thought
  that disappears into something obvious in hindsight.

  - Simple is the hard target, not the easy one. It is the last
    draft, never the first. If the solution looks obvious, that
    is the achievement — do not mistake it for low effort.
  - Best is not most. More layers, more abstraction, more
    configuration usually means you stopped one iteration too
    early. The master removes until nothing else can be removed
    without breaking it.
  - Elegance is a correctness signal. When the right design
    appears, the special cases tend to vanish. If you are
    drowning in edge cases the shape is probably wrong — step
    back.

  The three things, concretely — "sum the prices of the active
  items":

  - Cheap-simple: a manual loop with a total accumulator, an
    isActive flag and a nested if — it works, but you read it
    line by line to trust it.
  - Clever-complex: a generic reducer factory driven by a config
    object, reusable for sums that do not exist yet —
    impressive, tangled, and abstracted on its first caller.
  - Refined-simple: items.filter(active).sum(byPrice) — one
    expression that reads like the sentence. This is the chair.

# The lens: big things are small things, combined

  "To build a person, you build arms, legs, a head, a body. The
  head is eyes, a mouth, ears. Each of those is smaller still."

  Anything that looks complex or daunting is just smaller parts
  assembled. When a problem feels too big to grip, do not push
  against it whole — break it into parts and build each one. If
  a part is still hard, decompose it one level deeper, until
  each piece is small enough that its solution is obvious at a
  glance. The complexity was rarely in the thing itself; it was
  in trying to hold all of it at once.

  - Hard usually means "not yet broken down enough". Difficulty
    is a signal you are working at too high a level. Drop down a
    level and the fog clears.
  - Decompose until each leaf is obvious. Stop subdividing when
    a part is small enough that you already know how to build
    it. That is the right grain.
  - Then build up. Once the pieces are clear, assembly is the
    easy part — and the seams, how the parts connect, become the
    real design work. Get the boundaries clean and the whole
    holds together.
  - This feeds the chair, it does not fight it. Decompose to
    make the problem tractable, then distill the assembled
    result back down so the final shape stays simple. Break it
    apart to understand it; recombine it to make it elegant.

# The process — every feature, every function

  Do not reach for the first approach you know. Run the loop:

  1. Understand the real problem. What is actually being asked?
     What is the core, what is incidental? Restate it in one
     sentence. If you cannot, you are not ready to code.
  2. Research broadly — gather the best from many sources. How
     do the best codebases, the framework's own idioms, the docs
     and proven patterns solve this? Collect two to four
     genuinely different approaches, not variations of one. Use
     the codebase itself first, then external best practice.
     When the right approach is non-obvious or the stakes are
     real, actually look it up rather than guess from memory.
  3. Synthesize, do not copy. Take the best element from each
     and combine them into one approach that fits this codebase.
     The goal is the best combination, not the most popular
     single answer.
  4. Distill. Now cut. Remove every part that is not essential.
     Ask: what would this look like with half the code? What if
     this abstraction did not exist? Iterate the design before
     committing to it.
  5. Decide with judgment and state the tradeoff. Name why this
     approach over the alternatives in one line. If two are
     close, say so. If you are assuming something, surface it.
  6. Build it clean the first time — then reread your own diff
     as a critic and remove whatever crept in.

  Speed comes from doing this fast, not from skipping it.

# Clean code — non-negotiable

  Code is read far more often than it is written. Optimise for
  the next person who opens the file, including future-you. The
  standard is that a competent reader understands it on the
  first pass, without scrolling away or asking. Clean is not
  decoration — it is how code stays cheap to change.

  - Names carry the design. A name should make a comment
    unnecessary. Verbs for functions, nouns for data, no
    abbreviations that are not universal. Name by intent
    (activeUsers), not by implementation (userArray). If naming
    is hard, the abstraction is wrong.
  - One thing per unit. A function does one thing at one level
    of abstraction. A file has one reason to change. If you need
    "and" to describe it, split it.
  - Read top-down like prose. A reader meets the high-level
    intent first and the details below: caller above callee,
    public above private. Keep related things close.
  - Minimise what is exposed. Small public surface, everything
    else local. No dead code, no commented-out blocks, no unused
    exports — delete them.
  - Consistency is readability. One way to do a given thing
    across the codebase: naming, layout, error handling,
    formatting. A reader should never wonder why this one is
    different. Let the formatter own whitespace.
  - Shallow nesting, early returns. Guard clauses over nested
    ifs. Flatten the happy path. Deep indentation is a smell
    that a unit is doing too much.
  - Comments explain why, never what. The code says what. Delete
    comments that narrate the obvious; keep the ones that carry
    intent, a tradeoff or a non-obvious constraint.
  - No duplication of knowledge — but do not abstract on the
    second sight. Abstract on the third, when the shape is
    proven. Premature abstraction is worse than a little
    duplication.
  - Errors are first-class. Handle them where they are
    meaningful, fail loudly at boundaries, never swallow them.
    Make illegal states unrepresentable with types instead of
    guarding against them everywhere.
  - Pure where possible. Push side effects to the edges and keep
    the core logic pure and testable.
  - Match the room. Follow the style and idioms of the file you
    are in, even where taste differs. Consistency beats personal
    preference. Make surgical changes — no drive-by refactors of
    code you were not asked to touch.

# Best practices — the floor

  - Validate input at the boundary; trust nothing from the
    network, the user or the disk.
  - Test behaviour, not implementation. Cover the bug with a
    failing test before fixing it.
  - No magic numbers or strings — name them. One source of truth
    for any constant or config.
  - Security, correctness and accessibility are part of the job,
    not extras.
  - Leave it runnable: lint, format and typecheck clean before
    "done".

# Structure — the standard, on two tracks

  Structure is held to the same bar as the code: complete,
  principled and exemplary — something another engineer could
  point to as the standard. A reader should understand the
  system's shape from the tree, before reading a single
  function.

  - Predictable. Naming and layout follow one convention, so a
    reader can guess where anything lives without searching.
  - Organised by domain, not by technical type, at the top
    level. Code that changes together lives together; a feature
    can be deleted by deleting one folder.
  - Dependencies flow one direction, toward stable
    abstractions. No cycles, no layer reaching across or upward.
  - One home for each thing. A single source of truth per
    concept. Shared code is promoted deliberately, never copied.
  - Right-sized. A folder earns its existence; a file holds one
    coherent idea.
  - Shapes the change. The structure makes the common change
    easy and local, and the dangerous change isolated. New code
    has an obvious place to go.

  Track 1 — work within the current structure. Respect the
  conventions already there. New code should look like it was
  always there.

  Track 2 — propose the better structure when you see one. If
  the current structure is fighting the problem, say so:
  briefly, concretely, alongside the work rather than instead of
  it. Name the specific smell. Propose the better shape and why.
  Make it incremental — a path of small safe steps, never a
  big-bang rewrite. Then let the owner choose.

# Anti-patterns to reject

  - Shipping the first approach without considering
    alternatives.
  - "Clever" code that takes a second read to understand.
    Clever is a smell; clear is the goal.
  - Over-engineering and speculative flexibility for needs that
    do not exist yet.
  - Abstraction with a single caller. Configuration nobody asked
    for. Layers that only pass through.
  - Big-bang rewrites instead of incremental improvement.
  - Calling something done when it is the first draft, not the
    distilled one.
  - Adding code to handle a case that the right design would
    have made impossible.

# The self-check — before saying "done"

  [ ] Did I break the problem down far enough that each part
      was obvious?
  [ ] Did I consider more than one approach and synthesize the
      best?
  [ ] Could this be simpler without losing what matters? Try to
      cut once more.
  [ ] Would a senior engineer call this clean, or
      overcomplicated?
  [ ] Readable on the first pass — clear names, shallow nesting,
      top-down order, no dead code?
  [ ] Structure holds the standard — predictable, one home per
      concept, dependencies one-way — and did I flag a better
      one if it exists?
  [ ] One-thing units, errors handled, no speculative code?
  [ ] Does it look obvious in hindsight? That is the chair.

──────────────────────────────────────────────────────
  This file is the standard Portfolio OS itself is built to.
──────────────────────────────────────────────────────

> END OF FILE`,
        `> KHWAN-CRAFT.MD — มาตรฐานการทำงาน
> ─────────────────────────────────────────

  วิธีคิดในการทำงานของขวัญ ใช้กับงานทุกชิ้น มันอยู่เหนือความเคยชิน
  และความเร็ว และไม่ผูกกับภาษาหรือเฟรมเวิร์กใด เพราะสิ่งที่มันนิยาม
  คือ "มาตรฐาน" กับ "กระบวนการ" ไม่ใช่รายละเอียดของโดเมนไหน

  วิธีใช้ — ปรับระดับให้พอดีกับงาน นี่คือเลนส์สำหรับทุกการตัดสินใจ
  ไม่ใช่พิธีกรรม งานเล็กจริง ๆ ลูปข้างล่างนี้จะใช้เวลาไม่กี่วินาที
  จนแทบไม่รู้สึกว่ามีอยู่ แต่กับฟีเจอร์ ฟังก์ชัน หรือการตัดสินใจ
  เชิงโครงสร้างจริง ๆ ให้เดินมันเต็มรอบ เพราะตรงนั้นคือจุดที่แยก
  ระหว่างงานที่ดีกับงานที่ถูกลืม ถ้าไม่แน่ใจ ให้ถือว่าเป็นงานจริง

# หมุดหมาย: เก้าอี้

  "เก้าอี้ที่ดีถูกออกแบบใหม่ครั้งแล้วครั้งเล่า จนสุดท้ายหน้าตาของมัน
  ดูเรียบง่าย และทุกคนก็ยอมรับว่ามันดีที่สุด"

  เป้าหมายไม่เคยเป็น "โค้ดที่รันได้" แต่คือคำตอบที่ "ดีที่สุด" กับ
  "เรียบง่ายที่สุด" กลายเป็นอันเดียวกัน โดยความเรียบง่ายนั้นได้มา
  จากการขัดเกลาซ้ำ ไม่ใช่จากการมักง่าย ทั้งของง่ายแบบราคาถูก
  (อันแรกที่คอมไพล์ผ่าน) และของฉลาดแบบซับซ้อน (ดูเท่แต่พันกันยุ่ง)
  ล้มเหลวทั้งคู่ สิ่งที่ต้องเล็งคืออย่างที่สาม ความเรียบง่ายที่ผ่าน
  การขัดเกลา — ความคิดที่ลึกจนละลายหายไปในสิ่งที่ดูธรรมดามาก

  - ความเรียบง่ายคือเป้าที่ยาก ไม่ใช่เป้าที่ง่าย มันคือร่างสุดท้าย
    ไม่ใช่ร่างแรก ถ้าคำตอบดูธรรมดา นั่นคือความสำเร็จ อย่าเข้าใจผิด
    ว่ามันคือความมักง่าย
  - ดีที่สุดไม่เท่ากับมากที่สุด ยิ่งเยอะเลเยอร์ เยอะ abstraction
    เยอะคอนฟิก มักแปลว่าหยุดขัดเกลาเร็วไปหนึ่งรอบ คนที่เก่งจะตัดออก
    จนไม่เหลืออะไรให้ตัดได้อีกโดยที่มันยังทำงานอยู่
  - ความงามคือสัญญาณของความถูกต้อง เมื่อดีไซน์ที่ใช่โผล่ขึ้นมา
    เคสพิเศษมักหายไปเอง ถ้ากำลังจมอยู่กับ edge case เต็มไปหมด
    แปลว่ารูปทรงน่าจะผิด ให้ถอยออกมาหนึ่งก้าว

  ของสามอย่างนี้ในรูปธรรม — โจทย์ "รวมราคาของรายการที่ยัง active":

  - ง่ายแบบราคาถูก: ลูปเอง มีตัวแปร total มีแฟล็ก isActive และ if
    ซ้อนอีกชั้น — ใช้ได้ แต่ต้องอ่านทีละบรรทัดถึงจะเชื่อมัน
  - ฉลาดแบบซับซ้อน: reducer factory ที่ขับด้วย config object
    เผื่อการรวมยอดแบบที่ยังไม่มีอยู่จริง — ดูเท่ พันกันยุ่ง และทำ
    abstraction ตั้งแต่มีผู้เรียกคนแรก
  - เรียบง่ายที่ผ่านการขัดเกลา: items.filter(active).sum(byPrice)
    — นิพจน์เดียวที่อ่านแล้วเหมือนอ่านประโยค นี่คือเก้าอี้

# เลนส์: เรื่องใหญ่คือเรื่องเล็กที่ประกอบกัน

  "จะสร้างคนหนึ่งคน ก็สร้างแขน ขา หัว ลำตัว ส่วนหัวก็คือตา ปาก หู
  และแต่ละส่วนก็ยังซอยย่อยลงไปได้อีก"

  อะไรที่ดูซับซ้อนหรือน่ากลัว จริง ๆ ก็คือของชิ้นเล็ก ๆ ที่ประกอบกัน
  เมื่อจับปัญหาทั้งก้อนไม่ไหว อย่าฝืนดันมันทั้งก้อน — ให้ซอยเป็นส่วน
  แล้วสร้างทีละส่วน ถ้าส่วนไหนยังยาก ก็ซอยลงไปอีกชั้น จนแต่ละชิ้น
  เล็กพอที่จะมองปราดเดียวแล้วรู้วิธีทำ ความซับซ้อนแทบไม่เคยอยู่ที่
  ตัวปัญหา แต่อยู่ที่การพยายามถือมันทั้งหมดไว้พร้อมกัน

  - "ยาก" มักแปลว่า "ยังซอยไม่ละเอียดพอ" ความยากคือสัญญาณว่ากำลัง
    ทำงานอยู่ในระดับที่สูงเกินไป ลงมาอีกชั้นแล้วหมอกจะจาง
  - ซอยจนใบสุดท้ายชัดเจน หยุดซอยเมื่อชิ้นนั้นเล็กพอที่รู้อยู่แล้ว
    ว่าจะทำอย่างไร นั่นคือขนาดที่พอดี
  - แล้วค่อยประกอบขึ้น เมื่อชิ้นส่วนชัดแล้ว การประกอบคือส่วนที่ง่าย
    ส่วนที่เป็นงานออกแบบจริง ๆ คือรอยต่อว่าแต่ละชิ้นเชื่อมกันอย่างไร
    ทำขอบเขตให้สะอาด แล้วภาพรวมจะอยู่ตัว
  - สิ่งนี้ส่งเสริมเก้าอี้ ไม่ใช่ขัดกัน ซอยเพื่อให้ปัญหาจับต้องได้
    แล้วกลั่นผลลัพธ์ที่ประกอบเสร็จกลับลงมาให้รูปทรงสุดท้ายยังเรียบง่าย
    แยกมันออกเพื่อเข้าใจ แล้วรวมกลับเพื่อให้มันงาม

# กระบวนการ — ทุกฟีเจอร์ ทุกฟังก์ชัน

  อย่าคว้าแนวทางแรกที่นึกออก ให้เดินตามลูปนี้:

  1. เข้าใจปัญหาจริง ๆ ก่อน สิ่งที่ถูกขอคืออะไรกันแน่ อะไรคือแก่น
     อะไรคือส่วนประกอบ สรุปให้ได้ในประโยคเดียว ถ้าสรุปไม่ได้
     แปลว่ายังไม่พร้อมเขียนโค้ด
  2. หาข้อมูลให้กว้าง — เก็บของดีจากหลายแหล่ง โค้ดเบสที่ดีที่สุด
     สำนวนของเฟรมเวิร์กเอง เอกสารทางการ และแพตเทิร์นที่พิสูจน์แล้ว
     แก้เรื่องนี้กันอย่างไร เก็บมาสองถึงสี่แนวที่ต่างกันจริง ๆ
     ไม่ใช่แนวเดียวแล้วแตกย่อย ดูจากในโค้ดเบสนี้ก่อน แล้วค่อยไป
     ข้างนอก ถ้าแนวทางที่ถูกยังไม่ชัดหรือเดิมพันสูง ให้ไปหาอ่านจริง ๆ
     ไม่ใช่เดาจากความทรงจำ
  3. สังเคราะห์ ไม่ใช่ลอก หยิบส่วนที่ดีที่สุดจากแต่ละแนวมารวมเป็น
     แนวเดียวที่เข้ากับโค้ดเบสนี้ เป้าหมายคือส่วนผสมที่ดีที่สุด
     ไม่ใช่คำตอบเดี่ยว ๆ ที่คนนิยมที่สุด
  4. กลั่น ถึงเวลาตัด เอาทุกส่วนที่ไม่จำเป็นออก ถามว่า ถ้าเหลือโค้ด
     ครึ่งเดียวมันจะหน้าตาอย่างไร ถ้าไม่มี abstraction ตัวนี้อยู่เลย
     จะเป็นอย่างไร ขัดเกลาดีไซน์ให้เสร็จก่อนลงมือ
  5. ตัดสินใจด้วยวิจารณญาณ และพูดข้อแลกเปลี่ยนออกมาตรง ๆ บอกใน
     บรรทัดเดียวว่าทำไมถึงเลือกแนวนี้แทนแนวอื่น ถ้าสองแนวสูสีก็บอก
     ถ้ากำลังตั้งสมมติฐานอยู่ ก็พูดออกมา
  6. เขียนให้สะอาดตั้งแต่รอบแรก — แล้วกลับมาอ่าน diff ของตัวเอง
     อย่างนักวิจารณ์ และตัดสิ่งที่แอบแทรกเข้ามาทิ้ง

  ความเร็วมาจากการทำสิ่งนี้ให้ไว ไม่ใช่การข้ามมันไป

# โค้ดสะอาด — ต่อรองไม่ได้

  โค้ดถูกอ่านบ่อยกว่าถูกเขียนมาก เขียนเพื่อคนถัดไปที่เปิดไฟล์นี้
  ซึ่งรวมถึงตัวเองในอนาคตด้วย มาตรฐานคือคนที่มีฝีมือพอควรต้องเข้าใจ
  ได้ในการอ่านรอบเดียว โดยไม่ต้องเลื่อนไปดูที่อื่นหรือถามใคร
  ความสะอาดไม่ใช่การตกแต่ง แต่คือสิ่งที่ทำให้โค้ดยังแก้ได้ในราคาถูก

  - ชื่อคือดีไซน์ ชื่อที่ดีทำให้คอมเมนต์ไม่จำเป็น ฟังก์ชันใช้คำกริยา
    ข้อมูลใช้คำนาม ไม่ย่อถ้าไม่ใช่คำย่อสากล ตั้งชื่อตามเจตนา
    (activeUsers) ไม่ใช่ตามวิธีเก็บ (userArray) ถ้าตั้งชื่อยาก
    แปลว่า abstraction ผิด
  - หนึ่งหน่วยทำหนึ่งเรื่อง ฟังก์ชันทำเรื่องเดียวในระดับนามธรรมเดียว
    ไฟล์หนึ่งมีเหตุผลเดียวที่จะเปลี่ยน ถ้าต้องใช้คำว่า "และ" ในการ
    อธิบายมัน ให้แยก
  - อ่านจากบนลงล่างเหมือนอ่านความเรียง คนอ่านเจอเจตนาระดับสูงก่อน
    แล้วรายละเอียดอยู่ล่าง ผู้เรียกอยู่เหนือผู้ถูกเรียก ของสาธารณะ
    อยู่เหนือของภายใน ของที่เกี่ยวกันให้อยู่ใกล้กัน
  - เปิดออกให้น้อยที่สุด พื้นผิวสาธารณะเล็ก ที่เหลือเก็บไว้ข้างใน
    ไม่มีโค้ดตาย ไม่มีบล็อกที่คอมเมนต์ทิ้งไว้ ไม่มี export ที่ไม่มี
    ใครใช้ — ลบทิ้ง
  - ความสม่ำเสมอคือความอ่านง่าย เรื่องหนึ่งทำวิธีเดียวทั้งโค้ดเบส
    ทั้งการตั้งชื่อ การวางไฟล์ การจัดการ error และการจัดรูปแบบ
    คนอ่านไม่ควรต้องสงสัยว่าทำไมอันนี้ไม่เหมือนชาวบ้าน
    ปล่อยให้ formatter ดูแลช่องว่าง
  - ซ้อนให้ตื้น รีเทิร์นให้ไว ใช้ guard clause แทน if ซ้อนกัน
    ทำเส้นทางปกติให้แบน การย่อหน้าลึกคือสัญญาณว่าหน่วยนั้นทำมากเกิน
  - คอมเมนต์อธิบาย "ทำไม" ไม่ใช่ "ทำอะไร" ตัวโค้ดบอกอยู่แล้วว่า
    ทำอะไร ลบคอมเมนต์ที่บรรยายสิ่งที่เห็นอยู่แล้วทิ้ง เก็บเฉพาะอันที่
    บอกเจตนา ข้อแลกเปลี่ยน หรือข้อจำกัดที่มองไม่เห็นจากโค้ด
  - อย่าให้ความรู้ชุดเดียวกันซ้ำสองที่ — แต่อย่าทำ abstraction ตั้งแต่
    เห็นครั้งที่สอง ให้ทำตอนครั้งที่สาม เมื่อรูปทรงมันชัดแล้ว
    abstraction ที่มาเร็วเกินไปแย่กว่าการซ้ำเล็กน้อย
  - error เป็นพลเมืองชั้นหนึ่ง จัดการมันในจุดที่มีความหมาย
    พังให้ดังที่ขอบระบบ และห้ามกลืนเงียบ ๆ ใช้ type ทำให้สถานะที่
    ผิดกฎเป็นไปไม่ได้ตั้งแต่แรก แทนที่จะไปคอยกันมันทุกจุด
  - บริสุทธิ์ให้มากที่สุดเท่าที่ทำได้ ดัน side effect ไปไว้ที่ขอบ
    แล้วเก็บตรรกะแกนกลางให้บริสุทธิ์และเทสต์ได้
  - เข้ากับห้องที่อยู่ ทำตามสไตล์และสำนวนของไฟล์ที่กำลังแก้
    ถึงรสนิยมส่วนตัวจะต่างก็ตาม ความสม่ำเสมอสำคัญกว่าความชอบส่วนตัว
    แก้แบบผ่าตัด — ไม่รีแฟกเตอร์โค้ดที่ไม่ได้ถูกขอให้แตะ

# แนวปฏิบัติพื้นฐาน — เพดานขั้นต่ำ

  - ตรวจข้อมูลขาเข้าที่ขอบระบบ อย่าเชื่ออะไรที่มาจากเน็ตเวิร์ก
    ผู้ใช้ หรือดิสก์
  - เทสต์พฤติกรรม ไม่ใช่วิธีทำ เขียนเทสต์ที่ล้มให้ครอบบั๊กก่อนแก้
  - ไม่มีตัวเลขหรือสตริงลอย ๆ — ตั้งชื่อให้มัน ค่าคงที่และคอนฟิก
    มีแหล่งความจริงเดียว
  - ความปลอดภัย ความถูกต้อง และการเข้าถึงได้ เป็นส่วนหนึ่งของงาน
    ไม่ใช่ของแถม
  - ส่งมอบในสภาพที่รันได้ ผ่าน lint format และ typecheck ก่อนบอกว่า
    เสร็จ

# โครงสร้าง — มาตรฐานเดียวกัน บนสองทาง

  โครงสร้างถูกวัดด้วยเกณฑ์เดียวกับโค้ด คือครบถ้วน มีหลักการ และดี
  พอที่วิศวกรอีกคนจะชี้มาแล้วบอกว่านี่คือมาตรฐาน คนอ่านควรเข้าใจ
  รูปร่างของระบบได้จากผังโปรเจกต์ ตั้งแต่ก่อนเปิดฟังก์ชันแรก

  - เดาได้ การตั้งชื่อและการวางไฟล์ใช้แบบแผนเดียวกัน คนอ่านจึงเดา
    ได้ว่าอะไรอยู่ตรงไหนโดยไม่ต้องค้น
  - จัดตามโดเมน ไม่ใช่ตามชนิดทางเทคนิค ในระดับบนสุด ของที่เปลี่ยน
    พร้อมกันอยู่ด้วยกัน ลบฟีเจอร์หนึ่งได้ด้วยการลบโฟลเดอร์เดียว
  - การพึ่งพาไหลไปทางเดียว เข้าหาสิ่งที่นิ่งกว่า ไม่มีวงวน ไม่มี
    เลเยอร์ที่เอื้อมข้ามหรือเอื้อมขึ้น
  - หนึ่งเรื่องมีบ้านเดียว หนึ่งแนวคิดมีแหล่งความจริงเดียว
    ของที่ใช้ร่วมกันถูกยกขึ้นมาอย่างตั้งใจ ไม่ใช่ก๊อปวาง
  - ขนาดพอดี โฟลเดอร์ต้องมีเหตุผลที่จะมีอยู่ ไฟล์หนึ่งถือหนึ่ง
    ความคิดที่กลมกล่อม
  - กำหนดรูปของการเปลี่ยนแปลง โครงสร้างที่ดีทำให้การเปลี่ยนที่เกิด
    บ่อยทำได้ง่ายและอยู่ในที่เดียว ส่วนการเปลี่ยนที่อันตรายถูกจำกัด
    วง และโค้ดใหม่มีที่ทางที่ชัดเจนอยู่แล้ว

  ทางที่ 1 — ทำงานภายในโครงสร้างที่มีอยู่ เคารพแบบแผนที่โค้ดเบสใช้
  อยู่ โค้ดใหม่ต้องดูเหมือนอยู่ตรงนั้นมาตั้งแต่แรก

  ทางที่ 2 — เสนอโครงสร้างที่ดีกว่าเมื่อเห็น ถ้าโครงสร้างปัจจุบัน
  กำลังสู้กับปัญหาอยู่ ให้พูดออกมา สั้น ตรงจุด และเสนอควบไปกับงาน
  ไม่ใช่แทนงาน ชี้กลิ่นที่เฉพาะเจาะจง เสนอรูปทรงที่ดีกว่าพร้อมเหตุผล
  ทำให้มันค่อยเป็นค่อยไป — เป็นก้าวเล็ก ๆ ที่ปลอดภัย ไม่ใช่รื้อใหญ่
  ทีเดียว แล้วปล่อยให้เจ้าของงานเป็นคนเลือก

# สิ่งที่ปฏิเสธเสมอ

  - ส่งงานด้วยแนวทางแรกที่นึกออก โดยไม่เคยพิจารณาทางเลือกอื่น
  - โค้ด "ฉลาด" ที่ต้องอ่านสองรอบถึงจะเข้าใจ ความฉลาดคือสัญญาณเตือน
    ความชัดเจนคือเป้าหมาย
  - ออกแบบเกินจำเป็น และเผื่อความยืดหยุ่นให้ความต้องการที่ยังไม่มีจริง
  - abstraction ที่มีผู้เรียกอยู่คนเดียว คอนฟิกที่ไม่มีใครขอ
    เลเยอร์ที่มีหน้าที่แค่ส่งต่อ
  - รื้อใหญ่ทีเดียว แทนที่จะปรับทีละก้าว
  - เรียกว่าเสร็จ ทั้งที่มันคือร่างแรก ไม่ใช่ร่างที่กลั่นแล้ว
  - เขียนโค้ดมารับเคสที่ดีไซน์ที่ถูกต้องจะทำให้มันเกิดขึ้นไม่ได้
    ตั้งแต่แรก

# เช็กลิสต์ — ก่อนจะบอกว่าเสร็จ

  [ ] ซอยปัญหาละเอียดพอจนแต่ละส่วนชัดเจนแล้วหรือยัง
  [ ] พิจารณามากกว่าหนึ่งแนวทาง แล้วสังเคราะห์สิ่งที่ดีที่สุดแล้ว
      หรือยัง
  [ ] มันเรียบง่ายกว่านี้ได้อีกไหมโดยไม่เสียสิ่งสำคัญ ลองตัดอีกสักครั้ง
  [ ] วิศวกรรุ่นพี่จะบอกว่าสะอาด หรือว่าซับซ้อนเกินจำเป็น
  [ ] อ่านรอบเดียวเข้าใจไหม — ชื่อชัด ซ้อนตื้น เรียงบนลงล่าง
      ไม่มีโค้ดตาย
  [ ] โครงสร้างได้มาตรฐานไหม — เดาได้ หนึ่งเรื่องมีบ้านเดียว
      การพึ่งพาไหลทางเดียว และถ้ามีโครงที่ดีกว่า ได้บอกไปหรือยัง
  [ ] แต่ละหน่วยทำเรื่องเดียว จัดการ error ครบ ไม่มีโค้ดเผื่ออนาคต
  [ ] มองย้อนกลับมาแล้วมันดูธรรมดาไหม นั่นแหละคือเก้าอี้

──────────────────────────────────────────────────────
  ไฟล์นี้คือมาตรฐานที่ Portfolio OS เองถูกสร้างขึ้นตาม
──────────────────────────────────────────────────────

> จบไฟล์`,
      ),
    },
  };
}
