# Component Architecture

## Component Hierarchy

```
App
└── Page (example/page.tsx)
    ├── ArticleForm
    │   ├── Title Input Field
    │   │   ├── Label
    │   │   ├── Input
    │   │   ├── Status Icon (✓/⚠)
    │   │   ├── Character Counter
    │   │   └── Error Message
    │   │
    │   ├── Content Input Field
    │   │   ├── Label
    │   │   ├── Textarea
    │   │   ├── Status Icon (✓/⚠)
    │   │   ├── Character Counter
    │   │   └── Error Message
    │   │
    │   ├── Submit Button
    │   │   ├── Icon (FileText / Loader2)
    │   │   └── Text
    │   │
    │   └── Loading Hint (when analyzing)
    │
    └── AnalysisResult (conditional)
        ├── Header Section
        │   ├── Viral Score Display
        │   │   └── Pie Chart (circular)
        │   │
        │   └── Rating & Prediction
        │       ├── Rating Badge
        │       └── Estimated PV Range
        │
        ├── Detailed Analysis Section
        │   ├── Radar Chart (8 metrics)
        │   └── Bar Chart (8 metrics)
        │
        ├── Improvements Section
        │   └── Improvement Cards (sorted by priority)
        │       ├── High Priority (red)
        │       ├── Medium Priority (yellow)
        │       └── Low Priority (blue)
        │
        └── Strengths Section
            └── Strength Cards (grid)
```

## Data Flow

```
┌─────────────────┐
│   User Input    │
│ (title, content)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ArticleForm    │◄─── Props: onAnalyze, isAnalyzing, disabled
│                 │
│ State:          │
│ - title         │
│ - content       │
│ - errors        │
│ - touched       │
└────────┬────────┘
         │
         │ onAnalyze(title, content)
         ▼
┌─────────────────┐
│  Parent (Page)  │
│                 │
│ State:          │
│ - isAnalyzing   │
│ - result        │
└────────┬────────┘
         │
         │ fetch('/api/analyze')
         ▼
┌─────────────────┐
│   API Route     │
│ /api/analyze    │
└────────┬────────┘
         │
         │ AI Analysis
         ▼
┌─────────────────┐
│  AnalysisResult │◄─── Props: result
│                 │
│ Computed:       │
│ - radarData     │
│ - barData       │
│ - pieData       │
└─────────────────┘
```

## State Management

### ArticleForm Component State

```typescript
// Local state (useState)
const [title, setTitle] = useState<string>('');
const [content, setContent] = useState<string>('');
const [errors, setErrors] = useState<ValidationErrors>({});
const [touched, setTouched] = useState<{
  title: boolean;
  content: boolean;
}>({ title: false, content: false });

// Validation functions (useCallback)
const validateTitle = useCallback((value: string) => { ... });
const validateContent = useCallback((value: string) => { ... });

// Event handlers (useCallback)
const handleTitleChange = useCallback(...);
const handleContentChange = useCallback(...);
const handleBlur = useCallback(...);
const handleSubmit = useCallback(...);
```

### AnalysisResult Component State

```typescript
// Props (no internal state needed)
const { result } = props;

// Computed values (useMemo)
const radarData = useMemo(() => { ... }, [result.scores]);
const barData = useMemo(() => { ... }, [radarData]);
const pieData = useMemo(() => { ... }, [result.viralScore]);
const sortedImprovements = useMemo(() => { ... }, [result.improvements]);

// Pure functions
const getRatingConfig = (rating) => { ... };
const getPriorityConfig = (priority) => { ... };
const getScoreColor = (score) => { ... };
```

## Performance Optimization Strategy

### ArticleForm
1. **Memoization**
   - `useCallback` for all event handlers
   - Prevents unnecessary re-renders

2. **Conditional Validation**
   - Only validate after field is touched
   - Reduces computation on every keystroke

3. **Optimized Re-renders**
   - State updates are batched
   - Only affected elements re-render

### AnalysisResult
1. **Data Memoization**
   - `useMemo` for all chart data transformations
   - Heavy computations run only once

2. **Pure Functions**
   - Config getters are pure functions
   - No side effects, easy to optimize

3. **Efficient Rendering**
   - Conditional rendering for optional elements
   - CSS animations use GPU acceleration

## Styling Architecture

### Tailwind CSS Utility Classes

