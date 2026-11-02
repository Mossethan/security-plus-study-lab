[CmdletBinding()]
param([string]$Folder, [switch]$Restore)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms

function Select-Folder {
    $dialog = New-Object System.Windows.Forms.FolderBrowserDialog
    $dialog.Description = 'Choose the folder containing your MP3 tracks'
    $dialog.ShowNewFolderButton = $false
    try { if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { return $dialog.SelectedPath } }
    finally { $dialog.Dispose() }
    return $null
}
function Get-Mp3Files([string]$Root) {
    $pending = New-Object 'System.Collections.Generic.Stack[string]'
    $pending.Push($Root)
    while ($pending.Count -gt 0) {
        $directory = $pending.Pop()
        try { $items = @(Get-ChildItem -LiteralPath $directory -Force -ErrorAction Stop) }
        catch { Write-Warning ('Cannot scan {0}: {1}' -f $directory, $_.Exception.Message); continue }
        foreach ($item in $items) {
            if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { continue }
            if ($item.PSIsContainer) {
                if ($item.Name -ine '_Still_Duplicates') { $pending.Push($item.FullName) }
            } elseif ($item.Extension -ieq '.mp3') { $item }
        }
    }
}
function Get-StreamHash($Stream) { return (Get-FileHash -InputStream $Stream -Algorithm SHA256).Hash }
function Test-Under([string]$Path, [string]$Prefix) { return $Path.StartsWith($Prefix, [StringComparison]::OrdinalIgnoreCase) }

