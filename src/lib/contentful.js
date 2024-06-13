import { cache } from 'react'
import 'server-only'

import { isDevelopment } from '@/lib/utils'

const fetchGraphQL = cache(async (query, preview = isDevelopment) => {
  try {
    const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN
        }`
      },
      body: JSON.stringify({ query })
    })
    console.log("Sent Contentful request.")

    if (!res.ok) return null
    console.log("Successful Contentful request.")

    return res.json()
  } catch (error) {
    console.info(error)
    return null
  }
})

// https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#preloading-data
export const preloadGetAllPosts = (preview = isDevelopment) => {
  void getAllPosts(preview)
}

export const getAllPosts = cache(async (preview = isDevelopment) => {
  try {
    const entries = await fetchGraphQL(
      `query {
        blogPostCollection(preview: ${preview}) {
          items {
            title
            slug
            date
            sys {
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entries?.data?. blogPostCollection?.items ?? []
  } catch (error) {
    console.info(error)
    return []
  }
})

export const getPost = cache(async (slug, preview = isDevelopment) => {
  try {
    const entry = await fetchGraphQL(
      `query {
         blogPostCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
          items {
            title
            slug
            date
            seo {
              title
              description
            }
            content {
              json
              links {
                assets {
                  block {
                    sys {
                      id
                    }
                    url(transform: {
                      format: AVIF,
                      quality: 50
                    })
                    title
                    width
                    height
                    description
                    contentfulMetadata {
                      tags {
                        name
                      }
                    }
                  }
                }
                entries {
                  inline {
                    sys {
                      id
                    }
                    __typename
                    ... on ContentEmbed {
                      title
                      embedUrl
                      type
                    }
                    ... on CodeBlock {
                      title
                      code
                    }
                    ... on Tweet {
                      id
                    }
                    ... on Carousel {
                      imagesCollection {
                        items {
                          title
                          description
                          url(transform: {
                            format: AVIF,
                            quality: 50
                          })
                        }
                      }
                    }
                  }
                }
              }
            }
            sys {
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entry?.data?.blogPostCollection?.items?.[0] ?? null
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getWritingSeo = cache(async (slug, preview = isDevelopment) => {
  try {
    const entry = await fetchGraphQL(
      `query {
         blogPostCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
          items {
            date
            seo {
              title
              description
              ogImageTitle
              ogImageSubtitle
              keywords
            }
            sys {
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entry?.data?.blogPostCollection?.items?.[0] ?? null
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getPageSeo = cache(async (slug, preview = isDevelopment) => {
  try {
    const entry = await fetchGraphQL(
      `query {
        pageCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
          items {
            seo {
              title
              description
              ogImageTitle
              ogImageSubtitle
              keywords
            }
          }
        }
      }`,
      preview
    )

    return entry?.data?.pageCollection?.items?.[0] ?? null
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getAllPostSlugs = cache(async (preview = isDevelopment) => {
  try {
    const entries = await fetchGraphQL(
      `query {
        blogPostCollection(preview: ${preview}) {
          items {
            slug
          }
        }
      }`,
      preview
    )

    return entries?.data?.blogPostCollection?.items.map((item) => ({
      slug: item.slug
    })) ?? []
  } catch (error) {
    console.info(error)
    return []
  }
})


export const getAllPageSlugs = cache(async (preview = isDevelopment) => {
  try {
    const entries = await fetchGraphQL(
      `query {
        pageCollection(preview: ${preview}) {
          items {
            slug
            hasCustomPage
            sys {
              id
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entries?.data?.pageCollection?.items ?? []
  } catch (error) {
    console.info(error)
    return []
  }
})


export const getPage = cache(async (slug, preview = isDevelopment) => {
  try {
    const entry = await fetchGraphQL(
      `query {
        pageCollection(where: { slug: "${slug}" }, preview: ${preview}, limit: 1) {
          items {
            title
            slug
            content {
              json
              links {
                assets {
                  block {
                    sys {
                      id
                    }
                    url(transform: {
                      format: AVIF,
                      quality: 50
                    })
                    title
                    width
                    height
                    description
                  }
                }
              }
            }
            sys {
              id
              firstPublishedAt
              publishedAt
            }
          }
        }
      }`,
      preview
    )

    return entry?.data?.pageCollection?.items?.[0] ?? null
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getAllLogbook = cache(async (preview = isDevelopment) => {
  try {
    const entries = await fetchGraphQL(
      `query {
        logbookCollection(order: date_DESC, preview: ${preview}) {
          items {
            title
            date
            description
            image {
              url(transform: {
                format: AVIF,
                quality: 50
              })
              title
              description
              width
              height
            }
          }
        }
      }`,
      preview
    )

    return entries?.data?.logbookCollection?.items ?? []
  } catch (error) {
    console.info(error)
    return []
  }
})
