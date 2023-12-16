import { Live } from "@prisma/client";
import useSWR from "swr";

interface LivesResponse {
  ok: boolean;
  lives: Live[];
}

export default function Lives() {
  const { data } = useSWR<LivesResponse>(`/api/live`);
  console.log(data);
  console.log(process.env.CF_CUSTOMER_CODE);
  return (
    <div className="devide-y-2 space-y-4">
      {data?.lives?.map((live) => (
        <div key={live?.id}>
          <div className="relative w-full rounded-md shadow-sm aspect-video overflow-hidden">
            <img
              src={`https://${process.env.CF_CUSTOMER_CODE}/${live?.cloudflareId}/thumbnails/thumbnail.jpg?time=1s&height=270`}
            />
          </div>
          <h3 className="text-gray-700 text-lg mt-2">{live?.title}</h3>
        </div>
      ))}
    </div>
  );
}
