import { User } from "@prisma/client";

type UserList = {
  myId: string;
  userList: User[];
};

export const chatProfileImg = ({ myId, userList }: UserList) => {
  const opponent = userList.filter((user) => Number(myId) !== Number(user?.id));

  if (opponent[0].avatar) {
    return opponent[0].avatar;
  } else {
    return "empty.png";
  }
};
