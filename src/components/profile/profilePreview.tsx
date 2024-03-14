interface PropsType {
  url: string | null | undefined;
  preview?: string;
  cls?: string;
}

export default function ProfilePreview({ url, preview, cls }: PropsType) {
  let imgUrl = "";
  if (url) {
    imgUrl = url;
  } else {
    imgUrl = "/empty.png";
  }

  if (preview) {
    imgUrl = preview;
  }

  return <img src={imgUrl} className={cls} />;
}
