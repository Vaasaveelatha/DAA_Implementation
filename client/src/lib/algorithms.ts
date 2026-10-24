export type AlgorithmKey =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap"
  | "shell"
  | "counting";

export type DatasetPreset =
  | "random"
  | "sorted"
  | "reversed"
  | "nearly"
  | "few"
  | "high"
  | "low";

export type EventType =
  | "COMPARE"
  | "SWAP"
  | "OVERWRITE"
  | "MARK_SORTED"
  | "PIVOT"
  | "MERGE"
  | "COMPLETE";

export interface SortStats {
  comparisons: number;
  swaps: number;
  accesses: number;
  iteration: number;
}

export interface SortEvent {
  id: number;
  type: EventType;
  array: number[];
  indices: number[];
  sorted: number[];
  pivotIndex?: number;
  activeRange?: [number, number];
  message: string;
  explanation: string;
  stats: SortStats;
}

export interface AlgorithmMeta {
  key: AlgorithmKey;
  name: string;
  eyebrow: string;
  description: string;
  keyIdea: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
  color: string;
  pseudocode: string[];
  useCases: string[];
  pros: string[];
  cons: string[];
}

export interface SortRun {
  events: SortEvent[];
  finalArray: number[];
  stats: SortStats;
}

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    key: "bubble",
    name: "Bubble Sort",
    eyebrow: "baseline / adjacent",
    description: "Repeatedly compares neighbors and bubbles the largest remaining value toward the end.",
    keyIdea: "Local swaps create a globally ordered suffix.",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    color: "#45E3FF",
    pseudocode: ["for end ← n - 1 down to 1", "  swapped ← false", "  for i ← 0 to end - 1", "    if A[i] > A[i + 1]", "      swap(A[i], A[i + 1])", "  if not swapped: break"],
    useCases: ["Teaching local exchange", "Tiny or nearly-sorted arrays"],
    pros: ["Stable", "Very easy to trace"],
    cons: ["Quadratic on large inputs", "Many writes"],
  },
  {
    key: "selection",
    name: "Selection Sort",
    eyebrow: "baseline / selection",
    description: "Scans the unsorted region for the minimum, then locks it into the next position.",
    keyIdea: "Choose the next smallest value with one deliberate swap.",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    color: "#9B8CFF",
    pseudocode: ["for start ← 0 to n - 2", "  min ← start", "  for i ← start + 1 to n - 1", "    if A[i] < A[min]: min ← i", "  swap(A[start], A[min])"],
    useCases: ["Memory-constrained systems", "Minimizing writes"],
    pros: ["Simple", "At most n swaps"],
    cons: ["Always quadratic comparisons", "Not stable by default"],
  },
  {
    key: "insertion",
    name: "Insertion Sort",
    eyebrow: "baseline / adaptive",
    description: "Grows a sorted prefix by shifting larger values and inserting the next key.",
    keyIdea: "Every new value finds its place inside an already-ordered prefix.",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    color: "#FFB866",
    pseudocode: ["for i ← 1 to n - 1", "  key ← A[i]", "  j ← i - 1", "  while j ≥ 0 and A[j] > key", "    A[j + 1] ← A[j]", "    j ← j - 1", "  A[j + 1] ← key"],
    useCases: ["Streaming data", "Small or nearly-sorted arrays"],
    pros: ["Adaptive", "Stable and in-place"],
    cons: ["Quadratic shifts", "Slow on reversed inputs"],
  },
  {
    key: "merge",
    name: "Merge Sort",
    eyebrow: "efficient / divide & conquer",
    description: "Splits the array, sorts each half, and merges ordered runs back together.",
    keyIdea: "Two sorted halves can be merged in a single linear pass.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    stable: true,
    inPlace: false,
    color: "#45E3FF",
    pseudocode: ["mergeSort(A, lo, hi)", "  if lo ≥ hi: return", "  mid ← floor((lo + hi) / 2)", "  mergeSort(A, lo, mid)", "  mergeSort(A, mid + 1, hi)", "  merge the two runs"],
    useCases: ["External sorting", "Stable production pipelines"],
    pros: ["Predictable runtime", "Stable"],
    cons: ["Needs auxiliary memory", "More moving parts"],
  },
  {
    key: "quick",
    name: "Quick Sort",
    eyebrow: "efficient / partition",
    description: "Partitions around a pivot, then recursively sorts the smaller regions.",
    keyIdea: "A good pivot turns one problem into two smaller ones.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    stable: false,
    inPlace: true,
    color: "#FF7B72",
    pseudocode: ["quickSort(A, lo, hi)", "  pivot ← A[hi]", "  p ← lo", "  for i ← lo to hi - 1", "    if A[i] ≤ pivot: swap(A[i], A[p]); p++", "  swap(A[p], A[hi])", "  recurse on both sides"],
    useCases: ["General in-memory sorting", "Cache-friendly workloads"],
    pros: ["Fast average case", "In-place"],
    cons: ["Worst-case quadratic", "Unstable"],
  },
  {
    key: "heap",
    name: "Heap Sort",
    eyebrow: "efficient / selection",
    description: "Builds a max heap, then repeatedly extracts the root into its final position.",
    keyIdea: "A heap makes the next maximum visible in logarithmic time.",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    color: "#7FE3B0",
    pseudocode: ["build a max heap", "for end ← n - 1 down to 1", "  swap(A[0], A[end])", "  mark end sorted", "  siftDown(A, 0, end)"],
    useCases: ["Strict runtime guarantees", "Priority-queue intuition"],
    pros: ["Worst-case O(n log n)", "Constant extra space"],
    cons: ["Not stable", "Less cache-friendly"],
  },
  {
    key: "shell",
    name: "Shell Sort",
    eyebrow: "additional / gap insertion",
    description: "Runs insertion sort over shrinking gaps so distant inversions disappear early.",
    keyIdea: "Pre-sort far-apart values before the final adjacent pass.",
    best: "O(n log n)",
    average: "O(n^1.5)",
    worst: "O(n²)",
    space: "O(1)",
    stable: false,
    inPlace: true,
    color: "#C6F36B",
    pseudocode: ["gap ← floor(n / 2)", "while gap ≥ 1", "  gapped insertion sort", "  gap ← floor(gap / 2)"],
    useCases: ["Simple embedded systems", "Medium arrays without extra memory"],
    pros: ["In-place", "Faster than insertion in practice"],
    cons: ["Gap sequence affects runtime", "Not stable"],
  },
  {
    key: "counting",
    name: "Counting Sort",
    eyebrow: "additional / non-comparison",
    description: "Counts occurrences in a bounded integer range, then reconstructs the ordered array.",
    keyIdea: "Use value frequencies instead of comparing pairs.",
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n + k)",
    space: "O(n + k)",
    stable: true,
    inPlace: false,
    color: "#F5D06F",
    pseudocode: ["find min and max", "count each value at value - min", "prefix-sum the counts", "write values back in order", "mark each output position sorted"],
    useCases: ["Small integer ranges", "Frequency-heavy data"],
    pros: ["Linear when k is bounded", "Stable reconstruction"],
    cons: ["Integer-only", "Memory grows with range"],
  },
];

