interface PropsType {
  url: string;
  preview?: string;
  cls?: string;
}

export default function ProfilePreview({ url, preview, cls }: PropsType) {
  let imgUrl = "";
  if (url) {
    imgUrl = `https://imagedelivery.net/Xy_RhqCCpc7KDMYzTB509w/${url}/public`;
  } else {
    imgUrl = "/empty.png";
  }

  if (preview) {
    imgUrl = preview;
  }

  return <img src={imgUrl} className={cls} />;
}
