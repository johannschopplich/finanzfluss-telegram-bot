import { ofetch } from 'ofetch'

export interface AlgoliaQueriesResponse {
  results: {
    hits: {
      url: string
      type: string
      hierarchy: {
        lvl0: string
        lvl1: string
      }
      content: string
      objectID: string
      _snippetResult: {
        hierarchy: {
          lvl1: {
            value: string
            matchLevel: string
          }
        }
        content: {
          value: string
          matchLevel: string
        }
      }
      _highlightResult: {
        hierarchy: {
          lvl0: {
            value: string
            matchLevel: string
            matchedWords: any[]
          }
          lvl1: {
            value: string
            matchLevel: string
            fullyHighlighted: boolean
            matchedWords: string[]
          }
        }
        content: {
          value: string
          matchLevel: string
          matchedWords: any[]
        }
      }
    }[]
    nbHits: number
    page: number
    nbPages: number
    hitsPerPage: number
    exhaustiveNbHits: boolean
    exhaustiveTypo: boolean
    exhaustive: {
      nbHits: boolean
      typo: boolean
    }
    query: string
    params: string
    index: string
    renderingContent: Record<string, any>
    processingTimeMS: number
    processingTimingsMS: {
      _request: {
        roundTrip: number
      }
    }
  }[]
}

const ALGOLIA_APP_ID = '0QAU3L9G64'
const ALGOLIA_SEARCH_ONLY_API_KEY = '47897301a51ff527290b49fe38fa7fe4'

export function useAlgolia() {
  const $algolia = ofetch.create({
    baseURL: `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes`,
    query: {
      'x-algolia-api-key': ALGOLIA_SEARCH_ONLY_API_KEY,
      'x-algolia-application-id': ALGOLIA_APP_ID,
    },
  })

  const query = (
    text: string,
    indexName: string,
    { hitsPerPage = 20, clickAnalytics = false } = {},
  ) =>
    $algolia<AlgoliaQueriesResponse>('*/queries', {
      method: 'POST',
      body: {
        requests: [
          {
            query: text,
            indexName,
            params: `attributesToRetrieve=["hierarchy.lvl0","hierarchy.lvl1","hierarchy.lvl2","hierarchy.lvl3","hierarchy.lvl4","hierarchy.lvl5","hierarchy.lvl6","content","type","url"]&attributesToSnippet=["hierarchy.lvl1:10","hierarchy.lvl2:10","hierarchy.lvl3:10","hierarchy.lvl4:10","hierarchy.lvl5:10","hierarchy.lvl6:10","content:10"]&snippetEllipsisText=…&highlightPreTag=<mark>&highlightPostTag=</mark>&hitsPerPage=${hitsPerPage}&clickAnalytics=${clickAnalytics}`,
          },
        ],
      },
    })

  const parseHits = (hits: AlgoliaQueriesResponse['results'][0]['hits']) => {
    // Extract categories from hits
    const categories = [
      ...new Set(hits.map((hit) => hit.hierarchy.lvl0).filter(Boolean)),
    ]

    // Sort hits by category
    const sortedHits = categories.map((category) => ({
      category,
      hits: hits.filter((hit) => hit.hierarchy.lvl0 === category),
    }))

    return {
      categories,
      hits: sortedHits,
    }
  }

  return {
    $algolia,
    query,
    parseHits,
  }
}
