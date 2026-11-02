STILL MP3 CLEANUP - Windows 10/11, no administrator account needed

1. Extract this ZIP into a normal folder.
2. Double-click Clean-MP3-Folder.cmd and choose your MP3 folder.
3. Review the duplicate/original pairs. Type MOVE to quarantine duplicates,
   or press Enter to leave your files unchanged.
4. Open Still, click Choose folder, and select the same MP3 folder.

The tool compares SHA-256 file hashes, not filenames or audio similarity.
It keeps one copy of each exact file, preferring shorter original filenames.
Copies with different tags, bitrates, or encodings might not match.

Duplicate copies move into _Still_Duplicates/<run>/Files, retaining their
relative subfolders. A Manifest.csv records each original and new path.
Files are checked again before moving. Nothing is overwritten or permanently
deleted. Still and this scanner ignore the _Still_Duplicates folder.

To undo, double-click Restore-Duplicates.cmd and choose Manifest.csv from a
cleanup run. Type RESTORE. Existing files are never overwritten. Changed or
missing quarantined files are skipped.

After reviewing the results, delete _Still_Duplicates yourself if you want to
reclaim the disk space. Keep it until you are satisfied with the kept copies.

The launcher uses the Windows built-in PowerShell runtime. Its execution-policy
setting applies only to that process; it does not change your system policy.

This utility was reviewed in a Linux development environment; native Windows
PowerShell execution has not been verified here. It has not accessed your files.
