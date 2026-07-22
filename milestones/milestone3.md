# Milestone 3

This document should be completed and submitted during **Unit 7** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

You will need to reference the GitHub Project Management guide in the course portal for more information about how to complete each of these steps.

- [x] In your repo, create a project board.
  - *Please be sure to share your project board with the grading team's GitHub **codepathreview**. This is separate from your repository's sharing settings.*
- [x] In your repo, create at least 5 issues from the features on your feature list.
  - List the title of each issue you created:
    1. Set up database schema and seed data
    2. Create GET /recipes endpoint
    3. Create GET /recipes/:id endpoint
    4. Build the Recipe Feed page
    5. Build recipe card component
- [x] In your repo, update the status of issues in your project board.
- [x] In your repo, create a GitHub Milestone for each final project unit, corresponding to each of the 5 milestones in your `milestones/` directory.
  - List the name of each milestone you created:
    1. Milestone 1 - Unit 5
    2. Milestone 2 - Unit 6
    3. Milestone 3 - Unit 7
    4. Milestone 4 - Unit 8
    5. Milestone 5 - Unit 9
  - [ ] Set the completion percentage of each milestone. The GitHub Milestone for this unit (Milestone 3 - Unit 7) should be 100% completed when you submit for full points.
- [ ] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [ ] Under each feature you have completed, include a GIF showing feature functionality.
- [ ] In this documents, complete all five questions in the **Reflection** section below.

## Reflection

### 1. What went well during this unit?

Initial setup of the codebase and project board came together quickly. We also had a smooth time creating the GitHub Milestones, and early on we established a clear team composition — one frontend-focused, one backend-focused, and two versatile members — which made it easy to assign work. Additionally, setting up CI, a pre-commit hook, style checks, and a contributing workflow gives us a solid foundation for smooth collaboration going forward.

### 2. What were some challenges your group faced in this unit?

The biggest challenge was breaking down tasks into small, single-purpose issues — particularly on the frontend. A task like "build home page" naturally encompasses multiple components (cards, navigation bar, layout), making it hard to scope issues cleanly. We also struggled to partition tasks across milestones with a realistic timeline. Additionally, setting up the CI workflow required several revisions to get right — mostly small nitpicks around what the flow should include and how Biome was configured (file extensions, reporter format).

### 3. Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

We did not complete all planned tasks this sprint. Coordination was difficult due to scheduling conflicts and reviews take longer than expected. We will carry the remaining tasks to the next week and prioritize them at the start of the sprint.  

### 4. Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

#10 (Comments) is the highest risk with it being complex, auth-dependent, and lowest priority. We are treating it as a stretch goal and will cut it first if needed. #7 (Filter by category) is the next in line as the feature is also a stretch goal as sorting is a custom feature that can be replaced by another, but the risk is low. If any of them remain at risk, #10 gets cut first and we will prioritize completing the required features.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

Some learning materials or guideline on implementing secure and efficient auth would be helpful. We will be implementing our auth with GitHub OAuth, but understanding the deeper aspects of authentication and authorization implementation and flow would help us build our own in the future.
