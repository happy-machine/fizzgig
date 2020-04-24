export interface IUserTickerNotificationThresholds {
  [low: string]: string;
  high: string;
}

export interface IUserTicker {
  _id?: string;
  name: string;
  symbol: string;
  should_notify?: boolean;
  last_notified?: Date;
  notification_thresholds?: IUserTickerNotificationThresholds;
}

export type IUser = {
  name: string;
  email: string;
  _id: string;
  __v: string;
  tickers: IUserTicker[];
};

export type ITicker = {
  symbol: string;
  stockValue: number;
};
