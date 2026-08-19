export type ModuleMaterial = {
  topic: string;
  listeningScript: string;
  readingText: string;
  discussionPrompt: string;
  realWorldMission: string;
  technicalTransfer: string;
};

export const moduleMaterials: Record<string, ModuleMaterial> = {
  "a2-1": {
    topic: "Learning experiences and recent progress",
    listeningScript: `Mina studies computer engineering. She has used English in class before, but she has never studied it every day. This month, she has started a new routine. She has already changed her phone and laptop interfaces to English, and she has watched several short programming videos without Thai subtitles. Yesterday, she watched a video about Git and wrote down five useful phrases. She hasn't spoken to a foreign student yet, but she wants to try soon. She says the biggest change is that English now feels like something she uses, not only a school subject.`,
    readingText: `Learning a language is easier to notice when you compare specific experiences. A learner may say, "I have studied English for years," but that sentence does not show what the learner can actually do. A more useful question is: what have you done in English recently? Perhaps you have read a README, watched a tutorial, written a message, or explained a small idea aloud. These experiences create evidence of real use. Finished events with a clear past time are different. You can say, "I watched a Git tutorial yesterday," because yesterday is finished. If the important point is the experience itself, you can say, "I've watched several Git tutorials." Good speakers switch between these two viewpoints naturally.`,
    discussionPrompt: "Which English experiences have you already had, and which ones have you not tried yet?",
    realWorldMission: "Open the history of one app or website you use and describe three things you have done recently in English.",
    technicalTransfer: "Explain which programming tools or languages you have used and when you first used one of them."
  },
  "a2-2": {
    topic: "Current projects and temporary situations",
    listeningScript: `Ken usually studies in the university library, but this week he is working from home because his team is preparing a demo. He normally uses his laptop for classes and coding practice. Right now, he is testing a small web application while his teammate is fixing the login page. The project is changing quickly, so they are meeting online every evening. Ken likes the project, but he is also sleeping less than usual. He knows that this schedule is temporary. After the demo, he is going back to his normal routine.`,
    readingText: `We use different language when we describe routines and temporary situations. A routine is something that is generally true: a developer checks email every morning, a student attends class on weekdays, or a team uses Git for version control. A current situation may be temporary: the team is testing a new service this week, the student is preparing for a presentation, or the developer is working from another office today. The difference matters because it tells the listener whether something is normal or happening around now. In project communication, this contrast is especially useful when giving status updates.`,
    discussionPrompt: "What do you normally do during the week, and what are you doing differently these days?",
    realWorldMission: "Give a 60-second spoken status update about what you are currently studying or building.",
    technicalTransfer: "Describe what your project normally does and what part you are currently changing."
  },
  "a2-3": {
    topic: "Asking for help and clarification",
    listeningScript: `A student is installing a development tool in a computer lab. An error message appears, so he asks the teaching assistant for help. He says, "Could you help me with this error?" The assistant explains the first step, but the student does not hear one word clearly. He asks, "Could you say that again?" Then he sees an unfamiliar term and asks, "What does dependency mean here?" The assistant gives a short explanation and shows him where to find the setting. The student solves the problem without changing to Thai.`,
    readingText: `Strong communication does not mean understanding everything immediately. It also means knowing how to repair a conversation. If you miss information, you can ask the speaker to repeat it. If one word is unclear, ask what it means. If an instruction is too fast, ask the speaker to slow down or show the step again. These simple strategies are important in classrooms, workplaces, travel, and technical support. They keep the interaction moving and reduce the pressure to understand every word on the first try.`,
    discussionPrompt: "What can you say when you do not understand an instruction, a word, or a fast speaker?",
    realWorldMission: "Practice five clarification phrases aloud until you can say each one without looking.",
    technicalTransfer: "Role-play asking a teammate for help with an installation or coding error."
  },
  "a2-4": {
    topic: "Comparing tools and choices",
    listeningScript: `Two students are choosing a note-taking app for a group project. One app is cheaper and easier to use, but the other has better collaboration features. The first student says the cheaper app is good enough for simple notes. The second student thinks the more expensive app is more useful because several people can edit the same page at the same time. In the end, they choose the second app because teamwork is more important for this project than price.`,
    readingText: `A useful comparison does more than say that one thing is better. It explains better for what purpose. A lightweight code editor may be faster to open, while a full IDE may be more powerful for debugging. A cheap laptop may be good enough for documents but less suitable for machine learning. When you compare options, choose clear criteria such as price, speed, ease of use, reliability, features, or learning curve. Then explain which criterion matters most in the situation.`,
    discussionPrompt: "Compare two apps, programming tools, games, or devices you know well and recommend one for a specific user.",
    realWorldMission: "Record a 75-second comparison of two products or tools using at least three comparison points.",
    technicalTransfer: "Compare two programming languages, frameworks, editors, or cloud services for one use case."
  },
  "a2-5": {
    topic: "Travel and everyday problem solving",
    listeningScript: `Nina has just arrived at a train station in another country. She needs to get to her hotel, but she cannot find the correct platform. She asks an employee, "Excuse me, how can I get to Central Station?" The employee tells her to take the blue line and change trains after three stops. Later, Nina notices that her ticket does not open the gate. She says, "I have a problem with my ticket. Could you help me?" The employee checks it and lets her through. Nina solves both problems using simple English.`,
    readingText: `When you travel, you rarely need perfect English. You need useful English that helps you complete a task. You may need to find a place, ask whether something is available, understand a price, explain a problem, or request help. Short, clear sentences are often more effective than complicated ones. Listening is equally important because answers may include numbers, times, directions, and place names. A good travel learner practices both the question and the kind of answer that may follow.`,
    discussionPrompt: "What English would you need if your phone stopped working while you were travelling alone?",
    realWorldMission: "Simulate three mini situations: asking for directions, checking into a hotel, and reporting a problem.",
    technicalTransfer: "Explain a simple technical problem to a service desk as if the other person cannot see your screen."
  },
  "a2-6": {
    topic: "A2 integration",
    listeningScript: `Arun is describing how his English has changed. He says that he usually studies for a short time in the morning and practices speaking in the evening. Last weekend, he tried to explain a programming project in English for one minute. It was difficult, but he finished the attempt. He has also started asking simple questions in English when he watches technical videos. Next week, he is going to practice travel situations and compare two apps. He still makes mistakes, but he can now build basic sentences faster than before.`,
    readingText: `A2 ability is not one grammar chapter. It is the ability to combine basic language for real purposes. A learner needs to talk about routines, past events, plans, experiences, preferences, comparisons, needs, and problems. The learner also needs to ask questions and understand common answers. At this stage, mistakes are expected. The important change is independence: the learner can communicate a simple message, repair some misunderstandings, and connect several sentences without translating every individual word.`,
    discussionPrompt: "Show your A2 range: routine, yesterday, experience, comparison, problem, and next plan in one connected response.",
    realWorldMission: "Complete the A2 readiness simulation without using Thai during the speaking portion.",
    technicalTransfer: "Give a one-minute project update that includes what you usually do, what you did, what you have finished, and what you will do next."
  },
  "b1-1": {
    topic: "Storytelling and timelines",
    listeningScript: `Last semester, Pat was preparing a live demo for a class project when his laptop suddenly restarted. He had tested the application the night before, so he thought everything was ready. While the computer was starting again, his teammate connected another laptop to the projector. By the time Pat logged back in, the class was already waiting. What happened next was surprisingly useful: the backup laptop had an older version of the project, and the team had to explain the missing features instead of showing them. In the end, the presentation went well because they stayed calm and told the audience exactly what had happened.`,
    readingText: `A clear story gives the listener a timeline. Background actions explain what was happening; main events move the story forward; earlier events can explain why the situation existed; and sequence markers help the listener follow the order. This matters outside entertainment. Engineers tell stories when they describe incidents, students tell stories when they explain project failures, and professionals use narratives to explain how a decision was made. A strong story is selective: it includes details that help the listener understand the event and leaves out details that do not matter.`,
    discussionPrompt: "Tell a story about a technical problem, presentation, trip, game, or university event that did not go as planned.",
    realWorldMission: "Record a two-minute story with clear background, problem, response, and outcome.",
    technicalTransfer: "Tell the story of a bug or outage from first symptom to final fix."
  },
  "b1-2": {
    topic: "Explaining a programming problem",
    listeningScript: `A developer is reporting a login bug. The issue occurs when a user signs in on a mobile browser after the session token has expired. The page should redirect the user to the login screen, but instead it stays on a loading state. The developer has reproduced the bug three times. She first thought the API was returning an error, but the network request is actually successful. She has already checked the server logs and tried clearing local storage. The error seems to come from the client-side state not updating after the token refresh. Her next step is to add logging around the authentication hook and compare the mobile and desktop flows.`,
    readingText: `A useful bug report lets another person understand the problem without watching you reproduce it. Start with the context: where and when does the issue occur? Then state the expected behavior and the actual behavior. Add reproducible steps, relevant error messages, and what you have already tried. Avoid vague descriptions such as "it doesn't work." Technical English becomes much easier when you organize the explanation around this structure. The grammar is less important than the information architecture, although accurate tense helps distinguish the current problem from previous troubleshooting attempts.`,
    discussionPrompt: "Explain a real or imagined bug using context, expected behavior, actual behavior, attempts, and next step.",
    realWorldMission: "Write a concise GitHub-style issue in English and then explain it aloud for 90 seconds.",
    technicalTransfer: "Use the bug-report structure on a problem from one of your own projects."
  },
  "b1-3": {
    topic: "Opinions and tradeoffs",
    listeningScript: `Two students are discussing AI coding assistants. One student argues that the tools are useful because they can explain unfamiliar code and reduce time spent on repetitive tasks. The other student agrees that they are convenient but worries that beginners may accept suggestions without understanding them. They both think the best approach depends on how the tool is used. If students check the output, ask why it works, and test it themselves, the assistant can support learning. However, if they copy everything automatically, they may become faster without becoming better programmers.`,
    readingText: `A strong opinion is not just a preference. It includes a claim, reasons, evidence or examples, and awareness of limitations. Tradeoffs are common in technology: speed versus maintainability, convenience versus privacy, cost versus reliability, and automation versus control. When you discuss a tradeoff, avoid treating one side as completely good and the other as completely bad. Explain the conditions under which each option makes sense. This creates more realistic arguments and prepares you for advanced discussion later.`,
    discussionPrompt: "Should students use AI coding assistants while learning programming? Give a position, two reasons, one limitation, and a conclusion.",
    realWorldMission: "Speak for two minutes on one technology tradeoff without reading a script.",
    technicalTransfer: "Compare developer productivity with code quality or learning depth in an AI-assisted workflow."
  },
  "b1-4": {
    topic: "Instructions and processes",
    listeningScript: `A teaching assistant is explaining how to start a small web project. First, create a new project folder and open it in your editor. Next, initialize the package file and install the dependencies. Once the installation has finished, create the basic source folders. Then add a simple start script so that the development server can be launched with one command. Before you make major changes, initialize Git and create the first commit. This makes it easier to return to a working version if something breaks later.`,
    readingText: `Good instructions are designed from the user's point of view. They state prerequisites, put steps in a logical order, warn about important conditions, and show how to verify success. In technical writing, sequence words help, but they are not enough by themselves. A step should contain an action and, when necessary, a reason or expected result. For example, "Run the test command" is clearer when it is followed by what a successful result should look like. The best process explanations also distinguish required steps from optional improvements.`,
    discussionPrompt: "Explain how to set up, use, or troubleshoot a tool you know well.",
    realWorldMission: "Create a five-step English setup guide for a real tool and test whether another person could follow it.",
    technicalTransfer: "Explain the setup flow for a NestJS, Next.js, Docker, Git, or database project."
  },
  "b1-5": {
    topic: "Study and work coordination",
    listeningScript: `A project team is planning the next week. One member says that the database migration is taking longer than expected. Another suggests moving the demo by one day, but the team leader would rather reduce the demo scope. They agree that Mina will finish the API changes, Ken will update the frontend, and Pat will prepare the test data. Before the meeting ends, the leader summarizes the decision and asks everyone to post an update by Thursday afternoon.`,
    readingText: `Meetings require several language functions at the same time. You may need to suggest an idea, disagree politely, volunteer for a task, ask for clarification, report what someone said, and confirm the next step. The most useful language is often short and reusable. Clear coordination also depends on listening: a participant needs to notice decisions, owners, deadlines, and unresolved questions. After a meeting, a concise written summary can prevent misunderstandings that were not obvious during the conversation.`,
    discussionPrompt: "Simulate a project meeting in which the team has a delay and must choose what to change.",
    realWorldMission: "Record a three-minute meeting simulation and write a four-line summary of decisions and next steps.",
    technicalTransfer: "Coordinate tasks for a small software release or class project."
  },
  "b1-6": {
    topic: "International communication and recovery strategies",
    listeningScript: `During a trip, Leo talks with three people who have different accents. He understands the hotel receptionist easily, but he misses part of a question from another traveller. Instead of pretending to understand, he asks, "Do you mean the train that leaves before eight?" Later, a restaurant employee uses a word he does not know. Leo asks for a simpler explanation. He notices that successful communication is not about catching every sound. It is about getting enough meaning, checking uncertain information, and keeping the conversation moving.`,
    readingText: `International English includes many accents and speaking styles. A learner who only practices one careful textbook voice may feel lost when rhythm or pronunciation changes. At B1, the goal is not to understand every accent perfectly. It is to recognize key information, use context, and repair gaps. Confirmation questions are especially powerful because they turn uncertain listening into interaction. Saying "Do you mean...?" or "So I should...?" checks your interpretation and gives the other person a chance to correct it.`,
    discussionPrompt: "How would you recover if you understood only 60% of what another English speaker said?",
    realWorldMission: "Listen to two different English speakers online and note three pronunciation or rhythm differences without judging the accents.",
    technicalTransfer: "Practice confirming requirements with an international teammate when part of the request is unclear."
  },
  "b1-7": {
    topic: "Presenting a project",
    listeningScript: `A student is presenting a campus navigation app. She begins by explaining the problem: new students often have difficulty finding classrooms and offices. The goal of the project is to provide simple indoor directions from a phone. The system consists of a web interface, a small location database, and an API. So far, the team has built the main navigation flow and tested it in one building. The biggest limitation is that location data must currently be entered manually. The next step is to improve the map data and test the app with first-year students.`,
    readingText: `A short project presentation becomes easier when the structure is stable. Start with the problem and why it matters. Then explain the solution at a high level, followed by the main components or approach. Show evidence of progress or results, mention one meaningful limitation, and finish with the next step. This structure prevents a technical presentation from becoming a list of features. It also helps the audience ask better questions because they understand the purpose before hearing implementation details.`,
    discussionPrompt: "Present one of your projects as problem → solution → architecture → progress → limitation → next step.",
    realWorldMission: "Give a three-minute project presentation and answer two self-generated follow-up questions.",
    technicalTransfer: "Use your real architecture, stack, or service design as the presentation content."
  },
  "b1-8": {
    topic: "B1 integration",
    listeningScript: `In a project review, a student explains a recent problem, gives an opinion about the solution, and describes the next steps. She speaks for several minutes without changing to Thai. When the reviewer asks an unexpected question, she pauses, reformulates the question, and gives a shorter answer first. Her grammar is not perfect, but the message remains clear. She can explain familiar technical ideas, understand most of the review, and repair communication when necessary. This is the kind of independence expected before moving into B2 work.`,
    readingText: `B1 is a practical independence threshold. A B1 learner can connect ideas, describe experiences, explain familiar work, give reasons, and manage many common situations. The learner still searches for words and may simplify complex ideas, but communication usually succeeds. Moving to B2 requires more than adding advanced grammar. It requires longer discourse, faster listening, stronger vocabulary networks, better paraphrasing, and the ability to discuss advantages, limitations, causes, and consequences in greater depth.`,
    discussionPrompt: "Demonstrate B1 independence with a project explanation, an opinion, a past event, and follow-up answers.",
    realWorldMission: "Complete the B1 readiness simulation and compare the recording with your A2 checkpoint.",
    technicalTransfer: "Explain a project decision and respond to three questions without prepared sentences."
  },
  "b2-1": {
    topic: "Systems, architecture and tradeoffs",
    listeningScript: `A team is deciding whether to split a growing application into several services. One engineer argues that separate services would allow teams to deploy independently and scale expensive components more selectively. Another engineer points out that the current system is still manageable and that distribution would add network failures, observability work, and deployment complexity. The team eventually agrees that the architectural question should not be "Are microservices better?" but "Which constraints are now serious enough to justify the additional complexity?" They decide to isolate one high-load component first and measure the result before making a larger migration.`,
    readingText: `Architecture decisions are rarely about choosing a universally superior technology. They are about matching a design to constraints. A monolith can be easier to develop, test, and operate when a system is small. Distributed services can provide organizational and scaling advantages when teams or workloads grow, but they introduce coordination costs and new failure modes. Mature technical discussion therefore focuses on assumptions, evidence, and tradeoffs. The strongest explanation states the current constraint, compares plausible options, identifies consequences, and makes a recommendation that can be revisited if the context changes.`,
    discussionPrompt: "When is a more complex architecture justified, and when is simplicity a stronger engineering choice?",
    realWorldMission: "Explain one architecture tradeoff for four minutes using constraints, options, risks, and recommendation.",
    technicalTransfer: "Discuss monolith vs microservices, SQL vs NoSQL, cloud vs local deployment, or another real system choice."
  },
  "b2-2": {
    topic: "Evidence, cause and uncertainty",
    listeningScript: `A product team notices that user sign-ups fell after a redesign. At first, several people assume the new page is the cause. A data analyst warns that the timing alone does not prove causation. Traffic sources also changed that week, and a mobile advertising campaign ended at the same time. The team compares conversion by device and traffic source and discovers that the largest decline came from one channel, not from the redesigned page itself. The redesign may still have had an effect, but the available evidence does not support the original confident claim.`,
    readingText: `Advanced discussion requires careful control of certainty. People often confuse correlation with causation, especially when two changes happen together. Good analytical language distinguishes what is known, what is likely, what is possible, and what remains uncertain. This matters in engineering incidents, business metrics, scientific claims, and everyday reasoning. Rather than saying "X caused Y" too early, a careful speaker may say that X appears to be associated with Y, that the evidence suggests a possible effect, or that another explanation cannot yet be ruled out.`,
    discussionPrompt: "How should a team talk about a suspected cause before it has enough evidence?",
    realWorldMission: "Take one strong claim from technology or business and reformulate it at three levels of certainty.",
    technicalTransfer: "Explain a performance regression or bug hypothesis while distinguishing evidence from assumption."
  },
  "b2-3": {
    topic: "Summarization and paraphrasing",
    listeningScript: `A lecturer explains that summarizing is not the same as shortening every sentence. A good summary identifies the central claim, selects the supporting points that are necessary to understand it, and removes examples or repetition that are not essential. Paraphrasing is different again: it expresses the same meaning using a new structure and vocabulary. Both skills require understanding first. If a learner changes individual words without understanding the relationship between ideas, the result may be inaccurate even if it looks different from the source.`,
    readingText: `Technical learners often need to move information between forms. They may read documentation and explain it to a teammate, watch a lecture and write notes, or compare several sources before making a recommendation. These tasks depend on summarization and paraphrasing. Effective paraphrase changes more than isolated vocabulary: it may change sentence structure, combine or divide ideas, alter the order of information, or replace a technical phrase with a simpler explanation. Effective summary preserves the logic of the source while reducing detail. Both skills become crucial at B2 and above because advanced users are expected to process information, not merely repeat it.`,
    discussionPrompt: "Explain the difference between summarizing, paraphrasing, and copying information.",
    realWorldMission: "Read one short technical article and produce a 90-second spoken summary without looking at the text.",
    technicalTransfer: "Paraphrase a section of documentation for a beginner while preserving the technical meaning."
  },
  "b2-4": {
    topic: "Professional register",
    listeningScript: `A developer needs the same information from two people. To a close teammate, she writes, "Hey, can you send me the logs when you get a chance?" To an external client, she writes, "Could you please send the relevant log files when convenient? They would help us investigate the issue." The purpose is similar, but the relationship and context change the wording. Professional English is not automatically longer or more complicated. It is controlled: direct enough to be clear, but appropriate for the social situation.`,
    readingText: `Register is the way language changes with audience, relationship, purpose, and medium. A chat message to a friend, a Slack update to a teammate, an email to a client, and an academic paragraph can all communicate similar facts with different choices. Advanced users do not simply memorize a "formal vocabulary list." They manage distance, politeness, directness, sentence structure, and technical detail. In professional settings, excessive formality can sound unnatural just as easily as excessive casualness can sound careless.`,
    discussionPrompt: "How would you communicate the same project delay to a friend, a teammate, a professor, and a client?",
    realWorldMission: "Write one message in casual, neutral, and professional register, then explain what changed and why.",
    technicalTransfer: "Rewrite a bug/status update for an engineer and then for a non-technical stakeholder."
  },
  "b2-5": {
    topic: "Natural-speed listening and accent flexibility",
    listeningScript: `When people speak naturally, words do not arrive as separate dictionary units. Function words become weaker, sounds link across word boundaries, and familiar phrases may be reduced. A learner can know every word in a transcript and still fail to recognize the sentence in real time. The solution is not simply to slow all audio down forever. Slower playback can reveal a difficult sequence, but the learner must return to normal speed and practice recognizing the phrase as a whole. Exposure to different clear accents also helps the brain focus on stable meaning rather than one exact pronunciation pattern.`,
    readingText: `Listening development involves both language knowledge and decoding skill. Vocabulary and grammar help a listener predict meaning, while phonological knowledge helps map the sound stream onto known words. At B2, learners need increasing experience with normal rhythm, reductions, linking, hesitation, and variation between speakers. Transcript work is useful only when it changes future listening. A productive routine is: listen for gist without text, listen again for details, inspect a short difficult section, shadow it, and finally return to the whole recording without the transcript.`,
    discussionPrompt: "Why can a sentence look easy in a transcript but sound difficult in real speech?",
    realWorldMission: "Use a normal-speed English clip, identify three hard sound sequences, shadow them, and replay the clip without subtitles.",
    technicalTransfer: "Practice with a technical talk or developer interview rather than only language-learning audio."
  },
  "b2-6": {
    topic: "Technical documentation",
    listeningScript: `A developer is explaining an API guide to a teammate. The endpoint is intended to create short-lived upload credentials. A valid user token is required, and the request must include the file type. If the type is not supported, the service returns a validation error. The credentials expire after ten minutes, so the client should request them shortly before the upload begins. The developer emphasizes that the endpoint does not upload the file itself; it only returns the information needed for the client to upload directly to storage.`,
    readingText: `Technical documentation compresses a great deal of meaning into noun phrases, condition clauses, reference words, and predictable conventions. Efficient readers do not translate every sentence. They identify the purpose of a section, locate prerequisites, notice conditions and exceptions, and track what pronouns or technical labels refer to. They also distinguish examples from requirements. When a sentence is difficult, it is often useful to simplify its structure: identify the main subject and verb first, then attach conditions and modifiers. This strategy preserves speed without ignoring precision.`,
    discussionPrompt: "How do you read documentation efficiently when you do not understand every word?",
    realWorldMission: "Read a real README or API page in English and explain its purpose, prerequisites, main flow, and one limitation aloud.",
    technicalTransfer: "Use documentation from a technology you currently use, such as NestJS, Next.js, Docker, MongoDB, or an API."
  },
  "b2-7": {
    topic: "Presentation and Q&A",
    listeningScript: `After a four-minute product presentation, an audience member asks why the team did not choose a cheaper architecture. The presenter does not answer immediately. She says, "That's a fair question. The key point here is that our main constraint was reliability rather than initial cost." She then explains the tradeoff and gives one example from testing. When another person misunderstands the deployment model, she says, "Let me clarify. The service itself is centralized; only the worker layer is distributed." Her answers are successful because she responds to the question directly before adding detail.`,
    readingText: `A presentation is only partly prepared speech. Question-and-answer periods test whether the speaker can listen, identify the real question, respond concisely, and reformulate when necessary. Strong presenters often use a simple pattern: acknowledge the question, answer it in one clear sentence, add evidence or explanation, and check whether more detail is needed. When the premise of a question is incorrect, diplomacy matters. Correct the misunderstanding without making the questioner feel dismissed.`,
    discussionPrompt: "How can you answer a difficult presentation question when you need a few seconds to think?",
    realWorldMission: "Give a five-minute presentation and answer at least five follow-up questions you did not script word-for-word.",
    technicalTransfer: "Present a real technical or startup project and defend one design decision."
  },
  "b2-8": {
    topic: "B2 integration",
    listeningScript: `A candidate in a technical interview explains a system design, compares two possible solutions, and responds to objections. He occasionally pauses for vocabulary, but he can reformulate rather than stopping. He understands the interviewer's normal-speed questions and notices when a follow-up challenges an assumption rather than asking for another fact. In writing, he can produce a structured explanation and adjust the tone for a professional reader. These abilities show substantial independence, which is the foundation needed before C1 work on nuance, synthesis, and implicit meaning.`,
    readingText: `B2 users can operate with substantial independence. They can follow the main ideas of complex material, interact with reasonable fluency, produce detailed text, and explain viewpoints with advantages and disadvantages. For a learner aiming at C1, B2 is not the finish line. It is the platform from which attention can shift toward precision, subtle stance, sophisticated discourse management, flexible register, and the ability to process demanding material without constant support.`,
    discussionPrompt: "Demonstrate B2 independence by explaining a complex issue, defending a view, acknowledging a counterpoint, and reformulating one idea.",
    realWorldMission: "Complete the B2 readiness simulation using an unfamiliar general topic as well as a technical topic.",
    technicalTransfer: "Do a five-minute system-design or product-tradeoff discussion with follow-up questions."
  },
  "c1-1": {
    topic: "Nuance, stance and hedging",
    listeningScript: `A researcher is discussing whether AI coding tools improve software quality. She avoids a simple yes-or-no conclusion. The available evidence appears to suggest that the tools can improve short-term productivity for many tasks, particularly repetitive ones. However, it would be premature to assume that faster code generation necessarily leads to better long-term maintainability. To some extent, the outcome depends on review practices, developer experience, and the kinds of tasks being delegated. Her position is not weak; it is calibrated to the strength of the evidence.`,
    readingText: `Advanced academic and professional English depends on calibrated claims. Hedging is sometimes misunderstood as avoiding commitment, but effective hedging actually increases precision. A writer may distinguish a possibility from a probability, a tendency from a universal rule, or evidence from interpretation. Stance also includes explicit evaluation: a result may be significant, questionable, plausible, limited, or surprising. C1 users select language that reflects how strongly they can support a claim. This is especially important in technology, where confident predictions often spread faster than the evidence behind them.`,
    discussionPrompt: "To what extent do AI coding assistants improve software development, and what claims would be too strong?",
    realWorldMission: "Take five absolute claims and rewrite them with evidence-appropriate degrees of certainty, then defend your choices aloud.",
    technicalTransfer: "Give a nuanced assessment of an AI, cloud, security, or architecture claim."
  },
  "c1-2": {
    topic: "Complex argument architecture",
    listeningScript: `In a debate about remote work, one speaker begins by conceding that physical offices can support informal collaboration. That said, he argues that the more significant issue is not location itself but whether teams have effective coordination practices. He then considers the counterargument that remote work weakens mentoring and accepts that this risk is real for junior employees. Rather than dismissing the problem, he proposes a distinction between unstructured remote work and deliberately designed remote systems. The argument develops by qualification, contrast, and synthesis rather than by repeating one opinion.`,
    readingText: `C1 argumentation is not defined by long sentences or difficult vocabulary. It is defined by control over reasoning and discourse. A strong argument establishes a position, develops it with relevant support, anticipates competing interpretations, concedes points where appropriate, and explains why the final judgment still follows. Counterarguments should not be included as decoration. They must affect the shape of the reasoning. Advanced speakers also manage the listener's attention through framing, contrast, emphasis, and strategic reformulation.`,
    discussionPrompt: "Does technological progress necessarily produce social progress? Build a position that genuinely engages with a competing view.",
    realWorldMission: "Record a six-minute argument with a thesis, two lines of support, a serious counterargument, concession, response, and qualified conclusion.",
    technicalTransfer: "Argue for or against a major architecture/product decision while acknowledging the strongest opposing case."
  },
  "c1-3": {
    topic: "Synthesis across sources",
    listeningScript: `Two analysts examine the use of automation in education. The first emphasizes access: automated feedback can give learners more practice than one teacher could manually review. The second emphasizes quality: feedback that is fast but shallow may encourage learners to optimize for the system rather than develop judgment. Taken together, the two views suggest that the key question is not whether automation should be used, but which parts of learning benefit from scale and which require human interpretation. Their disagreement concerns the boundary, not the value of feedback itself.`,
    readingText: `Synthesis creates a new structure from multiple sources. A weak multi-source response summarizes Source A and then Source B. A stronger response groups information by idea: where the sources agree, where they differ, what assumptions explain the difference, and what broader conclusion emerges. This requires accurate representation of each source and restraint; the writer should not make a source claim something it did not say. At C1, synthesis is central to academic reading, professional briefings, research, and strategic decision-making.`,
    discussionPrompt: "How would you combine two sources that agree on the problem but disagree on the solution?",
    realWorldMission: "Use two short English sources on one topic and produce a three-minute synthesis that organizes by ideas rather than source order.",
    technicalTransfer: "Synthesize two technical proposals, documentation sources, or viewpoints about an architecture choice."
  },
  "c1-4": {
    topic: "Reformulation for different audiences",
    listeningScript: `An engineer explains rate limiting three times. To a beginner, she says, "The system limits how many requests one user can send in a short period so that nobody overwhelms the service." To another engineer, she discusses token buckets, burst capacity, and distributed counters. To a manager, she focuses on reliability, abuse prevention, and user impact. The underlying concept stays the same, but the vocabulary, assumptions, and level of detail change. Reformulation is not simplification alone; it is audience-aware precision.`,
    readingText: `Professional expertise includes the ability to change how an idea is expressed without changing what it means. This may involve defining a technical term, replacing jargon with an analogy, making a vague statement more precise, compressing a detailed explanation, or shifting from an informal to a formal register. Reformulation is also a fluency strategy. When a speaker cannot retrieve one word, the ability to express the idea another way prevents the conversation from collapsing. At C1, this flexibility should be readily available.`,
    discussionPrompt: "Explain one technical concept to a child, a first-year student, an engineer, and a business manager.",
    realWorldMission: "Choose one complex idea and record four audience-specific explanations without reading a script.",
    technicalTransfer: "Use an architecture concept such as caching, microservices, OAuth, queues, containers, or model inference."
  },
  "c1-5": {
    topic: "Implicit meaning and pragmatics",
    listeningScript: `In a meeting, a manager responds to a proposal by saying, "That's certainly one way of approaching it. I wonder whether we've fully considered the operational cost." Grammatically, the response sounds neutral, but pragmatically it signals doubt. The manager is not simply asking for more information; she is inviting the team to reconsider the proposal without rejecting it directly. A C1 listener notices the wording, context, stress, and what is left unsaid. A C1 speaker can respond to that implied concern without forcing the other person to state it more bluntly.`,
    readingText: `Much advanced meaning is pragmatic rather than literal. Speakers soften disagreement, imply criticism, signal hesitation, or invite action indirectly. In professional contexts, direct statements may be replaced by questions or cautious observations to preserve cooperation. The challenge for learners is twofold: infer the likely intention and respond at an appropriate level of directness. Literal understanding can therefore be grammatically correct while socially inaccurate. Exposure to realistic dialogue, attention to intonation, and reflection on context are necessary for this skill.`,
    discussionPrompt: "How can you disagree strongly without sounding unnecessarily aggressive in a professional meeting?",
    realWorldMission: "Create and perform five mini-dialogues containing indirect disagreement, concern, or suggestion; explain the implied meaning afterward.",
    technicalTransfer: "Practice challenging an architecture or product proposal diplomatically."
  },
  "c1-6": {
    topic: "Advanced technical and business reasoning",
    listeningScript: `A startup is considering a decentralized inference network in which external machines provide compute capacity. From a scalability perspective, the model could increase available hardware without requiring the company to purchase every GPU itself. The constraint, however, is not raw compute alone. Network latency, model partitioning, trust, verification, data privacy, heterogeneous hardware, and incentive design all affect whether the system is useful. The tradeoff comes down to how much coordination overhead the architecture introduces relative to the capacity it unlocks. A failure mode would be designing the token incentive before proving that distributed inference is reliable enough for real workloads.`,
    readingText: `Complex technical-business decisions sit at the intersection of engineering constraints and economic incentives. A design may be technically possible yet operationally expensive, difficult to secure, or unattractive to users. Conversely, a commercially appealing idea may depend on performance assumptions that have not been validated. Advanced discussion therefore moves between layers: architecture, failure modes, cost structure, user value, operational risk, and evidence. C1-level communication allows a speaker to maintain coherence while moving among these layers, signal assumptions explicitly, and distinguish a promising hypothesis from a demonstrated capability.`,
    discussionPrompt: "What would have to be true for a decentralized LLM inference network to be technically and economically viable?",
    realWorldMission: "Give an eight-minute decision briefing on a complex technical product, including assumptions, constraints, risks, tradeoffs, and next validation step.",
    technicalTransfer: "Use your own distributed-compute, SaaS, IoT, or AI project as the case."
  },
  "c1-7": {
    topic: "Academic and analytical writing",
    listeningScript: `A lecturer argues that strong analytical writing begins before the first sentence is drafted. The writer needs a question, a defensible thesis, a structure that reflects the logic of the argument, and evidence that is evaluated rather than merely inserted. Nominalization and complex noun phrases can make academic prose more compact, but excessive density reduces clarity. The aim is controlled complexity: enough linguistic range to express precise relationships, but not so much that the reader has to decode the grammar before understanding the idea.`,
    readingText: `C1 writing combines conceptual organization with linguistic control. A paragraph should have a clear function in the argument; transitions should reflect real relationships rather than decorate the text; and evidence should be interpreted in relation to the claim. Advanced grammar is useful when it creates precision—for example, by qualifying a claim, packaging information efficiently, or foregrounding a contrast. It is not useful when it merely makes a sentence longer. Revision at this level should examine logic, cohesion, stance, register, lexical precision, and sentence-level accuracy separately.`,
    discussionPrompt: "What makes analytical writing advanced: vocabulary, grammar, reasoning, organization, or something else?",
    realWorldMission: "Write a 400–500 word analytical response, revise it using a C1 checklist, then defend the thesis orally for four minutes.",
    technicalTransfer: "Write an analytical memo on an AI, software architecture, security, or product strategy question."
  },
  "c1-8": {
    topic: "C1 exit integration",
    listeningScript: `A proficient user is not someone who never pauses or never makes an error. The defining feature is flexible control. The speaker can handle demanding topics, follow implicit meaning, choose an appropriate register, sustain an argument, reformulate when necessary, and interact without forcing the other person to simplify everything. In technical and academic contexts, the user can process complex sources and produce an independent synthesis. The final assessment therefore samples unfamiliar topics, follow-up pressure, listening inference, advanced reading, professional communication, and analytical writing. Completing the course is not itself evidence of C1; performance is.`,
    readingText: `The final stage of a C1 pathway should resist the temptation to reward completion alone. A learner may finish every lesson while still having a weak skill profile. Readiness must be demonstrated through varied tasks: extended spontaneous speaking, interactive discussion, natural-speed listening, demanding reading, synthesis, and controlled writing. Performance should be judged for range, accuracy, fluency, coherence, interaction, comprehension, precision, and register. If one area remains clearly below the target, the system should prescribe focused remediation and retest that area rather than declare success prematurely.`,
    discussionPrompt: "Complete the final abstract discussion: Is technological progress necessarily equivalent to social progress?",
    realWorldMission: "Complete the full C1 exit battery under test conditions and remediate any failed dimension before retesting.",
    technicalTransfer: "Give a professional presentation, defend a technical decision, synthesize sources, and respond to unfamiliar follow-ups."
  }
};
