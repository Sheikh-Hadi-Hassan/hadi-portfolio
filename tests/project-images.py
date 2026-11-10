#!/usr/bin/env python3
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
projects=json.loads((ROOT/'src/data/projects.json').read_text())
issues=[]
for project in projects:
    slug=project['slug']
    images=[{'src':project.get('hero'),'width':project.get('hero_width'),'height':project.get('hero_height'),'alt':project.get('title','')+' — project overview'}]+project.get('images',[])
    seen=set()
    for i,img in enumerate(images):
        src=img.get('src','')
        if not src.startswith('/assets/'): issues.append(f'{slug}: image {i} has invalid src {src!r}'); continue
        if src in seen and i>0: issues.append(f'{slug}: duplicate image src {src}')
        # A cover may appear once in its gallery; duplicates within the gallery still fail.
        if i>0: seen.add(src)
        target=ROOT/'public'/src.lstrip('/')
        if not target.is_file(): issues.append(f'{slug}: missing asset {src}')
        if not isinstance(img.get('width'),int) or img.get('width',0)<=0: issues.append(f'{slug}: invalid width for {src}')
        if not isinstance(img.get('height'),int) or img.get('height',0)<=0: issues.append(f'{slug}: invalid height for {src}')
        alt=str(img.get('alt','')).strip()
        if i>0:
            if len(alt)<18: issues.append(f'{slug}: alt too weak for {src}: {alt!r}')
            if re.fullmatch(r'(image|photo|project image|mockup|visual)\s*\d*',alt,re.I): issues.append(f'{slug}: generic alt for {src}: {alt!r}')
            if alt.count('|')>2 or alt.lower().count('branding')>3: issues.append(f'{slug}: suspicious keyword stuffing in alt for {src}')
if issues:
    raise SystemExit('Project image contract failed:\n- '+'\n- '.join(issues))
print(f'Project image contract passed: {sum(1+len(p.get("images",[])) for p in projects)} image references have valid paths, dimensions and descriptive alt text.')
