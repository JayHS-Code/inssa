interface PropsType {
  url: string;
  preview?: string;
  cls?: string;
}

// https://imagedelivery.net/Xy_RhqCCpc7KDMYzTB509w/<image_id>/<variant_name>
// https://imagedelivery.net/Xy_RhqCCpc7KDMYzTB509w/${url}/public

export default function Img({ url, preview, cls }: PropsType) {
  let imgUrl = "";
  if (url) {
    imgUrl = `https://imagedelivery.net/Xy_RhqCCpc7KDMYzTB509w/${url}/public`;
  } else {
    imgUrl = "empty.png";
  }

  if (preview) {
    imgUrl = preview;
  }

  return <img src={imgUrl} className={cls} />;
}
