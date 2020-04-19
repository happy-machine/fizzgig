const mockauthBody = {
  password: "blajdedededede",
  name: "some name",
  email: "test@gmail.com",
};

const mockBadAuthBody = {
  password: "blaj",
  name: "some name",
  email: "test@gmail.com",
};

const mockBadAuthBody2 = {
  password: "blajka",
  email: "test@gmail.com",
};

const mockBadAuthBody3 = {
  password: "blajka",
  name: "some name",
  email: 123684762764,
};

const mockAuthEvent = {
  type: "TOKEN",
  methodArn:
    "arn:aws:execute-api:us-east-1:264718556819:jx9su37jv4/dev/GET/getUser",
  authorizationToken: `Bearer ${process.env.TEST_TOKEN}`,
};

const mockBadAuthEvent = {
  type: "TOKEN",
  methodArn:
    "arn:aws:execute-api:us-east-1:342818556819:jx9su37jv4/dev/GET/getUser",
  authorizationToken: `Bearer ${process.env.TEST_TOKEN.split("")
    .reverse()
    .join("")}`,
};

module.exports = {
  mockauthBody,
  mockBadAuthBody,
  mockBadAuthBody2,
  mockBadAuthBody3,
  mockAuthEvent,
  mockBadAuthEvent,
};
