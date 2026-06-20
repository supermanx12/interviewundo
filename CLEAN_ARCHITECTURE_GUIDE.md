# Clean Architecture Guide & Code Examples

This guide provides a detailed explanation of the **Clean Architecture** patterns (also known as Hexagonal Architecture or Ports & Adapters) used in this project, explaining how each layer functions and interacts. It concludes with a complete, concrete code example of adding a new feature.

---

## 1. What is Clean Architecture?

Clean Architecture organizes software so that the **business logic** (what the system does) is completely separated from **delivery mechanisms** (how it does it, e.g., web frameworks, databases, caches, queues).

The codebase is structured into four main conceptual layers:

```text
       ┌─────────────────────────────────────────────────────────────┐
       │                    PRESENTATION LAYER                        │
       │          (Express Routes, Controllers, Middleware)          │
       │   Depends on ↓                                              │
       ├─────────────────────────────────────────────────────────────┤
       │                    APPLICATION LAYER                         │
       │             (Use Cases, DTOs, Orchestration)                │
       │   Depends on ↓                                              │
       ├─────────────────────────────────────────────────────────────┤
       │                      DOMAIN LAYER                           │
       │     (Entities, Value Objects, Ports/Interfaces, Errors)     │
       │   Depends on → NOTHING (Pure Business Logic)                │
       ├─────────────────────────────────────────────────────────────┤
       │                   INFRASTRUCTURE LAYER                      │
       │      (Prisma Repos, Redis, JWT, BullMQ, Socket.io)          │
       │   Implements Domain Ports                                   │
       └─────────────────────────────────────────────────────────────┘
```

### The Dependency Rule
Dependencies must **only point inward**. 
* Outward layers (Presentation, Infrastructure) can depend on inward layers (Application, Domain).
* Inward layers (Domain, Application) must **never** know about outward layers. For example, a file inside `domain/` or `application/` should never import anything from `@prisma/client`, `express`, `bullmq`, `redis`, or `jose/jwt`.

---

## 2. Deep Dive: Layer-by-Layer Breakdown

### A. The Domain Layer (`domain/`)
This is the heart of the application. It contains the essential business rules, domain schemas, validation logic, custom errors, and contracts (interfaces). It is pure TypeScript and has no dependencies on external frameworks or databases.

