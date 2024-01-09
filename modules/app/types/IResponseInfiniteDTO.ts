export interface IResponseInfiniteDTO<T> {
  total: number;
  data: T[];
  nextCursor?: number;
  prevCursor?: number;
}
