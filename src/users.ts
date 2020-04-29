const users: { id: string; name: string; room: string }[] = [];

export function addUser({ id, name, room }) {

  const userAlreadyExists = users.find(
    (user) => user.room === room && user.name === name
  );
  if (userAlreadyExists) return { error: "Username is already taken" };

  const user = { id, name, room };

  users.push(user);

  return { user };
}

export function remUser(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return -1;
}

export function getUser(id) {
  return users.find((user) => user.id === id);
}

export function getUsRm(room) {
  return users.filter((user) => user.room === room);
}

