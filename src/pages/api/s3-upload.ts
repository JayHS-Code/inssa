// export { APIRoute as default } from "next-s3-upload";

import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  async key(req, filename) {
    const { userId, s3FolderId } = req.body;
    return `${userId}/${s3FolderId}/${filename}`;
  },
});
