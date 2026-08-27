param(
    [Parameter(Mandatory = $true)]
    [ValidateLength(1, 60)]
    [string]$Label,

    [string]$ProjectRoot
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = Split-Path -Parent $PSScriptRoot
}

function Write-Utf8JsonFile {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)]$Value
    )

    $json = $Value | ConvertTo-Json -Depth 8
    $utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $json + [Environment]::NewLine, $utf8WithoutBom)
}

function New-RandomInviteCode {
    $bytes = New-Object byte[] 12
    $random = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $random.GetBytes($bytes)
    }
    finally {
        $random.Dispose()
    }
    $hex = ([System.BitConverter]::ToString($bytes)).Replace('-', '')
    $groups = for ($index = 0; $index -lt $hex.Length; $index += 4) {
        $hex.Substring($index, 4)
    }
    return 'ES-' + ($groups -join '-')
}

function Get-Sha256Hex {
    param([Parameter(Mandatory = $true)][string]$Value)

    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
        return ([System.BitConverter]::ToString($sha.ComputeHash($bytes))).Replace('-', '').ToLowerInvariant()
    }
    finally {
        $sha.Dispose()
    }
}

$resolvedRoot = [System.IO.Path]::GetFullPath($ProjectRoot)
$registryPath = Join-Path $resolvedRoot 'src\config\invite-users.json'
$privateDirectory = Join-Path $resolvedRoot '.local'
$privatePath = Join-Path $privateDirectory 'invite-codes.json'

if (-not (Test-Path -LiteralPath $registryPath -PathType Leaf)) {
    throw "Invite registry not found: $registryPath"
}

$registry = Get-Content -LiteralPath $registryPath -Encoding UTF8 | Out-String | ConvertFrom-Json
if ($registry.version -ne 1) {
    throw 'Unsupported invite registry version'
}

$existingUsers = @($registry.users)
do {
    $code = New-RandomInviteCode
    $codeHash = Get-Sha256Hex -Value $code
} while ($existingUsers.codeHash -contains $codeHash)

$id = [Guid]::NewGuid().ToString()
$registry.users = @($existingUsers) + @([PSCustomObject]@{
    id = $id
    label = $Label.Trim()
    codeHash = $codeHash
    active = $true
})

if (-not (Test-Path -LiteralPath $privateDirectory -PathType Container)) {
    New-Item -ItemType Directory -Path $privateDirectory | Out-Null
}

if (Test-Path -LiteralPath $privatePath -PathType Leaf) {
    $privateRegistry = Get-Content -LiteralPath $privatePath -Encoding UTF8 | Out-String | ConvertFrom-Json
    if ($privateRegistry.version -ne 1) {
        throw 'Unsupported private invite registry version'
    }
}
else {
    $privateRegistry = [PSCustomObject]@{ version = 1; codes = @() }
}

$privateRegistry.codes = @($privateRegistry.codes) + @([PSCustomObject]@{
    id = $id
    label = $Label.Trim()
    code = $code
    createdAt = [DateTimeOffset]::UtcNow.ToString('o')
})

Write-Utf8JsonFile -Path $registryPath -Value $registry
Write-Utf8JsonFile -Path $privatePath -Value $privateRegistry

Write-Output "Invite code created: $code"
Write-Output "Plaintext stored only in: $privatePath"
Write-Output "Tracked registry stores only SHA-256: $registryPath"
