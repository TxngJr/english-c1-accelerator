import type { Exercise, Lesson, VocabularyItem } from "@/lib/types";

const v = (
  id: string,
  wordOrChunk: string,
  meaningThai: string,
  definitionEnglish: string,
  examples: string[],
  collocations: string[] = [],
  commonMistakes: string[] = []
): VocabularyItem => ({
  id,
  wordOrChunk,
  meaningThai,
  definitionEnglish,
  level: "A1+",
  examples,
  collocations,
  commonMistakes,
});

const e = (exercise: Exercise): Exercise => exercise;

export const lessons: Lesson[] = [
  {
    id: "day-1",
    day: 1,
    title: "Build Your First Automatic English Sentences",
    cefrLevel: "A1+",
    stage: "Foundation Rebuild",
    focus: "High-frequency self-introduction patterns",
    prioritySkill: "speaking",
    objectives: [
      "Say 8 useful self-introduction patterns without translating word by word",
      "Use I am / I study / I like / I'm interested in / I want to / I need to / I can / I usually",
      "Correct three known personal error patterns",
      "Introduce yourself for 15–20 seconds"
    ],
    estimatedMinutes: 145,
    warmup: [{
      id: "d1-warmup",
      kind: "retrieval",
      title: "Say what you already know",
      estimatedMinutes: 8,
      instructionsThai: "ตอบออกเสียงก่อนดูตัวอย่าง ไม่ต้องกลัวผิด เป้าหมายคือดึงภาษาอังกฤษออกจากความจำ",
      examples: ["My name is ...", "I study ...", "I like ..."],
      exercises: [
        e({ id:"d1-w1", type:"timed-response", prompt:"What do you study?", instructionThai:"เริ่มตอบภายใน 5 วินาที", targetSkill:"speaking", seconds:5, modelAnswer:"I study computer engineering." }),
        e({ id:"d1-w2", type:"timed-response", prompt:"What are you interested in?", instructionThai:"ตอบ 1 ประโยค", targetSkill:"speaking", seconds:7, modelAnswer:"I'm interested in programming." }),
        e({ id:"d1-w3", type:"timed-response", prompt:"Why do you want to improve your English?", targetSkill:"speaking", seconds:10, modelAnswer:"I want to improve my English because I want to communicate confidently." })
      ]
    }],
    vocabulary: [
      v("d1-v1","I'm interested in ...","ฉันสนใจ...","Use this to talk about interests.",["I'm interested in programming.","I'm interested in reading manga."],["be interested in + noun","be interested in + -ing"],["I interest about...","I interested in..."]),
      v("d1-v2","I want to ...","ฉันอยากจะ...","Use this for goals and desires.",["I want to speak English fluently.","I want to understand technical videos."],["want to learn","want to improve","want to build"],["I want speak..."]),
      v("d1-v3","I need to ...","ฉันจำเป็นต้อง...","Use this for something necessary.",["I need to finish my assignment.","I need to practice speaking every day."],["need to practice","need to finish","need to check"],["I need practice..."]),
      v("d1-v4","I usually ...","ปกติฉัน...","Use this for a normal routine.",["I usually study at night.","I usually work on programming projects after class."],["usually study","usually work","usually play"],["I am usually study..."]),
      v("d1-v5","I work on ...","ฉันทำ/กำลังทำ...","Use this for projects or tasks you spend time developing.",["I work on web applications.","I work on university projects."],["work on a project","work on an app","work on an assignment"],["I do a programming language."]),
      v("d1-v6","improve my English","พัฒนาภาษาอังกฤษของฉัน","A natural goal phrase.",["I'm trying to improve my English.","I practice every day to improve my English."],["improve my speaking","improve my listening"],["learn an English"])
    ],
    grammar: [{
      id:"d1-grammar",
      kind:"grammar",
      title:"One strong base: Subject + verb + useful information",
      estimatedMinutes:25,
      explanationThai:"ภาษาอังกฤษพื้นฐานมักเริ่มจาก Subject + Verb ก่อน แล้วค่อยเติมข้อมูล อย่าแปลไทยทีละคำ ให้จำเป็น pattern เช่น I study..., I like..., I want to...",
      examples:[
        "I study at university.",
        "I like reading manga.",
        "I'm interested in programming.",
        "I want to improve my English.",
        "I can write code."
      ],
      exercises:[
        e({id:"d1-g1",type:"sentence-reorder",prompt:"Reorder: interested / I'm / programming / in",answer:"I'm interested in programming.",targetSkill:"grammarProduction",explanationThai:"ใช้ be interested in + noun/-ing",pattern:"I'm interested in + noun / -ing"}),
        e({id:"d1-g2",type:"error-correction",prompt:"Correct: I interests about reads manga.",answer:"I'm interested in reading manga.",targetSkill:"grammarProduction",explanationThai:"interested เป็น adjective ต้องใช้ am และตามด้วย in + reading",pattern:"be interested in + -ing"}),
        e({id:"d1-g3",type:"error-correction",prompt:"Correct naturally: I try to learing an english.",acceptedAnswers:["I'm learning English.","I'm trying to improve my English."],targetSkill:"grammarProduction",explanationThai:"English ไม่ใช้ an และหลัง try to ใช้ base verb; ในบริบทนี้ improve my English เป็นธรรมชาติกว่า"}),
        e({id:"d1-g4",type:"thai-to-english",prompt:"ฉันเขียนโค้ดได้",answer:"I can write code.",targetSkill:"grammarProduction",pattern:"I can + base verb"}),
        e({id:"d1-g5",type:"thai-to-english",prompt:"ปกติฉันทำโปรเจกต์เขียนโปรแกรมตอนกลางคืน",acceptedAnswers:["I usually work on programming projects at night.","I usually work on my programming projects at night."],targetSkill:"grammarProduction"})
      ]
    }],
    listening: [{
      id:"d1-listen",
      title:"Meet Niran",
      script:"Hi, I'm Niran. I study computer engineering at university. I'm interested in software development and artificial intelligence. I usually work on small programming projects after class. I also like reading manga and playing games. I'm learning English because I want to understand more technical content and communicate with people from other countries.",
      firstListenQuestion:"What is the speaker mainly talking about?",
      detailQuestions:[
        e({id:"d1-l1",type:"listening-comprehension",prompt:"What does Niran study?",answer:"computer engineering",targetSkill:"listening"}),
        e({id:"d1-l2",type:"listening-comprehension",prompt:"When does he usually work on programming projects?",answer:"after class",targetSkill:"listening"}),
        e({id:"d1-l3",type:"listening-comprehension",prompt:"Why is he learning English?",acceptedAnswers:["to understand more technical content and communicate with people from other countries","to understand technical content and communicate with people from other countries"],targetSkill:"listening"})
      ],
      connectedSpeechNotes:["I'm → /aɪm/","want to may sound like 'wanna' in informal speech, but keep 'want to' in formal writing","and I can link smoothly: 'and-I'"]
    }],
    speaking:[
      e({id:"d1-s1",type:"shadowing",prompt:"Shadow: I'm interested in programming.",targetSkill:"pronunciation",modelAnswer:"I'm interested in programming."}),
      e({id:"d1-s2",type:"speaking-prompt",prompt:"Complete and say 4 times with new information: I like ____.",targetSkill:"speaking",modelAnswer:"I like reading manga."}),
      e({id:"d1-s3",type:"timed-response",prompt:"What do you study and what are you interested in?",instructionThai:"ตอบ 2 ประโยค เริ่มใน 5 วินาที",targetSkill:"speaking",seconds:10,modelAnswer:"I study computer engineering. I'm interested in software development."}),
      e({id:"d1-s4",type:"speaking-prompt",prompt:"Introduce yourself for 10 seconds.",targetSkill:"speaking",seconds:10,modelAnswer:"Hi, I'm ___. I study ___. I'm interested in programming and I like reading manga."}),
      e({id:"d1-s5",type:"speaking-prompt",prompt:"Final challenge: Introduce yourself for 15–20 seconds without reading a script.",instructionThai:"พูดให้จบก่อน แล้วค่อยตรวจ 1–3 จุดสำคัญ",targetSkill:"speaking",seconds:20,minWords:25,modelAnswer:"Hi, I'm ___. I study computer engineering. I'm interested in programming and AI. I like reading manga and playing games. I want to improve my English because I want to communicate confidently."})
    ],
    reading:[{
      id:"d1-read",
      title:"A Student Who Builds Things",
      text:"Mek is a university student. He studies technology and enjoys building small web applications. He does not use English very much in daily life yet, but he reads short documentation when he needs to solve a programming problem. He wants to become more comfortable speaking because he hopes to work with international teams in the future.",
      questions:[
        e({id:"d1-r1",type:"reading-comprehension",prompt:"Why does Mek read documentation?",answer:"to solve a programming problem",targetSkill:"reading"}),
        e({id:"d1-r2",type:"reading-comprehension",prompt:"What is his future goal?",acceptedAnswers:["to work with international teams","work with international teams"],targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d1-write1",type:"free-writing",prompt:"Write 6 true sentences about yourself. Use at least 4 target patterns from today.",instructionThai:"พยายามเขียนเองก่อนดู model",targetSkill:"writing",minWords:35,modelAnswer:"I study computer engineering. I'm interested in programming. I like reading manga. I want to improve my English. I can write code. I usually work on projects at night."})
    ],
    review:[
      e({id:"d1-rev1",type:"thai-to-english",prompt:"ฉันสนใจการเขียนโปรแกรม",answer:"I'm interested in programming.",targetSkill:"grammarProduction"}),
      e({id:"d1-rev2",type:"error-correction",prompt:"Correct: I am usually play games at night.",answer:"I usually play games at night.",targetSkill:"grammarProduction"}),
      e({id:"d1-rev3",type:"timed-response",prompt:"Say three true sentences about yourself.",targetSkill:"speaking",seconds:15})
    ],
    exitCheck:[
      e({id:"d1-exit1",type:"speaking-prompt",prompt:"Introduce yourself for 15–20 seconds with no Thai.",targetSkill:"speaking",seconds:20,minWords:25}),
      e({id:"d1-exit2",type:"thai-to-english",prompt:"ฉันอยากพูดภาษาอังกฤษให้คล่อง",answer:"I want to speak English fluently.",targetSkill:"grammarProduction"})
    ],
    realWorldMission:"Change one app interface to English and say aloud three sentences about what you see.",
    prerequisites:[],
    masteryCriteria:{minimumAccuracy:0.8,minimumProductionAccuracy:0.75,maximumResponseSeconds:7,speakingSeconds:15,notes:["Can use at least six target patterns","Does not repeat known Day 1 errors","Starts speaking within 5–7 seconds"]}
  },

  {
    id:"day-2",
    day:2,
    title:"Be, Do, Have — Stop Mixing the Core Verbs",
    cefrLevel:"A1+",
    stage:"Foundation Rebuild",
    focus:"Core auxiliary and lexical verb control",
    prioritySkill:"speaking",
    objectives:[
      "Choose be, do, or have based on meaning",
      "Avoid forms like 'I am go to school'",
      "Produce simple present sentences quickly",
      "Speak for 15–20 seconds about a normal day"
    ],
    estimatedMinutes:150,
    warmup:[{
      id:"d2-warmup",kind:"retrieval",title:"Day 1 retrieval without notes",estimatedMinutes:8,
      instructionsThai:"พูด 5 ประโยคเกี่ยวกับตัวเองจาก pattern เมื่อวาน",
      exercises:[
        e({id:"d2-w1",type:"timed-response",prompt:"I'm interested in ...",targetSkill:"speaking",seconds:5}),
        e({id:"d2-w2",type:"timed-response",prompt:"I usually ...",targetSkill:"speaking",seconds:5}),
        e({id:"d2-w3",type:"timed-response",prompt:"I want to ...",targetSkill:"speaking",seconds:5})
      ]
    }],
    vocabulary:[
      v("d2-v1","be tired","เหนื่อย","Use be + adjective for a state.",["I'm tired after class.","She's tired today."],["be tired","feel tired"],["I tired"]),
      v("d2-v2","have class","มีเรียน","A natural phrase for scheduled class.",["I have class at nine.","I have two classes today."],["have class","have a meeting","have time"],["I am have class"]),
      v("d2-v3","do homework","ทำการบ้าน","Use do with homework/tasks.",["I do my homework after dinner.","I need to do an assignment."],["do homework","do an assignment","do exercise"],["make homework"]),
      v("d2-v4","go to class","ไปเรียน","Movement to a class.",["I go to class in the morning.","I usually go to class by train."],["go to class","go to university"],["I am go to class"]),
      v("d2-v5","have time","มีเวลา","Use have for possession/availability.",["I have time tonight.","I don't have much time today."],["have enough time","have free time"])
    ],
    grammar:[{
      id:"d2-grammar",kind:"grammar",title:"Three core systems",estimatedMinutes:30,
      explanationThai:"จำความหมายก่อนรูป: be = เป็น/อยู่/สภาพ, have = มี, do = ทำ (และช่วยสร้างคำถาม/ปฏิเสธใน Present Simple). ถ้ามีกริยาหลักอย่าง go/study/play ปกติไม่ใส่ am นำหน้า",
      examples:["I am tired.","I have class.","I do my homework.","I go to university.","I study programming."],
      exercises:[
        e({id:"d2-g1",type:"multiple-choice",prompt:"Choose: I ___ tired after class.",choices:[{label:"am",value:"am"},{label:"do",value:"do"},{label:"have",value:"have"}],answer:"am",targetSkill:"grammarRecognition"}),
        e({id:"d2-g2",type:"error-correction",prompt:"Correct: I am go to school every day.",answer:"I go to school every day.",targetSkill:"grammarProduction",explanationThai:"go เป็น main verb ของ Present Simple จึงไม่ใช้ am"}),
        e({id:"d2-g3",type:"thai-to-english",prompt:"วันนี้ฉันมีเรียนสองคาบ",acceptedAnswers:["I have two classes today.","I have two classes today"],targetSkill:"grammarProduction"}),
        e({id:"d2-g4",type:"thai-to-english",prompt:"ฉันทำการบ้านหลังอาหารเย็น",answer:"I do my homework after dinner.",targetSkill:"grammarProduction"}),
        e({id:"d2-g5",type:"build-sentence",prompt:"Build a sentence: usually / I / class / have / at 9",answer:"I usually have class at 9.",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d2-listen",title:"A Busy Morning",
      script:"On weekdays, I get up at seven. I have class at nine, so I usually leave home before eight. I am often sleepy in the morning, but I feel better after breakfast. I go to university by train. After class, I have lunch with my friends and then I do my homework in the library.",
      firstListenQuestion:"Is the speaker describing a normal weekday or a special event?",
      detailQuestions:[
        e({id:"d2-l1",type:"listening-comprehension",prompt:"What time does the speaker have class?",answer:"nine",targetSkill:"listening"}),
        e({id:"d2-l2",type:"listening-comprehension",prompt:"How does the speaker go to university?",answer:"by train",targetSkill:"listening"}),
        e({id:"d2-l3",type:"listening-comprehension",prompt:"Where does the speaker do homework?",answer:"in the library",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["get up links: ge-tup","have class: stress usually falls on class","and then often reduces in fast speech"]
    }],
    speaking:[
      e({id:"d2-s1",type:"sentence-transformation",prompt:"Change the meaning: 'I am tired.' → possession with time.",targetSkill:"speaking",modelAnswer:"I have time."}),
      e({id:"d2-s2",type:"timed-response",prompt:"What do you do after class?",targetSkill:"speaking",seconds:5,modelAnswer:"I usually do my homework or work on a project."}),
      e({id:"d2-s3",type:"timed-response",prompt:"What do you have today?",targetSkill:"speaking",seconds:5,modelAnswer:"I have two classes and one assignment."}),
      e({id:"d2-s4",type:"speaking-prompt",prompt:"Describe your normal morning for 15–20 seconds.",targetSkill:"speaking",seconds:20,minWords:25,modelAnswer:"I usually get up at ___. I have class at ___. I go to university by ___. I am sometimes tired in the morning, but I usually feel better after breakfast."})
    ],
    reading:[{
      id:"d2-read",title:"Why Basic Verbs Matter",
      text:"Small verbs are easy to ignore, but they control many English sentences. We use be to describe states and identities, have for possession and experiences, and do for actions such as homework. We also use do as a helper in many present-simple questions and negatives. Automatic control of these verbs makes speaking much faster.",
      questions:[
        e({id:"d2-r1",type:"reading-comprehension",prompt:"What does 'be' often describe?",acceptedAnswers:["states and identities","states","identities"],targetSkill:"reading"}),
        e({id:"d2-r2",type:"reading-comprehension",prompt:"Why are these verbs important for speaking?",acceptedAnswers:["they make speaking faster","automatic control makes speaking faster"],targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d2-write",type:"free-writing",prompt:"Write 8 sentences about your weekday. Include at least two examples of be, two of have, and two main action verbs.",targetSkill:"writing",minWords:55})
    ],
    review:[
      e({id:"d2-rev1",type:"error-correction",prompt:"Correct: I am have class today.",answer:"I have class today.",targetSkill:"grammarProduction"}),
      e({id:"d2-rev2",type:"error-correction",prompt:"Correct: I am study programming.",answer:"I study programming.",targetSkill:"grammarProduction"}),
      e({id:"d2-rev3",type:"timed-response",prompt:"Say one sentence with be, one with have, and one with an action verb.",targetSkill:"speaking",seconds:15})
    ],
    exitCheck:[
      e({id:"d2-exit1",type:"thai-to-english",prompt:"ปกติฉันมีเรียนตอนเช้าและทำการบ้านตอนเย็น",answer:"I usually have class in the morning and do my homework in the evening.",targetSkill:"grammarProduction"}),
      e({id:"d2-exit2",type:"speaking-prompt",prompt:"Describe your normal morning for 20 seconds.",targetSkill:"speaking",seconds:20,minWords:25})
    ],
    realWorldMission:"Narrate your next five actions in simple English: I open..., I check..., I go..., I have..., I do....",
    prerequisites:["day-1"],
    masteryCriteria:{minimumAccuracy:0.82,minimumProductionAccuracy:0.78,maximumResponseSeconds:6,speakingSeconds:20,notes:["No recurring 'I am + base verb' error","Can distinguish be/have/action verb in production"]}
  },

  {
    id:"day-3",
    day:3,
    title:"Present Simple for Real Life",
    cefrLevel:"A1+",
    stage:"Foundation Rebuild",
    focus:"Routines, interests, study and programming",
    prioritySkill:"speaking",
    objectives:[
      "Use Present Simple for routines and facts",
      "Use third-person -s in controlled production",
      "Talk about interests naturally",
      "Speak for 20 seconds about study and free time"
    ],
    estimatedMinutes:155,
    warmup:[{
      id:"d3-warmup",kind:"retrieval",title:"Fast core-verb retrieval",estimatedMinutes:8,
      exercises:[
        e({id:"d3-w1",type:"timed-response",prompt:"Say one sentence with 'I have...'",targetSkill:"speaking",seconds:5}),
        e({id:"d3-w2",type:"timed-response",prompt:"Say one sentence with 'I go...'",targetSkill:"speaking",seconds:5}),
        e({id:"d3-w3",type:"timed-response",prompt:"Say one sentence with 'I'm interested in...'",targetSkill:"speaking",seconds:5})
      ]
    }],
    vocabulary:[
      v("d3-v1","spend time + -ing","ใช้เวลาไปกับ...","Talk about how you use your time.",["I spend time coding after class.","I spend a lot of time reading documentation."],["spend time coding","spend time studying"],["spend time to code"]),
      v("d3-v2","practice + -ing","ฝึก...","Use practice with a noun or -ing form.",["I practice speaking every day.","I practice writing short messages."],["practice speaking","practice coding"],["practice to speak"]),
      v("d3-v3","solve a problem","แก้ปัญหา","Find a solution to a problem.",["I use documentation to solve problems.","My friend solves coding problems quickly."],["solve a problem","solve an issue"],["fix a problem is also natural but slightly different"]),
      v("d3-v4","work with","ทำงานกับ","Use tools, people, or technologies.",["I work with TypeScript.","She works with a small team."],["work with a team","work with data","work with React"]),
      v("d3-v5","in my free time","ในเวลาว่าง","A natural time phrase.",["I read manga in my free time.","I play games in my free time."])
    ],
    grammar:[{
      id:"d3-grammar",kind:"grammar",title:"Present Simple = routine, fact, repeated behavior",estimatedMinutes:28,
      explanationThai:"ใช้ Present Simple เมื่อพูดถึงสิ่งที่ทำเป็นประจำ ข้อเท็จจริง หรือความชอบ สำหรับ he/she/it เติม -s/-es ที่กริยา เช่น He studies, She works.",
      examples:["I study computer engineering.","I practice English every day.","My friend studies software engineering.","She works with Python.","He watches technical videos."],
      exercises:[
        e({id:"d3-g1",type:"fill-blank",prompt:"My friend ___ (study) computer engineering.",answer:"studies",targetSkill:"grammarProduction"}),
        e({id:"d3-g2",type:"fill-blank",prompt:"She ___ (work) with Python.",answer:"works",targetSkill:"grammarProduction"}),
        e({id:"d3-g3",type:"error-correction",prompt:"Correct: He study programming every day.",answer:"He studies programming every day.",targetSkill:"grammarProduction"}),
        e({id:"d3-g4",type:"thai-to-english",prompt:"ฉันฝึกพูดภาษาอังกฤษทุกวัน",answer:"I practice speaking English every day.",targetSkill:"grammarProduction"}),
        e({id:"d3-g5",type:"thai-to-english",prompt:"เพื่อนของฉันชอบเล่นเกม",answer:"My friend likes playing games.",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d3-listen",title:"Two Different Students",
      script:"I study computer engineering, and my friend Beam studies design. I spend a lot of time coding, but Beam spends more time drawing and working with visual tools. We both like technology. I usually read documentation when I have a problem. Beam usually watches short tutorials. In our free time, we both play games.",
      firstListenQuestion:"What is the main difference between the two students?",
      detailQuestions:[
        e({id:"d3-l1",type:"listening-comprehension",prompt:"What does the speaker study?",answer:"computer engineering",targetSkill:"listening"}),
        e({id:"d3-l2",type:"listening-comprehension",prompt:"What does Beam usually watch?",acceptedAnswers:["short tutorials","tutorials"],targetSkill:"listening"}),
        e({id:"d3-l3",type:"listening-comprehension",prompt:"What do both students do in their free time?",answer:"play games",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["studies ends with /z/ sound","spends ends with /z/","both like: keep the final /θ/ clear before /l/"]
    }],
    speaking:[
      e({id:"d3-s1",type:"speaking-prompt",prompt:"Say 5 true Present Simple sentences about your week.",targetSkill:"speaking"}),
      e({id:"d3-s2",type:"sentence-transformation",prompt:"Change 'I study programming.' to 'my friend'.",answer:"My friend studies programming.",targetSkill:"speaking"}),
      e({id:"d3-s3",type:"timed-response",prompt:"What do you usually do when you have a programming problem?",targetSkill:"speaking",seconds:5,modelAnswer:"I usually search for documentation or ask an AI assistant."}),
      e({id:"d3-s4",type:"speaking-prompt",prompt:"Talk for 20 seconds about what you study, what you practice, and what you do in your free time.",targetSkill:"speaking",seconds:20,minWords:30})
    ],
    reading:[{
      id:"d3-read",title:"A Simple Development Routine",
      text:"Ton builds small web projects after class. He usually starts by writing a short task list. Then he opens his editor and works on one feature at a time. When he finds an error, he reads the message carefully and searches the documentation. He does not always understand every English word, but he tries to identify the important terms first.",
      questions:[
        e({id:"d3-r1",type:"reading-comprehension",prompt:"What does Ton do before coding?",answer:"writes a short task list",targetSkill:"reading"}),
        e({id:"d3-r2",type:"reading-comprehension",prompt:"What does he do when he finds an error?",acceptedAnswers:["reads the message and searches the documentation","he reads the message carefully and searches the documentation"],targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d3-write",type:"free-writing",prompt:"Write a 70–90 word paragraph called 'My normal week'. Use usually, often or sometimes and one sentence about programming/IT.",targetSkill:"writing",minWords:70})
    ],
    review:[
      e({id:"d3-rev1",type:"fill-blank",prompt:"He ___ (read) documentation every day.",answer:"reads",targetSkill:"grammarProduction"}),
      e({id:"d3-rev2",type:"error-correction",prompt:"Correct: I practice to speaking English.",answer:"I practice speaking English.",targetSkill:"grammarProduction"}),
      e({id:"d3-rev3",type:"timed-response",prompt:"What do you do in your free time?",targetSkill:"speaking",seconds:5})
    ],
    exitCheck:[
      e({id:"d3-exit1",type:"speaking-prompt",prompt:"Talk about your study routine and free time for 20 seconds.",targetSkill:"speaking",seconds:20,minWords:30}),
      e({id:"d3-exit2",type:"sentence-transformation",prompt:"I work with JavaScript. → She ...",answer:"She works with JavaScript.",targetSkill:"grammarProduction"})
    ],
    realWorldMission:"Search one real programming question in English. Read the first useful result and say the main idea in one English sentence.",
    prerequisites:["day-2"],
    masteryCriteria:{minimumAccuracy:0.82,minimumProductionAccuracy:0.8,maximumResponseSeconds:5,speakingSeconds:20,notes:["Uses Present Simple for routine","Produces third-person -s in controlled tasks"]}
  },

  {
    id:"day-4",
    day:4,
    title:"Negatives Without Hesitation",
    cefrLevel:"A1+",
    stage:"Foundation Rebuild",
    focus:"don't / doesn't / isn't / aren't / can't",
    prioritySkill:"speaking",
    objectives:[
      "Build negative sentences with be, Present Simple, and can",
      "Avoid double verb errors",
      "Contrast what you do and do not do",
      "Respond to simple questions with complete negative answers"
    ],
    estimatedMinutes:145,
    warmup:[{
      id:"d4-warmup",kind:"retrieval",title:"Present Simple speed round",estimatedMinutes:8,
      exercises:[
        e({id:"d4-w1",type:"timed-response",prompt:"Say one routine you do every day.",targetSkill:"speaking",seconds:5}),
        e({id:"d4-w2",type:"timed-response",prompt:"Say one thing your friend does.",targetSkill:"speaking",seconds:5})
      ]
    }],
    vocabulary:[
      v("d4-v1","I don't usually ...","ปกติฉันไม่...","Natural negative routine phrase.",["I don't usually study in the morning.","I don't usually watch videos without subtitles."]),
      v("d4-v2","I can't ... yet","ฉันยัง...ไม่ได้","Useful for current limitations with a growth mindset.",["I can't speak for three minutes yet.","I can't understand fast speech yet."],["can't do it yet","can't understand it yet"]),
      v("d4-v3","not very often","ไม่บ่อยมาก","A softer frequency expression.",["I don't play games very often.","I don't travel very often."]),
      v("d4-v4","I don't need to ...","ฉันไม่จำเป็นต้อง...","Negative necessity.",["I don't need to translate every word.","I don't need to finish it today."])
    ],
    grammar:[{
      id:"d4-grammar",kind:"grammar",title:"Choose the negative helper",estimatedMinutes:28,
      explanationThai:"be ใช้ not ตรงๆ: I'm not / isn't / aren't. กริยาทั่วไปใช้ don't/doesn't + base verb. can ใช้ can't + base verb. หลัง doesn't กริยากลับเป็นรูป base: doesn't work ไม่ใช่ doesn't works.",
      examples:["I'm not tired.","I don't study in the morning.","He doesn't use Python.","I can't understand everything yet.","We aren't late."],
      exercises:[
        e({id:"d4-g1",type:"error-correction",prompt:"Correct: I don't am tired.",answer:"I'm not tired.",targetSkill:"grammarProduction"}),
        e({id:"d4-g2",type:"error-correction",prompt:"Correct: He doesn't studies at night.",answer:"He doesn't study at night.",targetSkill:"grammarProduction"}),
        e({id:"d4-g3",type:"thai-to-english",prompt:"ปกติฉันไม่ดูวิดีโอภาษาอังกฤษโดยไม่มีซับ",answer:"I don't usually watch English videos without subtitles.",targetSkill:"grammarProduction"}),
        e({id:"d4-g4",type:"thai-to-english",prompt:"ฉันยังพูดได้ไม่คล่อง",acceptedAnswers:["I can't speak fluently yet.","I can't speak English fluently yet."],targetSkill:"grammarProduction"}),
        e({id:"d4-g5",type:"fill-blank",prompt:"She ___ use Java. (negative)",answer:"doesn't",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d4-listen",title:"What I Don't Do",
      script:"I use English more than I did before, but I still have limits. I don't usually speak English with people in daily life, and I can't follow very fast conversations yet. I don't translate every sentence when I read, because that makes me too slow. I try to find the main idea first. I also don't study grammar for hours. I practice short patterns and then use them.",
      firstListenQuestion:"Is the speaker describing strengths, limitations, or both?",
      detailQuestions:[
        e({id:"d4-l1",type:"listening-comprehension",prompt:"What can't the speaker follow yet?",answer:"very fast conversations",targetSkill:"listening"}),
        e({id:"d4-l2",type:"listening-comprehension",prompt:"Why doesn't the speaker translate every sentence?",acceptedAnswers:["because it makes the speaker too slow","because that makes me too slow"],targetSkill:"listening"}),
        e({id:"d4-l3",type:"listening-comprehension",prompt:"What does the speaker do after practicing short patterns?",answer:"use them",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["don't usually often links smoothly","can't in natural speech may have a weak final /t/ but vowel contrast still matters","doesn't + base verb"]
    }],
    speaking:[
      e({id:"d4-s1",type:"speaking-prompt",prompt:"Say 3 things you do and 3 things you don't usually do.",targetSkill:"speaking"}),
      e({id:"d4-s2",type:"timed-response",prompt:"Can you understand fast English?",targetSkill:"speaking",seconds:5,modelAnswer:"Not always. I can't understand very fast English yet, but I can understand more with subtitles."}),
      e({id:"d4-s3",type:"speaking-prompt",prompt:"Talk for 20 seconds about your current English strengths and limitations.",targetSkill:"speaking",seconds:20,minWords:30})
    ],
    reading:[{
      id:"d4-read",title:"Do Less Translation",
      text:"Beginning learners often believe they need to translate every sentence. This can help sometimes, but constant translation slows reading and speaking. A better strategy is to notice familiar chunks, identify the main idea, and only check words that block understanding. You do not need perfect comprehension to learn from a text.",
      questions:[
        e({id:"d4-r1",type:"reading-comprehension",prompt:"What problem can constant translation cause?",answer:"it slows reading and speaking",targetSkill:"reading"}),
        e({id:"d4-r2",type:"reading-comprehension",prompt:"What should you check?",acceptedAnswers:["words that block understanding","only words that block understanding"],targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d4-write",type:"free-writing",prompt:"Write 8 contrast sentences: four things you do/can and four things you don't/can't yet.",targetSkill:"writing",minWords:55})
    ],
    review:[
      e({id:"d4-rev1",type:"error-correction",prompt:"Correct: She don't like debugging.",answer:"She doesn't like debugging.",targetSkill:"grammarProduction"}),
      e({id:"d4-rev2",type:"error-correction",prompt:"Correct: He doesn't works on weekends.",answer:"He doesn't work on weekends.",targetSkill:"grammarProduction"}),
      e({id:"d4-rev3",type:"timed-response",prompt:"Say one thing you can't do yet but want to do.",targetSkill:"speaking",seconds:7})
    ],
    exitCheck:[
      e({id:"d4-exit1",type:"speaking-prompt",prompt:"Describe three things you do and three things you don't do in a normal week.",targetSkill:"speaking",seconds:25,minWords:35}),
      e({id:"d4-exit2",type:"thai-to-english",prompt:"เขาไม่ใช้ Python",answer:"He doesn't use Python.",targetSkill:"grammarProduction"})
    ],
    realWorldMission:"For five minutes, notice actions you are NOT doing and say three negative English sentences aloud.",
    prerequisites:["day-3"],
    masteryCriteria:{minimumAccuracy:0.82,minimumProductionAccuracy:0.8,maximumResponseSeconds:5,speakingSeconds:20,notes:["Chooses be/do/can negatives correctly","No 'doesn't + -s' error in controlled production"]}
  },

  {
    id:"day-5",
    day:5,
    title:"Questions That Keep a Conversation Alive",
    cefrLevel:"A1+",
    stage:"Foundation Rebuild",
    focus:"Do / Are / Can + WH questions",
    prioritySkill:"speaking",
    objectives:[
      "Ask basic yes/no and WH questions",
      "Choose Do, Are, or Can correctly",
      "Use follow-up questions",
      "Complete a short guided conversation"
    ],
    estimatedMinutes:155,
    warmup:[{
      id:"d5-warmup",kind:"retrieval",title:"Turn statements into questions",estimatedMinutes:10,
      exercises:[
        e({id:"d5-w1",type:"sentence-transformation",prompt:"You study programming. → question",answer:"Do you study programming?",targetSkill:"grammarProduction"}),
        e({id:"d5-w2",type:"sentence-transformation",prompt:"You are tired. → question",answer:"Are you tired?",targetSkill:"grammarProduction"}),
        e({id:"d5-w3",type:"sentence-transformation",prompt:"You can code. → question",answer:"Can you code?",targetSkill:"grammarProduction"})
      ]
    }],
    vocabulary:[
      v("d5-v1","What do you ...?","คุณ...อะไร","Ask about an action or routine.",["What do you study?","What do you do after class?"]),
      v("d5-v2","Why do you ...?","ทำไมคุณถึง...","Ask for a reason.",["Why do you learn English?","Why do you use this framework?"]),
      v("d5-v3","How often do you ...?","คุณ...บ่อยแค่ไหน","Ask about frequency.",["How often do you practice speaking?","How often do you play games?"]),
      v("d5-v4","What about you?","แล้วคุณล่ะ","Simple follow-up to return a question.",["I like action games. What about you?"]),
      v("d5-v5","Could you say that again?","พูดอีกครั้งได้ไหม","Useful clarification request.",["Sorry, could you say that again?"])
    ],
    grammar:[{
      id:"d5-grammar",kind:"grammar",title:"Question frame first",estimatedMinutes:30,
      explanationThai:"อย่าคิดทั้งประโยคพร้อมกัน ให้เลือก frame ก่อน: Do you + verb? / Are you + adjective/noun? / Can you + verb? แล้ว WH-word วางหน้า เช่น What do you study? Why are you tired?",
      examples:["Do you study programming?","Are you interested in AI?","Can you explain your project?","What do you do after class?","Why do you want to improve your English?"],
      exercises:[
        e({id:"d5-g1",type:"multiple-choice",prompt:"___ you interested in AI?",choices:[{label:"Do",value:"Do"},{label:"Are",value:"Are"},{label:"Can",value:"Can"}],answer:"Are",targetSkill:"grammarRecognition"}),
        e({id:"d5-g2",type:"sentence-reorder",prompt:"Reorder: do / what / study / you ?",answer:"What do you study?",targetSkill:"grammarProduction"}),
        e({id:"d5-g3",type:"error-correction",prompt:"Correct: What you do after class?",answer:"What do you do after class?",targetSkill:"grammarProduction"}),
        e({id:"d5-g4",type:"thai-to-english",prompt:"ทำไมคุณถึงอยากพัฒนาภาษาอังกฤษ",answer:"Why do you want to improve your English?",targetSkill:"grammarProduction"}),
        e({id:"d5-g5",type:"thai-to-english",prompt:"คุณเขียนโค้ดได้ไหม",answer:"Can you write code?",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d5-listen",title:"A Short Student Conversation",
      script:"A: What do you study? B: I study computer engineering. What about you? A: I study information technology. Are you interested in AI? B: Yes, I am. I use AI tools when I work on projects. A: How often do you use them? B: Almost every day. What do you use them for? A: Mostly for debugging and learning new concepts.",
      firstListenQuestion:"What are the two students mainly discussing?",
      detailQuestions:[
        e({id:"d5-l1",type:"listening-comprehension",prompt:"What does the first speaker study?",answer:"information technology",targetSkill:"listening"}),
        e({id:"d5-l2",type:"listening-comprehension",prompt:"How often does B use AI tools?",answer:"almost every day",targetSkill:"listening"}),
        e({id:"d5-l3",type:"listening-comprehension",prompt:"What does A use AI tools for?",acceptedAnswers:["debugging and learning new concepts","mostly for debugging and learning new concepts"],targetSkill:"listening"})
      ],
      connectedSpeechNotes:["What do you often sounds like 'whaddaya' in fast informal speech; recognize it but keep a clear form when practicing","Are you links naturally","What about you? often has stress on you"]
    }],
    speaking:[
      e({id:"d5-s1",type:"speaking-prompt",prompt:"Ask 5 questions about study, interests, routine, English, and programming.",targetSkill:"speaking"}),
      e({id:"d5-s2",type:"timed-response",prompt:"Ask a follow-up question after: 'I like programming.'",targetSkill:"speaking",seconds:5,modelAnswer:"What kind of programming do you like?"}),
      e({id:"d5-s3",type:"speaking-prompt",prompt:"Simulate a 30-second conversation. Ask and answer at least 4 questions.",targetSkill:"speaking",seconds:30,minWords:40})
    ],
    reading:[{
      id:"d5-read",title:"Good Questions Reduce Pressure",
      text:"Conversation is easier when you do not try to give long answers all the time. Good questions share the speaking load. Start with simple questions, listen for one useful detail, and ask a follow-up question about that detail. This creates a natural conversation instead of an interview with memorized questions.",
      questions:[
        e({id:"d5-r1",type:"reading-comprehension",prompt:"How do questions reduce pressure?",acceptedAnswers:["they share the speaking load","good questions share the speaking load"],targetSkill:"reading"}),
        e({id:"d5-r2",type:"reading-comprehension",prompt:"What should a follow-up question use?",acceptedAnswers:["one useful detail","a useful detail from the answer"],targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d5-write",type:"free-writing",prompt:"Write 10 questions you could ask an international student. Include Do, Are, Can, What, Where, Why, and How often.",targetSkill:"writing",minWords:55})
    ],
    review:[
      e({id:"d5-rev1",type:"error-correction",prompt:"Correct: Why you want learn English?",answer:"Why do you want to learn English?",targetSkill:"grammarProduction"}),
      e({id:"d5-rev2",type:"sentence-transformation",prompt:"You are interested in software. → question",answer:"Are you interested in software?",targetSkill:"grammarProduction"}),
      e({id:"d5-rev3",type:"timed-response",prompt:"Ask me a question about my routine.",targetSkill:"speaking",seconds:5})
    ],
    exitCheck:[
      e({id:"d5-exit1",type:"speaking-prompt",prompt:"Ask and answer four connected questions in a 30-second mini conversation.",targetSkill:"speaking",seconds:30,minWords:40}),
      e({id:"d5-exit2",type:"thai-to-english",prompt:"คุณฝึกพูดบ่อยแค่ไหน",answer:"How often do you practice speaking?",targetSkill:"grammarProduction"})
    ],
    realWorldMission:"Ask an AI assistant one programming question in English, then ask one natural follow-up question in English.",
    prerequisites:["day-4"],
    masteryCriteria:{minimumAccuracy:0.82,minimumProductionAccuracy:0.8,maximumResponseSeconds:5,speakingSeconds:30,notes:["Can select Do/Are/Can frames","Can ask at least one follow-up question"]}
  },

  {
    id:"day-6",
    day:6,
    title:"Routine + Frequency — Speak Beyond One Sentence",
    cefrLevel:"A1+",
    stage:"Foundation Rebuild",
    focus:"usually / often / sometimes / rarely / never",
    prioritySkill:"speaking",
    objectives:[
      "Place frequency adverbs naturally",
      "Connect multiple routine sentences",
      "Use because / but / so",
      "Speak for 30 seconds about a normal weekday"
    ],
    estimatedMinutes:160,
    warmup:[{
      id:"d6-warmup",kind:"retrieval",title:"Question + answer retrieval",estimatedMinutes:10,
      exercises:[
        e({id:"d6-w1",type:"timed-response",prompt:"How often do you practice English?",targetSkill:"speaking",seconds:5}),
        e({id:"d6-w2",type:"timed-response",prompt:"What do you usually do after class?",targetSkill:"speaking",seconds:5}),
        e({id:"d6-w3",type:"timed-response",prompt:"Ask one follow-up question.",targetSkill:"speaking",seconds:5})
      ]
    }],
    vocabulary:[
      v("d6-v1","usually","โดยปกติ","More than often; a normal pattern.",["I usually study at night."]),
      v("d6-v2","often","บ่อย","Many times, but not always.",["I often read technical documentation."]),
      v("d6-v3","sometimes","บางครั้ง","On some occasions.",["I sometimes watch videos with English subtitles."]),
      v("d6-v4","rarely","แทบไม่ค่อย","Not often.",["I rarely study early in the morning."]),
      v("d6-v5","never","ไม่เคย/ไม่เลย","At no time.",["I never skip the weekly review."]),
      v("d6-v6","because / but / so","เพราะ / แต่ / ดังนั้น","Basic connectors that help you speak in connected ideas.",["I study at night because it's quiet.","I like games, but I don't play every day.","I have a test tomorrow, so I need to study."])
    ],
    grammar:[{
      id:"d6-grammar",kind:"grammar",title:"Frequency adverbs + connected ideas",estimatedMinutes:28,
      explanationThai:"usually/often/sometimes/rarely/never มักวางก่อนกริยาหลัก: I usually study. แต่หลัง be: I am usually tired. จากนั้นใช้ because/but/so เชื่อมความคิด เพื่อขยับจากประโยคเดี่ยวไปเป็นคำตอบที่ยาวขึ้น",
      examples:["I usually study at night.","I'm often tired after class.","I sometimes play games, but I don't play for long.","I practice English because I want to speak more naturally."],
      exercises:[
        e({id:"d6-g1",type:"sentence-reorder",prompt:"Reorder: usually / I / after class / study",answer:"I usually study after class.",targetSkill:"grammarProduction"}),
        e({id:"d6-g2",type:"sentence-reorder",prompt:"Reorder: tired / often / am / I / after class",answer:"I am often tired after class.",targetSkill:"grammarProduction"}),
        e({id:"d6-g3",type:"fill-blank",prompt:"I want to understand games in English, ___ I practice listening.",answer:"so",targetSkill:"grammarProduction"}),
        e({id:"d6-g4",type:"fill-blank",prompt:"I like programming, ___ debugging can be frustrating.",answer:"but",targetSkill:"grammarProduction"}),
        e({id:"d6-g5",type:"thai-to-english",prompt:"ฉันมักอ่าน documentation เพราะฉันอยากแก้ปัญหาด้วยตัวเอง",answer:"I often read documentation because I want to solve problems by myself.",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d6-listen",title:"My Weekday Rhythm",
      script:"I usually wake up around seven and check my schedule. I often have classes in the morning, so I leave home early. After class, I sometimes stay at university to work on assignments. I rarely study English for several hours at once because I lose focus. Instead, I practice in shorter sessions. At night, I usually review vocabulary and speak aloud for a few minutes.",
      firstListenQuestion:"What study style does the speaker prefer?",
      detailQuestions:[
        e({id:"d6-l1",type:"listening-comprehension",prompt:"When does the speaker often have classes?",answer:"in the morning",targetSkill:"listening"}),
        e({id:"d6-l2",type:"listening-comprehension",prompt:"Why doesn't the speaker study English for several hours at once?",answer:"because I lose focus",targetSkill:"listening"}),
        e({id:"d6-l3",type:"listening-comprehension",prompt:"What does the speaker usually do at night?",acceptedAnswers:["review vocabulary and speak aloud","reviews vocabulary and speaks aloud"],targetSkill:"listening"})
      ],
      connectedSpeechNotes:["usually may reduce to three syllables in natural speech","at night links: a(t)-night","because often carries less stress than the main idea"]
    }],
    speaking:[
      e({id:"d6-s1",type:"speaking-prompt",prompt:"Make 5 sentences using usually, often, sometimes, rarely, and never.",targetSkill:"speaking"}),
      e({id:"d6-s2",type:"speaking-prompt",prompt:"Expand aloud: I study English. → add frequency → add time → add reason.",targetSkill:"speaking",modelAnswer:"I usually study English at night because I want to improve my speaking."}),
      e({id:"d6-s3",type:"timed-response",prompt:"How often do you read English documentation, and why?",targetSkill:"speaking",seconds:7,modelAnswer:"I sometimes read English documentation when I need to solve a programming problem."}),
      e({id:"d6-s4",type:"speaking-prompt",prompt:"Describe your normal weekday for 30 seconds. Use at least three frequency words and one connector.",targetSkill:"speaking",seconds:30,minWords:45})
    ],
    reading:[{
      id:"d6-read",title:"Small Sessions, Frequent Retrieval",
      text:"Long study sessions can feel productive, but memory improves when learners return to material repeatedly. A short retrieval session forces the brain to reconstruct information instead of simply recognizing it. This is why a learner may understand a grammar rule but still fail to use it while speaking. Frequent production closes that gap.",
      questions:[
        e({id:"d6-r1",type:"reading-comprehension",prompt:"What does retrieval force the brain to do?",answer:"reconstruct information",targetSkill:"reading"}),
        e({id:"d6-r2",type:"reading-comprehension",prompt:"What gap does frequent production help close?",acceptedAnswers:["the gap between understanding and using language","the gap between recognizing a grammar rule and using it while speaking"],targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d6-write",type:"free-writing",prompt:"Write 90–110 words about your weekday routine. Use all five frequency adverbs if they are true, plus because/but/so.",targetSkill:"writing",minWords:90})
    ],
    review:[
      e({id:"d6-rev1",type:"error-correction",prompt:"Correct: I am usually study at night.",answer:"I usually study at night.",targetSkill:"grammarProduction"}),
      e({id:"d6-rev2",type:"fill-blank",prompt:"I'm often tired, ___ I still practice for 20 minutes.",answer:"but",targetSkill:"grammarProduction"}),
      e({id:"d6-rev3",type:"timed-response",prompt:"Give a 3-sentence answer: What do you usually do at night?",targetSkill:"speaking",seconds:15})
    ],
    exitCheck:[
      e({id:"d6-exit1",type:"speaking-prompt",prompt:"Talk about your normal weekday for 30 seconds without reading.",targetSkill:"speaking",seconds:30,minWords:45}),
      e({id:"d6-exit2",type:"thai-to-english",prompt:"ฉันไม่ค่อยเรียนตอนเช้าเพราะฉันยังง่วง",acceptedAnswers:["I rarely study in the morning because I'm still sleepy.","I don't often study in the morning because I'm still sleepy."],targetSkill:"grammarProduction"})
    ],
    realWorldMission:"Think aloud in English for five minutes while doing a normal task. Reuse routine chunks instead of translating new sentences.",
    prerequisites:["day-5"],
    masteryCriteria:{minimumAccuracy:0.83,minimumProductionAccuracy:0.8,maximumResponseSeconds:5,speakingSeconds:30,notes:["Can place frequency adverbs","Can connect ideas with because/but/so","Can sustain 30 seconds with scaffolding removed"]}
  },

  {
    id:"day-7",
    day:7,
    title:"Week 1 Integration + Real Conversation Test",
    cefrLevel:"A2-",
    stage:"Foundation Rebuild",
    focus:"Integrate self-introduction, routines, negatives and questions",
    prioritySkill:"speaking",
    objectives:[
      "Retrieve Week 1 language without notes",
      "Complete a balanced speaking/listening/reading/writing checkpoint",
      "Identify the top recurring errors",
      "Create next-week remediation targets"
    ],
    estimatedMinutes:130,
    warmup:[{
      id:"d7-warmup",kind:"retrieval",title:"No-notes retrieval map",estimatedMinutes:12,
      instructionsThai:"พูด pattern ที่จำได้ให้มากที่สุดจาก Day 1–6 จากนั้นค่อยเปิดดูว่าขาดอะไร",
      exercises:[
        e({id:"d7-w1",type:"speaking-prompt",prompt:"Say 8 different sentence starters you learned this week.",targetSkill:"speaking"}),
        e({id:"d7-w2",type:"speaking-prompt",prompt:"Ask 5 different questions.",targetSkill:"speaking"})
      ]
    }],
    vocabulary:[
      v("d7-v1","this week","สัปดาห์นี้","Useful review time phrase.",["This week, I practiced speaking every day."]),
      v("d7-v2","I found ... difficult","ฉันรู้สึกว่า...ยาก","Reflect on learning difficulty.",["I found question forms difficult.","I found listening at normal speed difficult."]),
      v("d7-v3","I'm getting better at ...","ฉันกำลังเก่งขึ้นในเรื่อง...","Describe gradual improvement.",["I'm getting better at answering quickly."]),
      v("d7-v4","I still need to work on ...","ฉันยังต้องฝึก...","Identify a weakness.",["I still need to work on past tense."])
    ],
    grammar:[{
      id:"d7-grammar",kind:"assessment",title:"Week 1 grammar production test",estimatedMinutes:20,
      explanationThai:"คะแนน recognition อย่างเดียวไม่พอ ต้องทำ production ด้วย",
      exercises:[
        e({id:"d7-g1",type:"thai-to-english",prompt:"ฉันสนใจการเขียนโปรแกรมและปกติฉันทำโปรเจกต์ตอนกลางคืน",answer:"I'm interested in programming, and I usually work on projects at night.",targetSkill:"grammarProduction"}),
        e({id:"d7-g2",type:"error-correction",prompt:"Correct: I am go to university every day.",answer:"I go to university every day.",targetSkill:"grammarProduction"}),
        e({id:"d7-g3",type:"sentence-transformation",prompt:"She studies AI. → negative",answer:"She doesn't study AI.",targetSkill:"grammarProduction"}),
        e({id:"d7-g4",type:"sentence-transformation",prompt:"You can write code. → question",answer:"Can you write code?",targetSkill:"grammarProduction"}),
        e({id:"d7-g5",type:"fill-blank",prompt:"I ___ tired after class, but I still practice English.",answer:"am",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d7-listen",title:"A New Study Habit",
      script:"This week, I changed the way I practice English. I don't only read grammar explanations now. I say short sentences aloud and try to answer questions quickly. I still make mistakes, especially when I need to choose a verb fast, but I'm getting better at starting my answer without Thai. I also listen to short English clips at normal speed before I read the transcript.",
      firstListenQuestion:"What is the main change in the speaker's study method?",
      detailQuestions:[
        e({id:"d7-l1",type:"listening-comprehension",prompt:"What does the speaker do instead of only reading grammar explanations?",acceptedAnswers:["says short sentences aloud and answers questions quickly","say short sentences aloud and try to answer questions quickly"],targetSkill:"listening"}),
        e({id:"d7-l2",type:"listening-comprehension",prompt:"What mistake is still difficult?",acceptedAnswers:["choosing a verb fast","when I need to choose a verb fast"],targetSkill:"listening"}),
        e({id:"d7-l3",type:"listening-comprehension",prompt:"When does the speaker read the transcript?",answer:"after listening at normal speed",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["getting better at links across word boundaries","still make mistakes: stress mistakes","before I → before-I"]
    }],
    speaking:[
      e({id:"d7-s1",type:"speaking-prompt",prompt:"Introduce yourself for 30 seconds. Include study, interests, routine and English goal.",targetSkill:"speaking",seconds:30,minWords:45}),
      e({id:"d7-s2",type:"speaking-prompt",prompt:"Answer: What do you usually do on a weekday?",targetSkill:"speaking",seconds:30,minWords:45}),
      e({id:"d7-s3",type:"speaking-prompt",prompt:"Ask and answer five connected questions as a mini-conversation.",targetSkill:"speaking",seconds:40,minWords:55})
    ],
    reading:[{
      id:"d7-read",title:"From Recognition to Production",
      text:"A learner can recognize a correct sentence without being able to create it. Recognition is easier because the answer is already visible. Production is different: the learner must retrieve vocabulary, choose a structure, and organize the sentence in real time. For this reason, a course should not mark a grammar topic as mastered after a multiple-choice quiz. The learner needs repeated independent production.",
      questions:[
        e({id:"d7-r1",type:"reading-comprehension",prompt:"Why is production harder than recognition?",acceptedAnswers:["the learner must retrieve vocabulary, choose a structure, and organize the sentence","because the learner must create the language independently"],targetSkill:"reading"}),
        e({id:"d7-r2",type:"reading-comprehension",prompt:"What should not be enough to mark grammar as mastered?",answer:"a multiple-choice quiz",targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d7-write",type:"free-writing",prompt:"Write a 100–120 word weekly reflection: what you can do now, what is still difficult, and what you will focus on next.",targetSkill:"writing",minWords:100})
    ],
    review:[
      e({id:"d7-rev1",type:"speaking-prompt",prompt:"Say your top three recurring mistakes aloud in corrected form.",targetSkill:"speaking"}),
      e({id:"d7-rev2",type:"timed-response",prompt:"Why do you want to improve your English?",targetSkill:"speaking",seconds:5})
    ],
    exitCheck:[
      e({id:"d7-exit1",type:"speaking-prompt",prompt:"Week 1 checkpoint: speak for 30 seconds about yourself without Thai or a script.",targetSkill:"speaking",seconds:30,minWords:45}),
      e({id:"d7-exit2",type:"free-writing",prompt:"Write 8 accurate sentences from memory using 8 different Week 1 patterns.",targetSkill:"writing",minWords:55})
    ],
    realWorldMission:"Record a 30-second self-introduction on your phone or in the app. Keep it as a baseline to compare later.",
    prerequisites:["day-6"],
    masteryCriteria:{minimumAccuracy:0.8,minimumProductionAccuracy:0.78,maximumResponseSeconds:5,speakingSeconds:30,notes:["Week 1 test covers productive skills","If below 70%, repeat targeted drills instead of moving on blindly"]}
  },

  {
    id:"day-8",
    day:8,
    title:"Past Simple Switch — Today vs Yesterday",
    cefrLevel:"A2-",
    stage:"Foundation Rebuild",
    focus:"did / regular past / time signals",
    prioritySkill:"speaking",
    objectives:[
      "Switch automatically when the time changes to yesterday",
      "Use did in questions and negatives",
      "Produce common regular past forms",
      "Answer 'What did you do yesterday?' in 15–20 seconds"
    ],
    estimatedMinutes:165,
    warmup:[{
      id:"d8-warmup",kind:"retrieval",title:"Present vs past trigger",estimatedMinutes:10,
      instructionsThai:"เมื่อเห็น yesterday ให้สลับระบบทันที ไม่ใช้ Present Simple",
      exercises:[
        e({id:"d8-w1",type:"sentence-transformation",prompt:"Today: I study English. → Yesterday:",answer:"I studied English yesterday.",targetSkill:"grammarProduction"}),
        e({id:"d8-w2",type:"sentence-transformation",prompt:"Today: I work on my project. → Yesterday:",answer:"I worked on my project yesterday.",targetSkill:"grammarProduction"})
      ]
    }],
    vocabulary:[
      v("d8-v1","yesterday","เมื่อวาน","A strong Past Simple signal.",["I studied English yesterday."]),
      v("d8-v2","last night","เมื่อคืน","A finished past time.",["I watched a video last night."]),
      v("d8-v3","finish an assignment","ทำงาน/การบ้านเสร็จ","Complete a task.",["I finished an assignment yesterday."]),
      v("d8-v4","work on a project","ทำโปรเจกต์","Spend time developing a project.",["I worked on my project last night."]),
      v("d8-v5","practice speaking","ฝึกพูด","Target skill phrase.",["I practiced speaking for twenty minutes."])
    ],
    grammar:[{
      id:"d8-grammar",kind:"grammar",title:"Past Simple: finished time = finished verb",estimatedMinutes:32,
      explanationThai:"ถ้าเหตุการณ์จบแล้วและมีเวลาอย่าง yesterday/last night ให้ใช้ Past Simple. กริยาปกติเติม -ed. คำถามใช้ Did + subject + base verb; ปฏิเสธใช้ didn't + base verb.",
      examples:["I studied English yesterday.","I worked on my project last night.","Did you study yesterday?","I didn't play games last night."],
      exercises:[
        e({id:"d8-g1",type:"fill-blank",prompt:"Yesterday, I ___ (work) on my project.",answer:"worked",targetSkill:"grammarProduction"}),
        e({id:"d8-g2",type:"error-correction",prompt:"Correct: I do my homework yesterday.",answer:"I did my homework yesterday.",targetSkill:"grammarProduction",explanationThai:"นี่เป็น known error สำคัญ: yesterday บังคับให้คิด Past Simple"}),
        e({id:"d8-g3",type:"sentence-transformation",prompt:"You studied last night. → question",answer:"Did you study last night?",targetSkill:"grammarProduction"}),
        e({id:"d8-g4",type:"sentence-transformation",prompt:"I played games yesterday. → negative",answer:"I didn't play games yesterday.",targetSkill:"grammarProduction"}),
        e({id:"d8-g5",type:"thai-to-english",prompt:"เมื่อคืนฉันทำโปรเจกต์และฝึกภาษาอังกฤษ",answer:"I worked on my project and practiced English last night.",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d8-listen",title:"Yesterday After Class",
      script:"Yesterday, I finished class at four. I stayed at university for another hour and worked on an assignment. Then I went home and ate dinner. I didn't play games because I wanted to finish my work first. At night, I practiced English for twenty minutes and watched a short technology video.",
      firstListenQuestion:"Was yesterday mainly a study day or a free day?",
      detailQuestions:[
        e({id:"d8-l1",type:"listening-comprehension",prompt:"What time did class finish?",answer:"four",targetSkill:"listening"}),
        e({id:"d8-l2",type:"listening-comprehension",prompt:"Why didn't the speaker play games?",acceptedAnswers:["because I wanted to finish my work first","because the speaker wanted to finish work first"],targetSkill:"listening"}),
        e({id:"d8-l3",type:"listening-comprehension",prompt:"How long did the speaker practice English?",answer:"twenty minutes",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["worked ends with /t/","practiced ends with /t/","wanted to may reduce in natural speech; keep the past meaning clear from context"]
    }],
    speaking:[
      e({id:"d8-s1",type:"sentence-transformation",prompt:"Rapid switch: I study → yesterday",answer:"I studied.",targetSkill:"speaking"}),
      e({id:"d8-s2",type:"sentence-transformation",prompt:"Rapid switch: I work → yesterday",answer:"I worked.",targetSkill:"speaking"}),
      e({id:"d8-s3",type:"timed-response",prompt:"What did you do yesterday?",instructionThai:"เริ่มใน 5 วินาที ตอบอย่างน้อย 3 ประโยค",targetSkill:"speaking",seconds:20,minWords:30,modelAnswer:"Yesterday, I went to class. After class, I worked on my project. At night, I studied English and watched a video."}),
      e({id:"d8-s4",type:"speaking-prompt",prompt:"Say three things you did and one thing you didn't do yesterday.",targetSkill:"speaking",seconds:25,minWords:35})
    ],
    reading:[{
      id:"d8-read",title:"A Small Bug From Yesterday",
      text:"Yesterday, a developer tested a new login feature. The page loaded correctly, but the form returned an error after the user clicked the button. The developer checked the logs, found a missing environment variable, and updated the configuration. After that, the feature worked normally.",
      questions:[
        e({id:"d8-r1",type:"reading-comprehension",prompt:"When did the error appear?",acceptedAnswers:["after the user clicked the button","after the button was clicked"],targetSkill:"reading"}),
        e({id:"d8-r2",type:"reading-comprehension",prompt:"What caused the problem?",answer:"a missing environment variable",targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d8-write",type:"free-writing",prompt:"Write 8 sentences about yesterday. Use at least five Past Simple verbs and one negative.",targetSkill:"writing",minWords:60})
    ],
    review:[
      e({id:"d8-rev1",type:"error-correction",prompt:"Correct: Yesterday I do my assignment.",answer:"Yesterday, I did my assignment.",targetSkill:"grammarProduction"}),
      e({id:"d8-rev2",type:"error-correction",prompt:"Correct: Did you studied last night?",answer:"Did you study last night?",targetSkill:"grammarProduction"}),
      e({id:"d8-rev3",type:"timed-response",prompt:"What did you do last night?",targetSkill:"speaking",seconds:7})
    ],
    exitCheck:[
      e({id:"d8-exit1",type:"speaking-prompt",prompt:"Answer 'What did you do yesterday?' for 20 seconds.",targetSkill:"speaking",seconds:20,minWords:30}),
      e({id:"d8-exit2",type:"thai-to-english",prompt:"เมื่อวานฉันทำการบ้านแต่ฉันไม่ได้เล่นเกม",answer:"I did my homework yesterday, but I didn't play games.",targetSkill:"grammarProduction"})
    ],
    realWorldMission:"Before bed, say five sentences about things you did today. Tomorrow, repeat them with 'yesterday'.",
    prerequisites:["day-7"],
    masteryCriteria:{minimumAccuracy:0.82,minimumProductionAccuracy:0.78,maximumResponseSeconds:5,speakingSeconds:20,notes:["Automatically reacts to yesterday/last night","Uses did/didn't + base verb"]}
  },

  {
    id:"day-9",
    day:9,
    title:"High-Frequency Irregular Past",
    cefrLevel:"A2-",
    stage:"Foundation Rebuild",
    focus:"did, went, bought, saw, had, made, got, came",
    prioritySkill:"speaking",
    objectives:[
      "Retrieve common irregular past verbs quickly",
      "Avoid present forms after finished-past time signals",
      "Ask and answer past questions",
      "Extend a past answer to 25–30 seconds"
    ],
    estimatedMinutes:165,
    warmup:[{
      id:"d9-warmup",kind:"retrieval",title:"Past switch recall",estimatedMinutes:10,
      exercises:[
        e({id:"d9-w1",type:"timed-response",prompt:"go → past",answer:"went",targetSkill:"grammarProduction",seconds:3}),
        e({id:"d9-w2",type:"timed-response",prompt:"buy → past",answer:"bought",targetSkill:"grammarProduction",seconds:3}),
        e({id:"d9-w3",type:"timed-response",prompt:"see → past",answer:"saw",targetSkill:"grammarProduction",seconds:3}),
        e({id:"d9-w4",type:"timed-response",prompt:"have → past",answer:"had",targetSkill:"grammarProduction",seconds:3}),
        e({id:"d9-w5",type:"timed-response",prompt:"make → past",answer:"made",targetSkill:"grammarProduction",seconds:3})
      ]
    }],
    vocabulary:[
      v("d9-v1","went","ไปแล้ว","Past of go.",["I went to university yesterday."]),
      v("d9-v2","bought","ซื้อแล้ว","Past of buy.",["I bought a new cable last week."]),
      v("d9-v3","saw","เห็น/ดูแล้ว","Past of see.",["I saw an interesting video yesterday."]),
      v("d9-v4","had","มี/กิน/ประสบแล้ว","Past of have.",["I had class in the morning.","I had lunch with my friends."]),
      v("d9-v5","made","ทำ/สร้างแล้ว","Past of make.",["I made a small app last weekend."]),
      v("d9-v6","got","ได้/ไปถึง/กลายเป็น","Past of get; meaning depends on context.",["I got home at eight.","I got an error message."])
    ],
    grammar:[{
      id:"d9-grammar",kind:"grammar",title:"Irregular verbs as chunks, not a giant table",estimatedMinutes:30,
      explanationThai:"อย่าท่อง list ยาวอย่างเดียว ให้ผูก past form เข้ากับ chunk ที่ใช้จริง: went home, had class, made a project, got an error, saw a video, bought a cable.",
      examples:["I went home at eight.","I had class yesterday.","I made a small website.","I got an error message.","I saw a useful tutorial."],
      exercises:[
        e({id:"d9-g1",type:"fill-blank",prompt:"Yesterday I ___ (go) to university.",answer:"went",targetSkill:"grammarProduction"}),
        e({id:"d9-g2",type:"fill-blank",prompt:"Last week I ___ (buy) a new keyboard.",answer:"bought",targetSkill:"grammarProduction"}),
        e({id:"d9-g3",type:"fill-blank",prompt:"I ___ (see) an interesting video last night.",answer:"saw",targetSkill:"grammarProduction"}),
        e({id:"d9-g4",type:"thai-to-english",prompt:"เมื่อวานฉันมีเรียนตอนเช้า",answer:"I had class in the morning yesterday.",targetSkill:"grammarProduction"}),
        e({id:"d9-g5",type:"error-correction",prompt:"Correct: Yesterday I go home at 8.",answer:"Yesterday, I went home at 8.",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d9-listen",title:"A Productive Saturday",
      script:"Last Saturday, I got up late and had breakfast around ten. Then I went to a café with my laptop. I worked on a small website and made a new page for the project. In the afternoon, I saw a video about a new AI model and took some notes. Before I went home, I bought a drink and talked with a friend for a while.",
      firstListenQuestion:"What kind of day did the speaker have?",
      detailQuestions:[
        e({id:"d9-l1",type:"listening-comprehension",prompt:"Where did the speaker work on the website?",answer:"at a café",targetSkill:"listening"}),
        e({id:"d9-l2",type:"listening-comprehension",prompt:"What did the speaker see in the afternoon?",answer:"a video about a new AI model",targetSkill:"listening"}),
        e({id:"d9-l3",type:"listening-comprehension",prompt:"What did the speaker buy before going home?",answer:"a drink",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["went to often links: wen(t)-to","got up links strongly","had breakfast: final /d/ may link into /b/"]
    }],
    speaking:[
      e({id:"d9-s1",type:"speaking-prompt",prompt:"Make one true or imaginary sentence with went, had, made, got, saw, and bought.",targetSkill:"speaking"}),
      e({id:"d9-s2",type:"timed-response",prompt:"Where did you go yesterday?",targetSkill:"speaking",seconds:5}),
      e({id:"d9-s3",type:"timed-response",prompt:"What did you have for dinner?",targetSkill:"speaking",seconds:5}),
      e({id:"d9-s4",type:"speaking-prompt",prompt:"Tell me about yesterday for 25–30 seconds. Use at least three irregular past verbs.",targetSkill:"speaking",seconds:30,minWords:45})
    ],
    reading:[{
      id:"d9-read",title:"The First Working Prototype",
      text:"A student team built a simple prototype for an IoT class. They bought a small sensor, connected it to a microcontroller, and made a basic dashboard. At first, they got several errors because the configuration was wrong. They read the error messages, changed the settings, and finally saw live data on the screen.",
      questions:[
        e({id:"d9-r1",type:"reading-comprehension",prompt:"What did the team buy?",answer:"a small sensor",targetSkill:"reading"}),
        e({id:"d9-r2",type:"reading-comprehension",prompt:"Why did they get errors?",answer:"because the configuration was wrong",targetSkill:"reading"}),
        e({id:"d9-r3",type:"reading-comprehension",prompt:"What did they finally see?",answer:"live data on the screen",targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d9-write",type:"free-writing",prompt:"Write a 90–110 word story about a recent day. Use at least five irregular past verbs from today.",targetSkill:"writing",minWords:90})
    ],
    review:[
      e({id:"d9-rev1",type:"timed-response",prompt:"make → past",answer:"made",targetSkill:"grammarProduction",seconds:3}),
      e({id:"d9-rev2",type:"timed-response",prompt:"get → past",answer:"got",targetSkill:"grammarProduction",seconds:3}),
      e({id:"d9-rev3",type:"error-correction",prompt:"Correct: I buy a drink yesterday.",answer:"I bought a drink yesterday.",targetSkill:"grammarProduction"})
    ],
    exitCheck:[
      e({id:"d9-exit1",type:"speaking-prompt",prompt:"Describe yesterday for 30 seconds using at least three irregular past verbs.",targetSkill:"speaking",seconds:30,minWords:45}),
      e({id:"d9-exit2",type:"thai-to-english",prompt:"เมื่อวานฉันไปมหาวิทยาลัยและเจอเพื่อน",acceptedAnswers:["I went to university and saw my friend yesterday.","Yesterday, I went to university and saw my friend."],targetSkill:"grammarProduction"})
    ],
    realWorldMission:"Write five past-tense bullet points about today before bed, then say them aloud without reading.",
    prerequisites:["day-8"],
    masteryCriteria:{minimumAccuracy:0.82,minimumProductionAccuracy:0.78,maximumResponseSeconds:4,speakingSeconds:30,notes:["Retrieves six core irregular verbs","Uses past verbs inside chunks, not isolated list recall only"]}
  },

  {
    id:"day-10",
    day:10,
    title:"Past Story Automaticity",
    cefrLevel:"A2-",
    stage:"Foundation Rebuild",
    focus:"Sequencing a simple past narrative",
    prioritySkill:"speaking",
    objectives:[
      "Sequence past events with first / then / after that / finally",
      "Use Past Simple consistently across a short story",
      "Self-correct present/past switching",
      "Speak for 30–40 seconds about yesterday"
    ],
    estimatedMinutes:170,
    warmup:[{
      id:"d10-warmup",kind:"retrieval",title:"Irregular verb sprint",estimatedMinutes:10,
      exercises:[
        e({id:"d10-w1",type:"timed-response",prompt:"Say the past forms: go, buy, see, have, make, get.",targetSkill:"speaking",seconds:15}),
        e({id:"d10-w2",type:"timed-response",prompt:"What did you do yesterday? Give 3 verbs only.",targetSkill:"speaking",seconds:8})
      ]
    }],
    vocabulary:[
      v("d10-v1","first","ก่อนอื่น","Start a sequence.",["First, I checked my messages."]),
      v("d10-v2","then","จากนั้น","Continue a sequence.",["Then, I went to class."]),
      v("d10-v3","after that","หลังจากนั้น","Continue a sequence with more separation.",["After that, I worked on my project."]),
      v("d10-v4","later","ต่อมา","A later point in time.",["Later, I met a friend."]),
      v("d10-v5","finally","สุดท้าย","End a sequence.",["Finally, I went home."])
    ],
    grammar:[{
      id:"d10-grammar",kind:"grammar",title:"Keep the whole story in the same finished-past frame",estimatedMinutes:28,
      explanationThai:"ปัญหาพบบ่อยคือเริ่มด้วย past แล้วกลับไป present กลางเรื่อง ให้ตั้ง mental frame ว่า 'เรื่องนี้จบแล้ว' และใช้ sequence words ช่วยถือโครงเรื่อง",
      examples:["First, I went to class.","Then, I had lunch.","After that, I worked on an assignment.","Finally, I went home."],
      exercises:[
        e({id:"d10-g1",type:"error-correction",prompt:"Correct the tense switch: Yesterday I went to class, and then I eat lunch.",answer:"Yesterday I went to class, and then I ate lunch.",targetSkill:"grammarProduction"}),
        e({id:"d10-g2",type:"sentence-reorder",prompt:"Order naturally: finally / after that / first / then",answer:["first","then","after that","finally"],targetSkill:"grammarRecognition"}),
        e({id:"d10-g3",type:"thai-to-english",prompt:"ก่อนอื่นฉันไปเรียน จากนั้นฉันกินข้าวกับเพื่อน",acceptedAnswers:["First, I went to class. Then, I ate with my friends.","First, I went to class. Then, I had lunch with my friends."],targetSkill:"grammarProduction"}),
        e({id:"d10-g4",type:"error-correction",prompt:"Correct: After that, I do my homework and went home.",answer:"After that, I did my homework and went home.",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d10-listen",title:"A Small Debugging Story",
      script:"Yesterday, I tried to finish a small feature for my project. First, I opened the app and tested the login page. Then, I got an error from the server. I checked the logs and found that one environment variable was missing. After that, I updated the configuration and restarted the service. Finally, the login worked, so I wrote a short note about the fix.",
      firstListenQuestion:"What problem did the speaker solve?",
      detailQuestions:[
        e({id:"d10-l1",type:"listening-comprehension",prompt:"Where did the error come from?",answer:"the server",targetSkill:"listening"}),
        e({id:"d10-l2",type:"listening-comprehension",prompt:"What was missing?",answer:"one environment variable",targetSkill:"listening"}),
        e({id:"d10-l3",type:"listening-comprehension",prompt:"What did the speaker do after the login worked?",answer:"wrote a short note about the fix",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["tried to may sound compressed","checked the logs: final consonants may link","worked, so: /t/ + /s/ transition"]
    }],
    speaking:[
      e({id:"d10-s1",type:"speaking-prompt",prompt:"Tell a 4-step story using first, then, after that, finally.",targetSkill:"speaking"}),
      e({id:"d10-s2",type:"timed-response",prompt:"What happened yesterday after class?",targetSkill:"speaking",seconds:5}),
      e({id:"d10-s3",type:"speaking-prompt",prompt:"Tell me what you did yesterday for 30–40 seconds. Keep the story in Past Simple.",targetSkill:"speaking",seconds:40,minWords:60}),
      e({id:"d10-s4",type:"speaking-prompt",prompt:"Tell a simple programming problem story: problem → action → result.",targetSkill:"speaking",seconds:35,minWords:50})
    ],
    reading:[{
      id:"d10-read",title:"A Failed Deployment",
      text:"A small team deployed a new version of an application on Friday. First, the deployment completed normally. A few minutes later, users reported that one page did not load. The team checked the monitoring dashboard and found a failed database connection. They restored the previous configuration, restarted the service, and finally confirmed that the page worked again.",
      questions:[
        e({id:"d10-r1",type:"reading-comprehension",prompt:"When did users report a problem?",answer:"a few minutes later",targetSkill:"reading"}),
        e({id:"d10-r2",type:"reading-comprehension",prompt:"What was the technical cause?",answer:"a failed database connection",targetSkill:"reading"}),
        e({id:"d10-r3",type:"reading-comprehension",prompt:"How did the story end?",acceptedAnswers:["the page worked again","they confirmed that the page worked again"],targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d10-write",type:"free-writing",prompt:"Write a 110–130 word past story. Use first, then, after that, later, and finally. Check every main verb for tense consistency.",targetSkill:"writing",minWords:110})
    ],
    review:[
      e({id:"d10-rev1",type:"error-correction",prompt:"Correct: Yesterday I went home and play games.",answer:"Yesterday, I went home and played games.",targetSkill:"grammarProduction"}),
      e({id:"d10-rev2",type:"timed-response",prompt:"Give a 4-step past sequence in 20 seconds.",targetSkill:"speaking",seconds:20})
    ],
    exitCheck:[
      e({id:"d10-exit1",type:"speaking-prompt",prompt:"Answer 'What did you do yesterday?' for 30–40 seconds with a clear sequence.",targetSkill:"speaking",seconds:40,minWords:60}),
      e({id:"d10-exit2",type:"error-correction",prompt:"Correct: First I went to class. Then I have lunch. Finally I go home.",answer:"First, I went to class. Then, I had lunch. Finally, I went home.",targetSkill:"grammarProduction"})
    ],
    realWorldMission:"At the end of today, record a 40-second spoken timeline of your day using sequence words.",
    prerequisites:["day-9"],
    masteryCriteria:{minimumAccuracy:0.83,minimumProductionAccuracy:0.8,maximumResponseSeconds:5,speakingSeconds:35,notes:["Maintains past frame across connected sentences","Can tell a simple event sequence without reverting repeatedly to present"]}
  },

  {
    id:"day-11",
    day:11,
    title:"Future Plans — Going To vs Will",
    cefrLevel:"A2-",
    stage:"Foundation Rebuild",
    focus:"planned intentions and spontaneous decisions",
    prioritySkill:"speaking",
    objectives:[
      "Use be going to for plans and intentions",
      "Use will for decisions/predictions in simple contexts",
      "Talk about next weekend",
      "Answer a future prompt for 25–30 seconds"
    ],
    estimatedMinutes:160,
    warmup:[{
      id:"d11-warmup",kind:"retrieval",title:"Past automaticity refresh",estimatedMinutes:10,
      exercises:[
        e({id:"d11-w1",type:"timed-response",prompt:"What did you do yesterday?",targetSkill:"speaking",seconds:15}),
        e({id:"d11-w2",type:"timed-response",prompt:"Say one sentence with 'finally'.",targetSkill:"speaking",seconds:5})
      ]
    }],
    vocabulary:[
      v("d11-v1","I'm going to ...","ฉันวางแผนจะ...","Use for an intention or plan.",["I'm going to study this weekend.","I'm going to work on my project tonight."]),
      v("d11-v2","I think I'll ...","ฉันคิดว่าฉันคงจะ...","Useful for a decision or prediction.",["I think I'll stay home tonight."]),
      v("d11-v3","next weekend","สุดสัปดาห์หน้า","Future time phrase.",["I'm going to visit my family next weekend."]),
      v("d11-v4","plan to ...","วางแผนที่จะ...","Direct planning phrase.",["I plan to finish the feature tomorrow."]),
      v("d11-v5","probably","น่าจะ","Express probability.",["I'll probably study at home."])
    ],
    grammar:[{
      id:"d11-grammar",kind:"grammar",title:"Future meaning before future form",estimatedMinutes:30,
      explanationThai:"going to เหมาะกับแผน/ความตั้งใจที่มีอยู่แล้ว. will ใช้ได้กับการตัดสินใจทันที การคาดการณ์ หรือข้อเสนอพื้นฐาน. อย่าพยายามจับเป็นกฎแข็งเกินไป ให้เริ่มจากความหมาย.",
      examples:["I'm going to work on my project tonight.","I'm going to study English this weekend.","I think I'll stay home.","I'll help you with that."],
      exercises:[
        e({id:"d11-g1",type:"multiple-choice",prompt:"You already planned it: I ___ study at the library tomorrow.",choices:[{label:"am going to",value:"am going to"},{label:"will",value:"will"}],answer:"am going to",targetSkill:"grammarRecognition"}),
        e({id:"d11-g2",type:"thai-to-english",prompt:"สุดสัปดาห์หน้าฉันวางแผนจะทำโปรเจกต์",acceptedAnswers:["I'm going to work on my project next weekend.","I plan to work on my project next weekend."],targetSkill:"grammarProduction"}),
        e({id:"d11-g3",type:"error-correction",prompt:"Correct: I going to study tonight.",answer:"I'm going to study tonight.",targetSkill:"grammarProduction"}),
        e({id:"d11-g4",type:"fill-blank",prompt:"I think I ___ probably stay home tonight.",answer:"will",targetSkill:"grammarProduction"}),
        e({id:"d11-g5",type:"sentence-transformation",prompt:"Plan: work on my app tomorrow → full sentence",answer:"I'm going to work on my app tomorrow.",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d11-listen",title:"Plans for the Weekend",
      script:"This weekend, I'm going to focus on two things. On Saturday morning, I'm going to work on my university project. I already have a list of tasks. In the afternoon, I think I'll take a break and meet a friend. On Sunday, I'm going to review English and prepare for next week. If I have extra time, I'll probably watch a movie in English.",
      firstListenQuestion:"What are the speaker's two main priorities?",
      detailQuestions:[
        e({id:"d11-l1",type:"listening-comprehension",prompt:"What is planned for Saturday morning?",answer:"work on my university project",targetSkill:"listening"}),
        e({id:"d11-l2",type:"listening-comprehension",prompt:"What may happen in the afternoon?",answer:"meet a friend",targetSkill:"listening"}),
        e({id:"d11-l3",type:"listening-comprehension",prompt:"What will the speaker probably do with extra time?",answer:"watch a movie in English",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["going to often reduces toward 'gonna' in informal speech; recognize it but write going to","I'll = I will","probably often receives less stress than the main verb"]
    }],
    speaking:[
      e({id:"d11-s1",type:"speaking-prompt",prompt:"Say three things you're going to do this week.",targetSkill:"speaking"}),
      e({id:"d11-s2",type:"timed-response",prompt:"What are you going to do next weekend?",targetSkill:"speaking",seconds:5,modelAnswer:"I'm going to work on a project and practice English. I think I'll also play some games."}),
      e({id:"d11-s3",type:"speaking-prompt",prompt:"Talk about next weekend for 25–30 seconds. Include one going to plan and one will sentence.",targetSkill:"speaking",seconds:30,minWords:45})
    ],
    reading:[{
      id:"d11-read",title:"Planning a Small Release",
      text:"A student developer is going to release a small update next week. Before the release, she is going to test the main user flow and fix two known bugs. She thinks the testing will take one evening. If everything looks stable, she will publish the update on Friday and write a short release note.",
      questions:[
        e({id:"d11-r1",type:"reading-comprehension",prompt:"What will she do before the release?",acceptedAnswers:["test the main user flow and fix two known bugs","testing and fixing two known bugs"],targetSkill:"reading"}),
        e({id:"d11-r2",type:"reading-comprehension",prompt:"When will she publish the update if everything is stable?",answer:"Friday",targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d11-write",type:"free-writing",prompt:"Write 90–110 words about your next weekend. Separate fixed plans from things you think will probably happen.",targetSkill:"writing",minWords:90})
    ],
    review:[
      e({id:"d11-rev1",type:"error-correction",prompt:"Correct: I going to play games tonight.",answer:"I'm going to play games tonight.",targetSkill:"grammarProduction"}),
      e({id:"d11-rev2",type:"timed-response",prompt:"Say one plan for tomorrow and one prediction.",targetSkill:"speaking",seconds:10})
    ],
    exitCheck:[
      e({id:"d11-exit1",type:"speaking-prompt",prompt:"What are you going to do next weekend? Speak for 30 seconds.",targetSkill:"speaking",seconds:30,minWords:45}),
      e({id:"d11-exit2",type:"thai-to-english",prompt:"ฉันคิดว่าคืนนี้ฉันน่าจะอยู่บ้าน",answer:"I think I'll probably stay home tonight.",targetSkill:"grammarProduction"})
    ],
    realWorldMission:"Open your real calendar and describe three upcoming plans aloud in English.",
    prerequisites:["day-10"],
    masteryCriteria:{minimumAccuracy:0.82,minimumProductionAccuracy:0.8,maximumResponseSeconds:5,speakingSeconds:30,notes:["Uses going to confidently for plans","Can produce a simple will prediction without overthinking"]}
  },

  {
    id:"day-12",
    day:12,
    title:"Future Arrangements + Time Precision",
    cefrLevel:"A2-",
    stage:"Foundation Rebuild",
    focus:"Present Continuous for arrangements + future contrast",
    prioritySkill:"speaking",
    objectives:[
      "Use Present Continuous for arranged future events",
      "Contrast arrangements, intentions and predictions",
      "Talk about a real schedule",
      "Speak for 30–35 seconds about upcoming plans"
    ],
    estimatedMinutes:165,
    warmup:[{
      id:"d12-warmup",kind:"retrieval",title:"Future plan retrieval",estimatedMinutes:10,
      exercises:[
        e({id:"d12-w1",type:"timed-response",prompt:"Say two things you're going to do this weekend.",targetSkill:"speaking",seconds:10}),
        e({id:"d12-w2",type:"timed-response",prompt:"Make one prediction with 'I think I'll...'",targetSkill:"speaking",seconds:5})
      ]
    }],
    vocabulary:[
      v("d12-v1","I'm meeting ...","ฉันมีนัดเจอ...","Present Continuous can describe an arranged future event.",["I'm meeting my friend at six."]),
      v("d12-v2","I'm having ...","ฉันมี...ตามนัด/กำหนด","Use for arranged events.",["I'm having a meeting tomorrow."]),
      v("d12-v3","at 3 p.m.","ตอนบ่ายสาม","Precise clock time.",["I'm meeting my team at 3 p.m."]),
      v("d12-v4","on Friday","วันศุกร์","Use on with days.",["I'm presenting on Friday."]),
      v("d12-v5","this evening","เย็นนี้","Natural near-future time phrase.",["I'm studying with a friend this evening."])
    ],
    grammar:[{
      id:"d12-grammar",kind:"grammar",title:"Three future lenses",estimatedMinutes:32,
      explanationThai:"ใช้ Present Continuous เมื่อมี arrangement ชัดเจน เช่น นัดคน/มีประชุม. going to = intention/plan. will = prediction/decision. ในชีวิตจริงมี overlap บ้าง เป้าหมายตอนนี้คือเลือกได้อย่างเป็นธรรมชาติในสถานการณ์หลัก.",
      examples:["I'm meeting my team at 3 p.m.","I'm going to finish the report tonight.","I think the meeting will be useful."],
      exercises:[
        e({id:"d12-g1",type:"multiple-choice",prompt:"You already arranged a meeting: I ___ my team at 3 p.m.",choices:[{label:"am meeting",value:"am meeting"},{label:"will meet",value:"will meet"},{label:"am going to meet",value:"am going to meet"}],answer:"am meeting",targetSkill:"grammarRecognition"}),
        e({id:"d12-g2",type:"thai-to-english",prompt:"พรุ่งนี้ฉันมีประชุมกับทีมตอนบ่ายสาม",acceptedAnswers:["I'm meeting my team at 3 p.m. tomorrow.","I'm having a meeting with my team at 3 p.m. tomorrow."],targetSkill:"grammarProduction"}),
        e({id:"d12-g3",type:"error-correction",prompt:"Correct: I'm meet my friend tomorrow.",answer:"I'm meeting my friend tomorrow.",targetSkill:"grammarProduction"}),
        e({id:"d12-g4",type:"fill-blank",prompt:"I'm presenting ___ Friday.",answer:"on",targetSkill:"grammarProduction"}),
        e({id:"d12-g5",type:"fill-blank",prompt:"I'm meeting my team ___ 3 p.m.",answer:"at",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d12-listen",title:"Tomorrow's Schedule",
      script:"Tomorrow is going to be busy. I'm having class at nine in the morning. At noon, I'm meeting two classmates to prepare our presentation. We're presenting on Friday, so we're going to practice the difficult section twice. In the evening, I'm going to review English at home. I think I'll be tired, but I still want to do a short speaking session.",
      firstListenQuestion:"Why are the classmates meeting at noon?",
      detailQuestions:[
        e({id:"d12-l1",type:"listening-comprehension",prompt:"What time is class?",answer:"nine",targetSkill:"listening"}),
        e({id:"d12-l2",type:"listening-comprehension",prompt:"When is the presentation?",answer:"Friday",targetSkill:"listening"}),
        e({id:"d12-l3",type:"listening-comprehension",prompt:"What will the speaker still do even if tired?",answer:"a short speaking session",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["we're = we are","going to practice may reduce in conversational speech","at noon: final /t/ can be unreleased before /n/"]
    }],
    speaking:[
      e({id:"d12-s1",type:"speaking-prompt",prompt:"Look at your real or imagined schedule and say 4 arranged events with times.",targetSkill:"speaking"}),
      e({id:"d12-s2",type:"timed-response",prompt:"What are you doing tomorrow afternoon?",targetSkill:"speaking",seconds:5}),
      e({id:"d12-s3",type:"speaking-prompt",prompt:"Talk about tomorrow for 30–35 seconds. Include an arrangement, an intention, and a prediction.",targetSkill:"speaking",seconds:35,minWords:50})
    ],
    reading:[{
      id:"d12-read",title:"Preparing for a Technical Presentation",
      text:"Three students are presenting a software project on Friday. They are meeting on Wednesday evening to check the demo and decide who will explain each section. One student is going to introduce the problem, another is going to show the architecture, and the third will probably handle questions. They are practicing early because live demos can fail.",
      questions:[
        e({id:"d12-r1",type:"reading-comprehension",prompt:"Why are they meeting on Wednesday?",acceptedAnswers:["to check the demo and decide who will explain each section","to prepare the presentation"],targetSkill:"reading"}),
        e({id:"d12-r2",type:"reading-comprehension",prompt:"Why are they practicing early?",answer:"because live demos can fail",targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d12-write",type:"free-writing",prompt:"Write your schedule for tomorrow in 8–10 sentences. Mark each sentence as Arrangement, Intention, or Prediction after you write it.",targetSkill:"writing",minWords:80})
    ],
    review:[
      e({id:"d12-rev1",type:"sentence-transformation",prompt:"I have a meeting tomorrow at 2. → arrangement form",answer:"I'm having a meeting tomorrow at 2.",targetSkill:"grammarProduction"}),
      e({id:"d12-rev2",type:"timed-response",prompt:"What are you doing tomorrow evening?",targetSkill:"speaking",seconds:5})
    ],
    exitCheck:[
      e({id:"d12-exit1",type:"speaking-prompt",prompt:"Describe tomorrow's schedule for 35 seconds.",targetSkill:"speaking",seconds:35,minWords:50}),
      e({id:"d12-exit2",type:"thai-to-english",prompt:"วันศุกร์ฉันมีนัดนำเสนองานกับทีม",acceptedAnswers:["I'm presenting with my team on Friday.","My team and I are presenting on Friday."],targetSkill:"grammarProduction"})
    ],
    realWorldMission:"Read tomorrow's real calendar in English and say each event aloud with a time phrase.",
    prerequisites:["day-11"],
    masteryCriteria:{minimumAccuracy:0.82,minimumProductionAccuracy:0.8,maximumResponseSeconds:5,speakingSeconds:35,notes:["Can use present continuous for arranged future","Can explain the difference among arrangement/intention/prediction in context"]}
  },

  {
    id:"day-13",
    day:13,
    title:"Yesterday, Today, Tomorrow — Time-System Integration",
    cefrLevel:"A2-",
    stage:"Foundation Rebuild",
    focus:"Switching past, present and future automatically",
    prioritySkill:"speaking",
    objectives:[
      "Switch tense based on time reference",
      "Connect yesterday, today and tomorrow in one response",
      "Reduce hesitation before main verbs",
      "Speak for 35–45 seconds across three time frames"
    ],
    estimatedMinutes:170,
    warmup:[{
      id:"d13-warmup",kind:"retrieval",title:"Time-word reaction drill",estimatedMinutes:12,
      instructionsThai:"เห็น time word แล้วพูด verb form ให้ถูกทันที",
      exercises:[
        e({id:"d13-w1",type:"timed-response",prompt:"Every day → study",answer:"I study every day.",targetSkill:"grammarProduction",seconds:4}),
        e({id:"d13-w2",type:"timed-response",prompt:"Yesterday → study",answer:"I studied yesterday.",targetSkill:"grammarProduction",seconds:4}),
        e({id:"d13-w3",type:"timed-response",prompt:"Tomorrow plan → study",answer:"I'm going to study tomorrow.",targetSkill:"grammarProduction",seconds:4})
      ]
    }],
    vocabulary:[
      v("d13-v1","yesterday","เมื่อวาน","Finished past frame.",["Yesterday, I worked on my project."]),
      v("d13-v2","today","วันนี้","Current day; tense depends on meaning.",["Today, I have two classes."]),
      v("d13-v3","tomorrow","พรุ่งนี้","Future reference.",["Tomorrow, I'm meeting my team."]),
      v("d13-v4","right now","ตอนนี้","Common Present Continuous signal.",["Right now, I'm reviewing English."]),
      v("d13-v5","later","ทีหลัง/ต่อมา","Can refer to later today or later in a story.",["Later, I'm going to practice speaking."])
    ],
    grammar:[{
      id:"d13-grammar",kind:"grammar",title:"Choose the timeline before the grammar",estimatedMinutes:30,
      explanationThai:"ก่อนสร้างประโยค ให้ตัดสินใจ timeline: finished past / routine or present state / future plan. เป้าหมายคือให้ time cue เรียก grammar pattern อัตโนมัติแทนการแปลไทยแล้วค่อยคิดกฎ.",
      examples:["Yesterday, I had class.","Today, I have class.","Tomorrow, I'm having class at nine.","Right now, I'm studying English."],
      exercises:[
        e({id:"d13-g1",type:"fill-blank",prompt:"Yesterday, I ___ class at nine. (have)",answer:"had",targetSkill:"grammarProduction"}),
        e({id:"d13-g2",type:"fill-blank",prompt:"Today, I ___ two classes. (have)",answer:"have",targetSkill:"grammarProduction"}),
        e({id:"d13-g3",type:"fill-blank",prompt:"Tomorrow, I ___ my team at 3 p.m. (meet, arranged)",answer:"am meeting",targetSkill:"grammarProduction"}),
        e({id:"d13-g4",type:"error-correction",prompt:"Correct the timeline: Yesterday I go to class, today I went to class, and tomorrow I go to class at nine.",answer:"Yesterday I went to class, today I go to class, and tomorrow I'm going to class at nine.",targetSkill:"grammarProduction"}),
        e({id:"d13-g5",type:"thai-to-english",prompt:"เมื่อวานฉันทำโปรเจกต์ วันนี้ฉันมีเรียน และพรุ่งนี้ฉันจะเจอทีม",acceptedAnswers:["Yesterday I worked on my project, today I have class, and tomorrow I'm meeting my team.","Yesterday, I worked on my project. Today, I have class. Tomorrow, I'm meeting my team."],targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d13-listen",title:"Three Days, Three Time Frames",
      script:"Yesterday, I spent most of the evening working on my project. I fixed one bug but didn't finish the whole feature. Today, I have classes until the afternoon, so I'm only doing a short English session right now. Tomorrow, I'm meeting my teammate after class. We're going to test the feature together, and I think we'll finish it.",
      firstListenQuestion:"What is the speaker's project status across the three days?",
      detailQuestions:[
        e({id:"d13-l1",type:"listening-comprehension",prompt:"What happened yesterday?",acceptedAnswers:["the speaker worked on the project and fixed one bug","worked on the project and fixed one bug"],targetSkill:"listening"}),
        e({id:"d13-l2",type:"listening-comprehension",prompt:"Why is today's English session short?",answer:"because I have classes until the afternoon",targetSkill:"listening"}),
        e({id:"d13-l3",type:"listening-comprehension",prompt:"What is planned for tomorrow?",answer:"meeting my teammate and testing the feature",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["didn't finish: final /t/ may be light","right now carries contrastive time stress","we're going to may compress strongly at natural speed"]
    }],
    speaking:[
      e({id:"d13-s1",type:"timed-response",prompt:"Tell me one thing you did yesterday.",targetSkill:"speaking",seconds:5}),
      e({id:"d13-s2",type:"timed-response",prompt:"Tell me one thing you usually do today/this week.",targetSkill:"speaking",seconds:5}),
      e({id:"d13-s3",type:"timed-response",prompt:"Tell me one thing you're going to do tomorrow.",targetSkill:"speaking",seconds:5}),
      e({id:"d13-s4",type:"speaking-prompt",prompt:"Main integration: Tell me about yesterday, today, and tomorrow for 35–45 seconds.",targetSkill:"speaking",seconds:45,minWords:65,modelAnswer:"Yesterday, I went to class and worked on my project. Today, I have two classes, and I'm practicing English now. Tomorrow, I'm meeting my friend after class, and I'm going to finish an assignment in the evening."})
    ],
    reading:[{
      id:"d13-read",title:"A Three-Day Development Plan",
      text:"Yesterday, the team reviewed user feedback and selected two bugs to fix. Today, they are working on the first bug and writing tests. Tomorrow, they are meeting the product owner to demonstrate the changes. After the meeting, they are going to decide whether the update is ready for release.",
      questions:[
        e({id:"d13-r1",type:"reading-comprehension",prompt:"What did the team do yesterday?",answer:"reviewed user feedback and selected two bugs",targetSkill:"reading"}),
        e({id:"d13-r2",type:"reading-comprehension",prompt:"What are they doing today?",answer:"working on the first bug and writing tests",targetSkill:"reading"}),
        e({id:"d13-r3",type:"reading-comprehension",prompt:"What will happen tomorrow?",acceptedAnswers:["they are meeting the product owner","a meeting with the product owner"],targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d13-write",type:"free-writing",prompt:"Write three short paragraphs: Yesterday / Today / Tomorrow. 35–50 words each. Check every main verb against its time frame.",targetSkill:"writing",minWords:105})
    ],
    review:[
      e({id:"d13-rev1",type:"timed-response",prompt:"Yesterday → go",answer:"went",targetSkill:"grammarProduction",seconds:3}),
      e({id:"d13-rev2",type:"timed-response",prompt:"Every day → go",answer:"go",targetSkill:"grammarProduction",seconds:3}),
      e({id:"d13-rev3",type:"timed-response",prompt:"Tomorrow plan → go",acceptedAnswers:["am going to go","I'm going to go"],targetSkill:"grammarProduction",seconds:4})
    ],
    exitCheck:[
      e({id:"d13-exit1",type:"speaking-prompt",prompt:"Speak for 45 seconds: yesterday, today, and tomorrow.",targetSkill:"speaking",seconds:45,minWords:65}),
      e({id:"d13-exit2",type:"thai-to-english",prompt:"เมื่อวานฉันทำการบ้าน วันนี้ฉันเรียน และพรุ่งนี้ฉันจะทำโปรเจกต์",acceptedAnswers:["Yesterday I did my homework, today I study, and tomorrow I'm going to work on my project.","Yesterday, I did my homework. Today, I study. Tomorrow, I'm going to work on my project."],targetSkill:"grammarProduction"})
    ],
    realWorldMission:"At three points today—morning, afternoon, night—say one past, one present and one future sentence aloud.",
    prerequisites:["day-12"],
    masteryCriteria:{minimumAccuracy:0.84,minimumProductionAccuracy:0.8,maximumResponseSeconds:4,speakingSeconds:40,notes:["Time cues trigger correct tense quickly","Can sustain multi-timeframe response without collapsing into one tense"]}
  },

  {
    id:"day-14",
    day:14,
    title:"Foundation Block Assessment — 30 to 45 Seconds",
    cefrLevel:"A2-",
    stage:"Foundation Rebuild",
    focus:"Two-week mastery checkpoint",
    prioritySkill:"speaking",
    objectives:[
      "Retest baseline prompts",
      "Demonstrate automatic present/past/future production",
      "Complete integrated listening, reading and writing",
      "Use results to decide whether to accelerate or remediate"
    ],
    estimatedMinutes:140,
    warmup:[{
      id:"d14-warmup",kind:"retrieval",title:"Calm retrieval — no new grammar",estimatedMinutes:10,
      instructionsThai:"วันนี้ไม่ยัดเนื้อหาใหม่ ให้ดึงของเดิมออกมาใช้จริง",
      exercises:[
        e({id:"d14-w1",type:"speaking-prompt",prompt:"Say five sentence starters from memory.",targetSkill:"speaking"}),
        e({id:"d14-w2",type:"speaking-prompt",prompt:"Say one present, one past and one future sentence.",targetSkill:"speaking"})
      ]
    }],
    vocabulary:[
      v("d14-v1","compared with","เมื่อเทียบกับ","Use for progress comparison.",["Compared with Day 1, I can answer faster now."]),
      v("d14-v2","more confidently","อย่างมั่นใจขึ้น","Describe improvement in confidence.",["I can speak more confidently now."]),
      v("d14-v3","I still hesitate when ...","ฉันยังลังเลเมื่อ...","Identify a specific speaking problem.",["I still hesitate when I talk about the past."]),
      v("d14-v4","my next target is ...","เป้าหมายต่อไปของฉันคือ...","Set the next learning goal.",["My next target is a one-minute answer."])
    ],
    grammar:[{
      id:"d14-grammar",kind:"assessment",title:"Production checkpoint",estimatedMinutes:25,
      explanationThai:"ห้ามใช้คะแนนรวมเดียวตัดสิน ต้องดู production, listening, reading, writing และความเร็วแยกกัน",
      exercises:[
        e({id:"d14-g1",type:"thai-to-english",prompt:"ปกติฉันทำโปรเจกต์ตอนกลางคืน",answer:"I usually work on projects at night.",targetSkill:"grammarProduction"}),
        e({id:"d14-g2",type:"thai-to-english",prompt:"เมื่อวานฉันทำการบ้านและดูวิดีโอ",answer:"Yesterday, I did my homework and watched a video.",targetSkill:"grammarProduction"}),
        e({id:"d14-g3",type:"thai-to-english",prompt:"พรุ่งนี้ฉันจะเจอเพื่อนตอนบ่ายสาม",acceptedAnswers:["I'm meeting my friend at 3 p.m. tomorrow.","I'm going to meet my friend at 3 p.m. tomorrow."],targetSkill:"grammarProduction"}),
        e({id:"d14-g4",type:"error-correction",prompt:"Correct: I am go to university every day.",answer:"I go to university every day.",targetSkill:"grammarProduction"}),
        e({id:"d14-g5",type:"error-correction",prompt:"Correct: Yesterday I do my homework.",answer:"Yesterday, I did my homework.",targetSkill:"grammarProduction"}),
        e({id:"d14-g6",type:"sentence-transformation",prompt:"You study English. → question",answer:"Do you study English?",targetSkill:"grammarProduction"})
      ]
    }],
    listening:[{
      id:"d14-listen",title:"Two Weeks of Change",
      script:"Two weeks ago, I understood some English grammar, but I had trouble using it quickly. I often translated from Thai before I spoke. During the last two weeks, I practiced short sentence patterns, questions, past tense, and future plans. I still make mistakes, but I can start simple answers faster now. My next goal is to speak for one full minute and understand more English at normal speed.",
      firstListenQuestion:"What changed during the two weeks?",
      detailQuestions:[
        e({id:"d14-l1",type:"listening-comprehension",prompt:"What did the speaker often do before speaking?",answer:"translated from Thai",targetSkill:"listening"}),
        e({id:"d14-l2",type:"listening-comprehension",prompt:"What four areas did the speaker practice?",acceptedAnswers:["short sentence patterns, questions, past tense, and future plans","sentence patterns, questions, past tense, future plans"],targetSkill:"listening"}),
        e({id:"d14-l3",type:"listening-comprehension",prompt:"What is the next speaking goal?",answer:"speak for one full minute",targetSkill:"listening"})
      ],
      connectedSpeechNotes:["two weeks ago: natural phrase stress on weeks","had trouble using it: linking across trouble-using","next goal: stress the content words"]
    }],
    speaking:[
      e({id:"d14-s1",type:"speaking-prompt",prompt:"Baseline retest 1: Introduce yourself.",targetSkill:"speaking",seconds:30,minWords:45}),
      e({id:"d14-s2",type:"speaking-prompt",prompt:"Baseline retest 2: Why do you want to improve your English?",targetSkill:"speaking",seconds:30,minWords:45}),
      e({id:"d14-s3",type:"speaking-prompt",prompt:"Baseline retest 3: What did you do yesterday?",targetSkill:"speaking",seconds:35,minWords:50}),
      e({id:"d14-s4",type:"speaking-prompt",prompt:"Baseline retest 4: What are you going to do next weekend?",targetSkill:"speaking",seconds:35,minWords:50}),
      e({id:"d14-s5",type:"speaking-prompt",prompt:"Final Day 14 challenge: Tell me about yourself, yesterday, and your next plan for 30–45 seconds.",targetSkill:"speaking",seconds:45,minWords:65})
    ],
    reading:[{
      id:"d14-read",title:"Why Automaticity Comes Before Advanced Grammar",
      text:"Advanced grammar is useful, but it does not solve a basic production bottleneck by itself. A learner may recognize conditionals or passive forms while still hesitating over simple present and past sentences. In that situation, the fastest path forward is often to automate high-frequency language first. Once the learner can build basic sentences with less conscious effort, attention becomes available for richer vocabulary, longer ideas and more complex structures.",
      questions:[
        e({id:"d14-r1",type:"reading-comprehension",prompt:"What is the main argument?",acceptedAnswers:["automate high-frequency basic language before focusing heavily on advanced grammar","basic automaticity should come before advanced grammar"],targetSkill:"reading"}),
        e({id:"d14-r2",type:"reading-comprehension",prompt:"What becomes available after basic sentences require less conscious effort?",answer:"attention for richer vocabulary, longer ideas and more complex structures",targetSkill:"reading"})
      ]
    }],
    writing:[
      e({id:"d14-write",type:"free-writing",prompt:"Write 120–150 words: 'My English after two weeks'. Include current ability, a past difficulty, evidence of progress, and the next target.",targetSkill:"writing",minWords:120})
    ],
    review:[
      e({id:"d14-rev1",type:"speaking-prompt",prompt:"Name your top three recurring errors and say the corrected patterns.",targetSkill:"speaking"}),
      e({id:"d14-rev2",type:"timed-response",prompt:"One present + one past + one future sentence in 12 seconds.",targetSkill:"speaking",seconds:12})
    ],
    exitCheck:[
      e({id:"d14-exit1",type:"speaking-prompt",prompt:"Spontaneous 30–45 second response with present, past and future.",targetSkill:"speaking",seconds:45,minWords:65}),
      e({id:"d14-exit2",type:"free-writing",prompt:"Write 10 independent sentences without notes, mixing Present Simple, Past Simple, and future forms.",targetSkill:"writing",minWords:75})
    ],
    realWorldMission:"Save today's 30–45 second recording as the first major comparison point against Day 1.",
    prerequisites:["day-13"],
    masteryCriteria:{minimumAccuracy:0.8,minimumProductionAccuracy:0.78,maximumResponseSeconds:5,speakingSeconds:30,notes:["Advance only if productive skills are adequate","If production is under 70%, remediate error categories; do not restart the whole course","Target next speaking ladder step: 45–60 seconds"]}
  }
];

export const getLesson = (id: string) => lessons.find((lesson) => lesson.id === id) ?? lessons[0];
