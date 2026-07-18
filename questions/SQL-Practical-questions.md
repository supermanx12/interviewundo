# SQL Practical Questions

This document lists the 20 new SQL query questions added to the platform, including their descriptions, difficulty levels, solution queries, and schemas.

---

## 1. American Cities High Population (Easy)

**Description**: Write a query to select all columns for all American cities in the `city` table with a population larger than 100,000. The country code for America is 'USA'.
**Table Schema (city)**:

- `id` (INTEGER, Primary Key)
- `name` (TEXT)
- `country_code` (TEXT)
- `population` (INTEGER)

**Solution**:

```sql
SELECT * FROM city WHERE country_code = 'USA' AND population > 100000;
```

---

## 2. American City Names (Easy)

**Description**: Write a query to select the `name` field for all American cities in the `city` table with a population larger than 120,000. The country code for America is 'USA'.
**Table Schema (city)**:

- `id` (INTEGER, Primary Key)
- `name` (TEXT)
- `country_code` (TEXT)
- `population` (INTEGER)

**Solution**:

```sql
SELECT name FROM city WHERE country_code = 'USA' AND population > 120000;
```

---

## 3. Select City By ID (Easy)

**Description**: Write a query to select all columns for a city with the ID `1661` in the `city` table.
**Table Schema (city)**:

- `id` (INTEGER, Primary Key)
- `name` (TEXT)
- `country_code` (TEXT)
- `population` (INTEGER)

**Solution**:

```sql
SELECT * FROM city WHERE id = 1661;
```

---

## 4. Japanese Cities Attributes (Easy)

**Description**: Write a query to select all attributes (columns) of every Japanese city in the `city` table. The country code for Japan is 'JPN'.
**Table Schema (city)**:

- `id` (INTEGER, Primary Key)
- `name` (TEXT)
- `country_code` (TEXT)
- `population` (INTEGER)

**Solution**:

```sql
SELECT * FROM city WHERE country_code = 'JPN';
```

---

## 5. Japanese City Names (Easy)

**Description**: Write a query to select the `name` of all Japanese cities in the `city` table. The country code for Japan is 'JPN'.
**Table Schema (city)**:

- `id` (INTEGER, Primary Key)
- `name` (TEXT)
- `country_code` (TEXT)
- `population` (INTEGER)

**Solution**:

```sql
SELECT name FROM city WHERE country_code = 'JPN';
```

---

## 6. Station City and State (Easy)

**Description**: Write a query to select a list of `city` and `state` from the `station` table.
**Table Schema (station)**:

- `id` (INTEGER, Primary Key)
- `city` (TEXT)
- `state` (TEXT)
- `lat_n` (REAL)
- `long_w` (REAL)

**Solution**:

```sql
SELECT city, state FROM station;
```

---

## 7. Station Even IDs (Easy)

**Description**: Write a query to select a list of unique `city` names from the `station` table that have an even `id` number.
**Table Schema (station)**:

- `id` (INTEGER, Primary Key)
- `city` (TEXT)
- `state` (TEXT)
- `lat_n` (REAL)
- `long_w` (REAL)

**Solution**:

```sql
SELECT DISTINCT city FROM station WHERE id % 2 = 0;
```

---

## 8. Station City Count Difference (Easy)

**Description**: Write a query to find the difference between the total number of city entries in the `station` table and the number of distinct city entries in the table.
**Table Schema (station)**:

- `id` (INTEGER, Primary Key)
- `city` (TEXT)
- `state` (TEXT)
- `lat_n` (REAL)
- `long_w` (REAL)

**Solution**:

```sql
SELECT COUNT(city) - COUNT(DISTINCT city) AS difference FROM station;
```

---

## 9. Shortest and Longest City Name (Medium)

**Description**: Write a query to find the two cities in the `station` table with the shortest and longest `city` names, along with their respective lengths (i.e. number of characters in the name). If there is more than one smallest or largest city, choose the one that comes first alphabetically.
**Table Schema (station)**:

- `id` (INTEGER, Primary Key)
- `city` (TEXT)
- `state` (TEXT)
- `lat_n` (REAL)
- `long_w` (REAL)

**Solution**:

```sql
SELECT city, LENGTH(city) AS len FROM station ORDER BY LENGTH(city) ASC, city ASC LIMIT 1;
SELECT city, LENGTH(city) AS len FROM station ORDER BY LENGTH(city) DESC, city ASC LIMIT 1;
```

---

## 10. Employee Salaries Query (Easy)

**Description**: Write a query to select the `name` of all employees in the `employee` table who have a salary strictly greater than 2000 per month and have been employed for less than 10 months. Sort the results by `employee_id` in ascending order.
**Table Schema (employee)**:

- `employee_id` (INTEGER, Primary Key)
- `name` (TEXT)
- `months` (INTEGER)
- `salary` (INTEGER)

**Solution**:

```sql
SELECT name FROM employee WHERE salary > 2000 AND months < 10 ORDER BY employee_id ASC;
```

---

## 11. Higher Than 75 Marks (Easy)

**Description**: Write a query to select the `name` of all students in the `students` table who scored strictly higher than 75 marks. Sort the output by the last three characters of each name. If two or more students have names ending in the same last three characters, sort them by `id` ascending.
**Table Schema (students)**:

