import type { Song, Songs } from "../../app/utils/schemas";

export const songMock: Song = {
  number: "1",
  title: "Title",
};

export const songMock2: Song = {
  number: "2",
  title: "Title 2",
};

export const songsMock: Songs = [songMock, songMock2];
