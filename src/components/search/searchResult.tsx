import { User } from "@prisma/client";
import { useRouter } from "next/router";
import ProfilePreview from "../profile/profilePreview";

interface SearchProps {
  search: User;
}

export default function SearchResult({ search }: SearchProps) {
  const router = useRouter();
  return (
    <div>
      <div
        className="mt-6 p-3 flex items-center gap-3 rounded-sm cursor-pointer hover:bg-black/20"
        onClick={() => router.push(`/profile/${search.nickname}`)}
      >
        <ProfilePreview url={search.avatar} cls={"w-12 h-12 rounded-full"} />
        <div>nickname</div>
      </div>
    </div>
  );
}