```
Component
├── Layout: flex, grid, space-y, space-x, gap
├── Sizing: w-full, max-w-*, h-*, min-h-*, max-h-*
├── Spacing: p-*, m-*, px-*, py-*
├── Typography: text-*, font-*, leading-*
├── Colors: bg-*, text-*, border-*
├── States: hover:, focus:, active:, disabled:
├── Dark Mode: dark:bg-*, dark:text-*, dark:border-*
├── Responsive: sm:, md:, lg:, xl:, 2xl:
└── Animations: transition-*, duration-*, animate-*
```

### Custom CSS

```css
/* Keyframe animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}
```

## Accessibility Features

### ARIA Attributes Used

```typescript
// ArticleForm
aria-invalid="true|false"       // Input validation state
aria-describedby="id"            // Link to error/hint messages
aria-live="polite"               // Dynamic content updates
aria-label="text"                // Screen reader labels
aria-busy="true|false"           // Loading state
role="alert"                     // Error messages

// AnalysisResult
aria-hidden="true"               // Decorative icons
role="status"                    // Status updates
```

### Semantic HTML

```html
<!-- ArticleForm -->
<form>
  <label for="input-id">...</label>
  <input id="input-id" aria-describedby="hint-id">
  <p id="hint-id">...</p>
  <p role="alert">...</p>
</form>

<!-- AnalysisResult -->
<section>
  <h2>...</h2>
  <ul>
    <li>...</li>
  </ul>
</section>
```

## Error Handling

### ArticleForm

```typescript
// Validation errors
interface ValidationErrors {
  title?: string;
  content?: string;
}

// Display strategy
- Show errors only after field is touched
- Real-time validation for immediate feedback
- Clear, actionable error messages
- Visual indicators (color, icons)
```

### AnalysisResult

```typescript
// Graceful degradation
- Check for data existence before rendering
- Provide fallbacks for missing data
- Handle empty arrays gracefully
- Safe array operations (map, filter)
```

## Testing Strategy

### Unit Tests (Recommended)

```typescript
// ArticleForm
describe('ArticleForm', () => {
  test('validates title length');
  test('validates content length');
  test('shows errors after blur');
  test('disables submit when invalid');
  test('calls onAnalyze with correct data');
  test('shows loading state');
});

// AnalysisResult
describe('AnalysisResult', () => {
  test('renders viral score correctly');
  test('displays correct rating');
  test('generates chart data');
  test('sorts improvements by priority');
  test('renders all strengths');
});
```

### Integration Tests (Recommended)

```typescript
describe('Article Analysis Flow', () => {
  test('full analysis workflow');
  test('error handling');
  test('loading states');
  test('result display');
});
```

### E2E Tests (Recommended)

```typescript
describe('User Journey', () => {
  test('user can analyze article');
  test('validation prevents invalid submission');
  test('results are displayed correctly');
  test('keyboard navigation works');
});
```

## Bundle Size Analysis

```
ArticleForm.tsx:    ~16 KB
AnalysisResult.tsx: ~19 KB
Total:              ~35 KB (uncompressed)

Dependencies:
- lucide-react:     ~2 KB (tree-shaken)
- recharts:         ~50 KB (gzipped)
- react:            ~40 KB (shared)
```

### Optimization Opportunities

1. **Code Splitting**
   ```tsx
   const AnalysisResult = lazy(() => import('@/components/AnalysisResult'));
   ```

2. **Lazy Loading Charts**
   ```tsx
   const RadarChart = lazy(() => import('recharts').then(m => ({ default: m.RadarChart })));
   ```

3. **Tree Shaking**
   - Import only needed icons from lucide-react
   - Use named imports for recharts components

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills Required
- None (uses modern React features)
- Optional: IntersectionObserver for lazy loading

### Progressive Enhancement
- Works without JavaScript (form submission only)
- Enhanced with JavaScript (validation, charts)
- Degrades gracefully on older browsers

## Future Enhancements

### Short Term
1. Add loading skeletons
2. Implement error boundaries
3. Add unit tests
4. Optimize bundle size

### Medium Term
1. Add A/B test comparison
2. Implement history feature
3. Add export functionality
4. Create mobile app version

### Long Term
1. Real-time collaboration
2. AI-powered suggestions as you type
3. Integration with note.com API
4. Advanced analytics dashboard

---

**Last Updated:** 2025-10-24
**Version:** 1.0.0
