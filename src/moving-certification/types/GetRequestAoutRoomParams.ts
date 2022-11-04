export type getRequestListAboutRoomParams =
  | {
      //날짜 별로 요청할 경우의 타입
      roomCode: number;
      startDate: Date;
      endDate: Date;
      page?: number | null;
    }
  | {
      // 페이지별로 요청할 경우의 타입
      roomCode: number;
      startDate?: Date | null;
      endDate?: Date | null;
      page: number | null;
    };
