import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderSelectedWork} from '../src/lib/portfolio-gallery-core.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const projects=JSON.parse(fs.readFileSync(path.join(root,'src/data/projects.json'),'utf8'));
const categories=JSON.parse(fs.readFileSync(path.join(root,'src/data/portfolio-categories.json'),'utf8'));
process.stdout.write(renderSelectedWork(projects,categories));