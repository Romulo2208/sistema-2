import {environment} from '../environments/environment'

export const config= {
   // URL_BACKEND: "http://127.0.0.1:3001",
    URL_BACKEND: environment.URL_BACKEND, //utilizar arquivo environment importado acima
    REPOSITORIES: {
        default: '/files',
        nucleo: '/nucleo-files'
      },
    KEY_LOCAL_STORAGE:"token-profesp",
    KEY_USER:"user",
    KEY_EXPIRES_IN:"expires_in",
    KEY_MODULES:"modules"
}