import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';

@Injectable()
export class RestaurantService extends AppHttpService {

  builder(resource: string = '') {
    return super.builder('restaurants' + resource);
  }

  getCep(cep: number) {
    let url = 'https://viacep.com.br/ws/' + cep + '/json/';
    return this.request().get(url)
      .toPromise()
      .then((res) => {
        return res.json() || {};
      });
  }

  upload(url: string, data: object) {
    let observable = this.http.post(this.url + '/' + url, data, { headers: this.header });
    return this.toPromise(observable);
  }

}
