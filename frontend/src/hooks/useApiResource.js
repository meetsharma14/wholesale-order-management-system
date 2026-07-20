import { useCallback, useEffect, useState } from "react";

import { getResource } from "../services/resourceService";

export default function useApiResource(resource) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadResource() {
      setLoading(true);
      setError("");

      try {
        const response = await getResource(resource);

        if (isMounted) {
          setData(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.detail ||
              err.message ||
              "Unable to load data from the backend."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadResource();

    return () => {
      isMounted = false;
    };
  }, [resource, version]);

  return { data, loading, error, reload };
}
