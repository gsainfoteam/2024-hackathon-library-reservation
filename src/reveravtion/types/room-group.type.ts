export const RoomGroup = {
  MediumGroupStudy: 3,
  SmallGroupStudy: 4,
  SmallCarrels: 5,
  LargeGroupStudy: 7,
  MultiMedia: 9,
} as const;
export type RoomGroupType = keyof typeof RoomGroup;
