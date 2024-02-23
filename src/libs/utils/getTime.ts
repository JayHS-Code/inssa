type dateType = {
  dateTime: Date;
};

export const getTime = ({ dateTime }: dateType) => {
  const date = new Date(dateTime);
  let hours = date.getHours();
  const minutes = date.getMinutes();

  if (hours < 12) {
    return `오전 ${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  } else {
    hours = hours % 12 === 0 ? 1 : hours % 12;

    return `오후 ${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  }
};
