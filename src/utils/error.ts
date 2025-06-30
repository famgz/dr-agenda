export function getFirstErrorMessage(error: any): string {
  let fieldErrors;
  let formErrors;
  if (error.error?.validationErrors) {
    fieldErrors = Object.values(
      error.error.validationErrors.fieldErrors,
    ).flat();
    formErrors = error.error.validationErrors.formErrors;
  }
  return fieldErrors?.[0] ?? formErrors?.[0] ?? error.error.serverError ?? '';
}
