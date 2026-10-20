import { initMenu } from './menu/controller.js?v=2-no-saved-filter';
import { initBookCover } from './book/cover.js?v=2-reveal-menu';

initBookCover();
await initMenu();
