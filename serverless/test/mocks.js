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

const mockUser1 = {
  _id: "5e9d65c1c5760d0008de181b",
  name: "test user 1",
  email: "test@gmail.com",
  password: "$2a$08$u52mRiJ10AX02v0kTAaDOO.ASMQQ2jxBo68AiVVfrVCu2d34hu.oi",
  tickers: [
    {
      notification_thresholds: {
        high: 1000000,
        low: 0,
      },
      _id: "5e9d67f612137700086634a1",
      name: "test stock 1",
      symbol: "IBM",
      should_notify: true,
      last_notified: "2020-02-20T09:14:30.858Z",
    },
    {
      notification_thresholds: {
        high: 0,
        low: 1000000,
      },
      _id: "5e9d67f612137700086634a2",
      name: "test stock 2",
      symbol: "TES2",
      should_notify: false,
      last_notified: "2020-04-20T09:14:30.858Z",
    },
  ],
  __v: 1,
};

const mockUser2 = {
  _id: "5e9d65c1c5760d0008de181b",
  name: "test user 1",
  email: "test@gmail.com",
  password: "$2a$08$u52mRiJ10AX02v0kTAaDOO.ASMQQ2jxBo68AiVVfrVCu2d34hu.oi",
  tickers: [
    {
      notification_thresholds: {
        high: 0,
        low: 1000000,
      },
      _id: "5e9d67f612137700086634a1",
      name: "test stock 1",
      symbol: "IBM",
      should_notify: true,
      last_notified: Date.now(),
    },
    {
      notification_thresholds: {
        high: 0,
        low: 1000000,
      },
      _id: "5e9d67f612137700086634a2",
      name: "test stock 2",
      symbol: "TES2",
      should_notify: false,
      last_notified: "2020-04-20T09:14:30.858Z",
    },
  ],
  __v: 1,
};

const mockUser3 = {
  _id: "5e9d65c1c5760d0008de181b",
  name: "test user 1",
  email: "test@gmail.com",
  password: "$2a$08$u52mRiJ10AX02v0kTAaDOO.ASMQQ2jxBo68AiVVfrVCu2d34hu.oi",
  tickers: [
    {
      notification_thresholds: {
        high: 1000000,
        low: 0,
      },
      _id: "5e9d67f612137700086634a1",
      name: "test stock 1",
      symbol: "IBM",
      should_notify: false,
      last_notified: "2020-02-20T09:14:30.858Z",
    },
    {
      notification_thresholds: {
        high: 0,
        low: 1000000,
      },
      _id: "5e9d67f612137700086634a2",
      name: "test stock 2",
      symbol: "TES2",
      should_notify: false,
      last_notified: "2020-04-20T09:14:30.858Z",
    },
  ],
  __v: 1,
};
const mockTicker1 = {
  "Global Quote": {
    "01. symbol": "IBM",
    "02. open": "119.3000",
    "03. high": "120.3900",
    "04. low": "117.9200",
    "05. price": "120.1200",
    "06. volume": "4944745",
    "07. latest trading day": "2020-04-17",
    "08. previous close": "115.7300",
    "09. change": "4.3900",
    "10. change percent": "3.7933%",
  },
};

const mockTicker2 = {
  "Global Quote": {
    "01. symbol": "IBM",
    "02. open": "119.3000",
    "03. high": "120.3900",
    "04. low": "117.9200",
    "05. price": "1000001",
    "06. volume": "4944745",
    "07. latest trading day": "2020-04-17",
    "08. previous close": "115.7300",
    "09. change": "4.3900",
    "10. change percent": "3.7933%",
  },
};

const mockTicker3 = {
  "Global Quote": {
    "01. symbol": "IBM",
    "02. open": "119.3000",
    "03. high": "120.3900",
    "04. low": "117.9200",
    "05. price": "1000001",
    "06. volume": "4944745",
    "07. latest trading day": "2020-04-17",
    "08. previous close": "115.7300",
    "09. change": "4.3900",
    "10. change percent": "3.7933%",
  },
};

const mockTicker4 = {
  "Global Quote": {
    "01. symbol": "BP.L",
    "02. open": "302.1500",
    "03. high": "308.2000",
    "04. low": "297.4500",
    "05. price": "297.9474",
    "06. volume": "11429194",
    "07. latest trading day": "2020-04-20",
    "08. previous close": "303.5500",
    "09. change": "-5.6026",
    "10. change percent": "-1.8457%",
  },
};

module.exports = {
  mockauthBody,
  mockBadAuthBody,
  mockBadAuthBody2,
  mockBadAuthBody3,
  mockAuthEvent,
  mockBadAuthEvent,
  mockUser1,
  mockUser2,
  mockUser3,
  mockTicker1,
  mockTicker2,
};
