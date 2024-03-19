import MainMenu from "@/components/common/mainMenu";
import ProfilePreview from "@/components/profile/profilePreview";
import SearchResult from "@/components/search/searchResult";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

interface SearchResponse {
  ok: boolean;
  result: User[];
}

export default function Search() {
  const router = useRouter();
  const { data } = useSWR<SearchResponse>(
    `/api/search?keyword=${router?.query?.keyword}`
  );
  console.log(data);
  return (
    <div>
      <MainMenu />
      {data?.result.map((search, idx) => (
        <SearchResult key={idx} search={search} />
      ))}
    </div>
  );
}
