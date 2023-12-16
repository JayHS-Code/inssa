import twilio from "twilio";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import smtpTransport from "@/libs/server/email";
import { withApiSession } from "@/libs/server/withSession";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

/** phone, email 입력 시 token 생성 및 user, token DB 저장. token 입력 시 user 를 찾아 로그인 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email, token } = req.body;
  console.log(phone, token);
  const payload = Math.floor(100000 + Math.random() * 9000000) + "";
  if (token) {
    const exists = await client.token.findUnique({
      where: {
        payload: token,
      },
    });

    if (!exists) return res.status(404).json({ invalidToken: true });
    console.log(exists);

    req.session.user = {
      id: exists.userId,
    };

    await req.session.save();

    await client.token.deleteMany({
      where: {
        userId: exists.userId,
      },
    });

    return res.json({ tokenAccess: true });
  }
  const user = await client.user.upsert({
    where: {
      ...(phone ? { phone } : { email }),
    },
    create: {
      nickname: "anonymous",
      ...(phone ? { phone } : { email }),
    },
    update: {},
  });
  await client.token.create({
    data: {
      payload,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  if (phone) {
    /*
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.MY_PHONE!,
      from: process.env.SEND_NUMBER,
      body: `inssa 인증번호를 입력해주세요. 인증번호: [${payload}]`,
    });
    console.log(message);
    */
  }

  if (email) {
    /*
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Nomad inssa Authentication Email",
      text: `Authentication Code : ${payload}`,
    };
    const result = await smtpTransport.sendMail(
      mailOptions,
      (error, responses) => {
        if (error) {
          console.log(error);
          return null;
        } else {
          console.log(responses);
          return null;
        }
      }
    );
    smtpTransport.close();
    console.log(result);
    */
  }
  return res.status(200).json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
