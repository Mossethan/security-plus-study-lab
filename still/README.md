# Still — Focus Studio

A personal sound player for studying and working. Buildless HTML, CSS and JavaScript, with no dependencies or API keys.

- Study, Deep Work, and Reading starting mixes.
- Procedural stereo ambient chords and sparse notes, with smooth variation changes.
- Synthesized brown noise, pink noise, and a rain-like texture.
- Adjustable amplitude modulation: 0–50% depth, 8/12/16/20 Hz rate.
- Local audio-file playback through the same music/pulse mixer, with looping.
- Switch between a single focus session (audio stops at the end) and repeating Pomodoro cycles: 25/5, 50/10, and 90/15 minutes, plus unlimited sessions. Audio fades out for breaks and resumes for focus.
- Sticky timer controls with pause/resume, reset, skip break, and round count. Wall-clock timing catches up after background throttling.
- Timer mode, settings, and a bounded completed-focus-round log in browser local storage.

Audio starts after a user gesture. Keep the page open while listening; mobile operating systems may suspend browser audio when locked. Imported files stay in memory on the device and must be chosen again after a reload. Settings and history do not sync between browsers.

This is an original experimental focus sound tool. It does not use Brain.fm assets or reproduce its proprietary system or established effects. The pulse rate describes amplitude modulation, not the audio's pitch. No particular pulse setting is claimed to improve cognition.

Serve this folder with a static web server. Run `node tests/timer.cjs` from this folder for timer boundary checks. No build step is required.

## GitHub Pages

Live player: https://mossethan.github.io/security-plus-study-lab/still/

Canonical source: `Mossethan/security-plus-study-lab`, branch `main`, folder `still/`. Future changes should be committed here. The site is served by the existing GitHub Pages deployment from the repository root; updates to `main` redeploy it automatically.

The player has no ChatGPT sign-in dependency. It is a public static page. Personal audio stays on the device, and browser settings/history remain local. Settings from the previous ChatGPT-hosted origin do not transfer automatically.


## Local MP3 library

Choose folder reads MP3 files (including subfolders) locally and skips byte-for-byte duplicates using SHA-256 hashes. There is no audio upload. Folder selections are not retained across reloads; select the folder again. The _Still_Duplicates quarantine folder is ignored.

Use the player controls for previous/next track, play/pause, seeking, and automatic track advancement. View tracks opens the playlist and optional shuffle. The playlist repeats at the end. Both timer modes continue to work: Pomodoro breaks pause audio, and single sessions stop it. The small + button accepts one audio file with repeat-one playback, or multiple MP3s as a library.

View tracks also exposes the duplicate CSV report and a Windows cleanup download. The utility in tools/MP3-Cleanup quarantines exact duplicates with a restorable manifest; it never permanently deletes or overwrites files. Its launcher uses Windows PowerShell; native Windows execution has not been verified in this Linux environment.

Run node tests/library.cjs, node tests/audio-files.cjs, and node tests/timer.cjs from this folder.