export const ALGORITHM_MAP = Object.fromEntries(ALGORITHMS.map(meta => [meta.key, meta])) as Record<AlgorithmKey, AlgorithmMeta>;

const cloneStats = (stats: SortStats): SortStats => ({ ...stats });

function createRun(input: number[]) {
  const array = [...input];
  const events: SortEvent[] = [];
  const sorted = new Set<number>();
  let pivotIndex: number | undefined;
  let activeRange: [number, number] | undefined;
  const stats: SortStats = { comparisons: 0, swaps: 0, accesses: 0, iteration: 0 };
  let id = 0;

  const emit = (type: EventType, indices: number[], message: string, explanation: string) => {
    events.push({
      id: id++,
      type,
      array: [...array],
      indices,
      sorted: [...sorted],
      pivotIndex,
      activeRange,
      message,
      explanation,
      stats: cloneStats(stats),
    });
  };

  const compare = (i: number, j: number, message?: string) => {
    stats.comparisons += 1;
    stats.accesses += 2;
    emit("COMPARE", [i, j], message ?? `Compare ${array[i]} and ${array[j]}`, `Reading positions ${i} and ${j} reveals whether the next move preserves the invariant.`);
    return array[i] - array[j];
  };

  const swap = (i: number, j: number, message?: string) => {
    stats.swaps += 1;
    stats.accesses += 4;
    [array[i], array[j]] = [array[j], array[i]];
    emit("SWAP", [i, j], message ?? `Swap ${array[i]} and ${array[j]}`, `The pair is out of order, so the algorithm exchanges them in-place.`);
  };

  const overwrite = (index: number, value: number, message?: string) => {
    stats.accesses += 2;
    array[index] = value;
    emit("OVERWRITE", [index], message ?? `Write ${value} to index ${index}`, `This write rebuilds the sorted region from the algorithm's working data.`);
  };

  const markSorted = (index: number, message?: string) => {
    sorted.add(index);
    emit("MARK_SORTED", [index], message ?? `Index ${index} is now sorted`, `This position will not need to move again.`);
  };

  const tick = () => {
    stats.iteration += 1;
  };

  const setPivot = (index: number) => {
    pivotIndex = index;
    emit("PIVOT", [index], `Pivot selected: ${array[index]}`, `Partitioning will place values smaller than the pivot to its left.`);
  };

  const setRange = (range?: [number, number]) => {
    activeRange = range;
  };

  const complete = () => {
    for (let i = 0; i < array.length; i += 1) sorted.add(i);
    pivotIndex = undefined;
    activeRange = undefined;
    emit("COMPLETE", [], "Sorting completed", "Every position is now in non-decreasing order.");
  };

  return { array, events, sorted, stats, compare, swap, overwrite, markSorted, tick, setPivot, setRange, complete };
}

