import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import * as jQuery from 'jquery';

import { DishesService } from "../../services/dishes.service";

@Component({
    selector: 'app-edit-dishe',
    templateUrl: './edit-dishe.component.html'
})

export class EditDisheComponent implements OnInit {

    dish: any = {};
    restaurant_id: string;
    update_prato: string = 'Salvar';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dishesService: DishesService
    ) { }

    ngOnInit() {
        jQuery('.modal').modal({
            complete: () => this.router.navigate(['/dishes'])
        });
        jQuery('.modal').modal('open');

        this.route.params.subscribe((params) => {
            this.dishesService.builder()
                .view(params['id'])
                .then((rs) => {
                    this.dish = rs;
                    window.Materialize.updateTextFields();
                })
        });

    }

    addFile(e) {
        e.preventDefault();
        this.dish.photo = e.target.files[0];
    }

    save(e, frm: FormControl) {
        e.preventDefault();
        let formData = this.dish;

        if (this.dish.photo) {
            let formData = new FormData;
            formData.append('photo', this.dish.photo);
            formData.append('name', this.dish.name);
            formData.append('description', this.dish.description);
            formData.append('price', this.dish.price);
            formData.append('restaurant_id', this.dish.restaurant_id);
        }

        this.update_prato = 'Salvando...';

        this.dishesService.builder()
            .update(this.dish.id, formData)
            .then(() => {
                this.update_prato = 'Salvar';
                this.dishesService.eventEmiter.emit();
                jQuery('.modal').modal("close");
                window.Materialize.toast('Salvo com sucesso!', 3000, 'rounded');
            });
    }

}
