# SortX — Interactive Sorting Algorithm Visualizer

**SortX** is an educational web application for exploring how sorting algorithms transform an array. It combines interactive visualization with algorithm operation events and learning-focused metrics so students can study the behavior of different sorting techniques instead of seeing only the final result.

**Project area:** Design and Analysis of Algorithms (DAA)  
**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend:** Node.js, Express.js, tRPC  
**Optional persistence:** MySQL and Drizzle ORM  
**Repository:** [Interactive Visualization of Sorting Algorithms](https://github.com/Vaasaveelatha/DAA_Implementation)

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Objectives](#objectives)
3. [Features and Scope](#features-and-scope)
4. [Supported Sorting Algorithms](#supported-sorting-algorithms)
5. [Technology Stack](#technology-stack)
6. [Application Architecture](#application-architecture)
7. [How Sorting Visualization Works](#how-sorting-visualization-works)
8. [Project Structure](#project-structure)
9. [Installation and Local Setup](#installation-and-local-setup)
10. [How to Use](#how-to-use)
11. [Algorithm Complexity Reference](#algorithm-complexity-reference)
12. [Design Decisions](#design-decisions)
13. [Testing and Validation](#testing-and-validation)
14. [Limitations](#limitations)
15. [Troubleshooting](#troubleshooting)
16. [Future Improvements](#future-improvements)
17. [Conclusion](#conclusion)

## Problem Statement

Sorting algorithms are fundamental to computer science, but learning them from pseudocode alone can make it difficult to follow comparisons, swaps, writes, partitions, and intermediate array states. A final sorted output does not show *why* the algorithm produced that result or how its steps differ from another algorithm.

SortX addresses this problem through an interactive visual learning environment that illustrates algorithm operations and helps users connect the theory of sorting with its execution.

## Objectives

- Demonstrate the working principles of commonly studied sorting algorithms.
- Make changes to array elements visible through step-oriented animations.
- Help learners compare algorithms in terms of their operation patterns and theoretical complexity.
- Provide a modern web interface for experimenting with sorting inputs.
- Separate algorithm logic from the interface using a reusable TypeScript event engine.
- Support optional backend persistence for features that need saved data.

## Features and Scope

The core project focuses on **algorithm visualization and learning**. The repository contains a typed sorting-event engine and dataset generators in `client/src/lib/algorithms.ts`, along with React application pages and visualizer interactions in `client/src/App.tsx`.

The architecture also includes a tRPC API and persistence helpers. The repository README identifies backend endpoints for database-backed preferences, quiz attempts, saved datasets, and visualization sessions. These persistence features require a configured MySQL connection; they should not be confused with the sorting algorithm itself.

**Learning capabilities:**

- Explore eight sorting algorithms.
- Observe how intermediate sorting operations change array order.
- Study event-based algorithm execution and related metrics.
- Use generated datasets to explore different input patterns.
- Compare theoretical running-time and auxiliary-space requirements.

> **Implementation note:** The exact on-screen controls, available input formats, and visual indicators depend on the current React UI. This README intentionally does not claim unverified controls such as export, copy, pause, or side-by-side comparison.

## Supported Sorting Algorithms

### 1. Bubble Sort

Repeatedly compares neighboring elements and swaps them if they are in the wrong order. After each complete pass, the largest remaining element moves toward its final position. It is straightforward to visualize but inefficient for large arrays.

### 2. Selection Sort

Searches the unsorted portion for the smallest value and places it at the beginning of that portion. It performs a quadratic number of comparisons even when the input is already sorted.

### 3. Insertion Sort

Builds a sorted prefix one element at a time by shifting larger values to make room for the next element. It is especially useful for small or nearly sorted datasets.

### 4. Merge Sort

Uses divide and conquer: split the array into smaller sections, recursively sort them, and merge the sorted sections. Its worst-case running time remains `O(n log n)`, with `O(n)` typical auxiliary array space.

### 5. Quick Sort

Selects a pivot, partitions values around it, and recursively sorts the partitions. It is typically fast, but unfavorable pivot choices can lead to `O(n²)` running time.

### 6. Heap Sort

Builds a max heap and repeatedly moves the maximum value to the end of the array, restoring the heap property after each removal. Its running time is `O(n log n)` even in the worst case.

### 7. Shell Sort

Improves insertion sort by first comparing elements separated by larger gaps, then reducing the gap until it becomes one. Complexity depends strongly on the chosen gap sequence.

### 8. Counting Sort

Counts the frequency of each integer value and uses those counts to produce sorted output. Unlike comparison-based sorts, its running time depends on the number of elements and the integer value range. It is not directly suitable for arbitrary decimal inputs without adaptation.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Builds interactive application screens and UI components. |
| TypeScript | Adds static typing to frontend and shared application logic. |
| JavaScript | Runtime language for browser and server execution. |
| Vite | Frontend development tooling and production bundling. |
| Tailwind CSS | Utility-based interface styling. |
| Node.js | Executes server-side JavaScript/TypeScript. |
| Express.js | Runs the HTTP server and hosts application endpoints. |
| tRPC | Provides typed communication between frontend and backend. |
| Drizzle ORM | Defines and accesses database-backed application data. |
| MySQL | Optional persistence for supported server features. |
| Vitest | Runs automated tests. |
| Git and GitHub | Version control and repository hosting. |

## Application Architecture

```text
                         USER / WEB BROWSER
                                 |
                                 v
                    React + TypeScript UI
                                 |
                   User selects an algorithm
                                 |
                                 v
                 Sorting event engine (client)
                                 |
                   Generates sorting operations
                                 |
                                 v
                   Visualization / UI updates
                                 |
                       Learning metrics

          Optional persistence / backend workflows:

                    React frontend / tRPC
                                 |
                                 v
                         Express server
                                 |
                                 v
                       Drizzle ORM helpers
                                 |
                                 v
                     MySQL (when configured)
```

**Key distinction:** Sorting visualization logic is implemented on the client side; the presence of Express, tRPC, Drizzle, and MySQL does **not** mean that each sorting comparison is processed or stored in the database.

## How Sorting Visualization Works

1. The application obtains a dataset for visualization.
2. The user chooses a supported sorting algorithm.
3. The TypeScript algorithm engine prepares a sequence of sorting-related events.
4. The React interface consumes those events to present intermediate algorithm states.
5. The visualization helps users understand the sequence of operations and algorithm behavior.
6. A completed run results in the values arranged in ascending order.

The sorting-event approach is useful because it separates **what the algorithm does** from **how its steps are displayed**. It also makes algorithm behavior easier to test without depending entirely on visual inspection.

### Understanding operation metrics

Operation counts are educational measurements. They may track events such as comparisons, swaps, or writes, depending on the algorithm's event definitions. They should not be treated as identical to CPU instructions or directly comparable wall-clock benchmarks. Animation time also includes UI rendering and playback delays.

## Project Structure

The following structure highlights important directories and files visible in the repository; it is not an exhaustive tree:

```text
DAA_Implementation/
├── client/
│   └── src/
│       ├── App.tsx                  # React application and interactions
│       └── lib/
│           └── algorithms.ts        # Sorting events and dataset generators
├── server/
│   ├── _core/
│   │   └── index.ts                 # Server entry point
│   ├── routers.ts                   # tRPC API definitions
│   └── db.ts                        # Database helpers
├── shared/                         # Shared types and constants
├── drizzle/                        # Database schema and migrations
├── patches/                        # Project dependency patches
├── package.json                     # Dependencies and npm scripts
├── pnpm-lock.yaml                   # Locked dependency versions
├── pnpm-workspace.yaml              # Workspace configuration
├── vite.config.ts                   # Vite configuration
├── vitest.config.ts                 # Test configuration
├── tsconfig.json                    # TypeScript configuration
├── drizzle.config.ts                # Database migration configuration
├── Dockerfile                       # Container build configuration
├── .gitignore                       # Ignored local/generated files
└── README.md                        # Project documentation
```

## Installation and Local Setup

### Requirements

- Node.js **20 or newer**.
- **pnpm 10 or newer** (repository declares `pnpm@10.18.0`).
- VS Code or another editor (optional).
- Git (optional if downloading a ZIP).
- MySQL **only if using persistence features**.

### 1. Download the project

```bash
git clone https://github.com/Vaasaveelatha/DAA_Implementation.git
cd DAA_Implementation
```

Alternatively, download and extract the ZIP, then open the directory containing `package.json`.

### 2. Check installed tools

```bash
node --version
pnpm --version
```

If `pnpm` is missing, install it using Corepack or the official pnpm installation instructions for your environment.

### 3. Install dependencies

```bash
pnpm install
```

### 4. Run the application

```bash
pnpm dev
```

Open **http://localhost:3000** in your browser. Keep the terminal running during development. Use `Ctrl+C` to stop the server.

### 5. Optional: configure MySQL persistence

Create a local `.env` file containing a valid `DATABASE_URL` connection string for your MySQL instance. The precise credentials and database name depend on your environment. Never commit this file or expose its contents in screenshots.

Then run:

```bash
pnpm db:migrate
```

This applies checked-in Drizzle migrations. **MySQL is not required merely to understand the sorting event engine**, but some application routes may depend on backend configuration.

### 6. Other useful commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Run the development server. |
| `pnpm check` | Validate TypeScript types. |
| `pnpm test` | Run the Vitest test suite. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Run the built production server. |
| `pnpm db:migrate` | Apply database migrations. |
| `pnpm db:push` | Generate and apply migrations as configured. |
| `pnpm format` | Format the project with Prettier. |

**Windows note:** The `dev` and `start` scripts use Unix-style inline environment variable assignments (`NODE_ENV=...`). They may need a compatible shell or script adjustment on native Windows PowerShell/Command Prompt. Do not assume the scripts are cross-platform without testing.

## How to Use

1. Start the development server and open the local application URL.
2. Navigate to the sorting visualizer in the React interface.
3. Choose an available dataset or input option provided by the interface.
4. Select one of the eight supported sorting algorithms.
5. Use the visualization controls shown in the application to inspect its execution.
6. Observe intermediate changes and any metrics shown on screen.
7. Repeat with another algorithm or dataset to study differences.

**Example dataset:** `[42, 18, 63, 7, 31]`  
**Expected ascending result:** `[7, 18, 31, 42, 63]`

## Algorithm Complexity Reference

Here, `n` is the number of elements and `k` is the integer value range for Counting Sort.

| Algorithm | Best Time | Average Time | Worst Time | Typical Auxiliary Space |
|---|---|---|---|---|
| Bubble Sort | `O(n)` with early-exit optimization; otherwise `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` |
| Selection Sort | `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` |
| Insertion Sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` |
| Merge Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` |
| Quick Sort | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)` average recursion; `O(n)` worst |
| Heap Sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` for in-place implementation |
| Shell Sort | Gap-sequence dependent | Gap-sequence dependent | Gap-sequence dependent | `O(1)` for in-place implementation |
| Counting Sort | `O(n + k)` | `O(n + k)` | `O(n + k)` | `O(n + k)` for stable output-array implementation |

These are **standard theoretical bounds**, not measured results from the app. Exact bounds and memory usage can differ based on the implementation. A visualizer that records all operations may use additional memory proportional to the event history, beyond the algorithm's traditional auxiliary-space complexity.

### Quick comparison

- **Simple quadratic sorts:** Bubble, Selection, and Insertion Sort.
- **Divide-and-conquer sorts:** Merge and Quick Sort.
- **Heap-based sort:** Heap Sort.
- **Gap-based insertion method:** Shell Sort.
- **Non-comparison-based sort:** Counting Sort.

## Design Decisions

### Typed event engine

Algorithm steps are represented separately from React rendering. This makes it easier to understand the sorting logic, maintain visualization behavior, and test algorithm correctness.

### React-based interface

React manages application screens and visual state, while TypeScript helps catch type-related mistakes during development.

### Separate server and client responsibilities

Express and tRPC handle backend communication. The sorting algorithm logic belongs to the client-side event engine rather than requiring an HTTP request for every swap.

### Optional database integration

Drizzle ORM and MySQL support application data that requires persistence. The sorting process itself does not inherently require database storage.

## Testing and Validation

Run the available automated tests and TypeScript checks:

```bash
pnpm test
pnpm check
```

For manual algorithm verification, useful test inputs include:

| Input type | Example | Expected result |
|---|---|---|
| Unsorted | `[5, 2, 8, 1]` | `[1, 2, 5, 8]` |
| Already sorted | `[1, 2, 3, 4]` | `[1, 2, 3, 4]` |
| Reverse sorted | `[4, 3, 2, 1]` | `[1, 2, 3, 4]` |
| Duplicates | `[3, 1, 3, 2]` | `[1, 2, 3, 3]` |
| Single value | `[7]` | `[7]` |
| Negative integers | `[-2, 4, 0, -1]` | `[-2, -1, 0, 4]` |

These are **recommended validation cases**, not a claim that every case has already passed in the current repository. In particular, confirm Counting Sort's handling of negative numbers and the allowed input range against its actual implementation.

## Limitations

- Visual playback and event recording introduce overhead, so the app is a learning tool rather than a controlled performance benchmark.
- Different algorithms may produce different numbers and types of visualization events; raw event totals are not always directly comparable.
- Counting Sort depends on the integer range and may require input restrictions.
- Quick Sort behavior depends on pivot and partition strategy.
- Shell Sort complexity depends on the chosen gap sequence.
- Optional database features need a valid MySQL configuration.
- Some shell scripts may require adjustments on Windows.
- The exact interface controls and visual indicators should be checked against the current UI before describing them in a live demonstration.

## Troubleshooting

### `pnpm` is not recognized

Install or enable pnpm, restart your terminal, and check `pnpm --version`.

### Dependencies fail to install

Verify Node.js and pnpm versions, internet access, and any dependency installation errors. Prefer the repository's lockfile rather than mixing package managers.

### The app does not start

Confirm you are in the folder containing `package.json`, then run `pnpm install` and `pnpm dev`. Read the terminal error for missing environment variables or platform-specific script problems.

### Port 3000 is in use

Stop the process occupying the port or adjust the application/server port configuration. Do not assume the Vite port alone controls the Express server.

### Database connection fails

Check whether `DATABASE_URL` is set, whether MySQL is running, and whether the configured user has access to the selected database. Database-backed features may fail without it.

### The visualizer displays unexpected output

Try a small known dataset and compare the result with its expected ascending order. Use `pnpm test` to check automated cases and inspect the browser developer console for frontend errors.

## Future Improvements

Potential enhancements include:

- Side-by-side algorithm visualization on the same input.
- More explicit educational explanations of each operation.
- Improved accessibility and keyboard navigation.
- Downloadable run summaries and classroom exercises.
- Expanded automated tests for edge cases and UI behavior.
- More detailed theoretical-versus-observed operation comparisons.
- Additional algorithms such as Radix Sort or Bucket Sort.

These items are proposed improvements, **not claims about existing functionality**.

## Conclusion

SortX demonstrates the principles of sorting through an interactive, event-driven web visualization. By combining eight sorting techniques with a typed React application and an optional Node.js/MySQL backend, it offers a practical way to connect Design and Analysis of Algorithms theory with visible algorithm behavior.

The project is intended primarily for **learning, experimentation, and academic demonstration**.
