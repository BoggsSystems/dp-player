export class ProjectMedia {
  count: number;
  _id: string;
  campaignId: string;
  name: string;
  createdAt: Date;
  category: string;
  categoryId: string;
  media: {
    url: string; duration: number | string;
  };
  thumbnail: {
    url: string;
  };
  watched: boolean;
}
