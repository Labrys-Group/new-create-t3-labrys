import { describe, expect, it, vi } from "vitest";

import { db } from "@acme/db/client";
import { Post } from "@acme/db/schema";

// Mock database client before any imports that might use it
vi.mock("@acme/db/client", async () => {
  const { createMockDb } = await import("@acme/db/mocks");
  return { db: await createMockDb() };
});

describe("createPost", () => {
  it("Should create a post", async () => {
    const title = "Test";
    const content = "This is a test post";

    await db.insert(Post).values({ title, content });

    const posts = await db.select().from(Post);
    expect(posts).lengthOf(1);

    expect(posts[0]?.title).eq(title);
    expect(posts[0]?.content).eq(content);
  });
});
