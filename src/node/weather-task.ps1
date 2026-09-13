<#
  气象采集器 Windows 计划任务管理脚本
  ---------------------------------------------------------------------------
  用法（在本目录下打开 PowerShell 执行）：
    powershell -ExecutionPolicy Bypass -File weather-task.ps1 install    注册任务（每 30 分钟按需采集）
    powershell -ExecutionPolicy Bypass -File weather-task.ps1 run        立即运行一次
    powershell -ExecutionPolicy Bypass -File weather-task.ps1 status     查看任务状态
    powershell -ExecutionPolicy Bypass -File weather-task.ps1 uninstall  删除任务
  说明：
    - 任务每 30 分钟执行一次 "node routes/weather.js --once auto"，
      仅在到达采集间隔时真正采集（研究区 30 分钟 / 全国 6 小时）；
    - 与 node 服务内嵌的采集调度共用 weather_collect_log 表去重，不会重复采集；
    - 采集日志输出到 %TEMP%\zhlt-weather-task.log；
    - 与 node 服务互不冲突：任务不占用任何端口。
#>
param([ValidateSet('install', 'uninstall', 'status', 'run')][string]$Action = 'status')

$ErrorActionPreference = 'Stop'
$taskName = 'ZHLXT-WeatherCollector'
$nodePath = (Get-Command node -ErrorAction Stop).Source
$jsPath = Join-Path $PSScriptRoot 'routes\weather.js'
$logPath = Join-Path $env:TEMP 'zhlt-weather-task.log'

if (-not (Test-Path $jsPath)) {
  throw ('未找到采集脚本: ' + $jsPath)
}

switch ($Action) {
  'install' {
    $argLine = '/c ""' + $nodePath + '" "' + $jsPath + '" --once auto >> "' + $logPath + '" 2>&1"'
    $taskAction = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument $argLine
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(2) `
      -RepetitionInterval (New-TimeSpan -Minutes 30) `
      -RepetitionDuration (New-TimeSpan -Days 3650)
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable `
      -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
      -ExecutionTimeLimit (New-TimeSpan -Minutes 20) -MultipleInstances IgnoreNew
    Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $trigger `
      -Settings $settings -Force `
      -Description 'ZHLXT 平台气象数据采集（每 30 分钟按需采集 Open-Meteo，写入 PostgreSQL weather_obs）' | Out-Null
    Write-Output ('已注册计划任务: ' + $taskName)
    Write-Output ('  执行命令: cmd.exe ' + $argLine)
    Write-Output ('  采集日志: ' + $logPath)
  }
  'uninstall' {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Output ('已删除计划任务: ' + $taskName)
  }
  'run' {
    Start-ScheduledTask -TaskName $taskName
    Write-Output ('已触发一次运行: ' + $taskName + '（日志: ' + $logPath + '）')
  }
  'status' {
    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if (-not $task) {
      Write-Output ('未找到计划任务: ' + $taskName + '（可执行 install 注册）')
      return
    }
    $info = Get-ScheduledTaskInfo -TaskName $taskName
    Write-Output ('任务: ' + $task.TaskName + '  状态: ' + $task.State)
    Write-Output ('上次运行: ' + $info.LastRunTime + '  结果: ' + $info.LastTaskResult)
    Write-Output ('下次运行: ' + $info.NextRunTime)
  }
}