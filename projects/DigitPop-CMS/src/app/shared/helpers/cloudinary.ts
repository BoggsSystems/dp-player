import {Project} from '../models/project';

export const Cloudinary = {
  resizeThumbnail: (projects: Project[]) => {
    projects.forEach((project: Project) => {
      if ('thumbnail' in project) {
        const url = project.thumbnail.url;
        const queryTerm = 'upload/';
        const queryLength = queryTerm.length;
        const uploadsIndex = url.indexOf(queryTerm);
        const paramsIndex = uploadsIndex + queryLength;
        const imgHeight = 50;
        const imgWidth = 50;
        const params = `c_fill,h_${imgHeight},w_${imgWidth}/`;
        project.thumbnail.url = url.substr(0, paramsIndex) + params + url.substr(paramsIndex);
      }
    });
    return projects;
  },
};
