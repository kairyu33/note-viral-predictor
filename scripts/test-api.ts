/**
 * API Test Script for Note Viral Predictor
 *
 * @description Tests the /api/analyze endpoint with sample data
 *
 * Usage:
 *   npm run dev (in another terminal)
 *   npx tsx scripts/test-api.ts
 */

interface TestCase {
  name: string;
  title: string;
  content: string;
  expectedRating?: 'low' | 'medium' | 'high' | 'viral';
}

const testCases: TestCase[] = [
  {
    name: 'High Quality Article',
    title: '3ヶ月で月収30万円を達成した副業の始め方【完全ガイド】',
    content: `
副業を始めて3ヶ月で月収30万円を達成しました。この記事では、私が実践した具体的な方法をすべて公開します。

## なぜ副業を始めたのか

会社員として働いていましたが、将来への不安から副業を決意。最初は何から始めればいいか分かりませんでした。

## 実践した3つのステップ

### 1. スキルの棚卸し
自分の強みを分析し、市場価値のあるスキルを見つけました。

### 2. プラットフォームの選定
クラウドソーシングサイトに登録し、案件を獲得。

### 3. 継続的な改善
フィードバックを元に、サービス品質を向上させました。

## 結果

月収30万円を達成し、会社に依存しない収入源を確立できました。
    `.trim(),
    expectedRating: 'high',
  },
  {
    name: 'Low Quality Article',
    title: '日記',
    content: '今日はいい天気でした。散歩に行きました。楽しかったです。',
    expectedRating: 'low',
  },
  {
    name: 'Medium Quality Article',
    title: 'プログラミング学習のコツ',
    content: `
プログラミングを学習する際のポイントをまとめました。

基礎を大切にすることが重要です。最初は難しく感じるかもしれませんが、諦めずに続けることで必ず成長できます。

また、実際にコードを書いて動かしてみることも大切です。理論だけでなく実践も重要です。

最後に、コミュニティに参加して他の学習者と交流することもおすすめです。
    `.trim(),
    expectedRating: 'medium',
  },
];

/**
 * Runs a single test case
 */
async function runTest(testCase: TestCase, apiUrl: string): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${testCase.name}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Title: ${testCase.title}`);
  console.log(`Content length: ${testCase.content.length} characters`);

  try {
    const startTime = Date.now();

    const response = await fetch(`${apiUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: testCase.title,
        content: testCase.content,
      }),
    });

    const elapsed = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ FAILED (${response.status})`);
      console.error('Error:', errorData);
      return;
    }

    const result = await response.json();

    console.log('\n✅ SUCCESS');
    console.log(`Response time: ${elapsed}ms`);
    console.log('\nResults:');
    console.log(`  Viral Score: ${result.viralScore}/100`);
    console.log(`  Rating: ${result.rating.toUpperCase()}`);
    console.log(`  Estimated Views: ${result.estimatedViews.min.toLocaleString()} - ${result.estimatedViews.max.toLocaleString()}`);

    console.log('\nDetailed Scores:');
    Object.entries(result.scores).forEach(([key, value]) => {
      const bar = '█'.repeat(Math.floor((value as number) / 5));
      console.log(`  ${key.padEnd(20)}: ${value}/100 ${bar}`);
    });

    console.log('\nTop Strengths:');
    result.strengths.slice(0, 3).forEach((strength: string, idx: number) => {
      console.log(`  ${idx + 1}. ${strength}`);
    });

    console.log('\nTop Improvements:');
    result.improvements
      .filter((imp: any) => imp.priority === 'high')
      .slice(0, 2)
      .forEach((improvement: any, idx: number) => {
        console.log(`  ${idx + 1}. [${improvement.priority.toUpperCase()}] ${improvement.category}`);
        console.log(`     ${improvement.suggestion}`);
      });

    if (testCase.expectedRating && result.rating !== testCase.expectedRating) {
      console.log(`\n⚠️  Warning: Expected rating "${testCase.expectedRating}" but got "${result.rating}"`);
    }

  } catch (error) {
    console.error('❌ ERROR:', error instanceof Error ? error.message : error);
  }
}

/**
 * Main test runner
 */
async function main() {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';

  console.log('Note Viral Predictor API Test Suite');
  console.log(`API URL: ${apiUrl}`);
  console.log(`Time: ${new Date().toISOString()}`);

  // Health check
  console.log('\n' + '='.repeat(60));
  console.log('HEALTH CHECK');
  console.log('='.repeat(60));

  try {
    const healthResponse = await fetch(`${apiUrl}/api/analyze`);
    const healthData = await healthResponse.json();

    console.log('✅ API is reachable');
    console.log('Status:', healthData.status);
    console.log('Version:', healthData.version);
    console.log('OpenAI Configured:', healthData.openaiConfigured);

    if (!healthData.openaiConfigured) {
      console.error('\n❌ CRITICAL: OpenAI API key is not configured!');
      console.error('Please set OPENAI_API_KEY in .env.local');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to connect to API');
    console.error('Make sure the development server is running: npm run dev');
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Run test cases
  for (const testCase of testCases) {
    await runTest(testCase, apiUrl);
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('ALL TESTS COMPLETED');
  console.log('='.repeat(60));
}

// Run tests
main().catch(console.error);
