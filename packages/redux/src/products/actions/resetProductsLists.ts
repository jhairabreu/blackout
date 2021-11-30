import { RESET_PRODUCTS_LISTS_ENTITIES } from '../actionTypes';
import resetProductsListsState from './resetProductsListsState';
import type {
  ResetProductsListsEntitiesAction,
  ResetProductsListsStateAction,
} from '../types';
import type { StoreState } from '../../types';
import type { ThunkDispatch } from 'redux-thunk';

/**
 * Reset products lists related entities to its initial value.
 *
 * @private
 *
 * @memberof module:products/actions
 *
 * @name resetProductsListsEntities
 *
 * @example
 * // Store before executing action
 * const store = {
 *     entities: {
 *         products: { 123: {...} }
 *         productsLists: { '123-foo': {...} }
 *     }
 * }
 *
 * // Result of reset entities:
 * const store = { entities: { products: { 123: {...} } } }
 *
 * @returns {Function} Dispatch reset productsLists entities action.
 */
const resetProductsListsEntities =
  () =>
  (
    dispatch: ThunkDispatch<
      StoreState,
      unknown,
      ResetProductsListsEntitiesAction
    >,
  ): void => {
    dispatch({
      type: RESET_PRODUCTS_LISTS_ENTITIES,
    });
  };

/**
 * Reset products lists state and related entities to its initial value.
 *
 * @memberof module:products/actions
 *
 * @name resetProductsLists
 *
 * @example
 * import { resetProductsLists } from '@farfetch/blackout-redux/products';
 *
 * // State and store before executing action
 * const state = {
 *     hash: '123-foo',
 *     error: {'123-foo': 'Error'},
 *     isLoading: {'123-foo': false},
 *     ...
 * };
 * const store = {
 *     entities: {
 *         products: { 123: {...} }
 *         productsLists: { '123-foo': {...} }
 *     }
 * }
 *
 * // Result of resetProductsLists:
 * const state =  { hash: null, error: {}, isLoading: {}, isHydrated: {} }
 * const store = { entities: { products: { 123: {...} } } }
 *
 * // Usage
 * dispatch(resetProductsLists());
 *
 * @returns {Function} Dispatch reset products lists state and entities action.
 */
const resetProductsLists =
  () =>
  (
    dispatch: ThunkDispatch<
      StoreState,
      unknown,
      ResetProductsListsStateAction | ResetProductsListsEntitiesAction
    >,
  ): void => {
    dispatch(resetProductsListsState());
    dispatch(resetProductsListsEntities());
  };

export default resetProductsLists;