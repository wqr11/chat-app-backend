import { Response, Router } from "express";

const router = Router();

router.route("/").get((_, res: Response) => {
  res.status(200).send("pong :)");
});

export { router as pingRoutes };
