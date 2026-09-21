#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Run gh with a temporary proxy injected, without touching user environment variables.

.DESCRIPTION
    Why this exists:
      gh (like git) does NOT read the Windows system proxy (WinINET). It only honors
      the HTTP_PROXY / HTTPS_PROXY environment variables, and gh has no per-host
      proxy setting of its own.

      If you write the proxy into user-level environment variables, then whenever the
      proxy app (Clash etc.) is not running, gh fails immediately AND every other tool
      that honors those variables (npm / pip / curl) fails too.

      This script injects the proxy only for the single gh invocation. When the proxy
      is down, only this script fails - nothing else is affected.

.USAGE
    Everything after the script path is passed straight to gh:

        tools\ghp.cmd auth status
        tools\ghp.cmd pr list --limit 5
        tools\ghp.cmd repo view
        tools\ghp.cmd -NoProxy api user      # bypass the proxy
        tools\ghp.cmd -Check                 # only probe the proxy port

    Configuration is read from environment variables (no extra switches, so that
    arbitrary gh arguments can be forwarded untouched):

        GHPROXY      proxy URL            default http://127.0.0.1:7890
        GHPDIRECT    set to any value     skip the proxy entirely
        GHPTIMING    set to any value     always print elapsed time

.NOTES
    Two deliberate choices, both learned the hard way on Windows PowerShell 5.1:

    1. This file is saved as UTF-8 **with BOM**.
       PowerShell 5.1 decodes BOM-less files as ANSI. That mangles any non-ASCII text,
       and the mangled bytes can even swallow a string terminator, producing a bogus
       "Unexpected token" syntax error. Keeping this script ASCII-only plus a BOM makes
       it safe either way.

    2. It does NOT use [Parameter(ValueFromRemainingArguments = $true)].
       On 5.1, when a script is invoked with -File, that attribute captures only the
       LAST argument ("api user" arrives as just "user"). A plain [string[]] positional
       parameter forwards every token correctly.
#>
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $Rest
)

$ErrorActionPreference = 'Stop'

# ---- configuration from environment ----
$proxyUrl = $env:GHPROXY
if (-not $proxyUrl) { $proxyUrl = 'http://127.0.0.1:7890' }
$direct = [bool]$env:GHPDIRECT

# ---- extract our own flags, leave everything else for gh ----
$mode = 'run'
$pass = New-Object System.Collections.Generic.List[string]
foreach ($a in @($Rest)) {
    if ($null -eq $a) { continue }
    if ($a -eq '-Check') { $mode = 'check'; continue }
    if ($a -eq '-NoProxy') { $direct = $true; continue }
    $pass.Add($a)
}

# ---- probe the proxy port ----
$probeHost = '127.0.0.1'
$probePort = 7890
if ($proxyUrl -match '^(?:https?://)?(?:[^@]*@)?([^:/]+):(\d+)') {
    $probeHost = $Matches[1]
    $probePort = [int]$Matches[2]
}

function Test-ProxyAlive {
    param([string] $TargetHost, [int] $TargetPort)
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $task = $client.ConnectAsync($TargetHost, $TargetPort)
        $ok = $task.Wait(700)
        $client.Close()
        return ($ok -and $task.IsCompleted)
    } catch {
        return $false
    }
}

function Write-Info { param([string] $Message) Write-Host $Message -ForegroundColor DarkGray }

$live = Test-ProxyAlive -TargetHost $probeHost -TargetPort $probePort

if ($mode -eq 'check') {
    if ($live) { Write-Info ('Proxy ' + $probeHost + ':' + $probePort + ' is listening (OK)') }
    else { Write-Info ('Proxy ' + $probeHost + ':' + $probePort + ' is NOT listening (proxy app probably off)') }
    exit 0
}

if ($direct) {
    Write-Info 'Direct mode (no proxy)'
    & gh @pass
    exit $LASTEXITCODE
}

if (-not $live) {
    Write-Host ('Proxy ' + $probeHost + ':' + $probePort + ' is not listening.') -ForegroundColor Yellow
    Write-Host 'Start your proxy app (e.g. Clash) first, or retry without the proxy:' -ForegroundColor Yellow
    Write-Host ('    tools\ghp.cmd -NoProxy ' + ($pass -join ' ')) -ForegroundColor Yellow
    exit 2
}

# Inject only for this invocation; user/system environment variables are untouched.
$env:HTTP_PROXY = $proxyUrl
$env:HTTPS_PROXY = $proxyUrl
$env:NO_PROXY = 'localhost,127.0.0.1,::1'

$sw = [System.Diagnostics.Stopwatch]::StartNew()
& gh @pass
$code = $LASTEXITCODE
$sw.Stop()

if ($env:GHPTIMING -or $sw.Elapsed.TotalSeconds -ge 5) {
    Write-Info ('(gh took ' + [math]::Round($sw.Elapsed.TotalSeconds, 1) + 's via proxy ' + $proxyUrl + ')')
}
exit $code
