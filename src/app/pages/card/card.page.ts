import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertButton, AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { User, Card } from 'src/app/interfaces/user';
import { WsApiService } from 'src/app/services/ws-api.service';
import { ComponentService } from 'src/app/services/component.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

  user: User;
  cards$: Observable<Card[]>;

  constructor(
    private storage: Storage,
    private ws: WsApiService,
    private modalCtrl: ModalController,
    private component: ComponentService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.storage.get('user').then(
      user => {
        this.user = user
      }
    )

    this.cards$ = this.ws.get<Card[]>(`/card/`)
  }

  async cardOptions(card) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            // Call a function to delete the card
            this.deleteCard(card.card_id);

          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    (await actionSheet).present();
  }


  addNewCard(){
    this.component.alertMessage('Add New Card', 'This feature is not available yet', 'danger')
  }

  deleteCard(card_id: number) {
    const button: AlertButton = {
      text: 'Delete',
      cssClass: 'danger',
      handler: () => {
        this.ws.delete(`/card/?card_id=${card_id}`).subscribe(
          () => {
            this.component.toastMessage('Card deleted', 'success')
          }
        )
      }
    }
    this.component.alertMessage('Delete Card', 'Are you sure you want to delete this card?', 'danger', 'Cancel', button)
  }




}
