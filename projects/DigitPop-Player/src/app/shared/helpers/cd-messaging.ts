export const CrossDomainMessaging = {
  isIOS: () => {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  },

  getVersion: () => {
    const agent = window.navigator.userAgent;
    const start = agent.indexOf('OS ');
    if ((agent.indexOf('iPhone') > -1 || agent.indexOf('iPad') > -1) && start > -1) {
      return window.Number(agent.substr(start + 3, 3).replace('_', '.'));
    }
    return 0;
  },

  isSafari: () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
};
