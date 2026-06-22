import { useState, useEffect, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: unknown[] = [],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const fnRef = useRef(asyncFn);

  fnRef.current = asyncFn;

  const execute = useCallback(() => {
    setLoading(true);
    setError(null);
    fnRef
      .current()
      .then((result) => {
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
          setLoading(false);
        }
      });
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    execute();
    return () => {
      mountedRef.current = false;
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

export function useAsyncAction<T extends (...args: never[]) => Promise<unknown>>(
  action: T,
): [(...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>, boolean, string | null] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      setLoading(true);
      setError(null);
      try {
        const result = await action(...args);
        setLoading(false);
        return result as Awaited<ReturnType<T>>;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong';
        setError(msg);
        setLoading(false);
        throw err;
      }
    },
    [action],
  );

  return [execute, loading, error];
}
