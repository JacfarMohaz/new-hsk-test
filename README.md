# HSK 3 Sprint

A fast, focused HSK 3 vocabulary exam-prep app. 20 isolated lessons, mixed-type quizzes, flashcards,
and a full-length mock exam modeled on the HSK 3 format. No backend, no accounts — all progress is
saved in your browser's `localStorage`.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS**
- `framer-motion` for the flashcard flip animation, `lucide-react` for icons
- `next/font` with **Noto Sans SC** (hanzi) and **Inter** (Latin text)
- **Vitest** for unit tests
- No database — all state lives in `localStorage` via `src/lib/storage.ts`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run test    # run the Vitest suite
npm run lint    # ESLint
```

## Project structure

```
src/
  app/                 Next.js routes (App Router)
    page.tsx              Home
    lesson/[id]/page.tsx  Lesson study + quiz
    exam/page.tsx         Final mock exam
    mistakes/page.tsx     Cross-lesson mistake review
    settings/page.tsx     Reset progress
  components/
    home/                Home page: lesson grid, start-point selector
    lesson/              Study tab, flashcards, lesson quiz
    exam/                Final exam: timer, navigator, per-part question UIs, results
    mistakes/            Mistake bank + practice runner
    quiz/                Shared multiple-choice question card
    settings/            Reset-progress UI
    ui/                  Navbar, footer, badge, progress bar
  lib/
    quiz.ts              Per-lesson quiz generation (pure functions)
    exam.ts              Final exam generation + scoring (pure functions)
    shuffle.ts            Fisher-Yates shuffle (+ seedable PRNG for tests)
    storage.ts            localStorage read/write helpers
    speech.ts              Web Speech API wrapper
    progress.ts            Lesson status / overall progress helpers
  data/
    vocabulary.json       Source vocabulary (20 lessons)
    index.ts              Typed accessors: getLesson(), getAllWords(), ...
    exam-sentences.ts     100 example sentences for the exam's fill-in-blank
                           and sentence-ordering sections
  types/vocabulary.ts     Shared Word / Lesson types
tests/
  quiz.test.ts            Lesson isolation, option correctness, full coverage
  exam.test.ts            Exam structure, scoring shape
```

## How the quiz/exam engines work

- **Lesson quizzes** (`src/lib/quiz.ts`) only ever draw questions and distractors from that
  lesson's own word list — vocabulary is never mixed across lessons here. Every word in the
  lesson is tested at least once, question types (hanzi→English, English→hanzi, hanzi→pinyin,
  pinyin→hanzi, listening) are shuffled, and distractors never share the correct answer's hanzi
  or English meaning.
- **The final exam** (`src/lib/exam.ts`) is the only other place vocabulary from different
  lessons is deliberately mixed (the Mistakes page also mixes lessons, and says so). It draws a
  balanced spread of words across all 20 lessons for Parts 1, 2 and 5, and samples
  `exam-sentences.ts` for Parts 3 and 4.
- Both are pure, seedable functions (take an optional `random` function) so they're fully unit
  tested with a deterministic PRNG in `tests/`.

## Adding or editing vocabulary

Edit `src/data/vocabulary.json`. Each lesson is:

```json
{
  "id": 21,
  "title_zh": "...",
  "title_en": "...",
  "words": [
    ["汉字", "pinyin", "pos", "english meaning"]
  ]
}
```

- A lesson needs **at least 4 words** (the quiz engine needs 4 options per question).
- The same hanzi can appear in multiple lessons — each lesson's copy is treated as its own
  entry, which is exactly how the shipped data handles words like 又, 花, 口, 只 and 东.
- No code changes are needed for a new lesson to show up on the home page, get a quiz, or be
  included in the final exam's lesson pool — `src/data/index.ts` reads the JSON directly.

To add fill-in-the-blank / sentence-ordering material for a new lesson, add entries to
`src/data/exam-sentences.ts` (`lessonId`, `answerHanzi` matching a word in that lesson,
`sentence` with a `____` blank, `english`, and optionally `tokens` — the full sentence split
into tappable chunks — to make it eligible for the sentence-ordering section).

## Progress & data reset

Everything (lesson scores, exam history, mistake bank, last-opened lesson) is stored under one
`localStorage` key. Use **Settings → Reset progress** to clear it, or clear your browser's site
data for this origin.
