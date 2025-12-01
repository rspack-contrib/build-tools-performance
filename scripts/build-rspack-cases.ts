import path from 'path';
import glob from 'fast-glob';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import color from 'picocolors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const casesDir = path.join(rootDir, 'cases');

async function main() {
  const configs = await glob('*/rspack.config.mjs', { 
    cwd: casesDir,
    absolute: true 
  });

  if (configs.length === 0) {
    console.log(color.yellow('No rspack.config.mjs files found in cases directory.'));
    return;
  }

  console.log(color.cyan(`Found ${configs.length} cases to build.`));

  for (const configPath of configs) {
    const caseDir = path.dirname(configPath);
    const caseName = path.basename(caseDir);
    
    console.log(color.cyan(`\nBuilding case: ${caseName}...`));

    await new Promise<void>((resolve, reject) => {
      // Let's check if cases have package.json.
      
      const child = spawn('npx', ['rspack', 'build', '-c', 'rspack.config.mjs'], {
        cwd: caseDir,
        stdio: 'inherit',
        shell: true,
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(color.green(`Successfully built ${caseName}`));
          resolve();
        } else {
          console.error(color.red(`Failed to build ${caseName} with code ${code}`));
          reject(new Error(`Build failed for ${caseName}`));
        }
      });
      
      child.on('error', (err) => {
          console.error(color.red(`Failed to start build for ${caseName}: ${err.message}`));
          reject(err);
      });
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

