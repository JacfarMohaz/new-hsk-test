# Prompt for Claude Code — HSK 3 Exam Prep Web App

Build a modern web app called **HSK 3 Sprint** that helps me quickly prepare for the HSK 3 exam using vocabulary only. Build it in the current directory.

## Tech stack
- **Next.js (latest, App Router) + TypeScript + Tailwind CSS**
- No backend and no database. Progress is saved in `localStorage`.
- Use `framer-motion` for subtle animations (optional) and `lucide-react` for icons.
- Must be fully responsive (mobile first) and deploy-ready for Vercel.

## Vocabulary data (IMPORTANT)
- I have placed `vocabulary.json` in the project root. Move it to `src/data/vocabulary.json` and import it from there. Do not retype or modify the words.
- Structure: `lessons[]`, each with `id` (1–20), `title_zh`, `title_en`, and `words[]`. Each word is an array: `[hanzi, pinyin, pos, english]`.
- **Vocabulary must NEVER be mixed between lessons** in lesson study pages or lesson quizzes. Each lesson is its own isolated set. Only the final exam draws from all 20 lessons.
- Create a typed helper layer (`getLesson(id)`, `getAllWords()`) that converts the arrays into typed objects `{ hanzi, pinyin, pos, en, lessonId }`.
- Some words appear in more than one lesson (e.g. 又, 花, 口, 只, 东). Treat them as separate entries per lesson. In the final exam, avoid using two entries with identical hanzi in the same question's options.

## Core features

### 1. Home page
- Hero section with the app name, a short tagline, and overall progress (% of lessons completed, average score).
- A **grid of 20 lesson cards** (Lesson 1 … Lesson 20). Each card shows the lesson number, the Chinese title, the English title, the word count, the best quiz score, and a status badge (Not started / In progress / Completed ≥ 80%).
- A 21st highlighted card: **Final HSK 3 Mock Exam**.
- **Start-point selector** (this is required): the user chooses where to begin:
  - A dropdown / segmented selector "Start from lesson: 1 … 20" with a "Go" button.
  - Quick buttons: **Start from Lesson 1**, **Continue where I left off** (last opened lesson), **Jump to Final Exam**.
  - Any lesson card can also be opened directly at any time (no locking).

### 2. Lesson page `/lesson/[id]`
- Header: lesson number, titles, previous / next lesson navigation.
- Two tabs: **Study** and **Quiz**.
- **Study tab**: a list/table of that lesson's words only (hanzi large, pinyin, part of speech, English). Include a button to play pronunciation using the browser Web Speech API (`speechSynthesis`, lang `zh-CN`), and a toggle to hide pinyin / hide English for self-testing. Add a flashcard mode (flip card) for that lesson.
- **Quiz tab**: generated ONLY from this lesson's vocabulary (see Quiz engine).

### 3. Quiz engine (per lesson)
- Every word of the lesson is tested at least once. Shuffle the order every attempt.
- Mixed question types (multiple choice with 4 options):
  1. Hanzi → English meaning
  2. English meaning → Hanzi
  3. Hanzi → Pinyin
  4. Pinyin → Hanzi
  5. Listening-style: the browser speaks the word (Web Speech API) and the user picks the correct hanzi (include a "replay" button)
- **Distractors must come only from the same lesson.** Every lesson has at least 13 words, so this is always possible. Never use a distractor with the same hanzi or the same English meaning as the correct answer.
- UI: one question at a time, progress bar, instant feedback (green/red) with the correct answer shown, a Next button, and keyboard shortcuts (1–4 to choose, Enter for next).
- Result screen: score, percentage, time taken, list of mistakes (hanzi, pinyin, meaning), buttons for **Retry**, **Retry only mistakes**, **Next lesson**, and **Back to home**.
- Save the best score, attempts, and mistaken words per lesson in `localStorage`.

### 4. Final HSK 3 Mock Exam `/exam`
- Draws questions from ALL 20 lessons (random, balanced across lessons: about the same number per lesson).
- Modeled after the HSK 3 format, adapted for a vocabulary-only app (no audio files). Sections:
  - **Part 1 – Listening-style (speech synthesis):** hear a word, choose the correct hanzi or meaning. (10 questions)
  - **Part 2 – Reading, match meaning:** hanzi → English and English → hanzi. (15 questions)
  - **Part 3 – Fill in the blank:** a Chinese sentence with a missing word, choose the correct word from 4 options. Create a file `src/data/exam-sentences.ts` with at least 80 simple HSK-3-level example sentences, each using exactly one vocabulary word from the lessons (store `lessonId`, `answerHanzi`, the sentence with `____`, and the English translation). Write sentences that are natural and use only simple grammar. (15 questions)
  - **Part 4 – Sentence ordering:** words/phrases of a short sentence are scrambled, and the user taps them into the correct order. Reuse the sentences from `exam-sentences.ts`. (5 questions)
  - **Part 5 – Pinyin → Hanzi writing check:** show pinyin plus the English meaning, and the user types the hanzi (accept exact match). (5 questions)
- Total about 50 questions; a countdown timer (default 45 minutes, visible at all times); question navigator panel where the user can jump to any question and see flagged/unanswered ones; a "Flag for review" button; a submit confirmation dialog.
- Result: overall score, percentage, pass/fail (pass ≥ 60%), per-section breakdown, a per-lesson weakness chart (which lessons the user missed the most), and a review of all wrong answers with the correct answer. Add a button "Practice my weakest lessons", which links to those lesson quizzes.
- Save the exam history (date, score) in `localStorage` and show a small progress chart.

### 5. Extra (nice to have, keep simple)
- A "Mistakes" page that lists all words the user has gotten wrong, across lessons, with a button to practice them. (This is the only place besides the final exam where words from several lessons may appear together, and it must say so clearly.)
- Reset-progress button in settings with a confirmation dialog.

## Design requirements
- **Modern dark navy theme.** Suggested palette: background `#0a1128` / `#0b1330`, surface cards `#111b3d` with a subtle border `rgba(255,255,255,0.08)`, primary accent electric blue / indigo (`#4f8cff` → `#7c5cff` gradient), success emerald, error rose, warning amber, and text `#e6ecff` with muted `#8b97c2`.
- Rounded corners (`rounded-2xl`), soft shadows and glow on hover, glassmorphism on the top navbar, smooth transitions, and generous spacing.
- Hanzi displayed large with a good Chinese font (use `next/font` with **Noto Sans SC** for hanzi and **Inter** for Latin text).
- Sticky top navbar: logo, Lessons, Final Exam, Mistakes. Footer minimal.
- Accessible: sufficient contrast, focus states, keyboard navigation, `aria` labels.
- Page titles and meta tags set properly.

## Code quality
- Clean folder structure: `src/app`, `src/components`, `src/lib` (quiz generator, shuffle, storage helpers), `src/data`, `src/types`.
- Pure functions for question generation, with a few unit tests (Vitest) that verify: (a) lesson quizzes never include words from other lessons, (b) options contain exactly one correct answer and no duplicates, (c) every lesson word is covered.
- Use a seeded or standard Fisher–Yates shuffle.
- Handle server vs client carefully: `localStorage` and `speechSynthesis` only in client components / `useEffect`.

## Deliverables
1. The complete working app, with `npm run dev` working without errors, and `npm run build` passing.
2. A short `README.md` with setup, structure, and how to add or edit vocabulary.
3. When finished, run the tests and the build and report the results.

Work step by step: first scaffold the project and data layer, then the quiz engine with tests, then the pages, then the design polish.
