import * as prismic from '@prismicio/client'

export function getPrismicClient() {
  const prismicService = prismic.createClient("ig-news-doug", {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN || "",
  });

  return prismicService;
}
