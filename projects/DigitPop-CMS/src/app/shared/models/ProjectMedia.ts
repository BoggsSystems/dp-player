export class ProjectMedia {
  _id: string;
  name: string;
  createdAt: Date;
  category: string;
  media: {
    url: string; duration: number | string;
  };
  thumbnail: {
    url: string;
  };
}
