[CmdletBinding()]
param()

$secureKey = Read-Host "DeepSeek API Key for this session (input is hidden)" -AsSecureString
$keyPointer = [IntPtr]::Zero

try {
    $keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
    $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
    if ([string]::IsNullOrWhiteSpace($plainKey)) {
        throw "DeepSeek API Key cannot be empty."
    }

    $env:DEEPSEEK_API_KEY = $plainKey
    Remove-Variable plainKey -ErrorAction SilentlyContinue
    npm.cmd run dev
}
finally {
    Remove-Item Env:\DEEPSEEK_API_KEY -ErrorAction SilentlyContinue
    if ($keyPointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
    }
}
