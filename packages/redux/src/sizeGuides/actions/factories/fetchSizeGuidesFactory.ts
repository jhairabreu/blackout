import * as actionTypes from '../../actionTypes';
import type { Dispatch } from 'redux';
import type { FetchSizeGuidesAction } from '../../types';
import type {
  GetSizeGuides,
  SizeGuide,
  SizeGuidesQuery,
} from '@farfetch/blackout-client/sizeGuides/types';

/**
 * @typedef {object} FetchSizeGuidesQuery
 *
 * @alias FetchSizeGuidesQuery
 * @memberof module:sizeGuides/actions
 *
 * @property {Array} [brandIds] - Brand ids to search for sizeGuides.
 * @property {Array} [categoryIds] - Category ids to search for sizeGuides.
 */

/**
 * @callback FetchSizeGuidesThunkFactory
 *
 * @param {FetchSizeGuidesQuery} [query] - Query parameters to apply to the
 * request.
 * @param {object} [config] - Custom configurations to send to the client
 * instance (axios).
 *
 * @returns {Function} Thunk to be dispatched to the redux store.
 */

/**
 * Creates a thunk factory configured with the specified client to fetch size
 * guides for a given set of brand ids and category ids.
 * This size guides logic should be used in cases that the project does not have
 * a specific category tree. If your project has a category tree you should use
 * the respective logic from `@farfetch/blackout-redux/products`.
 *
 * @memberof module:sizeGuides/actions/factories
 *
 * @param {Function} getSizeGuides - Get size guides client.
 *
 * @returns {FetchSizeGuidesThunkFactory} Thunk factory.
 */
const fetchSizeGuidesFactory =
  (getSizeGuides: GetSizeGuides) =>
  (query?: SizeGuidesQuery, config?: Record<string, unknown>) =>
  async (dispatch: Dispatch<FetchSizeGuidesAction>): Promise<SizeGuide[]> => {
    dispatch({
      meta: { query },
      type: actionTypes.FETCH_SIZE_GUIDES_REQUEST,
    });

    try {
      const result = await getSizeGuides(query, config);

      dispatch({
        meta: { query },
        payload: {
          result,
        },
        type: actionTypes.FETCH_SIZE_GUIDES_SUCCESS,
      });

      return result;
    } catch (error) {
      dispatch({
        meta: { query },
        payload: { error },
        type: actionTypes.FETCH_SIZE_GUIDES_FAILURE,
      });

      throw error;
    }
  };

export default fetchSizeGuidesFactory;