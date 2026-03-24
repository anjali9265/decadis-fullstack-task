import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


// end points

type Action = "create-item" | "delete-item" | "view-item" | "move-item";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  actions: Action[];
}


let users: User[] = [];
let nextId = 1;



app.post("/user", (req: Request, res: Response) => {
  const { firstname, lastname, email, actions } = req.body;

  if (!firstname || !lastname || !email) {
    res.status(400).json({ error: "firstname, lastname and email are required" });
    return;
  }

  const newUser: User = {
    id: nextId++,
    firstname,
    lastname,
    email,
    actions: actions ?? [],
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// get all user
app.get("/user", (req: Request, res: Response) => {
  res.json(users);
});

// get user
app.get("/user/:id", (req: Request, res: Response) => {
  const user = users.find((u) => u.id === Number(req.params.id));

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

// post user
app.put("/user/:id", (req: Request, res: Response) => {
  const index = users.findIndex((u) => u.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const { firstname, lastname, email, actions } = req.body;

  users[index] = {
    ...users[index],
    ...(firstname && { firstname }),
    ...(lastname && { lastname }),
    ...(email && { email }),
    ...(actions && { actions }),
  };

  res.json(users[index]);
});

// delete user
app.delete("/user/:id", (req: Request, res: Response) => {
  const index = users.findIndex((u) => u.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  users.splice(index, 1);
  res.status(204).send();
});

app.post("/action", (req: Request, res: Response) => {
  const { userId, action } = req.body;

  const user = users.find((u) => u.id === Number(userId));

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (!user.actions.includes(action)) {
    res.status(401).json({ error: `User is not allowed to execute "${action}"` });
    return;
  }

  res.status(200).json({ message: `Action "${action}" executed successfully` });
});
// ==========

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});