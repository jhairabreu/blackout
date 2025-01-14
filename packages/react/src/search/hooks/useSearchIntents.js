/**
 * Hook to provide all kinds of data for the business logic attached to the
 * search functionality (search intents).
 *
 * @module useSearchIntents
 * @category Search
 * @subcategory Hooks
 */
import {
  areSearchIntentsLoading,
  doGetSearchIntents,
  doResetSearchIntents,
  getSearchIntentsError,
  getSearchIntentsResult,
} from '@farfetch/blackout-core/search/redux';
import { buildSetFilters } from '@farfetch/blackout-core/products/listing/utils';
import {
  FILTER_SLUGS_ORDER,
  TYPE_FILTER,
  TYPE_REQUEST,
} from '@farfetch/blackout-core/search/redux/utils';
import { getSearchIntents as getSearchIntentsClient } from '@farfetch/blackout-core/search/client';
import { useAction } from '../../utils';
import { useSelector } from 'react-redux';
import urlJoin from 'proper-url-join';

const DEFAULT_BASE_URL = '/shopping';

/**
 * Gets the URL to redirect according to the search intents result. In a
 * nutshell, the logic is based on types:
 * <ul>
 * <li><b>Redirect:</b> not much to say, redirect to the received url;</li>
 * <li><b>Product:</b> builds the url for the respective product's PDP;</li>
 * <li><b>Listing:</b> builds the url, with the correct slugs, for the
 * respective listing.</li>
 * </ul>.
 *
 * @function getSearchRedirectUrl
 * @memberof module:useSearchIntents
 *
 * @param {object} searchIntents - Search intents result.
 * @param {string} baseUrl - Base url to prepend to the final redirect url.
 *
 * @returns {string|undefined} The URL to redirect the user into.
 */
const getSearchRedirectUrl = (searchIntents, baseUrl) => {
  if (!searchIntents) {
    return;
  }

  const {
    typeRequest,
    redirectUrl,
    resources: originalResources,
  } = searchIntents;

  // Prevent mutation on the original resources
  const resources = [...originalResources];

  switch (typeRequest) {
    // If the typeRequest is of the type "Redirect", automatically redirects to the url received.
    case TYPE_REQUEST.REDIRECT:
      return `/${redirectUrl}`;
    // If the typeRequest is of the type "Product", automatically redirects to the pdp of the product received, by slug.
    case TYPE_REQUEST.PRODUCT: {
      const productSlug = resources[0].values[0].slug;

      return `${baseUrl}/${productSlug}`;
    }
    // If the typeRequest is of the type "Listing", automatically redirects to a specific listing according the resources received.
    case TYPE_REQUEST.LISTING: {
      let resourcesWithSlug = [];

      // If the resources are possible to transform in slug - they have to follow a
      // specific contruction order: Gender (3) / Brand (1) / Category (2)
      FILTER_SLUGS_ORDER.forEach(filterSlugType => {
        // To transform a resource into a slug is necessary that resource only have 1 value associated with slug and the filter type should be
        // one of these types: Gender (3), brand (1) or category (2) (FILTER_SLUGS_ORDER).
        // All resources found of this type are passed to an array named resourcesWithSlug
        // and are removed from the initial array resources, to ensure that they will no longer be used.
        const filteredIndex = resources.findIndex(
          ({ typeFilter, values }) =>
            typeFilter === filterSlugType &&
            values.length <= 1 &&
            values[0].slug,
        );
        if (filteredIndex !== -1) {
          // If found, add the resource to the resourcesWithSlug array.
          resourcesWithSlug.push(resources[filteredIndex]);
          // If found, remove the resource from the original array.
          resources.splice(filteredIndex, 1);
        }
      });

      // If exist slugs is necessary to construct a URL with all the slugs associated.
      const slugsUrl =
        !!resourcesWithSlug.length &&
        resourcesWithSlug
          .map(({ values }) => values.map(({ slug }) => slug))
          .join('/');

      // With the remaining resources we have to transform them in queryParams, like {'categories': [123,456]}
      const queryParams = resources.reduce((acc, { typeFilter, values }) => {
        // Find the typeFilter of the resource, like CATEGORIES
        const queryParam = Object.entries(TYPE_FILTER).find(
          type => type[1] === typeFilter,
        );
        const queryValues = values.map(({ value }) => value);
        const queryKey =
          // If the typeFilter is 10(TEXT) should be treated as a query.
          // Otherwise the queryParam found before (CATEGORIES) should be used.
          typeFilter !== TYPE_FILTER.TEXT
            ? queryParam[0].toLowerCase()
            : 'query';

        acc[queryKey] = queryValues;

        return acc;
      }, {});

      // With this util we transform all the queryParms in a queryString
      const { queryString } = buildSetFilters({}, queryParams);

      // Finally we navigate to a specific listing
      return urlJoin(baseUrl, slugsUrl, queryString);
    }
    default:
      return;
  }
};

/**
 * @function useSearchIntents
 * @memberof module:search/hooks
 *
 * @param {number} [baseUrl='/shopping'] - Base url to prepend to the final
 * redirect url. Defaults to <code>'/shopping'</code>.
 *
 * @returns {object} All the handlers, state, actions and relevant data needed
 * to manage a search request.
 */
export default (baseUrl = DEFAULT_BASE_URL) => {
  const error = useSelector(getSearchIntentsError);
  const isLoading = useSelector(areSearchIntentsLoading);
  const searchIntents = useSelector(getSearchIntentsResult);
  const searchRedirectUrl = getSearchRedirectUrl(searchIntents, baseUrl);

  // Actions
  const getSearchIntents = useAction(
    doGetSearchIntents(getSearchIntentsClient),
  );
  const resetSearchIntents = useAction(doResetSearchIntents);

  return {
    /**
     * Gets the search intents.
     *
     * @type {Function}
     */
    getSearchIntents,
    /**
     * Resets the search intents result.
     *
     * @type {Function}
     */
    resetSearchIntents,
    /**
     * Search intents error.
     *
     * @type {object|undefined}
     */
    error,
    /**
     * Whether the search intents request is loading.
     *
     * @type {boolean}
     */
    isLoading,
    /**
     * Search intents result received.
     *
     * @type {?object}
     */
    searchIntents,
    /**
     * Redirect url where the user should be redirected with the
     * intents received.
     *
     * @type {string}
     * @variation Member
     *
     * @see {@link module:useSearchIntents.getSearchRedirectUrl|getSearchRedirectUrl} method
     */
    searchRedirectUrl,
  };
};
