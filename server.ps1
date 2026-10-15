$port = 5500
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/ root: $root"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $rawUrl = [System.Uri]::UnescapeDataString($request.RawUrl)
            if ($rawUrl -eq "/" -or $rawUrl -eq "") {
                $rawUrl = "/index.html"
            }

            $filePath = $rawUrl.Split('?')[0].TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $fullPath = [System.IO.Path]::Combine($root, $filePath)

            if ([System.IO.File]::Exists($fullPath)) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                $mime = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".pdf"  { "application/pdf" }
                    default { "application/octet-stream" }
                }
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $response.ContentType = $mime
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Flush()
            } else {
                $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $filePath")
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $msg.Length
                $response.StatusCode = 404
                $response.OutputStream.Write($msg, 0, $msg.Length)
                $response.OutputStream.Flush()
            }
        } catch {
            Write-Host "Request error: $_"
        } finally {
            $response.OutputStream.Close()
            $response.Close()
        }
    }
} finally {
    $listener.Stop()
}