export function runAlgorithm(input: number[], key: AlgorithmKey): SortRun {
  const ctx = createRun(input);
  const { array, stats } = ctx;

  if (key === "bubble") {
    for (let end = array.length - 1; end > 0; end -= 1) {
      ctx.tick();
      let moved = false;
      for (let i = 0; i < end; i += 1) {
        if (ctx.compare(i, i + 1, `Compare ${array[i]} and ${array[i + 1]}`) > 0) {
          ctx.swap(i, i + 1, `${array[i + 1]} > ${array[i]} → swap`);
          moved = true;
        }
      }
      ctx.markSorted(end, `Element ${array[end]} is locked at index ${end}`);
      if (!moved) break;
    }
    if (array.length) ctx.markSorted(0, `Element ${array[0]} is locked at index 0`);
  }

  if (key === "selection") {
    for (let start = 0; start < array.length - 1; start += 1) {
      ctx.tick();
      let min = start;
      for (let i = start + 1; i < array.length; i += 1) {
        if (ctx.compare(i, min, `Compare candidate ${array[i]} with minimum ${array[min]}`) < 0) min = i;
      }
      if (min !== start) ctx.swap(start, min, `Move minimum ${array[start]} into index ${start}`);
      ctx.markSorted(start, `Minimum ${array[start]} is now sorted`);
    }
    if (array.length) ctx.markSorted(array.length - 1, `Final element ${array[array.length - 1]} is sorted`);
  }

  if (key === "insertion") {
    if (array.length) ctx.markSorted(0, `Seed the sorted prefix with ${array[0]}`);
    for (let i = 1; i < array.length; i += 1) {
      ctx.tick();
      const value = array[i];
      stats.accesses += 1;
      let j = i - 1;
      while (j >= 0) {
        stats.comparisons += 1;
        stats.accesses += 2;
        ctx.events.push({ id: ctx.events.length, type: "COMPARE", array: [...array], indices: [j, i], sorted: [...ctx.sorted], message: `Compare ${array[j]} with key ${value}`, explanation: `The sorted prefix shifts right while it searches for the key's insertion point.`, stats: { ...stats } });
        if (array[j] <= value) break;
        ctx.overwrite(j + 1, array[j], `Shift ${array[j]} from index ${j} to ${j + 1}`);
        j -= 1;
      }
      if (j + 1 !== i) ctx.overwrite(j + 1, value, `Insert key ${value} at index ${j + 1}`);
      ctx.markSorted(i, `Sorted prefix now reaches index ${i}`);
    }
  }

  if (key === "merge") {
    const merge = (lo: number, hi: number) => {
      if (lo >= hi) return;
      const mid = Math.floor((lo + hi) / 2);
      merge(lo, mid);
      merge(mid + 1, hi);
      ctx.setRange([lo, hi]);
      ctx.events.push({ id: ctx.events.length, type: "MERGE", array: [...array], indices: [lo, mid, hi], sorted: [...ctx.sorted], activeRange: [lo, hi], message: `Merge indices ${lo}–${mid} with ${mid + 1}–${hi}`, explanation: `Both halves are locally ordered; merge picks the smaller front value each time.`, stats: { ...stats } });
      const left = array.slice(lo, mid + 1);
      const right = array.slice(mid + 1, hi + 1);
      let i = 0, j = 0, k = lo;
      while (i < left.length && j < right.length) {
        stats.comparisons += 1;
        stats.accesses += 2;
        ctx.events.push({ id: ctx.events.length, type: "COMPARE", array: [...array], indices: [lo + i, mid + 1 + j], sorted: [...ctx.sorted], activeRange: [lo, hi], message: `Compare merge candidates ${left[i]} and ${right[j]}`, explanation: `The smaller head becomes the next value in the merged run.`, stats: { ...stats } });
        if (left[i] <= right[j]) ctx.overwrite(k++, left[i++], `Write ${left[i - 1]} from the left run`);
        else ctx.overwrite(k++, right[j++], `Write ${right[j - 1]} from the right run`);
      }
      while (i < left.length) ctx.overwrite(k++, left[i++], "Drain the remaining left run");
      while (j < right.length) ctx.overwrite(k++, right[j++], "Drain the remaining right run");
      for (let index = lo; index <= hi; index += 1) ctx.markSorted(index, `Merged run confirms index ${index}`);
      ctx.setRange(undefined);
    };
    merge(0, array.length - 1);
  }

  if (key === "quick") {
    const partition = (lo: number, hi: number): number => {
      ctx.setRange([lo, hi]);
      ctx.setPivot(hi);
      const pivot = array[hi];
      let p = lo;
      for (let i = lo; i < hi; i += 1) {
        if (ctx.compare(i, hi, `Compare ${array[i]} with pivot ${pivot}`) <= 0) {
          if (i !== p) ctx.swap(i, p, `Move ${array[p]} left of pivot`);
          p += 1;
        }
      }
      if (p !== hi) ctx.swap(p, hi, `Place pivot ${pivot} at index ${p}`);
      ctx.markSorted(p, `Pivot ${pivot} is fixed at index ${p}`);
      return p;
    };
    const quick = (lo: number, hi: number) => {
      if (lo >= hi) return;
      ctx.tick();
      const p = partition(lo, hi);
      quick(lo, p - 1);
      quick(p + 1, hi);
    };
    quick(0, array.length - 1);
  }

  if (key === "heap") {
    const siftDown = (root: number, size: number) => {
      let largest = root;
      while (true) {
        const left = largest * 2 + 1;
        const right = left + 1;
        if (left >= size) break;
        if (ctx.compare(left, largest, `Compare child ${array[left]} with parent ${array[largest]}`) > 0) largest = left;
        if (right < size && ctx.compare(right, largest, `Compare child ${array[right]} with parent ${array[largest]}`) > 0) largest = right;
        if (largest === root) break;
        ctx.swap(root, largest, `Heapify: move ${array[largest]} above parent`);
        root = largest;
      }
    };
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i -= 1) {
      ctx.tick();
      siftDown(i, array.length);
    }
    for (let end = array.length - 1; end > 0; end -= 1) {
      ctx.tick();
      ctx.swap(0, end, `Extract max ${array[end]} to index ${end}`);
      ctx.markSorted(end, `Heap extraction locks index ${end}`);
      siftDown(0, end);
    }
    if (array.length) ctx.markSorted(0, "Heap root is the final sorted element");
  }

  if (key === "shell") {
    for (let gap = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < array.length; i += 1) {
        ctx.tick();
        let j = i;
        while (j >= gap) {
          if (ctx.compare(j - gap, j, `Gap ${gap}: compare ${array[j - gap]} and ${array[j]}`) <= 0) break;
          ctx.swap(j - gap, j, `Gap ${gap}: swap distant inversion`);
          j -= gap;
        }
      }
    }
    for (let i = 0; i < array.length; i += 1) ctx.markSorted(i, `Gap passes confirm index ${i}`);
  }

  if (key === "counting") {
    if (array.length) {
      const min = Math.min(...array);
      const max = Math.max(...array);
      const counts = new Array(max - min + 1).fill(0);
      for (let i = 0; i < array.length; i += 1) {
        stats.accesses += 1;
        counts[array[i] - min] += 1;
        ctx.events.push({ id: ctx.events.length, type: "MERGE", array: [...array], indices: [i], sorted: [...ctx.sorted], message: `Count value ${array[i]} in bucket ${array[i] - min}`, explanation: "Counting Sort records frequency instead of comparing pairs.", stats: { ...stats } });
      }
      let write = 0;
      for (let bucket = 0; bucket < counts.length; bucket += 1) {
        while (counts[bucket] > 0) {
          const value = bucket + min;
          ctx.overwrite(write, value, `Write ${value} from frequency bucket ${bucket}`);
          ctx.markSorted(write, `Index ${write} is finalized by counting`);
          write += 1;
          counts[bucket] -= 1;
        }
      }
    }
  }

  ctx.complete();
  return { events: ctx.events, finalArray: [...array], stats: { ...stats } };
}

