export class ProjectMedia {
  count: number;
  _id: string;
  campaignId: string;
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
