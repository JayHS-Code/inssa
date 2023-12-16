import { useState } from "react";

type UseFetchResult = [
  (data: any) => void,
  { loading: boolean; data: undefined | any; error: undefined | any }
];

export default function useFetch(url: string): UseFetchResult {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<undefined | any>(undefined);
  const [error, setError] = useState<undefined | any>(undefined);
  function useApi(data: any) {
    setLoading(true);
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json().catch(() => {}))
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }
  return [useApi, { loading, data, error }];
}
