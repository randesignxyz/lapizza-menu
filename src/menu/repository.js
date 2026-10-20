import { validateMenu } from './model.js';

export async function loadMenu() {
  const response = await fetch(new URL('../../menu.json', import.meta.url), {
    cache: 'no-cache',
  });
  if (!response.ok) throw new Error(`Menu request failed: ${response.status}`);
  return validateMenu(await response.json());
}
