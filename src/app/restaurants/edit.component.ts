import { Component, OnInit } from '@angular/core';
//import { MdProgressSpinnerModule } from '@angular/material';
import * as jQuery from 'jquery';

import { RestaurantService } from './../services/restaurant.service';
import { AuthService } from './../services/auth.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html'
})

export class EditComponent implements OnInit {

    restaurant: any = {};
    photos: any[] = [];
    address: any = {};
    dragging: boolean = false;
    upload_status: string = 'not';
    send_foto: string = 'Enviar';
    restaurantPhoto: any = null;


    constructor(
        protected authService: AuthService,
        protected restaurantService: RestaurantService
    ) { }

    ngOnInit() {
        this.authService.getUser()
            .then((res) => {
                let id = res.restaurant.id;
                this.restaurantService.builder()
                    .view(id)
                    .then((res) => {
                        this.restaurant = res;
                        this.address = res.address || {};
                        window.Materialize.updateTextFields();

                        return this.restaurantService.builder('/' + this.restaurant.id + '/photos')
                            .list();
                    })
                    .then((res) => {
                        this.photos = res;
                        this.materialboxStart();
                    });
            });
    }

    upload(e) {
        e.preventDefault();
        let image_url: any = null;

        if (e.dataTransfer) {
            image_url = e.dataTransfer.files[0];
        } else {
            image_url = e.target.files[0];
        }

        this.dragging = true;
        this.upload_status = 'sending';

        let formData = new FormData();
        formData.append('photo', image_url);

        this.restaurantService.builder()
            .upload(this.restaurant.id + '/upload', formData)
            .then(() => {
                this.upload_status = 'success';
            })
            .catch(() => {
                this.upload_status = 'error'
            })

    }

    dragover(e) {
        e.stopPropagation();
        e.preventDefault();
        this.dragging = true;
    }

    searchCep() {
        let cep = this.address.cep || null;

        if (cep && cep.length === 8) {
            this.restaurantService.getCep(cep)
                .then((res) => {
                    this.address = {
                        cep: cep,
                        address: res.logradouro,
                        city: res.localidade,
                        neighborhood: res.bairro,
                        state: res.uf
                    }
                })
        }
    }

    save(e) {
        e.preventDefault();

        // if (this.restaurant.name === null) {
        //     window.Materialize.toast('Informe o nome do restaurante', 3000, 'red');
        //     return;
        // }
        // if (this.restaurant.description === null) {
        //     window.Materialize.toast('Informe a descrição do restaurante', 3000, 'red');
        //     return;
        // }
        // if (this.address.cep === null || this.address.cep == 0) {
        //     window.Materialize.toast('Informe o cep', 3000, 'red');
        //     return;
        // }
        // if (this.address.address === null) {
        //     window.Materialize.toast('Informe o endereço', 3000, 'red');
        //     return;
        // }
        // if (this.address.number === null || this.address.number == 0) {
        //     window.Materialize.toast('Informe o número', 3000, 'red');
        //     return;
        // }
        // if (this.address.city === null) {
        //     window.Materialize.toast('Informe a cidade', 3000, 'red');
        //     return;
        // }

        this.restaurantService.builder()
            .update(this.restaurant.id, this.restaurant)
            .then(() => {
                return this.restaurantService.builder('/' + this.restaurant.id + '/address')
                    .insert(this.address);
            })
            .then(() => {
                window.Materialize.toast('Dados atualizados com sucesso!!!', 3000, 'rounded');
            })
    }

    preparePhoto(e) {
        let image_url = e.target.files[0];
        let formData = new FormData();
        formData.append('restaurant_id', this.restaurant.id);
        formData.append('url', image_url);
        this.restaurantPhoto = formData;
    }

    sendPhoto() {
        if (this.restaurantPhoto === null) {
            window.Materialize.toast('Selecione uma imagem antes', 3000, 'red');
            return;
        }

        this.send_foto = 'Enviando....';

        this.restaurantService.builder()
            .upload('photos', this.restaurantPhoto)
            .then(() => {
                this.send_foto = 'Enviar';
                window.Materialize.toast('Foto cadastrada com sucesso!!!', 3000, 'rounded');

                return this.restaurantService.builder('/' + this.restaurant.id + '/photos')
                    .list();
            }).then((res) => {
                this.photos = res;
                this.materialboxStart();
            });
    }

    deletePhoto(photo) {
        this.restaurantService.builder('/photos')
            .delete(photo.id)
            .then(() => {
                return this.restaurantService.builder('/' + this.restaurant.id + '/photos')
                    .list();
            }).then((res) => {
                this.photos = res;
                this.materialboxStart();
            });
    }

    private materialboxStart() {
        setTimeout(() => jQuery('.materialboxed').materialbox(), 1000);
    }

}
