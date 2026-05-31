import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Opens a page's guide automatically when the URL carries `?guide=1`.
 *
 * The support chat navigates to `${route}?guide=1`; each page just drops
 * `useAutoGuide(guide.openGuide)` to react to it. This solves the timing
 * problem (the target page mounts after navigation) without any global state:
 * the page opens its own guide when it mounts.
 */
export function useAutoGuide(openGuide: () => void): void {
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    if (params.get('guide') !== '1') {
      return;
    }

    openGuide();

    // Clean the param so a refresh or back-navigation doesn't re-open it.
    const next = new URLSearchParams(params);
    next.delete('guide');
    setParams(next, { replace: true });
    // Run only on mount; the chat always navigates to a fresh page instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useAutoGuide;
