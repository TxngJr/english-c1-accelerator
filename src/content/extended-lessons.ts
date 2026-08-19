import { extendedModules, type CourseModule } from "./extended.ts";
import { moduleMaterials } from "./module-materials.ts";
import { advancedInputs } from "./advanced-inputs.ts";
import type { CEFR, Exercise, Lesson, LessonActivity, ListeningBlock, ReadingBlock, Skill, VocabularyItem } from "@/lib/types";

const dayProfiles = [
  { name: "Launch & Notice", focus: "Activate the module's core chunks and notice how the target language works in context.", minutes: 155, priority: "speaking" as Skill },
  { name: "Automaticity Lab", focus: "Convert recognition into fast controlled production and reduce translation delay.", minutes: 165, priority: "grammarProduction" as Skill },
  { name: "Listening Decode", focus: "Decode normal connected speech, recover gist/details, then shadow useful phrases.", minutes: 170, priority: "listening" as Skill },
  { name: "Speaking Expansion", focus: "Build a longer response from chunks to connected discourse with less scaffolding.", minutes: 175, priority: "speaking" as Skill },
  { name: "Read, Paraphrase, Write", focus: "Process a demanding text, paraphrase ideas, and produce structured writing.", minutes: 175, priority: "reading" as Skill },
  { name: "Real-World Transfer", focus: "Use the week's language in an authentic technical, academic, travel, or professional mission.", minutes: 165, priority: "speaking" as Skill },
  { name: "Mastery Gate", focus: "Integrate the module under reduced support and collect evidence before moving on.", minutes: 160, priority: "speaking" as Skill }
] as const;

function cefrFor(module: CourseModule): CEFR {
  const level = module.level as CEFR;
  return level;
}

function stageFor(level: string): string {
  if (level.startsWith("A2")) return "Functional Foundation";
  if (level.startsWith("B1")) return "Functional Independence";
  if (level.startsWith("B2")) return "Independent Advanced User";
  return "C1 Advanced Proficiency";
}

function speakingSeconds(level: string, dayInModule: number): number {
  const base = level.startsWith("A2") ? 50 : level.startsWith("B1") ? 110 : level.startsWith("B2") ? 220 : 330;
  const delta = [0, 5, 10, 20, 25, 35, 45][dayInModule - 1] ?? 0;
  return base + delta;
}

function minWritingWords(level: string, dayInModule: number): number {
  const base = level.startsWith("A2") ? 100 : level.startsWith("B1") ? 160 : level.startsWith("B2") ? 240 : 360;
  return dayInModule >= 5 ? base : Math.round(base * 0.55);
}

function supportThai(level: string): string {
  if (level.startsWith("A2")) return "อ่านคำอธิบายภาษาไทยได้ แต่ตอนตอบให้พยายามคิดเป็น chunk ภาษาอังกฤษ ไม่แปลทีละคำ";
  if (level.startsWith("B1")) return "ใช้ภาษาไทยเฉพาะตอนที่ concept ยังไม่ชัด แล้วกลับไปผลิตคำตอบเป็นภาษาอังกฤษทันที";
  if (level.startsWith("B2")) return "พยายามใช้ English-first; เปิดคำอธิบายไทยเฉพาะจุดที่ทำให้ความหมายคลาดเคลื่อน";
  return "C1 block: work almost entirely in English. Use Thai only to resolve a genuinely complex linguistic point.";
}

function cleanChunk(chunk: string): string {
  return chunk.replace(/\.{3}/g, "___");
}

function canonicalChunk(chunk: string): string {
  return chunk.replace(/\.{3}/g, "").replace(/[?.!,;:]+$/g, "").trim();
}

function reorderCue(sentence: string, shift = 2): string {
  const tokens = sentence.trim().split(/\s+/);
  if (tokens.length < 4) return tokens.reverse().join(" / ");
  const pivot = Math.min(shift, tokens.length - 1);
  return [...tokens.slice(pivot), ...tokens.slice(0, pivot)].join(" / ");
}

