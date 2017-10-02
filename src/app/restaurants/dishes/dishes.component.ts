import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../services/auth.service';
import { DishesService } from "../../services/dishes.service";

@Component({
    selector: 'app-dishes',
    templateUrl: './dishes.component.html'
})

export class DishesComponent implements OnInit {

    dishes = {};

    constructor(
        protected authService: AuthService,
        private dishesService: DishesService
    ) { }

    ngOnInit() {
        this.authService.getUser()
            .then((res) => {
                let id = res.restaurant.id;
                let options = {
                    filters: [
                        {
                            restaurant_id: id
                        }
                    ]
                }
                this.dishesService.eventEmiter
                    .subscribe(() => {
                        this.dishesService.builder()
                            .list(options)
                            .then((rs) => {
                                this.dishes = rs;
                            });
                    })
                this.dishesService.eventEmiter.emit();
            });
    }

    remove(id: number) {
        this.dishesService.builder()
            .delete(id)
            .then(() => {
                window.Materialize.toast('Prato excluido com sucesso!!!', 3000, 'rounded');
                this.dishesService.eventEmiter.emit();
            });
    }
}
