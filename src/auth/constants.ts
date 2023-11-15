export const expires_in = 86400;

export const jwtConstants = {
  secret:
    'eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiQXJ0aHVyIE1vcmdhbiIsImlhdCI6MTY2NDI1MDMyMSwiZXhwIjoxNjY0MzM2NzIxfQ',
  signOptions: { expiresIn: `${expires_in}s` },
};
