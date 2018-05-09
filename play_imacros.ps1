dir -D ${env:APPDATA}/'Moonchild Productions'/'Pale Moon'/Profiles

$p = Read-Host "Nhap so dau tien cua account"
$f = Read-Host "So bat dau"
$l = Read-Host "So cuoi cung"
cd ${env:USERPROFILE}/Desktop/imacros


$ini = ${env:APPDATA} + '/Moonchild Productions/Pale Moon/profiles.ini'
"[General]" | Out-File $ini
"StartWithLastProfile=1`r`n" | Add-Content $ini
$index = 0
for ($i = [int]$f; $i -le [int]$l; $i++){
 "[Profile$index]" | Add-Content $ini
 "Name=$p`_$i" | Add-Content $ini
 "IsRelative=1" | Add-Content $ini
 "Path=Profiles/$p`_$i" | Add-Content $ini
 "Default=1`r`n" | Add-Content $ini
 $index++
}

new-item 'C:\Logs\Imacros\' -itemtype directory 
$pass = Read-Host 'Nhap password'
$run = Get-Content run.js
for ($i = [int]$f; $i -le [int]$l; $i++){
  $temp = $run -replace '@ip',"1`_$i"
  $temp = $temp -replace '@pass',$pass
  $path = 'C:\Logs\Imacros\' + "1`_$i.js"
  $temp | Out-File $path
  & ${env:ProgramFiles(x86)}/'Pale Moon'/palemoon.exe -p $p`_$i -no-remote imacros://run/?m=1`_$i.js
}

Start-Sleep -s 10
for ($i = [int]$f; $i -le [int]$l; $i++){
  $path = 'C:\Logs\Imacros\' + "1`_$i.js"
  Remove-Item $path
}