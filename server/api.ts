import { Router, Request, Response } from 'express';
import { CreateRoom, JoinRoom } from './main';

const router: Router = Router();

router.post('/join-room', (req: Request, res: Response) => {
  let room: string = req.body.room;
  let user: string = req.body.user;
  let result: boolean = JoinRoom(room, user);
  if (result) res.send("Joined room successfuly");
  else res.send("Failed to join room: room not found.")

});

router.post('/create-room', (req: Request, res: Response) => {
  let room: string = req.body.room;
  let user: string = req.body.user;
  let result: boolean = CreateRoom(room, user);
  if (result) res.send("Created room successfuly");
  else res.send("Failed to create room: room already exists.")
  // NOTE: Will need to generate IP for multicast here
});

export default router;