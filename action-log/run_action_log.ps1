<#
  run_action_log.ps1
  PowerShell-only ActionTracker deploy + launch. No Python, no external packages.
  Drop-in replacement for run_action_log.bat's server step (uses built-in
  System.Net.HttpListener from the .NET Framework that ships with Windows).

  Usage:
    .\run_action_log.ps1                 # defaults below
    .\run_action_log.ps1 -Port 8080      # start on a fixed port
    .\run_action_log.ps1 -Dst "D:\tmp\al" # serve from a local folder instead of Z:

  Press Ctrl+C to stop the server.
#>

param(
    [string]$Src     = 'C:\Users\qinghua.song\DSAI\workbuddy\action-log',
    [string]$Dst     = 'Z:\7. Engineering\01-Eng Mgmt\01 Action Log',
    [int]   $Port    = 8000,
    [int]   $PortMax = 8015
)

$ErrorActionPreference = 'Stop'

Write-Host "============================================================"
Write-Host " ActionTracker - deploy + launch (PowerShell, no Python)"
Write-Host "============================================================"
Write-Host " Source : $Src"
Write-Host " Deploy : $Dst"
Write-Host " Port   : $Port (auto-advances if busy, up to $PortMax)"
Write-Host "============================================================"

# ---- Step 1: Deploy run-ready files (index.html, css\, js\) ----
# Mirrors the .bat: copy only the run artifacts, NOT action.json / setup.json.
Write-Host "`n[1/2] Deploying run-ready files..."
# Require the source to exist.
if (-not (Test-Path $Src)) {
    Write-Host "  ERROR: Source folder not found: $Src"
    exit 1
}

# Require the deploy (Z:) folder to exist / be creatable. No silent fallback.
if (-not (Test-Path $Dst)) {
    Write-Host "  Creating destination: $Dst"
    New-Item -ItemType Directory -Path $Dst -Force -ErrorAction SilentlyContinue | Out-Null
}
if (-not (Test-Path $Dst)) {
    Write-Host "  ERROR: cannot create deploy folder: $Dst"
    Write-Host "  The Z: drive is probably not mapped. Map it (or pass -Dst) and retry."
    exit 1
}

# remove previous deploy artifacts only (leave any action.json/setup.json alone)
if (Test-Path (Join-Path $Dst 'index.html')) { Remove-Item (Join-Path $Dst 'index.html') -Force }
if (Test-Path (Join-Path $Dst 'css')) { Remove-Item (Join-Path $Dst 'css') -Recurse -Force }
if (Test-Path (Join-Path $Dst 'js'))  { Remove-Item (Join-Path $Dst 'js')  -Recurse -Force }

Copy-Item (Join-Path $Src 'index.html') $Dst -Force -ErrorAction SilentlyContinue
if (Test-Path (Join-Path $Src 'css')) { Copy-Item (Join-Path $Src 'css') (Join-Path $Dst 'css') -Recurse -Force }
if (Test-Path (Join-Path $Src 'js'))  { Copy-Item (Join-Path $Src 'js')  (Join-Path $Dst 'js')  -Recurse -Force }
Write-Host "  NOTE: action.json / setup.json are NOT copied."

$serveRoot = (Resolve-Path -LiteralPath $Dst).ProviderPath
Write-Host "  Serve root: $serveRoot"

# ---- Step 2: Find a free port (no netstat parsing; uses .NET TCP listener table) ----
function Test-PortFree([int]$p) {
    $listeners = [System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners()
    return ($listeners.Port -notcontains $p)
}
while (-not (Test-PortFree $Port)) {
    Write-Host "  Port $Port busy - trying next."
    $Port++
    if ($Port -gt $PortMax) {
        Write-Host "  ERROR: no free port in range $($PortMin)-$PortMax. Close other servers and retry."
        exit 1
    }
}
Write-Host "  Using port: $Port"

# ---- Step 3: Start HTTP server via built-in HttpListener ----
# Manual MIME map keeps it PS7/.NET-Core safe (no System.Web dependency).
$mime = @{
    '.html' = 'text/html; charset=utf-8'; '.htm'  = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8';   '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'; '.map' = 'application/json'
    '.png'  = 'image/png';  '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif';  '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'
    '.woff' = 'font/woff';  '.woff2' = 'font/woff2'; '.ttf' = 'font/ttf'
    '.txt'  = 'text/plain; charset=utf-8'; '.md' = 'text/markdown; charset=utf-8'
    '.pdf'  = 'application/pdf'; '.bak' = 'application/octet-stream'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")   # prefix MUST end with '/'
try {
    $listener.Start()
} catch [System.Net.HttpListenerException] {
    Write-Host "  ERROR: cannot bind port $Port ($($_.Exception.Message))."
    Write-Host "  If 'Access is denied', reserve it once (admin):"
    Write-Host "    netsh http add urlacl url=http://localhost:$Port/ user=Everyone"
    exit 1
}

$url = "http://localhost:$Port/index.html"
Write-Host "`n[2/2] Server listening on http://localhost:$Port/  (Ctrl+C to stop)"
Write-Host "  Open: $url"
try { Start-Process $url } catch { Write-Host "  (could not auto-open browser; open $url manually)" }

try {
    while ($true) {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        # Decode the request path and turn it into an absolute, normalized path.
        $rel      = [Uri]::UnescapeDataString($req.Url.LocalPath).TrimStart('/')
        $candidate = Join-Path $serveRoot $rel
        $normalized = [System.IO.Path]::GetFullPath($candidate)   # resolves '..' without needing the file to exist

        # Path-traversal guard: the resolved path must stay under $serveRoot.
        if (-not $normalized.StartsWith($serveRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
            $res.StatusCode = 403
            Write-Host " 403  $rel (traversal blocked)"
        } else {
            if ((Test-Path $normalized) -and ((Get-Item $normalized) -is [System.IO.DirectoryInfo])) {
                $normalized = Join-Path $normalized 'index.html'
            }
            if (Test-Path $normalized -PathType Leaf) {
                $ext  = [System.IO.Path]::GetExtension($normalized).ToLower()
                $data = [System.IO.File]::ReadAllBytes($normalized)
                $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
                $res.StatusCode  = 200
                $res.OutputStream.Write($data, 0, $data.Length)
                Write-Host " 200  $($req.HttpMethod) $rel"
            } else {
                $res.StatusCode = 404
                Write-Host " 404  $rel"
            }
        }
        $res.Close()
    }
} finally {
    if ($listener.IsListening) { $listener.Stop() }
    $listener.Close()
    Write-Host "`n[STOP] Server stopped."
}
