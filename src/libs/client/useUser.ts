import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function useUser() {
  const { data, error } = useSWR("/api/users/profile/myProfile");
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/account/signIn");
    }
  }, [data, router]);
  /*
  const [user, setUser] = useState();
  useEffect(() => {
    fetch("/api/users/myProfile")
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) {
          return router.replace("/account/signIn");
        }
        setUser(data.profile);
      });
  }, [router]);
  */
  return { user: data?.profile, isLoading: !data && !error };
}
