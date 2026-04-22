import { STORIES } from '../content/index.js';

export function useStory(slug) {
  const story = slug ? STORIES[slug] : null;
  return { story, notFound: !!slug && !story };
}
