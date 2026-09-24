// Builds the GitHub Pages site: Storybook at the root, the portal prototype at /prototype/.
// The prototype references ../css, ../components and ../assets, so those are copied next to it.
import { execSync } from 'node:child_process';
import { cpSync } from 'node:fs';

const OUT = 'storybook-static';
execSync('npm run build-storybook', { stdio: 'inherit' });

const skipStories = (src) => !src.endsWith('.stories.js');
cpSync('css', `${OUT}/css`, { recursive: true });
cpSync('components', `${OUT}/components`, { recursive: true, filter: skipStories });
cpSync('assets', `${OUT}/assets`, { recursive: true }); // merges with Storybook's hashed build files; no name clashes
cpSync('prototype', `${OUT}/prototype`, { recursive: true });

console.log(`Site built in ${OUT}/ (Storybook at /, prototype at /prototype/)`);
