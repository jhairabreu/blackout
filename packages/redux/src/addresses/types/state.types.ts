import type {
  Address,
  Prediction,
  PredictionDetails,
} from '@farfetch/blackout-client/addresses/types';
import type { CombinedState } from 'redux';
import type { Error } from '@farfetch/blackout-client/types';
import type {
  Nullable,
  StateWithoutResult,
  StateWithResult,
  StateWithResultArray,
} from '../../types';

export type AddressState = CombinedState<{
  error: Record<Address['id'], Error | null>;
  isLoading: Record<Address['id'], boolean>;
}>;

export type State = CombinedState<{
  error: Nullable<Error>;
  isLoading: boolean;
  result: string[] | null;
  predictions: StateWithResultArray<Prediction>;
  predictionDetails: StateWithResult<PredictionDetails>;
  addresses: StateWithoutResult;
  address: AddressState;
  addressSchema: StateWithoutResult;
  defaultAddressDetails: StateWithResult<Address>;
}>;