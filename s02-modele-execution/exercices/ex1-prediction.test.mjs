import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { prediction } from './ex1-prediction.mjs';

const executer = promisify(execFile);

test("la prédiction correspond à l'exécution réelle", async () => {
  const programme = fileURLToPath(new URL('./ex1-programme.mjs', import.meta.url));
  const { stdout } = await executer(process.execPath, [programme]);
  const reel = stdout.trim().split(/\r?\n/);
  assert.equal(prediction.length, 12, 'la prédiction doit contenir les 12 lettres');
  assert.deepEqual(prediction, reel);
});
