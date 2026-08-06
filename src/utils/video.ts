/** Converts a YouTube or Vimeo watch/share URL into an embeddable iframe src. */
export function getEmbedUrl(rawUrl: string): string | null {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, '');

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const id = u.searchParams.get('v');
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`;

    const parts = u.pathname.split('/').filter(Boolean);
    if ((parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') && parts[1]) {
      return `https://www.youtube-nocookie.com/embed/${parts[1]}`;
    }
    return null;
  }

  if (host === 'youtu.be') {
    const id = u.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (host === 'vimeo.com') {
    const parts = u.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}
