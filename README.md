# Blog

Write Markdown in Obsidian (or any editor). Push. Live on [spencerhlee.com](https://spencerhlee.com).

## New post

In Obsidian, create a note under `src/posts/` — or:

```bash
npm run new -- "My post title"
```

Then publish:

```bash
git add .
git commit -m "Add my post"
git push
```

## Folders

Create a folder inside `src/posts/` (in Obsidian or in the file browser). Notes in that folder show up as a subdirectory on the site — same directory-listing look.

Example: `src/posts/notes/my-setup.md` → `/notes/my-setup.html`

## Obsidian

It’s fine to open `src/posts` as a vault. Obsidian’s `.obsidian`, trash, and plugin folders are ignored — they won’t be published.

## Preview locally

```bash
npm install
npm start
```
