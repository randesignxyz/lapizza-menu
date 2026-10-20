const v2Url = new URL('../index.html', import.meta.url);
const v1Url = new URL('../versions/v1/index.html', import.meta.url);
const isV1 = window.location.pathname.startsWith(new URL('.', v1Url).pathname);

function createVersionTabs() {
  const nav = document.createElement('nav');
  nav.className = 'ui-version-tabs';
  nav.setAttribute('aria-label', 'UI versions');
  const label = document.createElement('span');
  label.className = 'ui-version-label';
  label.textContent = 'UI preview';
  nav.append(label);
  for (const [name, url, active] of [
    ['V1', v1Url, isV1],
    ['V2', v2Url, !isV1],
  ]) {
    const link = document.createElement('a');
    link.href = url.href;
    link.textContent = name;
    if (active) link.setAttribute('aria-current', 'page');
    nav.append(link);
  }
  return nav;
}

document.body.prepend(createVersionTabs());
// A modal sits above the document, so it needs its own visible switcher.
const cover = document.getElementById('bookCover');
if (cover) cover.prepend(createVersionTabs());
