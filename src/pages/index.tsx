import BottomMenu from "@/components/bottomMenu";
import HeaderMenu from "@/components/headerMenu";
import Item from "@/components/item";
import useUser from "@/libs/client/useUser";
import useSWR from "swr";

export default function Home() {
  useUser();
  const { data } = useSWR("/api/post");
  console.log(data);
  return (
    <div>
      <HeaderMenu />
      <Item />
      <BottomMenu />
    </div>
  );
}
