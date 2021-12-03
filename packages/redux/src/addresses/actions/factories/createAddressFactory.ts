import {
  CREATE_ADDRESS_FAILURE,
  CREATE_ADDRESS_REQUEST,
  CREATE_ADDRESS_SUCCESS,
} from '../../actionTypes';
import { normalize } from 'normalizr';
import addressesSchema from '../../../entities/schemas/addresses';
import type {
  Address,
  PostAddress,
  User,
} from '@farfetch/blackout-client/addresses/types';
import type { Config } from '@farfetch/blackout-client/types';
import type { CreateAddressAction } from '../../types';
import type { Dispatch } from 'redux';

/**
 * @callback CreateAddressThunkFactory
 * @param {number} userId - Identifier of the user.
 * @param {object} data - Object containing the address information.
 * @param {object} [config] - Custom configurations to send to the client
 * instance (axios).
 *
 * @returns {Function} Thunk to be dispatched to the redux store.
 */

/**
 * Responsible for creating an address for the current user.
 *
 * @function doCreateAddress
 * @memberof module:addresses/actions/factories
 *
 * @param {Function} postAddress - PostAddress client.
 *
 * @returns {CreateAddressThunkFactory} Thunk factory.
 */
const createAddressFactory =
  (postAddress: PostAddress) =>
  (userId: User['id'], data: Address, config?: Config) =>
  async (dispatch: Dispatch<CreateAddressAction>): Promise<Address> => {
    dispatch({
      type: CREATE_ADDRESS_REQUEST,
    });

    try {
      const result = await postAddress({ userId }, data, config);

      dispatch({
        meta: { addressId: result.id },
        payload: normalize(result, addressesSchema),
        type: CREATE_ADDRESS_SUCCESS,
      });

      return result;
    } catch (error) {
      dispatch({
        payload: { error },
        type: CREATE_ADDRESS_FAILURE,
      });

      throw error;
    }
  };

export default createAddressFactory;
