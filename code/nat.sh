#!/bin/bash
# usage: nat.sh <key> <CoShort>   -> builds resume+letter, ATS check, merges letter-first into /home/claude/up
set -e
K=$1; C=$2
cd /mnt/user-data/outputs/applications
ONLY="_$K\$" node build.js >/dev/null
for f in Resume CoverLetter; do python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf "Abdelrahman_Conber_${f}_$K.docx" >/dev/null 2>&1; done
pdfinfo Abdelrahman_Conber_CoverLetter_$K.pdf | grep Pages; pdfinfo Abdelrahman_Conber_Resume_$K.pdf | grep Pages
python3 ats_check.py /home/claude/apply/nat/p/$K.txt Abdelrahman_Conber_Resume_$K.pdf Abdelrahman_Conber_CoverLetter_$K.pdf | head -8
cp Abdelrahman_Conber_Resume_$K.pdf Abdelrahman_Conber_CoverLetter_$K.pdf /home/claude/up/
pdfunite Abdelrahman_Conber_CoverLetter_$K.pdf Abdelrahman_Conber_Resume_$K.pdf /home/claude/up/Abdelrahman_Conber_${C}_Resume_and_Letter.pdf
pdftotext -l 1 /home/claude/up/Abdelrahman_Conber_${C}_Resume_and_Letter.pdf - | grep -m1 '^Hi '
