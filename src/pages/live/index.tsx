import BottomMenu from "@/components/bottomMenu";
import HeaderMenu from "@/components/headerMenu";
import { Live } from "@prisma/client";
import useSWR from "swr";

interface LivesResponse {
  ok: boolean;
  lives: Live[];
}

export default function Lives() {
  const { data } = useSWR<LivesResponse>(`/api/live`);
  return (
    <div>
      <HeaderMenu />
      <div className="devide-y-2 space-y-4">
        {data?.lives?.map((live) => (
          <div key={live?.id}>
            <div className="relative w-full rounded-md shadow-sm aspect-video overflow-hidden">
              <img
                src={`https://${process.env.NEXT_PUBLIC_CF_CUSTOMER_CODE}/${live?.cloudflareId}/thumbnails/thumbnail.jpg?time=1s&height=270`}
              />
            </div>
            <h3 className="text-gray-700 text-lg mt-2">{live?.title}</h3>
          </div>
        ))}
      </div>
      <BottomMenu />
    </div>
  );
}
