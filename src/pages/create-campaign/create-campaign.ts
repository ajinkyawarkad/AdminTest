import { Component ,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Slides } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

import { CreateLeadProfilePage } from '../create-lead-profile/create-lead-profile';
import { Camp,Sts } from '../../models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase, { firestore } from 'firebase/app';
import { Storage } from '@ionic/storage';
import { v4 as uuid } from 'uuid';

import { Observable } from 'rxjs';
import * as $ from "jquery";


interface Camps {
name:string;
role:string;

}

@IonicPage()
@Component({
selector: 'page-create-campaign',
templateUrl: 'create-campaign.html',
})
export class CreateCampaignPage {

@ViewChild(Slides) slides: Slides;
slideOpts;
public form: FormGroup;
createSuccess = false;
camp = {} as Camp;
sts = {} as Sts;

products: Observable<Camps[]>;
productss: Observable<Camps[]>;

userInfo:any;
public anArray:any=[];
public acArr:any= [];

constructor(private _FB : FormBuilder,public navCtrl: NavController, public navParams: NavParams,
private alertCtrl: AlertController,public afs: AngularFirestore,private storage: Storage) {
this.slideOpts = {
effect: 'flip'
};

}
temp()
{
this.navCtrl.push(CreateLeadProfilePage)
}

goTo(){
console.log(this.anArray);

}
Add(){
this.anArray.push({'status':'','action':''});

}
remove(idx)
{
this.anArray.splice(idx, 1);
}
ionViewDidLoad() {
this.sts.sts1 = 'Interested';
this.sts.sts2 = 'Not-Interested';
console.log('ionViewDidLoad CreateCampaignPage');
let currentuser=firebase.auth().currentUser;

firebase
  .firestore()
  .collection("Company")
  .doc("COM#" + currentuser.uid)
  .collection("Admin")
  .doc(currentuser.uid)
  .onSnapshot((doc) => {
    var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    console.log(source, " data: ");
    this.products = doc.data().Managers;
    console.log(this.products);
  });

firebase.firestore().collection('Company').doc('COM#'+currentuser.uid).collection('Admin').doc(currentuser.uid)
.onSnapshot((doc) => {
var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
console.log(source, " data: ");
this.productss = doc.data().Users ;
console.log(this.productss) ;
});

}





insertUser(camp:Camp){
var obj=[{
status:this.sts.sts1,
action:this.sts.action1
},
{
status:this.sts.sts2,
action:this.sts.action2
}
]
let i;
let n = this.anArray.length;
for(i=0;i<n;i++){
obj.push(this.anArray[i])
}
console.log('obj is ', obj);
// if(camp.name && camp.goals && camp.manager && camp.sr != null){
this.storage.get('cuid').then((val) => {
// console.log('id is', val);
let uuid1 = uuid()
console.log(uuid);
this.storage.set('campId', uuid1) ;

firebase.firestore().collection('Company').doc(val).collection('Campaigns').doc(uuid1)
.set(Object.assign({
cid: uuid1,
name:camp.name,
goals:camp.goals,
manager: camp.manager,
sr: camp.sr,
status:obj,
active:true

}
))

let alert = this.alertCtrl.create({
title: 'Success',
subTitle: 'added',
//scope: id,
buttons: [{text: 'OK',
handler: data => {
this.navCtrl.push(CreateLeadProfilePage,
{
item:uuid1
});
}
}]
});
alert.present();
}).catch((err) => {
console.log(err);
let alert = this.alertCtrl.create({
//title: 'Error',
subTitle: err ,
buttons: [{text: 'OK',
handler: data => {
}
}]
});
alert.present();
});

// }
// else{

// let alert = this.alertCtrl.create({
// title: 'Error',
// subTitle: 'Failed to add',
// //scope: id,
// buttons: [{text: 'OK',
// handler: data => {
// //this.navCtrl.push(crea);
// }
// }]
// });
// alert.present();
// }
}

save(){
this.navCtrl.push(CreateLeadProfilePage);
}
ionViewDidEnter() {
//lock manual swipe for main slider
this.slides.lockSwipeToNext(true);
this.slides.lockSwipeToPrev(true);
}

slideToSlide() {
if (this.slides.getActiveIndex() + 1 === this.slides.length()) {
this.slides.slideTo(0);
} else {
this.slides.lockSwipeToNext(false);
this.slides.slideTo(this.slides.getActiveIndex() + 1);
this.slides.lockSwipeToNext(true);
}
}

slideToPrev()
{
if (this.slides.getActiveIndex() + 1 == this.slides.length())
{
this.slides.lockSwipeToPrev(false);
this.slides.slideTo(this.slides.getActiveIndex() - 1);
this.slides.lockSwipeToPrev(true);

}
}

presentConfirm() {
let alert = this.alertCtrl.create({
title: 'Success',
message: 'Compaign Created Successfully. Now You Can Add Leads',
buttons: [
{
text: 'Cancel',
role: 'cancel',
handler: () => {
console.log('Cancel clicked');
}
},
{
text: 'Add',
handler: () => {
console.log('Add clicked');
this.navCtrl.push(CreateLeadProfilePage);
}
}
]
});
alert.present();
}

}