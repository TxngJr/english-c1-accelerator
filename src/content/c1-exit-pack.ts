import type { Exercise, ListeningBlock, ReadingBlock } from "../lib/types.ts";

/**
 * Original, copyright-safe C1 exit material.
 * This pack deliberately mixes technology with broader social/professional topics so
 * familiar subject knowledge cannot substitute for C1 language control.
 */

export const c1ExitListening: ListeningBlock[] = [
  {
    id: "c1-exit-listen-1",
    title: "Productivity metrics in AI-assisted software teams",
    firstListenQuestion: "What is the speaker's main warning about interpreting productivity gains?",
    script: `Over the past year, our engineering organization has been trying to understand whether AI-assisted development is actually making teams more productive. At first, the answer seemed obvious. Developers reported that they could generate boilerplate faster, create tests more quickly, and spend less time searching documentation. Several internal dashboards also showed a fall in the median time between opening and merging a pull request. It would have been easy to announce that the tools had produced a clear productivity gain.

The difficulty is that almost every metric we had was affected by other changes. During the same period, two teams simplified their release process, one product line reduced the number of supported configurations, and the company moved several experienced engineers from platform work into product squads. We also changed the way pull requests were sized. Smaller changes naturally moved through review faster, so merge time alone could not tell us how much of the improvement came from AI assistance.

There was a second problem. Faster code production occasionally moved work downstream rather than removing it. Reviewers said that some generated changes looked plausible but required unusually careful inspection because the author did not fully understand every line. In a few cases, tests covered the obvious path while missing assumptions that an experienced developer would normally question. None of these incidents was catastrophic, but they reminded us that a local speed improvement can create a verification cost somewhere else in the system.

For that reason, we stopped asking, "How many lines did the tool generate?" and started asking a broader set of questions. How long does a task take from clarification to reliable production behavior? How often is work reopened after review? Does the change increase or decrease operational incidents? Are junior engineers becoming better at diagnosing problems, or are they becoming dependent on suggestions they cannot evaluate? Those measures are harder to collect, but they are closer to the outcomes the organization actually cares about.

Interestingly, the strongest benefit did not appear in the same place for every engineer. Experienced developers often used the assistant as a fast drafting partner. They already had a mental model of the system, so they could reject weak suggestions quickly. Some junior developers benefited most when they used it interactively: they asked for explanations, compared alternatives, and then tested the result. The weakest pattern was passive acceptance. When the tool became a substitute for understanding, apparent speed sometimes came at the cost of slower debugging later.

This does not mean the tools are ineffective. Our current evidence suggests that they are useful, particularly for routine transformation, test scaffolding, documentation drafts, and exploring unfamiliar APIs. The more cautious conclusion is that the size of the benefit depends on task type, developer experience, review practice, and the quality of the surrounding engineering process. A strong team can use faster generation to remove low-value friction. A weak process can simply generate questionable work faster.

We are now running a more controlled experiment. Similar tasks are being assigned across matched groups, and we are tracking not only completion time but review effort, defect rate, retention of key concepts, and the amount of rework required one week later. Even then, I would be reluctant to treat one experiment as a universal answer. Software organizations differ substantially. What we can reasonably hope for is a better estimate of where the tools help, where they shift costs, and which working habits make the benefits more reliable.

One additional issue is adaptation. Once developers know which outcomes are being measured, their behavior changes. If merge speed becomes a target, people may divide changes into smaller pull requests even when the underlying work has not become easier. If generated-code acceptance becomes a success measure, developers may accept suggestions they would otherwise rewrite. This does not make measurement impossible, but it means a metric should be treated as evidence about a system rather than a neutral window into it. We need several indicators that can challenge one another. A faster cycle accompanied by stable defects and lower review effort is more persuasive than a faster cycle on its own. We also need qualitative evidence from developers and reviewers because a dashboard may show that something changed without explaining the mechanism.

So the main lesson is not that AI coding tools definitely increase productivity, or that they fail to do so. It is that productivity is a system-level outcome. If we measure only the part of the process that became faster, we may mistake movement for improvement.`,
    connectedSpeechNotes: [
      "Listen for contrastive stress when the speaker moves from apparent speed to downstream cost.",
      "Notice stance markers: 'it would have been easy', 'our current evidence suggests', 'I would be reluctant'.",
      "Track reference words such as 'those measures', 'this', and 'even then' to preserve discourse structure."
    ],
    detailQuestions: [
      {
        id: "c1-exit-l1-q1",
        type: "multiple-choice",
        prompt: "Which statement best captures the speaker's overall position?",
        choices: [
          { label: "AI assistance clearly increases productivity in every software team.", value: "a" },
          { label: "AI assistance appears useful, but productivity claims require system-level evidence and attention to shifted costs.", value: "b" },
          { label: "AI assistance is mostly harmful because generated code cannot be reviewed safely.", value: "c" },
          { label: "Pull-request merge time is the most reliable productivity metric available.", value: "d" }
        ],
        answer: "b",
        targetSkill: "listening",
        explanationThai: "คำตอบที่ดีต้องจับ stance ทั้งชิ้น ไม่ใช่เลือกจากประโยคใดประโยคหนึ่ง"
      },
      {
        id: "c1-exit-l1-q2",
        type: "listening-comprehension",
        prompt: "Identify two confounding changes that made the early productivity data difficult to interpret.",
        targetSkill: "listening",
        modelAnswer: "Examples include release-process simplification, reduced configuration support, movement of experienced engineers, and smaller pull-request sizing."
      },
      {
        id: "c1-exit-l1-q3",
        type: "listening-comprehension",
        prompt: "What does the speaker mean by saying that faster code production can 'move work downstream'? Explain the implication rather than quoting the phrase.",
        targetSkill: "listening",
        modelAnswer: "Generation may save authoring time while increasing review, verification, debugging, or later rework, so the total system may not improve equally."
      },
      {
        id: "c1-exit-l1-q4",
        type: "summary",
        prompt: "Summarize the difference between the strongest and weakest usage patterns among developers in 80–120 words.",
        targetSkill: "listening",
        minWords: 80,
        modelAnswer: "Strong users actively evaluate, question, and test suggestions; passive acceptance can create hidden understanding and debugging costs."
      },
      {
        id: "c1-exit-l1-q5",
        type: "argumentation",
        prompt: "What evidence would still be needed before the organization could make a strong causal claim? Give a precise answer based on the talk.",
        targetSkill: "listening",
        modelAnswer: "More controlled comparisons, multiple outcome measures, replication across different teams/tasks, and evidence separating AI effects from concurrent process changes."
      }
    ]
  },
  {
    id: "c1-exit-listen-2",
    title: "Urban heat: technology, inequality and adaptation",
    firstListenQuestion: "Why does the speaker argue that heat adaptation cannot be treated as an engineering problem alone?",
    script: `Cities around the world are investing in technologies intended to reduce the impact of extreme heat. Some measures are highly visible: reflective roofs, shade structures, redesigned public spaces, cooling centers, heat-warning systems, and networks of temperature sensors. Others are less obvious, such as changing building standards or adjusting public-service schedules. Taken individually, many of these interventions are technically straightforward. The challenge appears when we ask who benefits, who can access the protection, and how the measures interact with the social structure of a city.

Consider temperature mapping. A dense network of sensors can identify neighborhoods that remain several degrees hotter than nearby areas. That information is valuable because average city temperature hides substantial local variation. Yet a map is not an intervention. If the hottest neighborhoods also have older housing, fewer trees, limited public transport, and residents who cannot easily stop working during the afternoon, then sending an accurate heat alert may do little on its own. The warning tells people they are at risk without necessarily giving them a realistic way to reduce that risk.

Air conditioning illustrates a similar tension. It is extremely effective at protecting individuals indoors, and in severe heat it can be life-saving. But widespread use increases electricity demand precisely when the grid is under stress. In systems that still depend heavily on fossil fuels, additional power consumption can also contribute to the longer-term problem. More importantly, access is unequal. A policy that assumes every household can cool a private room may overlook renters, people in poor-quality housing, or households that avoid using air conditioning because of cost.

This does not imply that cities should reject technological solutions. Rather, the technology has to be embedded in a broader adaptation strategy. Reflective materials can reduce building heat load; trees can create local shade and improve outdoor comfort; public cooling spaces can provide emergency protection; labor rules can reduce exposure for outdoor workers; and targeted subsidies can make indoor cooling more accessible. Each measure has limitations, so resilience comes from combining them rather than searching for one universal fix.

There are also tradeoffs. Trees require water and long-term maintenance. Reflective surfaces may perform differently depending on climate and urban form. Cooling centers are useful only if people can reach them, trust them, and remain there safely. A sophisticated sensor network can become an expensive demonstration project if agencies lack the budget or authority to act on the data. In other words, implementation capacity matters as much as technical capability.

The distribution of benefits should be evaluated explicitly. Suppose a city cools a commercial district where many people work but leaves residential neighborhoods largely unchanged. That may still produce a public benefit, yet it should not be described as if the protection were evenly distributed. The same applies to digital heat-warning systems. Smartphone notifications are helpful, but they are less effective for people with limited connectivity, language barriers, or disabilities unless the communication design accounts for those users.

One useful shift is to treat heat resilience as a service rather than a collection of objects. The question becomes: can a person move through a dangerous hot day while maintaining access to safe indoor space, water, transport, medical support, and reliable information? From that perspective, a shaded bus stop and a labor regulation may belong to the same adaptation system even though one is physical infrastructure and the other is policy.

Evaluation also has to consider time. A program may look successful during one unusually hot week because emergency centers are heavily used, but that tells us little about whether the same neighborhoods become safer over several years. Some interventions, such as tree cover and building renovation, take time to produce benefits. Others, such as text-message alerts, can be deployed quickly but may have limited effect without supporting services. Cities therefore need both short-term emergency indicators and longer-term measures such as indoor temperature, heat-related illness, energy burden, access to shaded transport, and whether vulnerable residents actually use available services. The easiest metric to collect is not necessarily the one that best represents resilience.

The broader point is that technological progress expands the set of possible responses, but it does not decide how protection is distributed. Those decisions remain political, financial, and organizational. A city can own excellent sensors and still fail vulnerable residents. Conversely, a modest technical intervention can have a large effect if it is placed where risk is high and integrated with services people can actually use.`,
    connectedSpeechNotes: [
      "Track concessive language: 'this does not imply', 'yet', 'more importantly', 'conversely'.",
      "Listen for the repeated distinction between technical capability and implementation/access.",
      "Notice how examples are used to qualify rather than simply support a one-sided claim."
    ],
    detailQuestions: [
      {
        id: "c1-exit-l2-q1",
        type: "multiple-choice",
        prompt: "What is the central claim of the talk?",
        choices: [
          { label: "Cities should stop investing in heat technology because it increases inequality.", value: "a" },
          { label: "Air conditioning is the only intervention with strong evidence of effectiveness.", value: "b" },
          { label: "Heat adaptation works best when technical measures are integrated with access, services, policy and distributional considerations.", value: "c" },
          { label: "Temperature sensors are more important than physical infrastructure.", value: "d" }
        ],
        answer: "c",
        targetSkill: "listening"
      },
      {
        id: "c1-exit-l2-q2",
        type: "listening-comprehension",
        prompt: "Why does the speaker say that a temperature map is not an intervention?",
        targetSkill: "listening",
        modelAnswer: "Data identifies risk but does not itself give residents the resources, infrastructure, time, or access needed to reduce exposure."
      },
      {
        id: "c1-exit-l2-q3",
        type: "listening-comprehension",
        prompt: "Give two examples of tradeoffs or implementation limits mentioned in the talk and explain why they matter.",
        targetSkill: "listening",
        modelAnswer: "Examples: trees need water/maintenance; cooling centers require access and trust; AC raises grid demand and is unequally affordable; sensors require institutional capacity to act."
      },
      {
        id: "c1-exit-l2-q4",
        type: "paraphrasing",
        prompt: "Paraphrase the idea of treating heat resilience as a 'service rather than a collection of objects'.",
        targetSkill: "listening",
        modelAnswer: "Evaluate whether people can stay safe across the whole day through connected infrastructure, information, transport, regulation and support—not just whether the city owns individual technologies."
      },
      {
        id: "c1-exit-l2-q5",
        type: "argumentation",
        prompt: "What broader relationship between technology and social outcomes is implied by the final paragraph?",
        targetSkill: "listening",
        modelAnswer: "Technology expands options, but institutions and distributional choices determine who benefits and whether technical capability becomes real social protection."
      }
    ]
  },
  {
    id: "c1-exit-listen-3",
    title: "Panel discussion: remote assessment, integrity and student privacy",
    firstListenQuestion: "Where do the three speakers genuinely agree, and where does their reasoning diverge?",
    script: `Moderator: Universities have been trying to protect assessment integrity while more learning and testing happen online. One response has been remote proctoring software that may record video, analyze browser activity, or flag unusual behavior. I want to begin with a simple question: should universities use these systems for high-stakes exams?

Dr. Malik, assessment director: I would not give a universal yes, but I think completely rejecting remote proctoring creates a real problem. Some programs have geographically distributed students, professional accreditation requirements, or examinations where identity verification matters. If the alternative is forcing every student to travel to a test center, that also creates cost and access barriers. My position is that controlled use can be justified when the assessment risk is high and less intrusive methods are insufficient.

Professor Chen, computer scientist: I agree that integrity matters, but I am less convinced that the usual software solves the problem as cleanly as institutions sometimes assume. Automated flags can be ambiguous. Looking away from the screen may indicate cheating, but it may also be a normal behavior, a disability-related movement, or a response to something happening in the room. The danger is not only false positives. Once staff believe the system is objective, they may give its flags more authority than they deserve.

Sara, student representative: My concern begins even earlier. Students are often told that they must install software with significant permissions without having a meaningful alternative. Even if the university has a legitimate assessment goal, the burden is not equally comfortable for everyone. Some students live in shared rooms. Some cannot create a perfectly quiet private environment. Others may be anxious about being recorded in their home. We should not treat those concerns as evidence that students oppose academic integrity.

Dr. Malik: I think that's fair, and I would distinguish the existence of proctoring from poor implementation. If a university uses it, students should know exactly what is collected, how long it is stored, who can see it, and how a flag is reviewed. There should also be an appeal process. I would strongly oppose a model in which an automated score directly determines misconduct.

Professor Chen: That distinction helps, but there is a further question: are we protecting the right thing? If an exam consists of tasks that can be answered instantly by searching or using an AI system, perhaps the assessment design itself needs to change. We can spend more effort watching students, or we can design tasks that require explanation, oral follow-up, personalized data, staged work, or reflection on decisions. Those approaches are not cheat-proof, but they may produce better evidence of learning.

Sara: I agree, especially because surveillance can damage the relationship between students and the institution. But I do not want to pretend redesign is free. Oral assessments require staff time. Project work can create grading consistency problems. Students with heavy workloads may actually prefer a conventional timed exam. So I would not replace one absolute rule with another.

Dr. Malik: Exactly. Assessment design, staffing, accessibility, accreditation, and integrity all interact. In some cases, a short identity check plus a well-designed open-book exam may be enough. In others, a supervised setting may still be necessary. What I want to avoid is the assumption that there is one technical product that solves academic integrity for every course.

Professor Chen: And I want to avoid the reverse assumption that technology is inherently illegitimate. My objection is to overclaiming. If a system can help verify identity, say that. If it can identify behavior that requires human review, say that. Do not market probabilistic behavioral detection as if it can infer intention.

Sara: I would add one principle: students need a real route to raise concerns without being penalized for doing so. Transparency is useful, but consent is complicated when the software is a condition of taking a required exam. An institution should therefore minimize collection by design, not simply ask students to click 'agree'.

Moderator: It sounds as though all three of you accept that integrity is a legitimate objective, none of you supports automatic punishment based on software flags, and all of you see assessment design as part of the solution. The disagreement is more about when the intrusion of proctoring is proportionate and how much confidence institutions should place in the technology.

Dr. Malik: That is a fair summary of my position.

Professor Chen: Mine too, although I would probably put a higher burden of proof on the institution before adopting behavioral monitoring.

Sara: And I would emphasize that the burden should include demonstrating that students who lack ideal private spaces are not disadvantaged.`,
    connectedSpeechNotes: [
      "Distinguish partial agreement from full agreement. Several speakers agree with a premise before narrowing or challenging it.",
      "Listen for pragmatic stance: 'I'm less convinced', 'I would distinguish', 'I would add one principle'.",
      "Track how the moderator synthesizes the panel and how the final comments qualify that synthesis."
    ],
    detailQuestions: [
      {
        id: "c1-exit-l3-q1",
        type: "multiple-choice",
        prompt: "Which point is shared by all three panelists?",
        choices: [
          { label: "Remote proctoring should never be used.", value: "a" },
          { label: "Automated flags should directly determine academic misconduct.", value: "b" },
          { label: "Academic integrity is legitimate, but technology should not be treated as a complete or infallible solution.", value: "c" },
          { label: "Every high-stakes exam should be replaced with an oral assessment.", value: "d" }
        ],
        answer: "c",
        targetSkill: "listening"
      },
      {
        id: "c1-exit-l3-q2",
        type: "listening-comprehension",
        prompt: "How does Professor Chen's concern differ from Sara's concern?",
        targetSkill: "listening",
        modelAnswer: "Chen emphasizes validity/overconfidence in automated behavioral inference and assessment design; Sara emphasizes privacy, unequal home conditions, power/consent, and student impact."
      },
      {
        id: "c1-exit-l3-q3",
        type: "listening-comprehension",
        prompt: "Why does Dr. Malik reject a universal answer while still defending some use of proctoring?",
        targetSkill: "listening",
        modelAnswer: "Different programs face different integrity, accreditation, access and logistical constraints; controlled use may be proportionate when risks are high and alternatives are insufficient."
      },
      {
        id: "c1-exit-l3-q4",
        type: "argumentation",
        prompt: "Identify one moment of qualified agreement and explain what limitation follows it.",
        targetSkill: "listening",
        modelAnswer: "For example, Chen accepts integrity matters but questions confidence in behavioral detection; Sara agrees redesign can help but notes staffing/consistency and student workload costs."
      },
      {
        id: "c1-exit-l3-q5",
        type: "summary",
        prompt: "Write a 120–160 word synthesis organized by issues—not speaker order—covering integrity, validity, privacy/access, and alternatives.",
        targetSkill: "listening",
        minWords: 120,
        modelAnswer: "A strong synthesis integrates the speakers by themes and preserves differences in burden of proof and proportionality."
      }
    ]
  }
];

