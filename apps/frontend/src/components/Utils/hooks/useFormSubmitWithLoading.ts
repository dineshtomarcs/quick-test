import { useState, useCallback, useEffect } from "react";

import { FormikHelpers } from "formik";

let isMounted = true;
export const useFormSubmitWithLoading = <T>(
  onSubmit?: (values: T, formikHelpers?: FormikHelpers<T>) => void
): {
  onSubmitHandler: (
    values: T,
    formikHelpers?: FormikHelpers<T>
  ) => Promise<void>;
  loading: boolean;
} => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmitHandler = useCallback(
    async (values: T, formikHelpers: FormikHelpers<T> | undefined) => {
      setLoading(true);
      if (typeof onSubmit === "function") {
        await onSubmit(values, formikHelpers);
      }
      if (isMounted) {
        setLoading(false);
      }
    },
    [onSubmit]
  );

  return { onSubmitHandler, loading };
};
