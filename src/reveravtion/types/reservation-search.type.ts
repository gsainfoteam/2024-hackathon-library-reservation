export type ReservationSearch = {
  normalRoomGroupDates: [
    {
      id: number;
      FAC_NM: string;
      FLOOR: number;
      ROOM_GROUP: number;
      ROOM_ID: number;
      ROOM_NO: number;
      USE_YN: null;
      FROM_TIME: number;
      GROUP_NM: string;
      TO_TIME: number;
      UPDATE_DT: number;
      UPDATE_ID: string;
    },
  ];
  /** 오늘 사용자가 예약한 시간 */
  infoCountDay: number;
  canAvailableRoomDates: unknown[];
  roomOther: {
    RES_HOUR: number;
    DEPT_NM: string;
    GROUP_NM: string;
    REMARK: string;
  }[];
  notAvailableRoomDates: unknown[];
  /** 예약 범위 내에 사용자가 예약한 시간 */
  infoCount: number;
  room: {
    RES_ID: number;
    RES_HOUR: number;
  }[];
};