export const c1ExitReading: ReadingBlock[] = [
  {
    id: "c1-exit-read-1",
    title: "When efficiency makes systems more fragile",
    text: `Organizations often pursue efficiency by removing what appears to be unused capacity. A warehouse holds less inventory, a hospital schedules staff closer to expected demand, a software company consolidates services, or a supply chain relies on fewer suppliers. Under stable conditions, these changes can reduce cost and improve coordination. The difficulty is that capacity which looks unnecessary during normal operation may perform a different function during disruption. What appears to be waste may partly be resilience.

This tension is easy to miss because efficiency and resilience are measured on different timescales. The benefit of reducing spare capacity is visible every month in a budget. The benefit of redundancy may remain invisible for years and then become extremely valuable during one unusual event. As a result, managers are often rewarded for removing buffers while receiving little immediate credit for preserving capabilities that are rarely used. The organization can therefore become optimized for the average case while becoming increasingly exposed to the tail of the distribution.

Software architecture provides a useful example. A team may reduce operational complexity by centralizing several functions in one service. The decision can be entirely reasonable: fewer deployments, simpler monitoring, less network overhead, and easier local development. Yet centralization can also increase the consequence of one failure. The important question is not whether microservices or a monolith are inherently more resilient. It is whether the chosen boundaries match the failure modes the organization can tolerate. A system with many services can be fragile if all of them depend on the same database, identity provider, region, or small operations team.

The same logic applies to human expertise. Specialization increases efficiency because people become extremely good at a narrow set of tasks. However, if only one employee understands a critical deployment process, the organization has created a hidden dependency. Cross-training looks inefficient when everyone is available because two people learning the same process seems redundant. Its value appears when the specialist is absent during an incident or leaves the company unexpectedly.

It would be a mistake, however, to conclude that resilience simply means adding redundancy everywhere. Buffers have costs. Extra inventory can become obsolete. Duplicate infrastructure needs maintenance. Cross-training consumes time that could have been used for deeper specialization. Multiple suppliers create coordination overhead. A resilient design therefore has to be selective. The goal is not maximum redundancy but an explicit understanding of which failures would be unacceptable and which buffers reduce those risks at a reasonable cost.

One practical approach is to separate ordinary variation from true disruption. A restaurant should not maintain enough staff for the busiest imaginable day of the decade. It does need a method for handling common peaks, staff illness, and supplier delays. Similarly, a digital service may not justify a fully independent backup for every internal tool, but a payment system may require stronger redundancy because downtime immediately affects revenue and trust. Risk tolerance differs by function.

Another useful distinction concerns reversibility. Some efficiency measures can be undone quickly. If a team reduces cloud capacity and demand rises, additional instances may be added within minutes. Other decisions remove options that are expensive to recreate. Closing a local supplier network, losing institutional knowledge, or designing data around a proprietary interface can create dependencies that cannot be reversed during a crisis. Efficient systems should therefore pay particular attention to choices that reduce future flexibility.

Metrics can also create false confidence. High resource utilization is usually interpreted as good performance, but a system operating near maximum capacity has little room to absorb variation. A customer-support team whose agents are occupied almost every minute may look efficient while producing rapidly growing queues whenever demand rises slightly. In queueing systems, waiting time can increase sharply as utilization approaches capacity. The buffer is not necessarily a sign of poor management; it may be part of the service level.

This is where language matters in decision-making. Calling all unused capacity "waste" frames the discussion before analysis begins. Calling every buffer "resilience" can be equally misleading. Decision-makers need to ask what specific uncertainty the buffer protects against, how costly the failure would be, how quickly capacity can be restored, and whether several apparently independent resources actually share the same hidden dependency.

Recent interest in resilience has also created a danger of retrospective reasoning. After a disruption, it is easy to identify the exact backup that would have prevented the observed failure. But organizations face many possible disruptions and cannot prepare equally for all of them. A mature resilience strategy therefore focuses not only on known scenarios but on general capabilities: observability, modularity, communication, spare decision-making capacity, clear ownership, and the ability to improvise. These capabilities do not prevent every shock. They improve the organization's ability to detect, contain, and recover from surprises.

Governance affects whether these capabilities survive normal cost pressure. A buffer that has no named purpose is easy to remove because its value cannot be defended. By contrast, a team that documents why a second supplier exists, which incident class a recovery environment protects against, or what service-level objective requires spare capacity can debate the cost explicitly. Scenario exercises can also reveal false redundancy. Two backup systems may appear independent but depend on the same identity service, network path, region, or administrator. Diversity that exists only on an architecture diagram is not resilience if a hidden common dependency can disable every option at once.

The issue becomes more difficult when the cost and benefit belong to different groups. A company may save money by reducing support capacity while customers absorb longer recovery times. A supply chain may lower prices by concentrating production while a local community or public agency bears more of the disruption risk. These distributional effects do not make the efficiency decision automatically wrong, but they complicate claims that the system as a whole has improved. The boundary of the analysis matters: efficiency for whom, resilience against what, and over what period?

The relationship between efficiency and resilience is therefore not a simple tradeoff in which one must always be sacrificed for the other. Some improvements support both. Better automation can reduce routine cost while making recovery more reliable. Standardized interfaces can simplify operations while making components replaceable. Clear documentation can reduce training time while preventing knowledge concentration. The most valuable designs often search for these complementarities before accepting a pure tradeoff.

Nevertheless, there will be cases where resilience genuinely costs more in normal times. The decision then becomes normative as well as technical: how much cost should current users or shareholders bear to protect against uncertain future harm? There is no universal percentage that answers this. What can be demanded is transparency. If an organization chooses a highly efficient but brittle structure, it should understand the risk it is accepting rather than discovering the hidden price only when normal conditions disappear.

The broader lesson is that optimization changes the shape of vulnerability. Removing slack can expose dependencies that were previously masked. Adding redundancy can create its own complexity. Resilience requires enough spare capacity, diversity, knowledge, and flexibility to preserve essential functions under plausible stress, but not so much that the system becomes unmanageable. Efficiency asks how little resource is needed when the world behaves as expected. Resilience asks what remains possible when it does not. Sound design requires both questions.`,
    questions: [
      {
        id: "c1-exit-r1-q1",
        type: "multiple-choice",
        prompt: "Which statement best represents the author's thesis?",
        choices: [
          { label: "Organizations should maximize redundancy even when it is expensive.", value: "a" },
          { label: "Efficiency measures can remove protective capacity, so resilience requires selective buffers and attention to failure, reversibility and hidden dependencies.", value: "b" },
          { label: "Centralized software is always less resilient than distributed software.", value: "c" },
          { label: "High utilization is the best general measure of organizational performance.", value: "d" }
        ],
        answer: "b",
        targetSkill: "reading"
      },
      {
        id: "c1-exit-r1-q2",
        type: "reading-comprehension",
        prompt: "Explain why efficiency and resilience can be systematically misvalued when organizations use short reporting cycles.",
        targetSkill: "reading",
        modelAnswer: "Efficiency savings appear frequently and visibly, while resilience benefits may remain latent until rare disruption; incentives therefore favor removing buffers whose protective value is harder to observe."
      },
      {
        id: "c1-exit-r1-q3",
        type: "reading-comprehension",
        prompt: "What role does reversibility play in the author's framework? Give one example from the text and explain its significance.",
        targetSkill: "reading",
        modelAnswer: "Reversible efficiency choices can be corrected quickly; choices that destroy options or create deep lock-in require more caution because capacity cannot be restored during disruption."
      },
      {
        id: "c1-exit-r1-q4",
        type: "paraphrasing",
        prompt: "Paraphrase: 'The broader lesson is that optimization changes the shape of vulnerability.' Explain the idea in your own words without using 'optimization' or 'vulnerability'.",
        targetSkill: "reading",
        modelAnswer: "Making a system more efficient changes where and how it can fail; removing one cost or buffer can expose different dependencies and risks."
      },
      {
        id: "c1-exit-r1-q5",
        type: "argumentation",
        prompt: "Identify one assumption the author makes that could reasonably be challenged. State the challenge fairly and explain whether it weakens the main argument.",
        targetSkill: "reading"
      },
      {
        id: "c1-exit-r1-q6",
        type: "summary",
        prompt: "Write a 170–220 word summary organized around the author's analytical framework, not the sequence of examples.",
        minWords: 170,
        targetSkill: "reading"
      }
    ]
  },
  {
    id: "c1-exit-read-2",
    title: "Why technological progress and social progress do not move in lockstep",
    text: `Technological progress is often described through capability: what can now be done that was previously impossible, impractical, or expensive. Social progress, by contrast, is usually evaluated through outcomes that involve human welfare, opportunity, rights, security, participation, or fairness. The two are connected, but they are not equivalent. A society can gain powerful new capabilities without distributing their benefits widely, and it can improve social outcomes through institutional reform even when the underlying technology changes very little.

The distinction matters because technological narratives frequently move from invention to benefit without making the intermediate steps explicit. A medical diagnostic system may become more accurate, but patients benefit only if the system reaches clinics, professionals know how to use it, treatment is available, errors are monitored, and people can afford access. The technical advance is real even if those conditions are absent. The social effect depends on an implementation system.

History provides many examples of technologies whose effects were neither uniformly positive nor uniformly negative. Industrial machinery increased productive capacity while also transforming labor conditions, urbanization, environmental impact, and the distribution of bargaining power. Mass communication expanded access to information while creating new forms of propaganda and concentration. The internet lowered the cost of publishing and coordination while enabling surveillance, fraud, and large-scale manipulation. It would be simplistic to conclude that these technologies were socially harmful because they created problems, just as it would be simplistic to treat capability growth as automatic social improvement.

One reason the relationship is unstable is that benefits and costs can be distributed differently. A platform may create substantial convenience for consumers while shifting risk onto contract workers. An automated system may reduce average processing time while making errors harder for a minority of users to contest. A city may become more efficient while displacing residents from areas that become more valuable. Aggregate improvement can coexist with concentrated harm.

This creates a measurement problem. Suppose a technology raises total economic output. If social progress is defined entirely by output, the conclusion follows by definition. But many societies treat health, autonomy, equality before the law, education, environmental quality, and democratic participation as relevant too. The debate is therefore partly empirical and partly normative. Evidence can tell us who gains income or how mortality changes. It cannot by itself decide how different outcomes should be weighted.

Technological systems can also alter institutions rather than simply operating inside them. A new communication medium changes not only how fast messages travel but which actors can reach an audience, how attention is allocated, and what kinds of organizations become viable. Artificial intelligence may change the cost of producing text, code, images, and analysis, which in turn can affect education, employment, verification, and the economics of expertise. These second-order effects are often harder to predict than the immediate technical function.

Uncertainty does not justify fatalism. Societies are not passive recipients of technology. Standards, labor law, professional norms, product design, competition policy, education, taxation, public infrastructure, and user behavior all shape outcomes. The same underlying capability can therefore produce different social effects under different institutional arrangements. Privacy-enhancing design, for example, may allow a useful digital service to operate with less surveillance. Training and transition support may distribute productivity gains differently than a strategy based purely on labor replacement.

At the same time, institutional control has limits. Regulation can lag behind rapid development. Global technologies may cross jurisdictions. Competitive pressure can encourage deployment before consequences are fully understood. Once infrastructure becomes deeply embedded, reversing it can be costly. These constraints mean that calls to "just regulate" are no more complete than calls to "let innovation solve it." Governance itself requires capacity, information, enforcement, and adaptation.

The phrase "technological progress" also hides disagreement about direction. A system can become more powerful according to one metric while becoming worse according to another. A recommendation algorithm may increase engagement but reduce user satisfaction over longer periods. A model may achieve higher benchmark performance while consuming more energy or becoming less interpretable. Even within technology, progress is multidimensional. Choosing a metric already expresses a view about what matters.

This is especially important when comparing technological and social progress because social systems contain feedback. A technology changes behavior; behavior changes markets and institutions; those changes influence the next generation of technology. For example, if automated hiring systems reward particular credentials, applicants may change how they present themselves, universities may alter programs, and employers may later train models on data created by those adaptations. The technology is no longer an external input. It participates in reshaping the environment that defines success.

Power influences this feedback. Actors do not enter technological transitions with equal ability to define standards, absorb losses, or influence regulation. A large platform can experiment at a scale unavailable to smaller competitors; a worker may face a new monitoring system without having meaningful bargaining power over its design; a community may experience environmental costs produced by infrastructure serving users elsewhere. Social evaluation therefore needs to examine not only average outcomes but who has voice in deciding which risks are acceptable. Participation does not guarantee a good decision, yet the absence of participation can make it easier for benefits to be counted while externalized costs remain politically invisible.

There is also a temporal dimension. Early adopters may receive large benefits while transition costs fall on people whose skills, businesses, or institutions were designed for the previous system. In the long term, education and regulation may adapt, but the short-term losses are still real. A claim that society will eventually benefit does not answer how transition burdens should be distributed or how reversible the change is if expectations prove wrong. Social progress therefore includes the capacity to manage transitions, not only the attractiveness of a possible future equilibrium.

Optimistic accounts are right to emphasize that technological capability can expand the feasible set of social solutions. Cheap clean energy would make some climate policies easier. Better diagnostics can support earlier treatment. Accessible communication tools can reduce barriers for people with disabilities. Automated translation can enable interaction across languages. Refusing to acknowledge these possibilities would understate the importance of innovation.

Critical accounts are right to emphasize that possibility is not distribution. A solution can exist without being affordable, trusted, governable, or aligned with the needs of those at greatest risk. Moreover, some innovations create new problems that require additional social and technical responses. The relevant question is therefore not whether technology is good or bad in general, but which capabilities are being expanded, under what institutions, for whose benefit, with which externalities, and with what ability to correct failure.

This perspective changes how progress should be discussed. Instead of assuming a single upward line, we can separate at least four questions. First, has technical capability improved? Second, has that capability been translated into reliable real-world performance? Third, how are benefits and costs distributed? Fourth, do the resulting outcomes advance the values the society claims to care about? A positive answer to the first question does not guarantee positive answers to the others.

Nor does the distinction require hostility to innovation. In fact, it can support better innovation by making success criteria more complete. Engineers who understand accessibility, safety, privacy, and institutional constraints can design systems that create more durable value. Policymakers who understand technical limitations can avoid rules based on unrealistic assumptions. Communities that participate in deployment decisions can reveal costs that aggregate metrics overlook.

Technological progress and social progress therefore interact continuously but move through different mechanisms. Capability is an input to social change, not a verdict on it. Institutions, incentives, distribution, design, culture, and political choice mediate the path from invention to outcome. The strongest position is neither that technology inevitably improves society nor that every advance merely reproduces existing inequality. It is that new capability changes what is possible, while collective choices help determine which possibilities become normal.`,
    questions: [
      {
        id: "c1-exit-r2-q1",
        type: "multiple-choice",
        prompt: "Which statement most accurately reflects the author's position?",
        choices: [
          { label: "Technological development and social improvement are fundamentally unrelated.", value: "a" },
          { label: "New technology usually harms society unless governments prevent adoption.", value: "b" },
          { label: "Technological capability can enable social progress, but institutions, distribution, values and implementation mediate whether that potential becomes beneficial outcomes.", value: "c" },
          { label: "Economic output is the only objective measure that can be used to discuss progress.", value: "d" }
        ],
        answer: "c",
        targetSkill: "reading"
      },
      {
        id: "c1-exit-r2-q2",
        type: "reading-comprehension",
        prompt: "Why does the author describe the debate as partly empirical and partly normative?",
        targetSkill: "reading",
        modelAnswer: "Evidence can measure effects, but deciding which social outcomes matter and how to weigh conflicting outcomes requires value judgments."
      },
      {
        id: "c1-exit-r2-q3",
        type: "reading-comprehension",
        prompt: "Explain the significance of second-order effects and give one example from the text in your own words.",
        targetSkill: "reading",
        modelAnswer: "Technology changes institutions and behavior, which then change later incentives and systems; e.g., automated hiring can alter applicant behavior, education, and future training data."
      },
      {
        id: "c1-exit-r2-q4",
        type: "reading-comprehension",
        prompt: "How does the author respond to both technological optimism and technological criticism without treating them as identical positions?",
        targetSkill: "reading",
        modelAnswer: "The author accepts optimism about expanded feasible solutions and criticism about unequal distribution/new harms, then integrates them through mediating institutions and implementation."
      },
      {
        id: "c1-exit-r2-q5",
        type: "paraphrasing",
        prompt: "Reformulate the sentence 'Capability is an input to social change, not a verdict on it' for a nontechnical audience, then for an academic audience.",
        targetSkill: "reading"
      },
      {
        id: "c1-exit-r2-q6",
        type: "argumentation",
        prompt: "Does the four-question framework near the end adequately address power and political conflict? Give a reasoned critique based on the text rather than outside slogans.",
        targetSkill: "reading"
      }
    ]
  }
];