export function generateDataset(preset: DatasetPreset, size: number): number[] {
  const n = Math.max(4, Math.min(200, Math.round(size)));
  const random = () => Math.floor(Math.random() * 92) + 8;
  if (preset === "sorted") return Array.from({ length: n }, (_, i) => Math.round(8 + (i / Math.max(1, n - 1)) * 92));
  if (preset === "reversed") return generateDataset("sorted", n).reverse();
  if (preset === "few") return Array.from({ length: n }, () => [18, 32, 48, 66, 84][Math.floor(Math.random() * 5)]);
  if (preset === "low") return Array.from({ length: n }, () => Math.round(42 + (Math.random() - 0.5) * 18));
  if (preset === "high") return Array.from({ length: n }, () => Math.round(10 + Math.pow(Math.random(), 0.45) * 90));
  const result = Array.from({ length: n }, random);
  if (preset === "nearly") {
    result.sort((a, b) => a - b);
    for (let i = 0; i < Math.max(1, Math.floor(n / 8)); i += 1) {
      const left = Math.floor(Math.random() * n);
      const right = Math.floor(Math.random() * n);
      [result[left], result[right]] = [result[right], result[left]];
    }
  }
  return result;
}

export function parseCustomArray(raw: string): { values?: number[]; error?: string } {
  if (!raw.trim()) return { error: "Add at least two numbers to visualize a custom array." };
  const parts = raw.split(/[\s,;]+/).filter(Boolean);
  if (parts.some(part => !/^-?\d+(\.\d+)?$/.test(part))) return { error: "Use numbers separated by commas or spaces." };
  const values = parts.map(Number);
  if (values.some(value => !Number.isFinite(value))) return { error: "Every value must be finite." };
  if (values.length < 2) return { error: "Add at least two numbers to visualize a custom array." };
  if (values.length > 200) return { error: "Keep custom arrays to 200 values or fewer." };
  if (values.some(value => Math.abs(value) > 10000)) return { error: "Keep values between -10,000 and 10,000 for a readable stage." };
  return { values: values.map(value => Math.round(value)) };
}
