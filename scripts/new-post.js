#!/usr/bin/env node
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new -- "My post title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const dir = join("src", "posts");
const file = join(dir, `${slug}.md`);

if (existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const body = `---
title: ${JSON.stringify(title).slice(1, -1)}
date: ${today}
---

Write your post here.
`;

writeFileSync(file, body);
console.log(`Created ${file}`);
console.log("Edit it, then: git add . && git commit && git push");