export const c1ExitSpeaking: Exercise[] = [
  {
    id: "c1-exit-speak-1",
    type: "speaking-prompt",
    prompt: "Unfamiliar abstract response: Should societies deliberately slow the adoption of a useful technology when its long-term social effects are highly uncertain? Take a position, qualify it, and address one serious objection.",
    instructionThai: "เตรียมได้ 30 วินาที ห้ามเขียนสคริปต์เต็ม จากนั้นพูด 2 นาที",
    targetSkill: "speaking",
    seconds: 120,
    modelAnswer: "Assessment focus: immediate organization, nuanced stance, qualification, counterargument, lexical precision, and ability to continue without translating full Thai sentences."
  },
  {
    id: "c1-exit-speak-2",
    type: "speaking-prompt",
    prompt: "Professional presentation: propose an architecture or product decision for a system that must balance cost, reliability, privacy and speed of delivery. State assumptions, compare options, recommend one, identify a failure mode, and explain what evidence would make you reconsider.",
    instructionThai: "พูด 5–7 นาที ใช้ได้แค่ bullet keywords ไม่ใช้ full-sentence script",
    targetSkill: "speaking",
    seconds: 360,
    modelAnswer: "Assessment focus: coherent line of reasoning, technical/professional precision, signposting, tradeoffs, hedging, and audience awareness."
  },
  {
    id: "c1-exit-speak-3",
    type: "speaking-prompt",
    prompt: "Final baseline challenge: Is technological progress necessarily equivalent to social progress? Build a nuanced argument, distinguish capability from outcomes, acknowledge a competing viewpoint, and respond to at least three unprepared follow-up questions from the evaluator.",
    instructionThai: "discussion 6–8 นาที ไม่ใช้สคริปต์ และผู้ประเมินต้องถามต่อจากคำตอบจริงของคุณ",
    targetSkill: "speaking",
    seconds: 420,
    modelAnswer: "No fixed script. The evaluator should test flexibility, interaction, reformulation and whether the learner can defend and qualify meaning under pressure."
  },
  {
    id: "c1-exit-speak-4",
    type: "speaking-prompt",
    prompt: "Reformulation: explain eventual consistency (or another complex technical concept you know well) to (1) a beginner, (2) an engineer, and (3) a manager. Keep the underlying meaning stable while changing detail, terminology and consequence.",
    targetSkill: "speaking",
    seconds: 300,
    modelAnswer: "Assessment focus: register shifting, conceptual accuracy, lexical flexibility and rapid reformulation."
  }
];

