---
description: Auto-fix TypeScript, Prettier, and ESLint warnings and errors.
---

Your goal is to remove all Typescript and ESLint warning and error.You also format and index all files.

Follow this workflow :

1. Run the commands

- `pnpm format`: format files with Prettier
- `pnpm lint`: auto-fix linter errors and get the warning / errors remaining
- `pnpm ts`: get all the Typescript errors / warning

2. Fix all the errors

Ultra think and be sure to split the errors by folder, then run "Snipper" agent for each area. The code agent should be run with a specific list of files to fix and the actions to perform, so they can all work in parallel.

Ensure that each agent updates different files, with a maximum of 5 files per agent

In the description of each agents, put following :

<description-example>

Auto-fix(file1.ts, file2.ts, file3.ts, etc...)

</description-example>

In the description, be sure to add the list of all filename

In the prompt of each agent, put the following :

<prompt-example>

file1.ts:

- error ts 1
- error lint 2
- error ts 3

file2.ts:

- error lint 1
- error ts 2

</prompt-example>

3. Return to step 1

Run lint and ts commands again and verify that there is no remaining error.

During the procedure Create a Todo list and update this one with each command used and strike through when a task in todo list is done, example :

<todo-list>
~~☑ Run pnpm format to format files with Prettier~~
~~☑ Run pnpm lint to auto-fix linter errors and get the warning / errors remaining~~
☑ Run pnp ts get all the Typescript errors / warning
</todo-list>

Where is no remaining, give all fixes and verification in summary example:

<Summary-fixes-example>

- file1.ts: fixes
- file2.ts: fixes

Final verification:

- pnpm lint: ✅ No errors or warning
- pnpm ts: ✅ No Typescript errors

</Summary-fixes-example>
