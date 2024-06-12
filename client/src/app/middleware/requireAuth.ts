import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import supabase from "../lib/supabaseClient";

const requireAuth =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    return handler(req, res);
  };

export default requireAuth;