export const c1ExitWriting: Exercise[] = [
  {
    id: "c1-exit-write-1",
    type: "argumentation",
    prompt: "Using ideas from both C1 exit reading texts, write a 400–500 word analytical essay: 'Efficiency and technological capability are useful measures of progress, but they are insufficient guides to good decisions.' Evaluate this claim. You must synthesize the texts rather than summarize them one after another, include a counterargument, and maintain a precise stance.",
    targetSkill: "writing",
    minWords: 400,
    modelAnswer: "A strong response integrates concepts across both sources, distinguishes evidence from inference, develops a coherent thesis, handles a serious counterargument, and uses appropriate C1 register and cohesion."
  },
  {
    id: "c1-exit-write-2",
    type: "free-writing",
    prompt: "Professional task (180–250 words): Your team planned to deploy an AI-assisted feature this week, but evaluation has revealed a small yet meaningful risk of confidently incorrect outputs. Write a decision-oriented update to a product lead. State what is known, what remains uncertain, your recommendation, the tradeoff, and the next evidence you need. Avoid both alarmism and false reassurance.",
    targetSkill: "writing",
    minWords: 180,
    modelAnswer: "A strong response is concise, appropriately professional, calibrated in certainty, clear about impact and decision, and explicit about next steps."
  },
  {
    id: "c1-exit-synthesis",
    type: "summary",
    prompt: "Multi-source synthesis (220–300 words): combine the main insights from Reading 1 and Reading 2 into one account of why 'more capability with less slack' can create decisions that look successful on narrow metrics while producing hidden system or social risks. Organize by ideas, not by source.",
    targetSkill: "writing",
    minWords: 220,
    modelAnswer: "A strong synthesis connects efficiency/resilience with capability/social outcomes, preserves important qualifications, and clearly distinguishes the writer's integration from the source claims."
  }
];