*   **Entities:** Objects that represent business items with unique identities and state (e.g., `User`, `Problem`, `Submission`).
*   **Value Objects:** Immutable wrappers representing concepts with specific validations (e.g., `Email`, `Password`).
*   **Errors:** Specialized exception types representing business logic failures (e.g., `ConflictError`, `NotFoundError`, `UnauthorizedError`).
*   **Ports (Interfaces):** TypeScript interfaces defining interactions with external systems (e.g., [IUserRepository](file:///D:/interview-prep-platform/apps/backend-api/src/domain/ports/repositories/IUserRepository.ts)).
    *   *Why Ports?* By defining `IUserRepository` inside the domain layer, the domain declares what database access it *requires*. The actual implementation is postponed to the infrastructure layer.

### B. The Application Layer (`application/`)
This layer coordinates the application's flows. It contains **Use Cases**, which orchestrate the domain objects, ports, and services to achieve a specific action.

*   **Use Cases:** Implement the generic [IUseCase](file:///D:/interview-prep-platform/apps/backend-api/src/application/interfaces/IUseCase.ts) interface. Each use case represents a single, focused business command or query (e.g., `RegisterUser`, `SubmitCode`).
*   **Data Transfer Objects (DTOs):** Define input and output contracts for the use cases, ensuring clean boundaries.
*   *Key Constraint:* Use cases must only access repositories and services via their abstract interfaces (ports). They never directly query databases.

### C. The Infrastructure Layer (`infrastructure/`)
This layer handles the concrete technical implementation details. It adapts external frameworks, databases, and services to fit the domain contracts.

*   **Adapters:** Concrete classes that implement domain ports. For example, [PrismaUserRepository](file:///D:/interview-prep-platform/apps/backend-api/src/infrastructure/database/repositories/PrismaUserRepository.ts) adapts Prisma queries to satisfy `IUserRepository`.
*   **External Integrations:** Database setups, token signers, Redis client initialization, code execution judges, etc.

### D. The Presentation Layer (`presentation/`)
This layer is the entry point for the user or client. It deals with HTTP requests, routing, sockets, and formatting.

*   **Routers:** Handle HTTP routing (e.g., Express paths).
*   **Controllers:** Parse incoming requests, trigger the relevant use case, and format the output into JSON responses.
*   **Middleware:** Parse parameters, validate requests using schemas (like Zod), check authentication tokens, and convert domain errors to HTTP statuses.

---

## 3. Dependency Injection (Wiring It All Together)
Because the layers only depend on interfaces, we need a mechanism to instantiate classes and inject their concrete implementations at runtime.

This is done in the dependency container file: [container/index.ts](file:///D:/interview-prep-platform/apps/backend-api/src/container/index.ts).

1.  **Instantiate Adapters:** Create instances of repositories and services (e.g., `const userRepository = new PrismaUserRepository()`).
2.  **Instantiate Use Cases:** Pass these repository and service instances into the constructor of the use cases (e.g., `const registerUser = new RegisterUser(userRepository, passwordService)`).
3.  **Instantiate Controllers:** Inject the use cases into the controllers.
4.  **Export Container:** Export the instantiated components as a single container to be consumed by the routes.

---

## 4. Concrete Example: Implementing a "Get Problem By ID" Feature

Here is a step-by-step example showing how to add a feature to retrieve a coding problem by its ID using Clean Architecture.

### Step 1: Add or Update the Port (Domain Layer)
In `apps/backend-api/src/domain/ports/repositories/IProblemRepository.ts`, declare the query method signature:

```typescript
// apps/backend-api/src/domain/ports/repositories/IProblemRepository.ts
import type { Problem } from '@interviewprep/shared-types';

export interface IProblemRepository {
  // Existing methods...
  
  findById(id: string): Promise<Problem | null>;
}
```

### Step 2: Implement the Use Case (Application Layer)
Create the use case, utilizing `IUseCase`, injecting the repository via the constructor, and throwing a domain error if the problem is not found.

```typescript
// apps/backend-api/src/application/use-cases/problem/GetProblemById.ts
import type { IUseCase } from '../../interfaces/IUseCase';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { Problem } from '@interviewprep/shared-types';
import { NotFoundError } from '../../../domain/errors';

export interface GetProblemByIdInput {
  id: string;
}

export class GetProblemById implements IUseCase<GetProblemByIdInput, Problem> {
  constructor(private readonly problemRepository: IProblemRepository) {}

  async execute(input: GetProblemByIdInput): Promise<Problem> {
    const problem = await this.problemRepository.findById(input.id);
    if (!problem) {
      throw new NotFoundError(`Problem with ID ${input.id} was not found`);
    }
    return problem;
  }
}
```

### Step 3: Implement the Database Repository (Infrastructure Layer)
Implement the new method inside the concrete repository implementing `IProblemRepository` using the Prisma client.

```typescript
// apps/backend-api/src/infrastructure/database/repositories/PrismaProblemRepository.ts
import { prisma } from '../../../config/database';
import type { IProblemRepository } from '../../../domain/ports/repositories/IProblemRepository';
import type { Problem } from '@interviewprep/shared-types';

export class PrismaProblemRepository implements IProblemRepository {
  // Existing methods...

  async findById(id: string): Promise<Problem | null> {
    const prismaProblem = await prisma.problem.findUnique({
      where: { id },
      include: { testCases: true } // Assuming we want to fetch related test cases
    });

    if (!prismaProblem) return null;

    // Map Prisma schema to shared Domain Types
    return {
      id: prismaProblem.id,
      title: prismaProblem.title,
      slug: prismaProblem.slug,
      description: prismaProblem.description,
      difficulty: prismaProblem.difficulty as any,
      createdAt: prismaProblem.createdAt,
      updatedAt: prismaProblem.updatedAt,
    };
  }
}
```

### Step 4: Wire Everything Up (Container)
Add the use case instantiation and inject the concrete repository inside [container/index.ts](file:///D:/interview-prep-platform/apps/backend-api/src/container/index.ts).

```typescript
// apps/backend-api/src/container/index.ts

// 1. Import the Use Case
import { GetProblemById } from '../application/use-cases/problem/GetProblemById';

// 2. Instantiate Use Case
const getProblemById = new GetProblemById(problemRepository);

// 3. Inject it into the Controller
const problemController = new ProblemController(getProblems, getProblemById);

// 4. Export it in the container
export const container = {
  // ...
  useCases: {
    registerUser,
    loginUser,
    getProblems,
    getProblemById, // Added here
  },
  controllers: {
    authController,
    problemController, // Added here
  }
};
```

### Step 5: Expose via Controller and Routes (Presentation Layer)
Implement the controller method to parse requests, invoke the use case, and handle the response.

```typescript
// apps/backend-api/src/presentation/controllers/ProblemController.ts
import type { Request, Response, NextFunction } from 'express';
import type { GetProblemById } from '../../application/use-cases/problem/GetProblemById';

export class ProblemController {
  constructor(
    private readonly getProblems: any,
    private readonly getProblemById: GetProblemById
  ) {}

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const problem = await this.getProblemById.execute({ id });
      
      res.status(200).json({
        success: true,
        data: problem
      });
    } catch (error) {
      next(error); // Express global errorHandler middleware handles mapping DomainErrors to HTTP status codes
    }
  }
}
```

Finally, mount the controller method to the Express router:

```typescript
// apps/backend-api/src/presentation/routes/problem.routes.ts
import { Router } from 'express';
import { container } from '../../container';

const router = Router();
const { problemController } = container.controllers;

router.get('/:id', (req, res, next) => problemController.getById(req, res, next));

export default router;
```
