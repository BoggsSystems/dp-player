import {Router} from '@angular/router';

export const Cache = {
  createCache: (data: any, key: string = 'my-projects') => {
    sessionStorage.setItem(key, data);
  },

  createProjectDetails: () => {

  },

  invokeCache: (key: string = 'my-projects') => {
    sessionStorage.removeItem(key);
  },

  exitTrial: (router: Router) => {
    localStorage.removeItem('currentuser');
    localStorage.removeItem('XchaneCurrentUser');
    localStorage.removeItem('currentrole');
    router.navigate(['/']).then(r => {
      return;
    });
  },
};
