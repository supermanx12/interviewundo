import { prisma } from '../../../config/database';

interface TestCaseSeed {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
}

interface ProblemSeed {
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: 'SQL';
  tags: string[];
  starterCode: string;
  solutionCode: string;
  order: number;
  isPublished: boolean;
  testCases: TestCaseSeed[];
}

const sqlProblems: ProblemSeed[] = [
  {
    title: 'Filter Engineering Employees',
    slug: 'filter-engineering-employees',
    description: `We have a table \`employees\` with columns \`id\`, \`name\`, \`department\`, and \`salary\`.
      
Write a query to select the \`name\` and \`salary\` of all employees in the 'Engineering' department, sorted by \`salary\` in descending order.

### Example:
**Input:**
\`employees\` table:
| id | name    | department  | salary |
|----|---------|-------------|--------|
| 1  | Alice   | Engineering | 90000  |
| 2  | Bob     | Sales       | 60000  |
| 3  | Charlie | Engineering | 95000  |

**Output:**
| name    | salary |
|---------|--------|
| Charlie | 95000  |
| Alice   | 90000  |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT name, salary FROM employees WHERE department = 'Engineering' ORDER BY salary DESC;`,
    tags: ['sql', 'basic'],
    isPublished: true,
    order: 801,
    testCases: [
      {
        input:
          "\"CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER); INSERT INTO employees VALUES (1, \\'Alice\\', \\'Engineering\\', 90000); INSERT INTO employees VALUES (2, \\'Bob\\', \\'Sales\\', 60000); INSERT INTO employees VALUES (3, \\'Charlie\\', \\'Engineering\\', 95000);\"",
        expectedOutput: '[{"name":"Charlie","salary":95000},{"name":"Alice","salary":90000}]',
        isHidden: false,
        order: 1,
      },
      {
        input:
          "\"CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER); INSERT INTO employees VALUES (1, \\'Eve\\', \\'Engineering\\', 80000); INSERT INTO employees VALUES (2, \\'Dave\\', \\'Marketing\\', 70000);\"",
        expectedOutput: '[{"name":"Eve","salary":80000}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'User Total Order Amount',
    slug: 'user-total-order-amount',
    description: `We have two tables: \`users\` (with \`id\`, \`name\`) and \`orders\` (with \`id\`, \`user_id\`, \`amount\`).
      
Write a query to find the \`name\` of each user and the total sum of their order amounts as \`total_amount\`.
Only include users who have made at least one order.
Sort the results by \`total_amount\` in descending order.

### Example:
**Input:**
\`users\` table:
| id | name  |
|----|-------|
| 1  | Alice |
| 2  | Bob   |

\`orders\` table:
| id  | user_id | amount |
|-----|---------|--------|
| 101 | 1       | 250    |
| 102 | 2       | 100    |
| 103 | 1       | 150    |

**Output:**
| name  | total_amount |
|-------|--------------|
| Alice | 400          |
| Bob   | 100          |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT u.name, SUM(o.amount) AS total_amount FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.name ORDER BY total_amount DESC;`,
    tags: ['sql', 'join'],
    isPublished: true,
    order: 802,
    testCases: [
      {
        input:
          "\"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER); INSERT INTO users VALUES (1, \\'Alice\\'); INSERT INTO users VALUES (2, \\'Bob\\'); INSERT INTO orders VALUES (101, 1, 250); INSERT INTO orders VALUES (102, 2, 100); INSERT INTO orders VALUES (103, 1, 150);\"",
        expectedOutput: '[{"name":"Alice","total_amount":400},{"name":"Bob","total_amount":100}]',
        isHidden: false,
        order: 1,
      },
      {
        input:
          '"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER); INSERT INTO users VALUES (1, \\\'Charlie\\\'); INSERT INTO orders VALUES (104, 3, 300);"',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Users Directory Query',
    slug: 'users-directory-query',
    description: `We have a table \`users\` with columns \`id\`, \`name\`, and \`age\`.
      
Write a query to select all users from the \`users\` table.

### Example:
**Input:**
\`users\` table:
| id | name  | age |
|----|-------|-----|
| 1  | Alice | 25  |

**Output:**
| id | name  | age |
|----|-------|-----|
| 1  | Alice | 25  |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: 'SELECT * FROM users;',
    tags: ['sql', 'basic'],
    isPublished: true,
    order: 803,
    testCases: [
      {
        input:
          '"CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), age INTEGER); INSERT INTO users (name, age) VALUES (\\\'Alice\\\', 25);"',
        expectedOutput: '[{"id":1,"name":"Alice","age":25}]',
        isHidden: false,
        order: 1,
      },
      {
        input:
          "\"CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), age INTEGER); INSERT INTO users (name, age) VALUES (\\'John Doe\\', 30); INSERT INTO users (name, age) VALUES (\\'Jane Doe\\', 22);\"",
        expectedOutput: '[{"id":1,"name":"John Doe","age":30},{"id":2,"name":"Jane Doe","age":22}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting SQL problems seeding...');

  for (const problemData of sqlProblems) {
    console.log(`Processing problem: ${problemData.title} (${problemData.slug})`);

    const existing = await prisma.problem.findUnique({
      where: { slug: problemData.slug },
    });

    if (existing) {
      await prisma.testCase.deleteMany({
        where: { problemId: existing.id },
      });
      console.log(`🧹 Cleared existing test cases for: ${problemData.slug}`);
    }

    const problem = await prisma.problem.upsert({
      where: { slug: problemData.slug },
      update: {
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        category: problemData.category,
        starterCode: problemData.starterCode,
        solutionCode: problemData.solutionCode,
        tags: problemData.tags,
        order: problemData.order,
        isPublished: problemData.isPublished,
      },
      create: {
        title: problemData.title,
        slug: problemData.slug,
        description: problemData.description,
        difficulty: problemData.difficulty,
        category: problemData.category,
        starterCode: problemData.starterCode,
        solutionCode: problemData.solutionCode,
        tags: problemData.tags,
        order: problemData.order,
        isPublished: problemData.isPublished,
      },
    });

    await prisma.testCase.createMany({
      data: problemData.testCases.map((tc) => ({
        problemId: problem.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden,
        order: tc.order,
      })),
    });

    console.log(`✅ Seeded: ${problemData.title}`);
  }

  console.log('🎉 Database seeding complete for SQL problems!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
