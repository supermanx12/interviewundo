Get-ChildItem -Path 'd:\interviewUndo\apps' -Recurse -Include '*.ts','*.tsx' | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  if ($content -match '\$\(\[char\]0x2014\)') {
    $fixed = $content -replace '\$\(\[char\]0x2014\)', [string][char]0x2014
    Set-Content $_.FullName $fixed -NoNewline
    Write-Host "Fixed: $($_.Name)"
  }
}
Write-Host "Done!"
