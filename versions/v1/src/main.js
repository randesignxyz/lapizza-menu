import { initMenu } from './menu/controller.js';
import { initCarousel } from './carousel/index.js';

const menu = await initMenu();
initCarousel({ onCategorySelect: menu.selectCategory });
