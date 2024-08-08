import { Router, Request, Response } from 'express';
import { CreateRoom, JoinRoom } from './udp';

const router: Router = Router();

router.get('/join-room', (req: Request, res: Response) => {
  let room: string = req.body.room;
  let user: string = req.body.user;
  let result: boolean = JoinRoom(room, user);
  if (result) res.send("Joined room successfuly");
  else res.send("Failed to join room: room not found.")
});

router.get('/create-room', (req: Request, res: Response) => {
  let room: string = req.body.room;
  let user: string = req.body.user;
  CreateRoom(room, user);
  res.send('Created Room');
});

export default router;