export class ProjectMedia {
  _id: string;
  name: string;
  category: string;
  media: {
    url: string; duration: number | string;
  };
  thumbnail: {
    url: string;
  };
}
