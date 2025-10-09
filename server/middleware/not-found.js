import { StatusCodes } from "http-status-codes";
export default function notFound(req, res) {
  res.status(StatusCodes.NOT_FOUND).send("Route does not exist");
}
