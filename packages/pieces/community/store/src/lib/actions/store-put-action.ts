import {
  createAction,
  Property,
  Validators,
} from '@activepieces/pieces-framework';
import { common, getScopeAndKey } from './common';

export const storagePutAction = createAction({
  name: 'put',
  displayName: 'Put',
  description: 'Put values in storage',
  errorHandlingOptions: {
    continueOnFailure: {
      hide: true,
    },
    retryOnFailure: {
      hide: true,
    },
  },

  props: {
    values: Property.Object({
      displayName: 'Values',
      required: true,
      validators: [Validators.maxKeyLength(128)],
    }),
    store_scope: common.store_scope,
  },

  async run(context) {
    const storedValues: Record<string, unknown> = {};
    for (const [rawKey, value] of Object.entries(context.propsValue['values'])) {
      if (rawKey.length === 0 && !value) {
        // Nothing to see here
        continue
      }

      const { key, scope } = getScopeAndKey({
        runId: context.run.id,
        key: rawKey,
        scope: context.propsValue.store_scope,
      });
      storedValues[rawKey] = await context.store.put(key, value, scope);
    }
    return storedValues;
  },
});
