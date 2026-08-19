export type CourseModule = {
  id: string;
  level: string;
  title: string;
  communicativeOutcome: string;
  languageFocus: string[];
  activeChunks: string[];
  speakingChallenge: string;
  listeningFocus: string;
  readingWritingFocus: string;
  masteryGate: string;
};

export const extendedModules: CourseModule[] = [
  {
    id: "a2-1",
    level: "A2",
    title: "Experience and Recent Events",
    communicativeOutcome: "Talk about life experience and recent events without confusing finished past time with present relevance.",
    languageFocus: ["Present Perfect foundations", "Past Simple vs Present Perfect", "ever / never / already / yet"],
    activeChunks: ["I've never...", "Have you ever...?", "I just...", "I haven't ... yet"],
    speakingChallenge: "45–60 seconds: talk about three things you have or have not done.",
    listeningFocus: "Short conversations about experience at normal A2 speed.",
    readingWritingFocus: "Short personal experience text + 100-word response.",
    masteryGate: "80% productive tense choice and a 45-second answer with limited hesitation."
  },
  {
    id: "a2-2",
    level: "A2",
    title: "Describe What Is Happening",
    communicativeOutcome: "Describe ongoing actions, temporary situations and simple changes.",
    languageFocus: ["Present Continuous review", "Present Simple vs Continuous", "state verbs foundations"],
    activeChunks: ["right now", "these days", "I'm currently...", "I'm working on..."],
    speakingChallenge: "Describe a current project and what is happening around you for one minute.",
    listeningFocus: "Descriptions of current work, study and everyday situations.",
    readingWritingFocus: "Project status update + short message.",
    masteryGate: "Use routine vs current-action contrast accurately in connected speech."
  },
  {
    id: "a2-3",
    level: "A2",
    title: "Requests, Help and Clarification",
    communicativeOutcome: "Ask for help, repeat information and make polite everyday requests.",
    languageFocus: ["can / could", "imperatives", "basic politeness", "question forms"],
    activeChunks: ["Could you help me...?", "Could you say that again?", "What does ... mean?", "How do I...?"],
    speakingChallenge: "Role-play a 2-minute help conversation.",
    listeningFocus: "Instructions and clarification requests.",
    readingWritingFocus: "Simple support chat and concise request message.",
    masteryGate: "Handle a short misunderstanding without switching to Thai."
  },
  {
    id: "a2-4",
    level: "A2",
    title: "Comparing Options",
    communicativeOutcome: "Compare products, tools, courses and everyday choices.",
    languageFocus: ["comparatives", "superlatives", "much / a bit / slightly", "because / so"],
    activeChunks: ["better for...", "easier to use", "more useful than", "the main difference is..."],
    speakingChallenge: "Compare two programming tools or two apps for 60–75 seconds.",
    listeningFocus: "Simple comparisons and recommendations.",
    readingWritingFocus: "Product/tool comparison + 120-word recommendation.",
    masteryGate: "Give at least three clear comparison points and a reasoned choice."
  },
  {
    id: "a2-5",
    level: "A2",
    title: "Travel and Everyday Problem Solving",
    communicativeOutcome: "Handle basic travel, shopping, directions and service problems.",
    languageFocus: ["there is/are", "prepositions", "countable/uncountable", "some/any", "should"],
    activeChunks: ["I'm looking for...", "Is there...?", "How can I get to...?", "I have a problem with..."],
    speakingChallenge: "Three short travel/service role-plays.",
    listeningFocus: "Directions, announcements and simple service interactions.",
    readingWritingFocus: "Signs, schedules, messages and a short complaint.",
    masteryGate: "Resolve a simulated everyday problem with understandable English."
  },
  {
    id: "a2-6",
    level: "A2+",
    title: "A2 Integration and Readiness",
    communicativeOutcome: "Integrate basic tense, question, comparison, request and experience language independently.",
    languageFocus: ["A2 integration", "high-frequency error repair", "automatic question formation"],
    activeChunks: ["In my experience...", "The reason is...", "It depends on...", "Could you clarify...?"],
    speakingChallenge: "2-minute guided conversation + 1-minute individual response.",
    listeningFocus: "One-minute A2 content at normal speed with gist/detail/inference.",
    readingWritingFocus: "A2 article + 120–150 word connected response.",
    masteryGate: "Pass productive A2 readiness criteria before B1."
  },

  {
    id: "b1-1",
    level: "B1",
    title: "Tell Better Stories",
    communicativeOutcome: "Tell a coherent story with background, events and outcome.",
    languageFocus: ["Past Continuous", "Past Simple", "Past Perfect foundations", "sequence markers"],
    activeChunks: ["while I was...", "by the time...", "what happened was...", "in the end..."],
    speakingChallenge: "Tell a 2-minute story about a problem or memorable event.",
    listeningFocus: "Narratives with background details and event sequence.",
    readingWritingFocus: "Narrative article + structured story.",
    masteryGate: "Maintain timeline clarity for two minutes."
  },
  {
    id: "b1-2",
    level: "B1",
    title: "Explain a Programming Problem",
    communicativeOutcome: "Describe a bug, expected behavior, actual behavior and attempted fixes.",
    languageFocus: ["cause/effect", "relative clauses", "technical noun phrases", "Past Simple/Present Perfect"],
    activeChunks: ["The issue occurs when...", "I expected..., but...", "I tried...", "The error seems to..."],
    speakingChallenge: "Explain a real or simulated bug for 90 seconds, then answer follow-ups.",
    listeningFocus: "Developer-style problem descriptions.",
    readingWritingFocus: "Bug report, issue description and documentation snippet.",
    masteryGate: "Listener can understand problem, steps and result without major clarification."
  },
  {
    id: "b1-3",
    level: "B1",
    title: "Opinions, Reasons and Tradeoffs",
    communicativeOutcome: "State opinions, support them and acknowledge simple disadvantages.",
    languageFocus: ["linking words", "first/second conditionals", "modals", "although / however"],
    activeChunks: ["I think the main reason is...", "One advantage is...", "However...", "If..., then..."],
    speakingChallenge: "2-minute opinion: Should students use AI coding assistants?",
    listeningFocus: "Short opinion exchanges with agreement/disagreement.",
    readingWritingFocus: "Opinion article + 150–180 word response.",
    masteryGate: "Give a claim, two reasons, one limitation and conclusion."
  },
  {
    id: "b1-4",
    level: "B1",
    title: "Instructions and Processes",
    communicativeOutcome: "Explain how a process works and give clear step-by-step instructions.",
    languageFocus: ["imperatives", "passive foundations", "sequence clauses", "purpose: to / so that"],
    activeChunks: ["First, you need to...", "Once you've...", "This is used to...", "Make sure you..."],
    speakingChallenge: "Explain how to set up a simple development project.",
    listeningFocus: "Procedural explanations and tutorials.",
    readingWritingFocus: "README-style instructions and process description.",
    masteryGate: "A listener could follow the process without missing a critical step."
  },
  {
    id: "b1-5",
    level: "B1",
    title: "Study and Work Communication",
    communicativeOutcome: "Participate in meetings, classes and project coordination.",
    languageFocus: ["reported speech foundations", "modal verbs", "future forms", "polite suggestions"],
    activeChunks: ["Could we...?", "I suggest we...", "He said that...", "I'll take care of..."],
    speakingChallenge: "Simulate a 3-minute project meeting.",
    listeningFocus: "Short meeting excerpts and classroom discussion.",
    readingWritingFocus: "Professional message, task update and meeting note.",
    masteryGate: "Coordinate tasks, ask for clarification and summarize next steps."
  },
  {
    id: "b1-6",
    level: "B1",
    title: "Travel, Social and International Communication",
    communicativeOutcome: "Manage unfamiliar but common situations with reasonable independence.",
    languageFocus: ["indirect questions", "modals", "conditionals", "phrasal verbs"],
    activeChunks: ["Would you mind...?", "Do you know if...?", "It depends on...", "I ended up..."],
    speakingChallenge: "Three role-plays with unexpected follow-up questions.",
    listeningFocus: "Different clear international accents.",
    readingWritingFocus: "Travel information, social messages and short reviews.",
    masteryGate: "Recover from misunderstanding and maintain interaction."
  },
  {
    id: "b1-7",
    level: "B1+",
    title: "Present a Project",
    communicativeOutcome: "Give a structured 2–3 minute project presentation.",
    languageFocus: ["signposting", "relative clauses", "passive voice", "present perfect for progress"],
    activeChunks: ["The goal of this project is...", "The system consists of...", "So far, we've...", "The next step is..."],
    speakingChallenge: "3-minute presentation: problem → solution → architecture → result.",
    listeningFocus: "Short technical presentations.",
    readingWritingFocus: "Slide notes + project summary.",
    masteryGate: "Clear structure, understandable technical language and successful follow-up answers."
  },
  {
    id: "b1-8",
    level: "B1+",
    title: "B1 Readiness Check",
    communicativeOutcome: "Demonstrate independent everyday, academic and technical English.",
    languageFocus: ["B1 integration", "recurring error repair", "fluency under time pressure"],
    activeChunks: ["From my point of view...", "The main issue is...", "What I mean is...", "In that case..."],
    speakingChallenge: "3-minute integrated conversation and presentation task.",
    listeningFocus: "Natural B1 content with detail and attitude questions.",
    readingWritingFocus: "B1 technical/general text + 180-word structured writing.",
    masteryGate: "Meet B1 productive and receptive criteria before B2."
  },

  {
    id: "b2-1",
    level: "B2",
    title: "Explain Systems and Architecture",
    communicativeOutcome: "Explain components, data flow, dependencies and design decisions.",
    languageFocus: ["passive structures", "relative clauses", "participle clauses foundations", "technical collocation"],
    activeChunks: ["is responsible for...", "communicates with...", "is designed to...", "a key tradeoff is..."],
    speakingChallenge: "3–4 minute system architecture explanation.",
    listeningFocus: "Technical talks and architecture discussions.",
    readingWritingFocus: "Documentation-style architecture text + technical summary.",
    masteryGate: "Explain a system so a technical listener can reconstruct the high-level design."
  },
  {
    id: "b2-2",
    level: "B2",
    title: "Argue a Position",
    communicativeOutcome: "Build and defend an argument with counterpoints.",
    languageFocus: ["advanced linking", "second/third conditionals", "modal deduction", "concession"],
    activeChunks: ["A stronger argument is...", "That may be true, but...", "Even if...", "The evidence suggests..."],
    speakingChallenge: "4-minute argument: Will AI replace some software jobs?",
    listeningFocus: "Debate and interview excerpts.",
    readingWritingFocus: "Argumentative article + 220–250 word essay.",
    masteryGate: "Claim, evidence, counterargument, rebuttal and conclusion are coherent."
  },
  {
    id: "b2-3",
    level: "B2",
    title: "Summarize and Paraphrase",
    communicativeOutcome: "Restate complex information accurately without copying wording.",
    languageFocus: ["reporting verbs", "nominalization foundations", "synonym control", "reference language"],
    activeChunks: ["The author argues that...", "In other words...", "The main point is...", "This can be summarized as..."],
    speakingChallenge: "Listen/read and give a 90-second summary.",
    listeningFocus: "Longer explanatory content.",
    readingWritingFocus: "Paraphrase paragraphs and write concise summaries.",
    masteryGate: "Preserve meaning while changing structure and vocabulary."
  },
  {
    id: "b2-4",
    level: "B2",
    title: "Professional Communication and Register",
    communicativeOutcome: "Shift between casual, neutral and professional English.",
    languageFocus: ["register", "indirectness", "hedging foundations", "formal linking"],
    activeChunks: ["Could you please...?", "I'd appreciate it if...", "It appears that...", "Just wanted to check..."],
    speakingChallenge: "Same message in casual teammate vs professional client register.",
    listeningFocus: "Workplace meetings and customer communication.",
    readingWritingFocus: "Professional email, status report and concise escalation.",
    masteryGate: "Choose register that fits relationship and purpose."
  },
  {
    id: "b2-5",
    level: "B2",
    title: "Natural-Speed Listening and Accent Flexibility",
    communicativeOutcome: "Follow normal speech with reductions, implied connections and different accents.",
    languageFocus: ["connected speech decoding", "discourse markers", "ellipsis", "informal spoken forms"],
    activeChunks: ["what I mean is...", "you know...", "the thing is...", "as far as I know..."],
    speakingChallenge: "Shadow and then summarize a 2-minute natural-speed passage.",
    listeningFocus: "Multiple clear accents, reductions and unscripted-style pacing.",
    readingWritingFocus: "Transcript analysis and spoken-to-written reformulation.",
    masteryGate: "Capture gist, most key details and speaker attitude at normal speed."
  },
  {
    id: "b2-6",
    level: "B2",
    title: "Documentation and Technical Reading",
    communicativeOutcome: "Read technical documentation efficiently without translating sentence by sentence.",
    languageFocus: ["complex noun phrases", "participles", "reference words", "condition clauses"],
    activeChunks: ["is intended to...", "in the event that...", "provided that...", "is required for..."],
    speakingChallenge: "Explain a documentation section in simpler English.",
    listeningFocus: "Technical walkthrough that mirrors documentation concepts.",
    readingWritingFocus: "README/API/cloud/microservices texts + summary and issue note.",
    masteryGate: "Locate key information, infer terms and explain the content independently."
  },
  {
    id: "b2-7",
    level: "B2",
    title: "Presentation and Q&A",
    communicativeOutcome: "Present for 4–5 minutes and handle follow-up questions.",
    languageFocus: ["signposting", "reformulation", "modal nuance", "emphasis"],
    activeChunks: ["Let me clarify...", "To put that another way...", "The key point here is...", "That's a fair question..."],
    speakingChallenge: "5-minute technical/business presentation + Q&A.",
    listeningFocus: "Presentation questions and spontaneous responses.",
    readingWritingFocus: "Executive summary and slide narration.",
    masteryGate: "Maintain organization under follow-up pressure."
  },
  {
    id: "b2-8",
    level: "B2+",
    title: "B2 Readiness Check",
    communicativeOutcome: "Demonstrate independent advanced-user ability across technical, academic and social English.",
    languageFocus: ["B2 integration", "precision", "fluency", "error reduction"],
    activeChunks: ["On balance...", "A potential drawback is...", "What this implies is...", "I'd distinguish between..."],
    speakingChallenge: "5-minute discussion with counterargument and follow-ups.",
    listeningFocus: "Natural-speed B2 material with inference.",
    readingWritingFocus: "Complex article + 250-word analytical response.",
    masteryGate: "Meet B2 criteria before C1 training."
  },

  {
    id: "c1-1",
    level: "C1",
    title: "Nuance, Stance and Hedging",
    communicativeOutcome: "Express certainty, uncertainty, limitation and stance precisely.",
    languageFocus: ["advanced modality", "hedging", "stance adverbs", "qualifying clauses"],
    activeChunks: ["to some extent", "it would appear that...", "arguably", "there is little reason to assume..."],
    speakingChallenge: "Discuss a controversial technology claim while qualifying certainty.",
    listeningFocus: "Academic/professional speakers signaling stance.",
    readingWritingFocus: "Analytical paragraph with calibrated claims.",
    masteryGate: "Avoid absolute claims when evidence is uncertain and explain degrees of confidence."
  },
  {
    id: "c1-2",
    level: "C1",
    title: "Complex Argument Architecture",
    communicativeOutcome: "Develop nuanced arguments that integrate competing viewpoints.",
    languageFocus: ["inversion", "cleft sentences", "advanced concession", "rhetorical organization"],
    activeChunks: ["While I agree that...", "That said...", "A more significant issue is...", "This raises the question of whether..."],
    speakingChallenge: "6-minute discussion with explicit counterargument handling.",
    listeningFocus: "Panel-style arguments and rebuttals.",
    readingWritingFocus: "Analytical essay with thesis, counterargument and synthesis.",
    masteryGate: "Argument remains coherent while acknowledging complexity."
  },
  {
    id: "c1-3",
    level: "C1",
    title: "Synthesis Across Sources",
    communicativeOutcome: "Combine multiple texts or viewpoints into one coherent explanation.",
    languageFocus: ["reporting structures", "nominalization", "complex noun phrases", "source integration"],
    activeChunks: ["Taken together...", "Both sources point to...", "Where they differ is...", "The broader implication is..."],
    speakingChallenge: "Synthesize two short sources in a 3-minute briefing.",
    listeningFocus: "Two-source listening with overlap and disagreement.",
    readingWritingFocus: "Multi-source synthesis memo.",
    masteryGate: "Integrate rather than list sources separately."
  },
  {
    id: "c1-4",
    level: "C1",
    title: "Professional Precision and Reformulation",
    communicativeOutcome: "Reformulate ideas instantly when wording fails or the audience needs clarity.",
    languageFocus: ["clefts", "substitution", "advanced cohesion", "register shifting"],
    activeChunks: ["What I'm getting at is...", "Let me rephrase that...", "More precisely...", "In practical terms..."],
    speakingChallenge: "Explain the same technical concept to a beginner, engineer and manager.",
    listeningFocus: "Professional explanations with reformulation.",
    readingWritingFocus: "Rewrite technical content for three audiences.",
    masteryGate: "Meaning stays accurate while register and complexity change."
  },
  {
    id: "c1-5",
    level: "C1",
    title: "Implicit Meaning and Pragmatics",
    communicativeOutcome: "Recognize implication, attitude, diplomacy and indirect disagreement.",
    languageFocus: ["pragmatic markers", "indirectness", "intonation-aware meaning", "advanced modality"],
    activeChunks: ["I'm not entirely convinced...", "That might be worth reconsidering.", "I see where you're coming from...", "There may be another way to look at it."],
    speakingChallenge: "Diplomatically challenge proposals in a simulated meeting.",
    listeningFocus: "Implied disagreement, attitude and subtle evaluation.",
    readingWritingFocus: "Tone analysis and diplomatic response writing.",
    masteryGate: "Infer intended meaning and respond with socially appropriate precision."
  },
  {
    id: "c1-6",
    level: "C1",
    title: "Advanced Technical and Business Discussion",
    communicativeOutcome: "Discuss architecture, AI, product strategy and tradeoffs at professional depth.",
    languageFocus: ["complex noun phrases", "nominalization", "advanced conditionals", "technical collocation"],
    activeChunks: ["from a scalability perspective...", "the constraint we're dealing with...", "the tradeoff comes down to...", "a failure mode would be..."],
    speakingChallenge: "8-minute system/product decision discussion.",
    listeningFocus: "Long-form technical and business discussions.",
    readingWritingFocus: "Design rationale, tradeoff memo and architecture critique.",
    masteryGate: "Sustain precision and coherence while reasoning through tradeoffs."
  },
  {
    id: "c1-7",
    level: "C1",
    title: "Academic and Analytical Writing",
    communicativeOutcome: "Write controlled, cohesive and nuanced analytical prose.",
    languageFocus: ["nominalization", "advanced cohesion", "complex noun phrases", "stance", "register"],
    activeChunks: ["the extent to which...", "a key limitation of this view...", "the available evidence suggests...", "a plausible explanation is..."],
    speakingChallenge: "Oral defense of a written thesis.",
    listeningFocus: "Academic mini-lecture with note-taking.",
    readingWritingFocus: "350–500 word analytical essay/report.",
    masteryGate: "Clear thesis, logical development, nuanced stance, cohesion and appropriate register."
  },
  {
    id: "c1-8",
    level: "C1",
    title: "C1 Exit Assessment",
    communicativeOutcome: "Demonstrate flexible, precise and independent English across academic, professional, technical and social tasks.",
    languageFocus: ["integrated C1 language use", "precision", "fluency", "reformulation", "register"],
    activeChunks: ["language selected by task rather than memorized decoration"],
    speakingChallenge: "Presentation + abstract discussion + spontaneous follow-up questions.",
    listeningFocus: "Natural-speed professional/academic material with implication and attitude.",
    readingWritingFocus: "Advanced reading synthesis + analytical and professional writing.",
    masteryGate: "Meet the C1 rubric across productive and receptive skills; course completion alone is insufficient."
  }
];
