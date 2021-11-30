import {
  CHARGE_FAILURE,
  CHARGE_REQUEST,
  CHARGE_SUCCESS,
} from '../../actionTypes';
import type { ChargesAction } from '../../types';
import type { Config } from '@farfetch/blackout-client/types';
import type { Dispatch } from 'redux';
import type {
  Intent,
  PostCharges,
  PostChargesData,
  PostChargesResponse,
} from '@farfetch/blackout-client/payments/types';

/**
 * @typedef {object} ChargeData
 * @property {object} chargeTransaction - Charge transaction data.
 */

/**
 * @callback ChargeThunkFactory
 * @param {string} id - Numeric identifier of the payment intent.
 * @param {ChargeData} data - Details for the charge.
 * @param {object} [config] - Custom configurations to send to the client
 * instance (axios).
 *
 * @returns {Function} Thunk to be dispatched to the redux store.
 */

/**
 * Method responsible for creating an intent charge.
 *
 * @function chargeFactory
 * @memberof module:payments/actions/factories
 *
 * @param {Function} postCharges - Post charges client.
 *
 * @returns {ChargeThunkFactory} Thunk factory.
 */

const postChargesFactory =
  (postCharges: PostCharges) =>
  (id: Intent['id'], data: PostChargesData, config?: Config) =>
  async (dispatch: Dispatch<ChargesAction>): Promise<PostChargesResponse> => {
    dispatch({
      type: CHARGE_REQUEST,
    });

    try {
      const result = await postCharges(id, data, config);
      // The chargeId is only accessible through the 'location' header.
      const chargeId = result?.headers['location']?.split('charges/')[1] || '';

      dispatch({
        payload: result.data,
        meta: { chargeId },
        type: CHARGE_SUCCESS,
      });

      return result;
    } catch (error) {
      dispatch({
        payload: { error },
        type: CHARGE_FAILURE,
      });

      throw error;
    }
  };

export default postChargesFactory;