function chunkExample(chunk: string, topic: string): string {
  const c = chunk.trim();
  const map: [RegExp, string][] = [
    [/^I've never/i, "I've never explained this topic in English before."],
    [/^Have you ever/i, "Have you ever had a similar experience?"],
    [/^I just/i, "I just finished the first version."],
    [/^I haven't/i, "I haven't finished the task yet."],
    [/^I'm currently/i, "I'm currently working on a university project."],
    [/^I'm working on/i, "I'm working on a small web application."],
    [/^Could you help me/i, "Could you help me understand this error?"],
    [/^Could you say that again/i, "Could you say that again a little more slowly?"],
    [/^What does/i, "What does this term mean in this context?"],
    [/^How do I/i, "How do I fix this problem?"],
    [/^The issue occurs when/i, "The issue occurs when the session expires."],
    [/^I expected/i, "I expected the page to load, but it stayed blank."],
    [/^I tried/i, "I tried restarting the service and checking the logs."],
    [/^The error seems to/i, "The error seems to come from the client state."],
    [/^The goal of this project is/i, "The goal of this project is to reduce setup time."],
    [/^The system consists of/i, "The system consists of an API, a database, and a web client."],
    [/^So far, we've/i, "So far, we've completed the core workflow."],
    [/^The next step is/i, "The next step is to test the system with real users."],
    [/^While I agree that/i, "While I agree that automation saves time, I would argue that review still matters."],
    [/^That said/i, "That said, the long-term effect is still uncertain."],
    [/^To some extent/i, "To some extent, the result depends on how the technology is used."],
    [/^Taken together/i, "Taken together, the two sources suggest a more complicated picture."],
    [/^Let me rephrase/i, "Let me rephrase that in simpler terms."],
    [/^More precisely/i, "More precisely, the bottleneck is coordination rather than raw compute."],
    [/^From a scalability perspective/i, "From a scalability perspective, the design is promising."],
    [/^The tradeoff comes down to/i, "The tradeoff comes down to flexibility versus operational complexity."],
    [/^A failure mode would be/i, "A failure mode would be trusting results that cannot be verified."],
    [/^The available evidence suggests/i, "The available evidence suggests that the effect is real but limited."],
    [/^A plausible explanation is/i, "A plausible explanation is that several factors changed at the same time."]
  ];
  for (const [pattern, example] of map) if (pattern.test(c)) return example;
  if (!c.includes("...")) return c;
  return `${cleanChunk(c)}  → complete this naturally in the context of ${topic.toLowerCase()}.`;
}

function vocabularyFor(module: CourseModule, moduleIndex: number, dayInModule: number): VocabularyItem[] {
  return module.activeChunks.map((chunk, index) => ({
    id: `ext-${module.id}-d${dayInModule}-v${index + 1}`,
    wordOrChunk: chunk,
    meaningThai: module.level.startsWith("C1")
      ? "ใช้เป็น discourse chunk เพื่อสื่อความหมายอย่างแม่นยำตามบริบท"
      : `chunk สำคัญของบท ${module.title} — ฝึกจำเป็นทั้งก้อนและนำไปพูดทันที`,
    definitionEnglish: `A reusable expression for ${module.communicativeOutcome.toLowerCase()}`,
    level: cefrFor(module),
    examples: [chunkExample(chunk, moduleMaterials[module.id].topic)],
    learnerExample: `Use this chunk to talk about your own study, programming, project, travel, or work context.`,
    commonMistakes: ["Do not memorize the Thai translation word-by-word; retrieve the English chunk as one unit."],
    tags: [module.id, `module-${moduleIndex + 1}`, module.level]
  }));
}

function warmupFor(module: CourseModule, dayInModule: number): LessonActivity[] {
  const chunkA = cleanChunk(module.activeChunks[(dayInModule - 1) % module.activeChunks.length]);
  const chunkB = cleanChunk(module.activeChunks[dayInModule % module.activeChunks.length]);
  return [{
    id: `ext-${module.id}-d${dayInModule}-warmup`,
    kind: "retrieval",
    title: dayInModule === 1 ? "Cold recall before explanation" : "Retrieve yesterday's language without rereading",
    estimatedMinutes: 10,
    instructionsThai: "ตั้งเวลาและตอบจากความจำก่อนเปิดโน้ต ถ้าติดให้พยายาม paraphrase ก่อนดูคำตอบ",
    exercises: [
      {
        id: `ext-${module.id}-d${dayInModule}-w1`,
        type: "timed-response",
        prompt: `Start speaking within 5 seconds: use “${chunkA}” in a sentence about your real life or work.`,
        targetSkill: "speaking",
        seconds: 15,
        tags: [module.languageFocus[0], "automaticity"]
      },
      {
        id: `ext-${module.id}-d${dayInModule}-w2`,
        type: "free-writing",
        prompt: `Without looking back, write one natural sentence using “${chunkB}”.`,
        targetSkill: "grammarProduction",
        modelAnswer: chunkExample(module.activeChunks[dayInModule % module.activeChunks.length], moduleMaterials[module.id].topic),
        tags: [module.languageFocus[0], "retrieval"]
      }
    ]
  }];
}

function grammarFor(module: CourseModule, dayInModule: number): LessonActivity[] {
  const focus = module.languageFocus[(dayInModule - 1) % module.languageFocus.length];
  const chunk = module.activeChunks[(dayInModule - 1) % module.activeChunks.length];
  const answerChunk = canonicalChunk(chunk);
  const example = chunkExample(chunk, moduleMaterials[module.id].topic);
  return [{
    id: `ext-${module.id}-d${dayInModule}-grammar`,
    kind: "grammar",
    title: `${focus} → production`,
    estimatedMinutes: dayInModule === 2 ? 30 : 20,
    explanationThai: `${supportThai(module.level)} เป้าหมายวันนี้คือใช้ ${focus} เพื่อสื่อความหมาย ไม่ใช่ท่องชื่อกฎ`,
    examples: [example, ...module.activeChunks.slice(0, 2).map((x) => chunkExample(x, moduleMaterials[module.id].topic))],
    exercises: [
      {
        id: `ext-${module.id}-d${dayInModule}-g1`,
        type: "fill-blank",
        prompt: `Closed-book chunk retrieval: type today's core chunk from memory. Function/topic: ${moduleMaterials[module.id].topic}. Hint — it begins with “${answerChunk.split(/\s+/)[0]}”.`,
        instructionThai: "ปิดตัวอย่างด้านบนก่อนตอบ จุดนี้วัด recall จริง ไม่ใช่แค่ recognition",
        answer: answerChunk,
        acceptedAnswers: [answerChunk],
        explanationThai: `จำเป็น chunk: ${answerChunk} แล้วนำไปใช้กับความหมายจริง ไม่แปลทีละคำ`,
        targetSkill: "grammarProduction",
        tags: [focus, module.id, "objective-production"]
      },
      {
        id: `ext-${module.id}-d${dayInModule}-g2`,
        type: "sentence-reorder",
        prompt: `Rebuild the natural sentence. Tokens: ${reorderCue(example, (dayInModule % 3) + 1)}`,
        instructionThai: "พิมพ์เป็นประโยคธรรมชาติทั้งประโยค ไม่ต้องใส่เครื่องหมายวรรคตอนท้ายก็ได้",
        answer: example,
        acceptedAnswers: [example],
        explanationThai: "จุดนี้วัด word order และการดึง pattern ออกมาใช้แบบ controlled production",
        targetSkill: "grammarProduction",
        tags: [focus, module.id, "word-order", "objective-production"]
      },
      {
        id: `ext-${module.id}-d${dayInModule}-g3`,
        type: "timed-response",
        prompt: `60-second grammar-to-speech drill: create four different sentences using today's target (${focus}). Do not translate full Thai sentences first.`,
        targetSkill: "speaking",
        seconds: 60,
        tags: [focus, "automaticity"]
      }
    ]
  }];
}

function listeningFor(module: CourseModule, dayInModule: number): ListeningBlock[] {
  const material = moduleMaterials[module.id];
  const advanced = advancedInputs[module.id];
  const baseScript = dayInModule === 5
    ? material.readingText
    : dayInModule === 6
      ? `${material.technicalTransfer} ${material.listeningScript}`
      : material.listeningScript;
  const script = advanced && (dayInModule >= 3 || module.level.startsWith("C1"))
    ? `${baseScript} ${advanced.listeningExtension}${module.level.startsWith("C1") && [3, 5, 7].includes(dayInModule) ? ` ${advanced.readingExtension}` : ""}`
    : baseScript;
  return [{
    id: `ext-${module.id}-d${dayInModule}-listen`,
    title: dayInModule === 3 ? `${module.title}: normal-speed decoding lab` : `${module.title}: input cycle ${dayInModule}`,
    script,
    firstListenQuestion: `What is the speaker's main point about ${material.topic.toLowerCase()}?`,
    detailQuestions: [
      {
        id: `ext-${module.id}-d${dayInModule}-l1`,
        type: "multiple-choice",
        prompt: "After the first listen without the transcript, which statement best captures the speaker's main purpose?",
        targetSkill: "listening",
        choices: [
          { label: module.communicativeOutcome, value: "main" },
          { label: `The speaker mainly gives a complete technical tutorial unrelated to ${material.topic.toLowerCase()}.`, value: "tutorial" },
          { label: "The speaker argues that there is one simple answer and no need to consider context or tradeoffs.", value: "absolute" },
          { label: "The speaker only lists vocabulary items and does not communicate a larger idea.", value: "list" }
        ],
        answer: "main",
        explanationThai: "ฟังหา communicative purpose และใจความรวมก่อนรายละเอียด อย่าพยายามถอดทุกคำ",
        tags: [module.id, "gist", "objective-listening"]
      },
      {
        id: `ext-${module.id}-d${dayInModule}-l2`,
        type: "listening-comprehension",
        prompt: "Write two specific details you heard. Do not copy from the transcript until after your answer.",
        targetSkill: "listening",
        modelAnswer: "Any two accurate details from the recording.",
        tags: [module.id, "detail"]
      },
      {
        id: `ext-${module.id}-d${dayInModule}-l3`,
        type: "summary",
        prompt: "After the final listen, summarize the audio in 2–4 sentences without looking at the transcript.",
        targetSkill: "listening",
        modelAnswer: `Your summary should preserve this core function: ${module.communicativeOutcome}`,
        tags: [module.id, "summary"]
      }
    ],
    connectedSpeechNotes: [
      "Listen for stressed content words first; do not try to hear every function word equally.",
      "Notice linking across word boundaries and weak forms in high-frequency phrases.",
      `Shadow one sentence containing a useful pattern such as: ${module.activeChunks[0]}`,
      dayInModule >= 3 ? "Return to 1.0× after any slower diagnostic replay." : "Use slower playback only if a short sequence is impossible to decode, then return to normal speed."
    ]
  }];
}

function speakingFor(module: CourseModule, dayInModule: number): Exercise[] {
  const material = moduleMaterials[module.id];
  const target = speakingSeconds(module.level, dayInModule);
  const support = dayInModule <= 2
    ? `Use this frame if needed: opening → 2–3 points → example → closing. Useful chunks: ${module.activeChunks.join(" · ")}`
    : dayInModule <= 4
      ? `Plan only 3 keywords. Do not write full sentences. Useful chunks: ${module.activeChunks.join(" · ")}`
      : "No full-sentence script. Pause and reformulate in English if you cannot recall a word.";

  const mainPrompts: Record<number, string> = {
    1: `Explain ${material.topic.toLowerCase()} in your own words and connect it to one real example from your study, programming, work, or daily life.`,
    2: `Automaticity contrast: give one simple statement about ${material.topic.toLowerCase()}, then qualify or contrast it using today's target language.`,
    3: `Retell the listening input from memory. State the main point, two details, and your own reaction without looking at the transcript.`,
    4: material.discussionPrompt,
    5: `Use the reading as evidence: summarize its central idea, then explain one implication you agree or disagree with.`,
    6: material.technicalTransfer,
    7: module.speakingChallenge
  };
  const rapidPrompts: Record<number, string> = {
    1: `What is one thing you already know or believe about ${material.topic.toLowerCase()}?`,
    2: `Give two different sentences using today's language focus without translating from Thai first.`,
    3: `What was the listening mainly about? Start with one sentence before adding detail.`,
    4: `State your position on this question in one clear sentence: ${material.discussionPrompt}`,
    5: `What is the strongest idea from the reading, and why does it matter?`,
    6: `What would you actually say or do in this real-world situation: ${material.technicalTransfer}`,
    7: `What is your thesis for the mastery challenge? Give it before you explain it.`
  };
  const followUps: Record<number, string> = {
    1: "Add one specific detail that makes your example clearer.",
    2: "Say the same idea again with a different structure or chunk.",
    3: "Which detail from the listening best supports your summary, and why?",
    4: "A listener disagrees with you. Acknowledge the objection and respond without restarting.",
    5: "Distinguish what the text explicitly says from what you infer from it.",
    6: "Clarify your recommendation for a person who does not share your technical background.",
    7: "Defend one claim, qualify it, and give one counterexample or limitation."
  };

  return [
    {
      id: `ext-${module.id}-d${dayInModule}-s1`,
      type: "timed-response",
      prompt: `Rapid response: ${rapidPrompts[dayInModule]}`,
      instructionThai: "เริ่มตอบภายใน 3–5 วินาที เป้าหมายคือ retrieval speed ไม่ใช่ประโยคสมบูรณ์แบบทุกคำ",
      targetSkill: "speaking",
      seconds: Math.min(60, Math.max(25, Math.round(target * 0.25))),
      tags: [module.id, "rapid-response", `day-${dayInModule}`]
    },
    {
      id: `ext-${module.id}-d${dayInModule}-s2`,
      type: "speaking-prompt",
      prompt: mainPrompts[dayInModule],
      instructionThai: support,
      targetSkill: "speaking",
      seconds: target,
      minWords: Math.round(target * (module.level.startsWith("A2") ? 1.15 : module.level.startsWith("B1") ? 1.35 : 1.55)),
      modelAnswer: `There is no single correct script. A strong response should fulfill: ${module.communicativeOutcome}. Use relevant examples and at least two useful chunks naturally.`,
      tags: [module.id, "extended-speaking", `day-${dayInModule}`]
    },
    {
      id: `ext-${module.id}-d${dayInModule}-s3`,
      type: "speaking-prompt",
      prompt: `Follow-up pressure: ${followUps[dayInModule]}`,
      targetSkill: "speaking",
      seconds: Math.max(30, Math.round(target * 0.3)),
      modelAnswer: "Answer the follow-up directly, reformulate rather than repeat, and connect the detail back to your main point.",
      tags: [module.id, "interaction", "reformulation", `day-${dayInModule}`]
    }
  ];
}

function readingFor(module: CourseModule, dayInModule: number): ReadingBlock[] {
  const material = moduleMaterials[module.id];
  const advanced = advancedInputs[module.id];
  const text = advanced && (dayInModule >= 5 || module.level.startsWith("C1"))
    ? `${material.readingText}\n\n${advanced.readingExtension}`
    : material.readingText;
  return [{
    id: `ext-${module.id}-d${dayInModule}-read`,
    title: `${material.topic} — comprehension and paraphrase`,
    text,
    questions: [
      {
        id: `ext-${module.id}-d${dayInModule}-r1`,
        type: "multiple-choice",
        prompt: "Which statement best captures the central communicative purpose of this text?",
        targetSkill: "reading",
        choices: [
          { label: module.communicativeOutcome, value: "main" },
          { label: `It is mainly a glossary of isolated terms about ${material.topic.toLowerCase()}.`, value: "glossary" },
          { label: "It claims that context, audience and evidence never affect language choices.", value: "context-free" },
          { label: "It is primarily a fictional story with no practical or analytical point.", value: "fiction" }
        ],
        answer: "main",
        explanationThai: "เลือกจาก thesis/function ของทั้งข้อความ ไม่ใช่ประโยคย่อยที่จำได้เพียงจุดเดียว",
        tags: [module.id, "gist", "objective-reading"]
      },
      {
        id: `ext-${module.id}-d${dayInModule}-r2`,
        type: "paraphrasing",
        prompt: "Choose one important idea from the text and paraphrase it in simpler English.",
        targetSkill: "reading",
        modelAnswer: "A valid answer keeps the original meaning while changing wording and/or structure.",
        tags: [module.id, "paraphrase"]
      },
      {
        id: `ext-${module.id}-d${dayInModule}-r3`,
        type: dayInModule >= 5 ? "summary" : "reading-comprehension",
        prompt: dayInModule >= 5
          ? "Write a 3–5 sentence summary that includes only the ideas needed to understand the argument."
          : "What is one implication of the text for a student, developer, or professional?",
        targetSkill: "reading",
        modelAnswer: "The answer should be supported by the text rather than invented from unrelated background knowledge.",
        tags: [module.id, dayInModule >= 5 ? "summary" : "inference"]
      }
    ]
  }];
}

function writingFor(module: CourseModule, dayInModule: number): Exercise[] {
  const material = moduleMaterials[module.id];
  const words = minWritingWords(module.level, dayInModule);
  const type = module.level.startsWith("C1") || dayInModule === 7 ? "argumentation" : dayInModule >= 5 ? "summary" : "free-writing";
  const prompts: Record<number, string> = {
    1: `Write ${words}–${words + 80} words explaining ${material.topic.toLowerCase()} through one example that is genuinely relevant to your study, programming, work, or daily life. Use at least two module chunks naturally.`,
    2: `Write ${words}–${words + 80} words that deliberately use today's language focus (${module.languageFocus[(dayInModule - 1) % module.languageFocus.length]}). Include one contrast or transformation instead of repeating the same sentence pattern.`,
    3: `Without copying the transcript, write ${words}–${words + 80} words summarizing the listening and adding one short reaction. Separate what you heard from what you think.`,
    4: `Write ${words}–${words + 80} words answering this discussion question: ${material.discussionPrompt}`,
    5: `Write ${words}–${words + 80} words that paraphrase and summarize the reading, then add one supported implication. Do not translate sentence-by-sentence.`,
    6: `Write a real-world response for this transfer task: ${material.technicalTransfer}`,
    7: `Write ${words}–${words + 80} words as a module mastery response. Address the core issue behind “${module.speakingChallenge}”, organize the answer clearly, and include one limitation, trade-off, or counterpoint.`
  };
  return [{
    id: `ext-${module.id}-d${dayInModule}-write1`,
    type,
    prompt: prompts[dayInModule],
    instructionThai: dayInModule < 5
      ? "เขียนให้โครงสร้างชัดก่อน แล้วค่อยตรวจ tense / verb form / collocation รอบที่สอง"
      : "Draft → revise organization → revise language precision. Do not edit every sentence while drafting.",
    targetSkill: "writing",
    minWords: words,
    modelAnswer: `Use the module outcome as the success criterion: ${module.communicativeOutcome}. Include clear organization, relevant evidence/examples, and language appropriate to ${module.level}.`,
    tags: [module.id, "writing", module.languageFocus[0], `day-${dayInModule}`]
  }];
}

function reviewFor(module: CourseModule, dayInModule: number): Exercise[] {
  return [
    {
      id: `ext-${module.id}-d${dayInModule}-rev1`,
      type: "speaking-prompt",
      prompt: `Recall all four useful chunks from this module without looking. Then use two in new sentences.`,
      targetSkill: "speaking",
      seconds: 45,
      modelAnswer: module.activeChunks.join(" · "),
      tags: [module.id, "retrieval"]
    },
    {
      id: `ext-${module.id}-d${dayInModule}-rev2`,
      type: "free-writing",
      prompt: `Write one error you made today, the corrected version, and the pattern you want to remember. If you made no obvious error, write one sentence you found difficult to produce.`,
      targetSkill: "grammarProduction",
      modelAnswer: "Example format: Original → Corrected → Pattern/Chunk.",
      tags: [module.id, "error-bank"]
    }
  ];
}

function exitFor(module: CourseModule, dayInModule: number): Exercise[] {
  const material = moduleMaterials[module.id];
  const target = speakingSeconds(module.level, dayInModule);
  const exitSpeaking: Record<number, string> = {
    1: "Without notes, explain the module topic and use two new chunks naturally.",
    2: "Produce three different sentences with today's target structure, then connect them into one short answer.",
    3: "Give a concise listening takeaway: main point → supporting detail → your reaction.",
    4: "Restate your discussion position more clearly than your first attempt and add one reason.",
    5: "Explain the reading's central claim and one implication without looking back at the text.",
    6: `Give the spoken version of this transfer task: ${material.technicalTransfer}`,
    7: `Mastery speaking gate: ${module.speakingChallenge}`
  };
  const exitWriting: Record<number, string> = {
    1: `In 3–5 sentences, record what you can now explain about ${material.topic.toLowerCase()} and which chunk was hardest to retrieve.`,
    2: "Write one sentence you produced slowly, rewrite it naturally, and name the pattern you need to automate.",
    3: "In 3–5 sentences, separate one fact/detail from the listening from one inference or opinion of your own.",
    4: "Summarize your position and the strongest reason for it in 3–5 sentences.",
    5: "Write a short synthesis: central reading idea + one implication + one question the text leaves open.",
    6: "Write 3–5 sentences explaining what language from this module you could reuse in a real study/work/technical situation.",
    7: `In 3–5 English sentences, explain what evidence from this module shows that you can now fulfill: ${module.communicativeOutcome}`
  };
  const base: Exercise[] = [
    {
      id: `ext-${module.id}-d${dayInModule}-exit1`,
      type: "speaking-prompt",
      prompt: exitSpeaking[dayInModule],
      targetSkill: "speaking",
      seconds: dayInModule === 7 ? target : Math.max(30, Math.round(target * 0.45)),
      modelAnswer: `Evidence target: ${module.masteryGate}`,
      tags: [module.id, "exit-speaking", `day-${dayInModule}`]
    },
    {
      id: `ext-${module.id}-d${dayInModule}-exit2`,
      type: "summary",
      prompt: exitWriting[dayInModule],
      targetSkill: "writing",
      modelAnswer: "Use specific evidence from today's speaking/listening/reading/writing rather than saying only that the lesson was easy or hard.",
      tags: [module.id, "exit-reflection", `day-${dayInModule}`]
    }
  ];
  if (dayInModule === 7) {
    base.push({
      id: `ext-${module.id}-d${dayInModule}-exit3`,
      type: "argumentation",
      prompt: `Module transfer challenge: ${material.technicalTransfer}`,
      targetSkill: "writing",
      minWords: minWritingWords(module.level, 7),
      modelAnswer: `Mastery gate: ${module.masteryGate}`,
      tags: [module.id, "module-gate"]
    });
  }
  return base;
}

function lessonFor(module: CourseModule, moduleIndex: number, dayInModule: number, absoluteDay: number): Lesson {
  const profile = dayProfiles[dayInModule - 1];
  const material = moduleMaterials[module.id];
  const previousId = absoluteDay === 15 ? "day-14" : `ext-day-${absoluteDay - 1}`;
  const productionThreshold = module.level.startsWith("A2") ? 0.78 : module.level.startsWith("B1") ? 0.8 : module.level.startsWith("B2") ? 0.82 : 0.84;
  return {
    id: `ext-day-${absoluteDay}`,
    day: absoluteDay,
    title: `${module.level} · ${module.title} — ${profile.name}`,
    cefrLevel: cefrFor(module),
    stage: stageFor(module.level),
    focus: profile.focus,
    prioritySkill: profile.priority,
    objectives: [
      module.communicativeOutcome,
      `Use ${module.languageFocus.join(", ")} in production rather than recognition only.`,
      `Retrieve and use these chunks naturally: ${module.activeChunks.join(" · ")}`,
      dayInModule === 7 ? `Demonstrate the module mastery gate: ${module.masteryGate}` : `Transfer the language to ${material.topic.toLowerCase()}.`
    ],
    estimatedMinutes: profile.minutes,
    warmup: warmupFor(module, dayInModule),
    vocabulary: vocabularyFor(module, moduleIndex, dayInModule),
    grammar: grammarFor(module, dayInModule),
    listening: listeningFor(module, dayInModule),
    speaking: speakingFor(module, dayInModule),
    reading: readingFor(module, dayInModule),
    writing: writingFor(module, dayInModule),
    review: reviewFor(module, dayInModule),
    exitCheck: exitFor(module, dayInModule),
    realWorldMission: dayInModule === 6 ? material.realWorldMission : dayInModule === 7 ? `Complete the module gate and compare your performance with Day ${absoluteDay - 6}.` : undefined,
    prerequisites: [previousId],
    masteryCriteria: {
      minimumAccuracy: module.level.startsWith("C1") ? 0.82 : module.level.startsWith("B2") ? 0.8 : 0.76,
      minimumProductionAccuracy: productionThreshold,
      maximumResponseSeconds: module.level.startsWith("A2") ? 5 : module.level.startsWith("B1") ? 5 : 4,
      speakingSeconds: speakingSeconds(module.level, dayInModule),
      notes: [
        `Module gate: ${module.masteryGate}`,
        "Do not advance because of time spent alone; use performance evidence and recurring-error trends.",
        dayInModule === 7 ? "If the module gate is weak, repeat targeted production/listening tasks before continuing." : "Today's errors should feed the Error Bank and later retrieval."
      ]
    }
  };
}

export const extendedLessons: Lesson[] = extendedModules.flatMap((module, moduleIndex) => {
  const startDay = 15 + moduleIndex * 7;
  return Array.from({ length: 7 }, (_, index) => lessonFor(module, moduleIndex, index + 1, startDay + index));
});

export const extendedLessonCount = extendedLessons.length;
export const finalCourseDay = extendedLessons.at(-1)?.day ?? 14;
