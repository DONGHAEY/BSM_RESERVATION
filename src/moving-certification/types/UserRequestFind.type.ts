import { isAccType } from './isAcc.type';

export type UserRequestFindType =
  | {
      // 페이지별로 요청을 받을 때
      userCode: number;
      isAcc?: isAccType | null;
      page: number;
    }
  | {
      // WATING인것을 모두 다 요청할 때,
      userCode: number;
      isAcc: isAccType.WATING;
      page?: number;
    };
