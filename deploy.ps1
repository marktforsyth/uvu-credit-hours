Set-Location ./creator
./venv/Scripts/Activate.ps1
python main.py
Set-Location ..

surge --project ./uvu-credit-hours-tool/dist --domain uvu-credit-hours.surge.sh