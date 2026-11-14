import { useCallback, useEffect, useRef, useState } from "react";
import useRequest from "./useRequest";

const useIsicCodes = (search, enabled) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(async (pageNumber, term) => {
    const id = ++requestId.current;
    loadingRef.current = true;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNumber });
      if (term) params.set("search", term);
      const res = await Request(`isic-codes?${params}`, HTTP_METHOD.GET);
      if (id !== requestId.current) return;

      const list = res?.data?.data ?? [];
      const meta = res?.data?.meta;

      setOptions((prev) =>
        pageNumber === 1
          ? list
          : [...prev, ...list.filter((n) => !prev.some((p) => p.id === n.id))],
      );
      setPage(pageNumber);
      setHasMore(meta ? meta.current_page < meta.last_page : list.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      if (id === requestId.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    setOptions([]);
    setPage(0);
    setHasMore(true);
    fetchPage(1, search);
  }, [search, enabled, fetchPage]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore || page === 0) return;
    fetchPage(page + 1, search);
  }, [fetchPage, hasMore, page, search]);

  return { options, loading, hasMore, loadMore };
};

export default useIsicCodes;