- `id` (INTEGER, Primary Key)
- `name` (TEXT)
- `marks` (INTEGER)

**Solution**:

```sql
SELECT name FROM students WHERE marks > 75 ORDER BY SUBSTR(name, -3), id ASC;
```

---

## 12. Rank Scores (Medium)

**Description**: Write a query to rank the scores in the `scores` table. The ranking should be calculated under the following rules:

1. Scores should be ranked from highest to lowest.
2. If there is a tie between two scores, both should have the same ranking.
3. After a tie, the next ranking number should be the next consecutive integer value (i.e., no holes/gaps in ranking).
   Return the result table with columns `score` and `rank` (aliased as `rank`). Sort the output by `score` in descending order.

**Table Schema (scores)**:

- `id` (INTEGER, Primary Key)
- `score` (REAL)

**Solution**:

```sql
SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS rank FROM scores;
```

---

## 13. Combine Two Tables (Easy)

**Description**: Write a query to report the `first_name`, `last_name`, `city`, and `state` for each person in the `person` table. If the address of a person's `person_id` is not present in the `address` table, report null for the city and state.
**Table Schema (person)**:

- `person_id` (INTEGER, Primary Key)
- `first_name` (TEXT)
- `last_name` (TEXT)

**Table Schema (address)**:

- `address_id` (INTEGER, Primary Key)
- `person_id` (INTEGER)
- `city` (TEXT)
- `state` (TEXT)

**Solution**:

```sql
SELECT p.first_name, p.last_name, a.city, a.state FROM person p LEFT JOIN address a ON p.person_id = a.person_id;
```

---

## 14. Employees Earning More Than Managers (Easy)

**Description**: Write a query to find the employees who earn strictly more than their managers. Return the result table with the column `employee` representing the employee's name.
**Table Schema (employee)**:

- `id` (INTEGER, Primary Key)
- `name` (TEXT)
- `salary` (INTEGER)
- `manager_id` (INTEGER)

**Solution**:

```sql
SELECT e.name AS employee FROM employee e JOIN employee m ON e.manager_id = m.id WHERE e.salary > m.salary;
```

---

## 15. Duplicate Emails (Easy)

**Description**: Write a query to report all the duplicate emails in the `person` table. Return the result table with the column `email` representing the duplicate email.
**Table Schema (person)**:

- `id` (INTEGER, Primary Key)
- `email` (TEXT)

**Solution**:

```sql
SELECT email FROM person GROUP BY email HAVING COUNT(email) > 1;
```

---

## 16. Second Highest Salary (Medium)

**Description**: Write a query to find the second highest salary from the `employee` table. If there is no second highest salary, return null. Return the result with the column name `second_highest_salary`.
**Table Schema (employee)**:

- `id` (INTEGER, Primary Key)
- `salary` (INTEGER)

**Solution**:

```sql
SELECT (SELECT DISTINCT salary FROM employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest_salary;
```

---

## 17. Find Customer Referee (Easy)

**Description**: Write a query to report the names of the customers in the `customer` table who are not referred by the customer with `id = 2`.
**Table Schema (customer)**:

- `id` (INTEGER, Primary Key)
- `name` (TEXT)
- `referee_id` (INTEGER)

**Solution**:

```sql
SELECT name FROM customer WHERE referee_id != 2 OR referee_id IS NULL;
```

---

## 18. Big Countries (Easy)

**Description**: A country is big if:

- It has an area of at least 3,000,000 km², or
- It has a population of at least 25,000,000.
  Write a query to report the name, population, and area of the big countries in the `world` table. Sort the results alphabetically by `name`.

**Table Schema (world)**:

- `name` (TEXT, Primary Key)
- `continent` (TEXT)
- `area` (INTEGER)
- `population` (INTEGER)
- `gdp` (REAL)

**Solution**:

```sql
SELECT name, population, area FROM world WHERE area >= 3000000 OR population >= 25000000 ORDER BY name ASC;
```

---

## 19. Classes More Than 5 Students (Easy)

**Description**: Write a query to report all the classes in the `courses` table that have at least 5 students. Return the result table with the column `class` representing the class name.
**Table Schema (courses)**:

- `student` (TEXT)
- `class` (TEXT)

**Solution**:

```sql
SELECT class FROM courses GROUP BY class HAVING COUNT(DISTINCT student) >= 5;
```

---

## 20. Tree Node Type (Medium)

**Description**: Each node in a binary tree can be one of three types:

- **Leaf**: if the node is a child node and has no children.
- **Root**: if the node is the root of the tree and has no parent.
- **Inner**: if the node has both a parent and a child.
  Write a query to find the type of each node in the `tree` table. Return the result table ordered by `id` in ascending order.

**Table Schema (tree)**:

- `id` (INTEGER, Primary Key)
- `p_id` (INTEGER)

**Solution**:

```sql
SELECT id,
       CASE
         WHEN p_id IS NULL THEN 'Root'
         WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'Inner'
         ELSE 'Leaf'
       END AS type
FROM tree
ORDER BY id ASC;
```
