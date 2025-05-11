$ErrorActionPreference = 'stop'
minikube start
minikube status

if ((Test-Path -LiteralPath variable:\LASTEXITCODE)) { exit $LASTEXITCODE }