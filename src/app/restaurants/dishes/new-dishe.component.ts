import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import * as jQuery from 'jquery';

import { AuthService } from './../../services/auth.service';
import { DishesService } from "../../services/dishes.service";


@Component({
    selector: 'app-new-dishe',
    templateUrl: './new-dishe.component.html'
})

export class NewDisheComponent implements OnInit {

    dish: any = {};
    restaurant_id: string;
    salvar_prato: string = 'Salvar';

    constructor(
        private router: Router,
        protected authService: AuthService,
        private dishesService: DishesService
    ) { }

    ngOnInit() {
        jQuery('.modal').modal({
            complete: () => this.router.navigate(['/dishes'])
        });
        jQuery('.modal').modal('open');

        this.authService.getUser()
            .then((res) => {
                this.restaurant_id = res.restaurant.id;
            });
    }

    addFile(e) {
        e.preventDefault();
        this.dish.photo = e.target.files[0];
    }

    save(e, frm: FormControl) {
        e.preventDefault();

        if (!this.dish.photo) {
            window.Materialize.toast('Selecione uma imagem antes', 3000, 'red');
            return;
        }
        if (!this.dish.name) {
            window.Materialize.toast('Informe o nome do prato', 3000, 'red');
            return;
        }
        if (!this.dish.description) {
            window.Materialize.toast('Informe a descrição do prato', 3000, 'red');
            return;
        }
        if (!this.dish.price) {
            window.Materialize.toast('Informe preço do prato', 3000, 'red');
            return;
        }

        let formData = new FormData;
        formData.append('photo', this.dish.photo);
        formData.append('name', this.dish.name);
        formData.append('description', this.dish.description);
        formData.append('price', this.dish.price);
        formData.append('restaurant_id', this.restaurant_id);

        this.salvar_prato = "Salvando...";

        this.dishesService.builder()
            .insert(formData)
            .then(() => {
                this.salvar_prato = "Salvar";
                this.dishesService.eventEmiter.emit();
                jQuery('.modal').modal("close");
                window.Materialize.toast('Salvo com sucesso!', 3000, 'rounded');
            });
    }
}
