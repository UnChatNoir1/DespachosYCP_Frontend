const authProvider = {
  login: ({ username, password }) => {
    const request = new Request('https://despachosycp-api.onrender.com/api/authenticate', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(auth => {
        localStorage.setItem('auth', JSON.stringify(auth));
        return Promise.resolve();
      })
      .catch(() => {
        return Promise.reject();
        //throw new Error('Network error')
      });
  },
  logout: () => {
    localStorage.removeItem('auth');
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem('auth') ? Promise.resolve() : Promise.reject(),
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getIdentity: () => {
    try {
      const { id, fullName, avatar } = JSON.parse(localStorage.getItem('auth'));
      return Promise.resolve({ id, fullName, avatar });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: () => {
    try {
      const { permissions } = JSON.parse(localStorage.getItem('auth'));
      /*console.log("Estos son los permisos: "+permissions);*/
      return Promise.resolve(permissions);    
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export default authProvider;
