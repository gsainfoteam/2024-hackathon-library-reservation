export type ReservationInfo = {
  notAvailableRoomDays: unknown[];
  infoCount: number;
  facility: [
    {
      ROOM_ID: number;
      FLOOR: 1 | 2 | 3 | 4;
      FAC_NM: string;
      ROOM_NO: number;
      ROOM_GROUP: number;
    },
  ];
  info: [
    {
      USER_ID: string;
      USER_NM: string;
      KOREAN_NM: string;
      DEPARTMENT_NM: string;
      FAC_DUR1: number;
      FAC_DUR2: number;
      FAC_DUR3: number;
      FAC_DUR4: number;
      FAC_DUR5: number;
      DATE_START: string;
      DATE_END: string;
      MONTH: number;
    },
  ];
};
