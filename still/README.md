# Still — Focus Studio

A personal sound player for studying and working. Buildless HTML, CSS and JavaScript, with no dependencies or API keys.

- Study, Deep Work, and Reading starting mixes.
- Procedural stereo ambient chords and sparse notes, with smooth variation changes.
- Synthesized brown noise, pink noise, and a rain-like texture.
- Adjustable amplitude modulation: 0–50% depth, 8/12/16/20 Hz rate.
- Local audio-file playback through the same music/pulse mixer, with looping.
- Pause/resume and 25/50/90-minute or unlimited sessions. Session end fades audio out.
- Settings and a bounded completed-session log in browser local storage.

Audio starts after a user gesture. Keep the page open while listening; mobile operating systems may suspend browser audio when locked. Imported files stay in memory on the device and must be chosen again after a reload. Settings and history do not sync between browsers.

This is an original experimental focus sound tool. It does not use Brain.fm assets or reproduce its proprietary system or established effects. The pulse rate describes amplitude modulation, not the audio's pitch. No particular pulse setting is claimed to improve cognition.

Serve this folder with a static web server. Run `node tests/timer.cjs` from this folder for timer boundary checks. No build step is required.

## GitHub Pages

Live player: https://mossethan.github.io/security-plus-study-lab/still/

Canonical source: `Mossethan/security-plus-study-lab`, branch `main`, folder `still/`. Future changes should be committed here. The site is served by the existing GitHub Pages deployment from the repository root; updates to `main` redeploy it automatically.

The player has no ChatGPT sign-in dependency. It is a public static page. Personal audio stays on the device, and browser settings/history remain local. Settings from the previous ChatGPT-hosted origin do not transfer automatically.
