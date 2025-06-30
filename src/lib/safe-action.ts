import { getSessionUserElseThrow } from '@/actions/session';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

export class ClinicOwnershipError extends Error {}

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleServerError(e, utils) {
    // const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;
    if (e instanceof ClinicOwnershipError) {
      return 'Clínica não pertence ao usuário';
    }
    console.error(e);
    return e.message;
  },
  defaultValidationErrorsShape: 'flattened',
}).use(async ({ next, clientInput, metadata }) => {
  const startTime = performance.now();
  const result = await next();
  const endTime = performance.now();
  const results = {
    metadata,
    clientInput,
    result,
    duration: `${endTime - startTime} ms`,
  };
  console.log(
    `[LOGGING ACTION MIDDLEWARE] ${new Date().toISOString()}`,
    results,
  );
  return result;
});

export const authActionClient = actionClient.use(async ({ next, metadata }) => {
  const user = await getSessionUserElseThrow();
  return next({ ctx: { user } });
});
