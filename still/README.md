# Still — Focus Studio

A personal sound player for studying and working. Buildless HTML, CSS and JavaScript, with no dependencies or API keys.

- Study, Deep Work, and Reading starting mixes.
- Procedural stereo ambient chords and sparse notes, with smooth variation changes.
- Synthesized brown noise, pink noise, and a rain-like texture.
- Adjustable amplitude modulation: 0–50% depth, 8/10/12/16/20/32/40 Hz rate. Alpha/beta labels describe modulation rates; 32/40 Hz gamma options are experimental, and no task-specific cognitive benefit is promised.
- Local audio-file playback through the same music/pulse mixer, with looping.
- Switch between a single focus session (audio stops at the end) and repeating Pomodoro cycles: 25/5, 50/10, and 90/15 minutes, plus unlimited sessions. Audio fades out for breaks and resumes for focus.
- Sticky timer controls with pause/resume, reset, skip break, current round, and completed-cycle count. A Pomodoro cycle is counted only after both focus and its full break finish; skipped breaks do not count. The count covers the current timer run and resets when the timer is reset, the duration or mode changes, or the page reloads. Wall-clock timing catches up after background throttling.
- Timer mode, settings, and a bounded completed-focus-round log in browser local storage.

Pause fades the final combined output after the compressor over 1.5 seconds, including imported tracks, generated music, noise, and reverb. It waits for the audio clock to reach silence before pausing the MP3 and suspending audio; resuming cancels a pending pause and fades back in. Status messages fade in/out and fade between replacements; rapid changes show only the latest queued message. Play/pause controls update immediately and remain clickable throughout the fade. A new play request reverses an unfinished fade from its current level; the latest request wins during rapid toggling. Mixer changes cannot bypass this final fade. Operating-system interruptions can still stop mobile audio immediately. Audio starts after a user gesture. Keep the page open while listening; mobile operating systems may suspend browser audio when locked. With Remember on this device enabled, MP3 libraries reload from a read-only folder link where supported, or from private IndexedDB file copies. No audio is uploaded. Browser permissions, storage quotas, private-mode expiry, or cleared site data can require selecting files again. Remembering files loads the library but never starts playback automatically. Settings and history do not sync between browsers.

This is an original experimental focus sound tool. The pulse rate describes amplitude modulation, not the audio's pitch. No particular pulse setting is claimed to improve cognition.

Serve this folder with a static web server. Run `node tests/timer.cjs` from this folder for timer boundary checks. No build step is required.

## GitHub Pages

Live player: https://mossethan.github.io/security-plus-study-lab/still/

Canonical source: `Mossethan/security-plus-study-lab`, branch `main`, folder `still/`. Future changes should be committed here. The site is served by the existing GitHub Pages deployment from the repository root; updates to `main` redeploy it automatically.

The player has no ChatGPT sign-in dependency. It is a public static page. Personal audio stays on the device, and browser settings/history remain local. Settings from the previous ChatGPT-hosted origin do not transfer automatically.


## Local MP3 library

Choose folder reads MP3 files (including subfolders) locally. It indexes filenames and folder labels without reading or hashing audio contents. There is no audio upload and no duplicate finder in the website. In Browse & filters, enable Remember on this device after choosing the folder/files. Browsers exposing showDirectoryPicker use read-only folder handles stored in IndexedDB; others store the selected MP3 files in private IndexedDB storage. Files and handles remain on the device, never in the public repository. A remembered handle is read only when permission is already granted; otherwise Reconnect folder requests read permission from a user click. Large browser copies may exceed quota, and a failed replacement leaves the previous saved selection unchanged. The UI reports failures instead of claiming persistence succeeded. The _Still_Duplicates quarantine folder from the standalone cleanup tool is ignored.

Browse & filters supports multiple genres and neural-effect levels. Selections within each group match any selected option; the genre group and effect group must both match. All means unrestricted. Apply filters updates playback, preserving the current track and time if it still matches. An empty match pauses the session and does not switch to generative audio. Filter choices persist in this browser.

Supported genres: Acoustic, Atmospheric, Cinematic, Classical, Drone, Electronic, Grooves, Lofi, Piano, and Post rock. The parser recognizes LowNEL, MedNEL/MediumNEL, HighNEL, and explicit effect folder labels. Untagged effects remain Unlabeled; BPM, encoding flags, normalization flags, and download-copy suffixes are not used to infer an effect level. Files do not need to be renamed when their existing labels are recognizable.

Legacy exports with a genre immediately before Focus or Deep Work are also recognized (for example, The Chase Cinematic Focus Deep Work becomes The Chase / Cinematic). Genre labels after Deep Work take priority. Production-template names without recognizable labels stay unclassified; put these in a genre and effect folder after confirming their categories, such as Music/Low effect/Electronic/. No category is guessed from sound, tempo, or production notes.

Imported music starts with generated ambient music, background texture, and rhythmic pulse at zero. Raise their sliders to add them back; these choices stay in place across track changes, filtering, pause/resume, and preset changes. Choosing a new file/folder starts with those sounds off again. Removing the imported music restores the generative mix; temporary imported-file mix levels do not overwrite its saved settings. Master volume controls the imported track independently of the Ambient music slider.

Use the player controls for previous/next track, play/pause, seeking, and automatic track advancement. Shuffle is limited to matching tracks. The playlist repeats at the end. Both timer modes remain available. The + button accepts one repeating audio file or multiple MP3s as a library.

Duplicate cleanup remains separate in tools/MP3-Cleanup and the existing downloadable ZIP. The utility quarantines exact duplicates with a restorable manifest, without permanently deleting or overwriting files. Native Windows execution has not been verified in this Linux environment.

Forget saved library clears only the saved browser copy/link and disables auto-loading. Removing imported music also forgets its saved selection. Original files are never renamed or deleted. Remembering is opt-in, specific to this browser/device, and not durable in a private session. Only use recordings you have permission to use and store.

Pulse Hz means volume repetitions per second, not pitch and not BPM. The oscillator modulates a shared stereo gain, so both channels receive the same envelope. Depth controls the volume reduction independently of frequency; a 50% depth has a gain range of 0.5–1.0 and a 0% depth leaves music unmodulated. Added modulation defaults off for imported music, which may already contain its own effects. The controls implement a generic amplitude-modulation experiment; they do not reproduce a commercial algorithm or establish clinical efficacy.

Run node tests/storage.cjs, node tests/library.cjs, node tests/filters.cjs, node tests/audio-files.cjs, and node tests/timer.cjs from this folder.
