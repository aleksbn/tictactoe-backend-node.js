import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import _ from "lodash";
import validateObjectId from "../middleware/validateObjectId";
import auth from "../middleware/auth";
import { generateAuthToken } from "../helpers/auth-helper";
import { UserModel, validate } from "../models/mongoose/userModel";
const router = express.Router();

router.get("/", auth, async (req: any, res: Response) => {
  let currentUser = await UserModel.findById(req.user._id);
  res.send(currentUser);
});

router.get("/:id", [validateObjectId], async (req: any, res: Response) => {
  let user = await UserModel.findById(req.params.id);
  res.send(user?.nickname || "unknown");
});

router.put("/", auth, async (req: any, res: Response) => {
  const id = req.body._id;
  delete req.body._id;
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);
  const editUser = req.body;

  const salt = await bcrypt.genSalt(10);
  editUser.password = await bcrypt.hash(editUser.password, salt);
  const user = await UserModel.findByIdAndUpdate(id, {
    email: editUser.email,
    password: editUser.password,
    nickname: editUser.nickname,
  }).lean();

  const token = generateAuthToken(id);
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "nickname", "email"]));
});

router.post("/", async (req: any, res: Response) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  let user = await UserModel.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("That email has already been registered.");

  user = new UserModel(_.pick(req.body, ["nickname", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = generateAuthToken(user._id.toString());

  await user.save();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "nickname", "email"]));
});

export default router;
