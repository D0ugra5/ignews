import { NextApiRequest, NextApiResponse } from "next";

export const helloworld = async (req: NextApiRequest, res: NextApiResponse) => {
  res.json({
    message: "Hello World!",
  });
};
