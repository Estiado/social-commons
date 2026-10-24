export function feedbackPagePath(value: string) {
  try {
    const url = new URL(value, 'https://social-commons.pages.dev');
    return value && value.length <= 500 && url.origin === 'https://social-commons.pages.dev'
      ? url.pathname
      : '';
  } catch {
    return '';
  }
}

export function feedbackLink(pathname: string, search = '') {
  const page = pathname === '/feedback' ? new URLSearchParams(search).get('page') || '' : pathname;
  const safePage = feedbackPagePath(page);
  return '/feedback' + (safePage ? '?page=' + encodeURIComponent(safePage) : '');
}
