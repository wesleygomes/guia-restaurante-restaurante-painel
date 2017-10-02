import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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
    update_restaurante: string = 'Salvar';
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

    save(frm: FormControl, e) {
        e.preventDefault();
        
        this.update_restaurante = 'Salvando...';

        this.restaurantService.builder()
            .update(this.restaurant.id, this.restaurant)
            .then(() => {
                return this.restaurantService.builder('/' + this.restaurant.id + '/address')
                    .insert(this.address);
            })
            .then(() => {
                window.Materialize.toast('Dados atualizados com sucesso!!!', 3000, 'rounded');
                this.update_restaurante = 'Salvar';
            });
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
                window.Materialize.toast('Foto excluida com sucesso!!!', 3000, 'rounded');
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
