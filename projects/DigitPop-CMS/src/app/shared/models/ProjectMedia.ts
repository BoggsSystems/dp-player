export class ProjectMedia {
  _id: string;
  name: string;
  media: {
    url: string; duration: number;
  };
  thumbnail: {
    url: string;
  };
}
