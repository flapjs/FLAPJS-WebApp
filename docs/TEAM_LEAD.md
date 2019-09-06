# So You Want to be the Team Lead?
Hello and welcome to the team! Either you have been chosen as the official Team Lead of Flap.js, or you like to read documentation. Either way, congrats! It will be a tough journey and I wish you the best of luck. ;)

To hopefully help you out, I've documented below my experiences I've gathered from being team lead myself. Many of these I've tried myself, and their results are documented below. But of course, not every team is the same. Some of these may be hugely successful for my team but fail miserably for yours. I would suggest you read it, but take what you see fit. Or try some out! Feel free to experiment and play around with different ideas. This is your chance to figure out how to be a good team lead. Good luck!

_NOTE: I hope you recognize the importance of documentation, especially internal documentation. For any project, whether it'd be building a bridge or creating a website, it is always about the people. Documentation helps bridge the gap between the code and its users. If this was helpful, I hope when you leave you will contribute to this document for future team leads to come. Experience is hard to come by and this is the perfect opportunity to contribute your take on leadership._

---

## Factors of a High Functioning Team
These are the pillars of team cohesion. Google has done their research and this is the result: the top five contributing factors of team efficiency.

- **Psychological Safety**
    - Members understand that their position and standing is not jeopardized by failure.
        + We need to feel safe to fail, or else code reviews are useless. Mistakes are learning and teaching opportunties.
- **Dependability**
    - Members can trust each other's word to follow through on promises.
        + When we say we'll complete a task by Thursday, we must be true to our word and complete it to the best of our ability. Otherwise, work will eventually all fall to a single person.
- **Structure and Clarity**
    - Members know the expectations and duties. Have regular meetings to define/clarify short and long term goals.
        + When you assign tasks, set a specific due date. Not next week. But Friday of next week. Even if it seems arbitrary, there needs to be a sense of termination to the tasks or else it risks the chance of being pushed back indefinitely.
            > For me, this was a recurring issue that I did not recognize until much later. One quarter I had set goals to complete a list of features by mid and end of quarter. However, week by week, each feature was being delayed. By the time the deadline came around, nothing got finished. The issue was that each feature had their own list of tasks. And each week, when we encountered an issue, we pushed it to next week and moved onto something else. It may seem trivial, but it is very important.
        + Also, any dates and times must be written down and easily accessible somewhere. Put it on a discussion thread or a calendar. This issue has personally affected me, as I live about an hour away from campus. Any last minute changes or ambiguity in the times would cause me to either completely miss the meeting or waste the entire day on campus waiting for it.
- **Meaning of Work**
    - Memebers understand how their work fits into the greater goal of the team.
        + This largely stems from the member's contributions to the design of their work. They need to know the product they are constructing and understand what problems they are fixing. These problems may not be visually present in the outcome, but they must understand its importance. It also helps that they like what they are doing. And because of the nature of this project, I feel members should do what they like to do as long as it contributes to the progression of the project. Their passion to contribute is always worth more than just another completed task. The purpose of this project is not only to serve the greater student community but also ourselves as aspiring developers. We should always be learning new things on this project. The same old thing gets boring.
        + To support this, we should ALWAYS hold design meetings early, maybe at the second or third meeting, after they are somewhat accustomed with how things work.
- **Impact of Work**
    - Members believe in your goals.
        + Everyone on your team should want the goals you've set. If someone disagrees, discuss it. If I don't believe in a cause, I would not put the extra time and effort to accomplish tasks that contribute to it. To ensure quality code and dedication to the project, these goals must be universally agreed upon.
        + It is also just as important to state these goals and provide the reasoning behind them. It is hard to believe in something that you don't understand.
            - Usually this is something done at the beginning of a milestone.

## Collaboration
Another thing we've learned is that collaboration helps build trust. Although it may seem like wasted time to meet 4 hours every week to program in silence, it not only greatly reduces the "cost" of communication that come from remote messaging but also encourages collaboration between members. It may seem inefficient at first, but after a few sessions people will start collaborating naturally. This not only boosts efficiency of work but also generates team cohesion. Once we get to know one another better, we will be able work more efficiently together. And the minimum requirement to getting that is by having an allotted every week to work together.

### Remote Meetings
This also describes the ineffectiveness of remote meetings. They don't work for involved discussions. Anything beyond 5 to 10 minutes of discussion should be done in person. Often times, people will arrive late, leave early, or do other things simultaneously. As painful as it might be to drive across town just to meet for half an hour, always meet in person.

> For the first quarter in the summer, we met in person twice every week. At first, it was often just a silent day of programming. Not much different than coding at home. But as the quarter continued, we began to talk to one another. We shared ideas and thoughts and became invested in not only each other's work but each other's lives. By the end, I feel like we understood eachother's strengths and weaknesses and each other's importance to the team. Together we knew how AND why to complete the tasks.

> We have also tried one quarter to have in-person meetings only once a week, with a remote meeting in-between. Although it initially went well, as the quarter progresses, the effort in the remote meetings dwindled. Due to other work loads and eventual chaos of midterms and finals, tasks were gettings delayed. Because of the lack of unity between memebrs, I feel like it became harder to communicate ideas and coordinate tasks. Therefore the extra time spent for in-person meetings really made up for this fact, of which we were lacking. Only do remote meetings as supplements rather than as the backbone of a project.

### What is DONE?
Pretty Much Done? That is never the case. To you it means about really a week or 2 more of work, to a stakeholder (in this case, you as a team lead or the professor) it means you should move on to the next thing already. Be careful when you say this. We should define what DONE means to you and the team. Maybe make a checklist of things that you need to do before DONE can be said.

**The Done Checklist**
- Passes all unit tests
- Passes all lint tests
- Passes a smoke test
- Has necessary documentation
- Has proper styling
- Has a pull request to merge into dev branch

### DevBlog
- A weekly devblog helps promote the sense of impact a member has on the Flap.js community. We get to share our ideas and feel like we are listened to.

### MissionDocs
- These are onboarding documents for new developers working on a particular system. It is very much like a readme but has a particular structure. Also, any modifictions to the document should only be additive. If something is no longer relevant, use a striketrough and provide a reasoning.

Most importantly, above all else, it explains the reasons it was built, potential dangers/pitfalls, and the inner workings of the sytem to future devs. Here's the structure we found that is most effective:

```markdown
# Motivation
    Here we describe why this system exists. For who is it intended for.
# Goals
    What we are planning to do with it. Usually this is a checklist.
# Entrypoints
    Where we can start.
# Dangers / Pitfalls
    Here we list the potential holes and mistakes that developers may run into. Any unfixed bugs or hack-y solutions are noted here.
# Theories
    Any theory behind the graph that may need some explanation. If it is a complex topic, it should be a simple introduction that can let the user at LEAST know what is going on and an idea on how to use the module effectively.
# Interactions / Ideas
    A high level description of how you as a user interact with it and how it as a system works.
# Changelog
    A summary of work done in the future. This should be dated.
```

### Meeting Times
- Keep it regular and consistent. Members need to know where and when they can get help, either with code or general logistics.
- In general, there should be about 1 to 2 hours of meetings per week.
- For more involved sessions: a typical coding session usually ranges from 2 to 3 hours, and a design session takes longer for about 4 hours or more.

### Task Lists
- Tasks should be ordered by importance and size.
    - NOTE: It is best to use the same color for priority tags (for high/medium/low). Just name them differently. It is much more useful that way.
- Every task needs estimated points of work.
- There needs to be goals and a deadline for the sprint.