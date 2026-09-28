import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile(new URL('../migration-manifest.json',import.meta.url),'utf8'));
for(const [name,expected] of Object.entries(manifest.unchangedFiles)){
 const bytes=await readFile(new URL('../'+name,import.meta.url));
 if(createHash('sha256').update(bytes).digest('hex')!==expected)throw new Error('Existing LP changed: '+name);
}
console.log(Object.keys(manifest.unchangedFiles).length+' existing LP files match source');
