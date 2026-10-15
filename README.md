# Security+ Study Lab

Static Security+ SY0-701 study website, prepared for GitHub Pages.

## Publish

In repository Settings → Pages, choose **Deploy from a branch**, **main**, **/(root)** and save.

The site works at a repository URL such as `https://USERNAME.github.io/security-plus-study-lab/`.

## Features

- Study path, defensive labs and reference guide
- 38 Professor Messer companion lessons
- 329 practice items and 90-minute exam simulation
- Seven cumulative checkpoints with a separate 140-question bank

Notes, quiz attempts and study progress are saved locally. The optional account system syncs all four study stores through Supabase with Google sign-in. Browser storage from another domain is not transferred automatically; export/import a progress backup to move it.

## Account sync

Account sync is prepared but **not activated** until `sync-config.js` contains an actual project URL and public publishable key, the migration is applied, and Google OAuth is configured. With empty configuration the site remains fully usable locally, including JSON progress export/import.

See [account setup](supabase/SETUP.md) for activation and verification. Never put a database password, service-role key, Supabase management token, or Google client secret in this public repository.

The browser caches a separate workspace per account and keeps the original guest keys. Importing guest progress is explicit. Sync uses a baseline and optimistic server revision, merges disjoint changes, and requires a choice when both devices edit the same note or attempt. Practice/exam/checkpoint attempts are atomic so a retry cannot be spliced into an older attempt. Local recovery copies are retained when importing or resolving conflicts. Authentication tokens are excluded from backups.

The Supabase JavaScript SDK is vendored at version 2.118.0, with its MIT license in `vendor/`, so sign-in does not depend on a third-party script CDN at runtime.

## Verify

```sh
node tests/messer.cjs
node tests/quizzes.cjs
node tests/messer-checkpoints.cjs
node tests/sync.cjs
```

Sync tests use a fake server to exercise two devices, offline retries, concurrent writes and account scoping. These do not replace live OAuth and database row-level-security checks after backend activation.

Independent original practice material; not official CompTIA or Professor Messer exam questions.