function Restore-Files {
    $picker = New-Object System.Windows.Forms.OpenFileDialog
    $picker.Title = 'Choose Manifest.csv inside a _Still_Duplicates run folder'
    $picker.Filter = 'Still cleanup manifest (Manifest.csv)|Manifest.csv'
    try { if ($picker.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { return }; $manifest = $picker.FileName }
    finally { $picker.Dispose() }
    $run = [IO.DirectoryInfo]([IO.Path]::GetDirectoryName($manifest))
    if ($run.Parent.Name -ine '_Still_Duplicates') { throw 'Choose a Manifest.csv inside the _Still_Duplicates folder.' }
    $root = $run.Parent.Parent.FullName.TrimEnd([char[]]'\/') + [IO.Path]::DirectorySeparatorChar
    $filesPrefix = (Join-Path $run.FullName 'Files').TrimEnd([char[]]'\/') + [IO.Path]::DirectorySeparatorChar
    $rows = @(Import-Csv -LiteralPath $manifest)
    Write-Host ('Restore available files from: {0}' -f $run.FullName)
    if ((Read-Host 'Type RESTORE to continue') -cne 'RESTORE') { Write-Host 'No files changed.'; return }
    $restored = 0
    foreach ($row in $rows) {
        $stream = $null
        try {
            $source = [IO.Path]::GetFullPath($row.QuarantinedPath)
            if (-not (Test-Under $source $filesPrefix)) { throw 'Manifest source is outside this quarantine.' }
            $relative = $source.Substring($filesPrefix.Length)
            $expected = [IO.Path]::GetFullPath((Join-Path $root $relative))
            $destination = [IO.Path]::GetFullPath($row.OriginalPath)
            if (-not (Test-Under $destination $root) -or $destination -ine $expected) { throw 'Manifest destination does not match the original folder.' }
            if (-not [IO.File]::Exists($source)) { continue }
            if ([IO.File]::Exists($destination) -or [IO.Directory]::Exists($destination)) { throw 'Original path already exists; it will not be overwritten.' }
            $stream = [IO.File]::Open($source, [IO.FileMode]::Open, [IO.FileAccess]::Read, ([IO.FileShare]::Read -bor [IO.FileShare]::Delete))
            if ((Get-StreamHash $stream) -ine $row.SHA256) { throw 'Quarantined file has changed; restore skipped.' }
            [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($destination))
            [IO.File]::Move($source, $destination)
            $restored++
        } catch { Write-Warning ('Restore skipped: {0}' -f $_.Exception.Message) }
        finally { if ($stream) { $stream.Dispose() } }
    }
    Write-Host ('Restored {0} files. No existing files were overwritten.' -f $restored)
}

try {
    if ($Restore) { Restore-Files; return }
    if (-not $Folder) { $Folder = Select-Folder }
    if (-not $Folder) { Write-Host 'Cancelled. No files changed.'; return }
    $directory = Get-Item -LiteralPath $Folder
    if (-not $directory.PSIsContainer) { throw 'Select a folder, not a file.' }
    $root = $directory.FullName
    $rootPrefix = $root.TrimEnd([char[]]'\/') + [IO.Path]::DirectorySeparatorChar
    Write-Host ('Scanning MP3s in {0}' -f $root)
    Write-Host 'Matching compares exact file contents. Different tags or encodings can prevent a match.'
    $files = @(Get-Mp3Files $root | Sort-Object @{Expression={$_.Name.Length}}, @{Expression={$_.FullName.Length}}, FullName)
    $duplicates = New-Object 'System.Collections.Generic.List[object]'
    $checked = 0
    foreach ($group in ($files | Group-Object Length)) {
        if ($group.Count -lt 2) { $checked += $group.Count; continue }
        $seen = @{}
        foreach ($file in $group.Group) {
            $checked++
            Write-Progress -Activity 'Checking MP3 file contents' -Status ('{0} of {1}' -f $checked, $files.Count) -PercentComplete ([int](100*$checked/[Math]::Max(1,$files.Count)))
            try {
                $hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
                if ($seen.ContainsKey($hash)) {
                    $duplicates.Add([PSCustomObject]@{OriginalPath=$file.FullName; KeptPath=$seen[$hash]; SHA256=$hash; Bytes=$file.Length; QuarantinedPath=''; Status='Planned'; Error=''})
                } else { $seen[$hash] = $file.FullName }
            } catch { Write-Warning ('Skipped {0}: {1}' -f $file.FullName, $_.Exception.Message) }
        }
    }
    Write-Progress -Activity 'Checking MP3 file contents' -Completed
    Write-Host ('Found {0} MP3 files and {1} exact duplicate copies.' -f $files.Count, $duplicates.Count)
    if ($duplicates.Count -eq 0) { Write-Host 'No files changed.'; return }
    $runName = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
    $quarantineRoot = Join-Path $root '_Still_Duplicates'
    $runRoot = Join-Path $quarantineRoot $runName
    while (Test-Path -LiteralPath $runRoot) { $runRoot = Join-Path $quarantineRoot ([Guid]::NewGuid().ToString('N')) }
    $destinationRoot = Join-Path $runRoot 'Files'
    foreach ($row in $duplicates) { Write-Host ('Duplicate: {0}' -f $row.OriginalPath); Write-Host ('Keep:      {0}' -f $row.KeptPath); Write-Host '' }
    Write-Host 'One original copy stays in place. Duplicates move to _Still_Duplicates; nothing is permanently deleted.'
    if ((Read-Host 'Type MOVE to move these duplicate copies') -cne 'MOVE') { Write-Host 'Cancelled. No files changed.'; return }
    [void][IO.Directory]::CreateDirectory($destinationRoot)
    $manifest = Join-Path $runRoot 'Manifest.csv'
    foreach ($row in $duplicates) {
        $relative = $row.OriginalPath.Substring($rootPrefix.Length)
        $row.QuarantinedPath = Join-Path $destinationRoot $relative
    }
    $duplicates | Export-Csv -LiteralPath $manifest -NoTypeInformation -Encoding UTF8
    $moved = 0
    foreach ($row in $duplicates) {
        $sourceStream = $null; $keptStream = $null
        try {
            # Lock both files against changes; permit renaming only the duplicate.
            $keptStream = [IO.File]::Open($row.KeptPath,[IO.FileMode]::Open,[IO.FileAccess]::Read,[IO.FileShare]::Read)
            $sourceStream = [IO.File]::Open($row.OriginalPath,[IO.FileMode]::Open,[IO.FileAccess]::Read,([IO.FileShare]::Read -bor [IO.FileShare]::Delete))
            if ((Get-StreamHash $sourceStream) -ine $row.SHA256 -or (Get-StreamHash $keptStream) -ine $row.SHA256) { throw 'A file changed after scanning. Move skipped.' }
            [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($row.QuarantinedPath))
            [IO.File]::Move($row.OriginalPath,$row.QuarantinedPath)
            $row.Status = 'Moved'; $moved++
        } catch { $row.Status='Skipped'; $row.Error=$_.Exception.Message; Write-Warning ('Skipped {0}: {1}' -f $row.OriginalPath,$row.Error) }
        finally {
            if ($sourceStream) { $sourceStream.Dispose() }; if ($keptStream) { $keptStream.Dispose() }
            $duplicates | Export-Csv -LiteralPath $manifest -NoTypeInformation -Encoding UTF8
        }
    }
    Write-Host ('Moved {0} exact duplicate copies. Originals are unchanged.' -f $moved)
    Write-Host ('Review/restore folder: {0}' -f $runRoot)
    Write-Host 'After reviewing the results, you may delete the _Still_Duplicates folder yourself to reclaim disk space.'
} catch { Write-Host ('Cleanup stopped: {0}' -f $_.Exception.Message) -ForegroundColor Yellow }
